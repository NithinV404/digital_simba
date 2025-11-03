import { TwitterApi } from "twitter-api-v2";
import { logger } from "../utils/logger";
import { PrismaClient } from "@prisma/client";
import MediaUtils from "../utils/media_utils";

const prisma = new PrismaClient();

const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;

if (!TWITTER_API_KEY || !TWITTER_API_SECRET) {
  throw new Error(
    'Missing Twitter OAuth 1.0a consumer credentials. Generate an "API Key" and "API Key Secret" from Twitter developer portal and set TWITTER_CONSUMER_KEY / TWITTER_CONSUMER_SECRET.'
  );
}

// Utility function for retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 429 || error.statusCode === 429) {
        // Rate limit exceeded
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          logger.warn(
            `Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${
              maxRetries + 1
            })`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
      throw error;
    }
  }
};

class TwitterProvider {
  appKey: string;
  appSecret: string;
  client: TwitterApi;
  tempData: Map<string, string>;

  constructor() {
    this.appKey = TWITTER_API_KEY;
    this.appSecret = TWITTER_API_SECRET;
    this.client = new TwitterApi({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_API_SECRET,
    });
    this.tempData = new Map();
  }

  connect = async (req, res) => {
    try {
      const callbackUrl = process.env.TWITTER_CALLBACK_URL;
      if (!callbackUrl) {
        return res
          .status(500)
          .json({ error: "Twitter callback URL not configured" });
      }
      const { url, oauth_token, oauth_token_secret } =
        await this.client.generateAuthLink(callbackUrl);
      this.tempData.set(oauth_token, oauth_token_secret);
      res.redirect(url);
    } catch (error) {
      logger.error(`Twitter connect error: ${error}`);
      res
        .status(500)
        .json({ error: "Failed to initiate Twitter authorization" });
    }
  };

  disconnect = async (userId) => {
    try {
      const account = await prisma.socialAccount.findFirst({
        where: { userId, platform: "twitter", connected: true },
      });

      if (account && account.accessToken && account.accessSecret) {
        try {
          const client = new TwitterApi({
            appKey: this.appKey,
            appSecret: this.appSecret,
            accessToken: account.accessToken,
            accessSecret: account.accessSecret,
          });

          await client.v1.post("oauth/invalidate_token");
          logger.info("Twitter token revoked successfully");
        } catch (revokeError) {
          logger.warn(`Failed to revoke Twitter token: ${revokeError.message}`);
        }
      }

      // Delete the account from database
      await prisma.socialAccount.deleteMany({
        where: { userId, platform: "twitter" },
      });

      return { success: true };
    } catch (error) {
      logger.error(`Error disconnecting Twitter: ${error}`);
      throw error;
    }
  };

  callback = async (req, res) => {
    const { oauth_token, oauth_verifier, denied } = req.query;
    if (denied) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/socialhub?twitter_error=denied`
      );
    }

    if (!oauth_token || !oauth_verifier) {
      return res.status(400).send("Missing OAuth parameters");
    }

    const oauth_token_secret = this.tempData.get(oauth_token);
    if (!oauth_token_secret) {
      return res.status(400).send("Invalid or expired OAuth token");
    }

    try {
      const tempClient = new TwitterApi({
        appKey: this.appKey,
        appSecret: this.appSecret,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
      });

      const {
        client,
        accessToken,
        accessSecret,
        screenName,
        userId: twitterUserId,
      } = await tempClient.login(oauth_verifier);
      this.tempData.delete(oauth_token);

      const userId = req.user.id;

      await prisma.socialAccount.upsert({
        where: { providerAccountId: twitterUserId },
        update: {
          accessToken,
          accessSecret,
          expiresAt: null,
          connected: true,
          username: screenName,
        },
        create: {
          userId,
          platform: "twitter",
          providerAccountId: twitterUserId,
          accessToken,
          accessSecret,
          connected: true,
          username: screenName,
        },
      });
      res.redirect(
        `${process.env.FRONTEND_URL}/socialhub?twitter_connected=true`
      );
    } catch (error) {
      logger.error(`Twitter callback error: ${error}`);
      res.redirect(`${process.env.FRONTEND_URL}/socialhub?twitter_error=true`);
    }
  };

  uploadMedia = async (client, source) => {
    try {
      logger.info(
        `Mime: ${source.mimeType} Category: ${MediaUtils.inferCategory(
          source.mimeType
        )}`
      );
      const mediaId = await client.v1.uploadMedia(source.data, {
        mimeType: source.mimeType,
      });
      logger.info(`Media uploaded: ${mediaId}`);
      return mediaId;
    } catch (error) {
      logger.warn(`Media upload failed: ${error.message || error}`);
      throw error;
    }
  };

  getClient = async (userId) => {
    const account = await prisma.socialAccount.findFirst({
      where: { userId, platform: "twitter", connected: true },
    });
    if (!account || !account.accessToken || !account.accessSecret)
      throw new Error("Twitter not connected");

    const accessSecret = account.accessSecret;

    return new TwitterApi({
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: account.accessToken,
      accessSecret,
    });
  };

  isConnected = async (userId) => {
    try {
      const account = await prisma.socialAccount.findFirst({
        where: { userId, platform: "twitter" },
      });
      if (account) {
        return { connected: account.connected, username: account.username };
      }
      return { connected: false, username: null };
    } catch (error) {
      logger.error(`Error checking Twitter connection: ${error}`);
      return { connected: false, username: null };
    }
  };

  publishPost = async (content, media = [], userId) => {
    try {
      const client = await this.getClient(userId);
      const mediaIds = [];

      for (const item of media) {
        const resolved = await MediaUtils.resolveBuffer(item);
        if (resolved) {
          const id = await this.uploadMedia(client, resolved);
          mediaIds.push(id);
        }
      }

      const tweet = await client.v2.tweet({
        text: content || "Posted from Digital Simba",
        media: mediaIds.length ? { media_ids: mediaIds as any } : undefined,
      });
      return { success: true, data: tweet, platform: "twitter" };
    } catch (error) {
      logger.error(`Twitter post error: ${error}`);
      if (error?.code === 401 || error?.data?.title === "Unauthorized") {
        try {
          await prisma.socialAccount.updateMany({
            where: { userId, platform: "twitter" },
            data: { connected: false },
          });
        } catch (updateError) {
          logger.warn(
            `Failed to mark Twitter account disconnected after unauthorized error: ${updateError}`
          );
        }
      }
      throw error;
    }
  };
  fetchEngagement = async (tweetId, userId) => {
    try {
      const result = await retryWithBackoff(async () => {
        const client = await this.getClient(userId);
        // Use Twitter v2 API to get public metrics for the tweet
        const resp = await client.v2.singleTweet(tweetId, {
          "tweet.fields": ["public_metrics"],
        });
        return resp;
      });

      if (result.data && result.data.public_metrics) {
        const metrics = result.data.public_metrics;
        return {
          success: true,
          metrics: {
            likes: metrics.like_count || 0,
            shares: metrics.retweet_count || 0,
            comments: metrics.reply_count || 0,
            views: metrics.impression_count || 0,
          },
        };
      }
      return { success: false, error: "No metrics available" };
    } catch (error) {
      logger.error(`Error fetching tweet engagement after retries: ${error}`);
      return { success: false, error: error.message };
    }
  };

  batchFetchEngagement = async (tweetIds, userId) => {
    if (!tweetIds || tweetIds.length === 0) return {};

    try {
      const client = await this.getClient(userId);
      // Twitter API allows up to 100 IDs per request
      const batches = [];
      for (let i = 0; i < tweetIds.length; i += 100) {
        batches.push(tweetIds.slice(i, i + 100));
      }

      const results = {};

      for (const batch of batches) {
        try {
          const resp = await retryWithBackoff(async () => {
            return await client.v2.tweets(batch, {
              "tweet.fields": ["public_metrics"],
            });
          });

          if (resp.data) {
            for (const tweet of resp.data) {
              if (tweet.public_metrics) {
                const metrics = tweet.public_metrics;
                results[tweet.id] = {
                  likes: metrics.like_count || 0,
                  shares: metrics.retweet_count || 0,
                  comments: metrics.reply_count || 0,
                  views: metrics.impression_count || 0,
                };
              }
            }
          }
          // Small delay between batches to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          logger.warn(
            `Error fetching batch engagement after retries: ${error.message}`
          );
          // Continue with next batch even if one fails
        }
      }

      return results;
    } catch (error) {
      logger.error(`Error in batch fetch engagement: ${error}`);
      return {};
    }
  };
}

export default new TwitterProvider();
