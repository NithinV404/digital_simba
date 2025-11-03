import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { PrismaClient } from "@prisma/client";
import MediaUtils from "../utils/media_utils";

const prisma = new PrismaClient();

const LINKEDIN_URL_BASE = "https://www.linkedin.com";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_CALLBACK_URL = process.env.LINKEDIN_CALLBACK_URL;

if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
  throw new Error(
    "Missing LinkedIn OAuth credentials. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET."
  );
}

// Utility function for retry with exponential backoff
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<any> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const statusCode = error.response?.status;
      if (statusCode === 429 || statusCode === 503 || statusCode === 500) {
        // Rate limit or server errors
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          logger.warn(
            `LinkedIn API error ${statusCode}, retrying in ${delay}ms (attempt ${
              attempt + 1
            }/${maxRetries + 1})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
      throw error;
    }
  }
};

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
  query: any;
}

interface MediaSource {
  data: Buffer;
  mimeType: string;
}

interface PublishResult {
  success: boolean;
  data?: any;
  platform: string;
  error?: string;
}

interface EngagementResult {
  success: boolean;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  error?: string;
}

interface ConnectionStatus {
  connected: boolean;
  username: string | null;
}

class LinkedinProvider {
  private linkedin_scopes = [
    "openid",
    "profile",
    "email",
    "w_member_social",
  ].join(" ");

  connect = (req: AuthenticatedRequest, res: Response): void => {
    const state = crypto.randomBytes(16).toString("hex");
    try {
      const paramsForAuth = new URLSearchParams({
        response_type: "code",
        client_id: LINKEDIN_CLIENT_ID!,
        redirect_uri: LINKEDIN_CALLBACK_URL!,
        scope: this.linkedin_scopes,
        state: state,
        grant_type: "revoke",
      });
      (res as any).redirect(
        `${LINKEDIN_URL_BASE}/oauth/v2/authorization?${paramsForAuth.toString()}`
      );
    } catch (e) {
      logger.error(e);
    }
  };

  disconnect = async (userId: string): Promise<{ success: boolean }> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "linkedin", connected: true },
      });

      if (account && account.accessToken) {
        // Revoke the token BEFORE disconnecting
        try {
          await axios.post(
            `${LINKEDIN_URL_BASE}/oauth/v2/revoke`,
            new URLSearchParams({
              client_id: LINKEDIN_CLIENT_ID!,
              client_secret: LINKEDIN_CLIENT_SECRET!,
              token: account.accessToken,
            }).toString(),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          logger.info("LinkedIn token revoked successfully");
        } catch (revokeError: any) {
          logger.warn(`Failed: ${revokeError.data}`);
        }
      }

      await (prisma as any).socialAccount.deleteMany({
        where: { userId, platform: "linkedin" },
      });

      return { success: true };
    } catch (error: any) {
      logger.error(`Error disconnecting LinkedIn: ${error}`);
      throw error;
    }
  };

  me = async (accessToken: string): Promise<any> => {
    let profileResp;
    try {
      profileResp = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err: any) {
      logger.error(
        `Failed to fetch LinkedIn profile: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
    return profileResp;
  };

  getAccount = async (userId: string): Promise<any> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "linkedin", connected: true },
      });
      if (!account || !account.accessToken) {
        throw new Error("No valid LinkedIn access token found");
      }
      return account;
    } catch (error: any) {
      logger.error(`Error retrieving access token: ${error}`);
      throw error;
    }
  };

  callback = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { code, state, error, error_description } = req.query;

      // Handle user denial or cancellation
      if (error) {
        logger.warn(`LinkedIn OAuth error: ${error} - ${error_description}`);
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?linkedin_error=denied`
        );
      }

      if (!code || !state) {
        logger.error("Missing code or state in LinkedIn callback");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?linkedin_error=true`
        );
      }

      const tokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: LINKEDIN_CALLBACK_URL!,
        client_id: LINKEDIN_CLIENT_ID!,
        client_secret: LINKEDIN_CLIENT_SECRET!,
      });

      const tokenResp = await axios.post(
        `${LINKEDIN_URL_BASE}/oauth/v2/accessToken`,
        tokenParams.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (!tokenResp.data.access_token) {
        logger.error("Failed to get LinkedIn token");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?linkedin_error=true`
        );
      }

      // Calculate expiration time
      const expiresAt = tokenResp.data.expires_in
        ? new Date(Date.now() + tokenResp.data.expires_in * 1000)
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // Default 60 days

      let userIdFromToken;
      if (tokenResp.data.id_token) {
        const decodedIdToken = jwt.decode(tokenResp.data.id_token) as any;
        userIdFromToken = decodedIdToken.sub;
      }

      const profileData = await this.me(tokenResp.data.access_token);
      if (!profileData) {
        logger.error("Failed to fetch LinkedIn profile");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?linkedin_error=true`
        );
      }

      const linkedinUserId = userIdFromToken || (profileData as any).sub;
      const fullName = `${(profileData as any).data.name}`;
      const userId = req.user.id;

      await (prisma as any).socialAccount.upsert({
        where: { providerAccountId: linkedinUserId },
        update: {
          accessToken: tokenResp.data.access_token,
          refreshToken: tokenResp.data.refresh_token || "",
          expiresAt: expiresAt,
          connected: true,
          username: fullName,
        },
        create: {
          userId,
          platform: "linkedin",
          providerAccountId: userIdFromToken,
          accessToken: tokenResp.data.access_token,
          refreshToken: tokenResp.data.refresh_token || "",
          expiresAt: expiresAt,
          connected: true,
          username: fullName,
        },
      });

      logger.info(`Access Token stored with expiration: ${expiresAt}`);
      (res as any).redirect(
        `${process.env.FRONTEND_URL}/socialhub?linkedin_connected=true`
      );
    } catch (error: any) {
      logger.error(`LinkedIn callback error: ${error}`);
      (res as any).redirect(
        `${process.env.FRONTEND_URL}/socialhub?linkedin_error=true`
      );
    }
  };

  isConnected = async (userId: string): Promise<ConnectionStatus> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "linkedin" },
      });
      if (account) {
        return { connected: account.connected, username: account.username };
      }
      return { connected: false, username: null };
    } catch (error: any) {
      logger.error(`Error checking LinkedIn connection: ${error}`);
      return { connected: false, username: null };
    }
  };

  uploadMedia = async (
    accessToken: string,
    providerAccountId: string,
    source: MediaSource
  ): Promise<string> => {
    try {
      logger.info(`Mime: ${source.mimeType}`);

      // Determine recipe based on mimeType
      let recipe: string;
      if (source.mimeType.startsWith("image/")) {
        recipe = "urn:li:digitalmediaRecipe:feedshare-image";
      } else if (source.mimeType.startsWith("video/")) {
        recipe = "urn:li:digitalmediaRecipe:feedshare-video";
      } else {
        logger.warn(`Unsupported media type: ${source.mimeType}`);
        throw new Error("Unsupported media type");
      }

      // Register upload
      const registerResp = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          registerUploadRequest: {
            recipes: [recipe],
            owner: `urn:li:person:${providerAccountId}`,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const uploadUrl =
        registerResp.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const assetUrn = registerResp.data.value.asset;

      // Upload buffer
      await axios.put(uploadUrl, source.data, {
        headers: {
          "Content-Type": source.mimeType,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      logger.info(`Media uploaded: ${assetUrn}`);
      return assetUrn;
    } catch (error: any) {
      logger.warn(`LinkedIn media upload failed: ${error.message || error}`);
      throw error;
    }
  };

  publishPost = async (
    content: string,
    media: any[] = [],
    userId: string
  ): Promise<PublishResult> => {
    try {
      const account = await this.getAccount(userId);
      const accessToken = account.accessToken;

      // Resolve all media buffers first for validation
      const resolvedMedia: MediaSource[] = [];
      for (const item of media) {
        const resolved = await MediaUtils.resolveBuffer(item);
        if (resolved) {
          resolvedMedia.push(resolved);
        }
      }

      // Validate BEFORE uploading anything
      const hasVideo = resolvedMedia.some((m: MediaSource) =>
        m.mimeType.startsWith("video/")
      );
      const hasImage = resolvedMedia.some((m: MediaSource) =>
        m.mimeType.startsWith("image/")
      );

      if (hasVideo && hasImage) {
        throw new Error(
          "LinkedIn does not support mixing images and videos in a single post. Please post them separately."
        );
      }

      if (hasVideo && resolvedMedia.length > 1) {
        throw new Error(
          "LinkedIn only supports one video per post. Please post videos separately."
        );
      }

      if (hasImage && resolvedMedia.length > 9) {
        throw new Error("LinkedIn supports a maximum of 9 images per post.");
      }

      // Now upload the validated media
      const assetUrns: string[] = [];
      for (const resolved of resolvedMedia) {
        const assetUrn = await this.uploadMedia(
          accessToken,
          account.providerAccountId,
          resolved
        );
        assetUrns.push(assetUrn);
      }

      // Prepare media array for post
      const mediaArray = assetUrns.map((urn: string) => ({
        status: "READY",
        description: { text: "Media description" },
        media: urn,
        title: { text: "Media title" },
      }));

      // Determine share media category based on actual media types
      let shareMediaCategory = "NONE";
      if (assetUrns.length > 0) {
        shareMediaCategory = hasVideo ? "VIDEO" : "IMAGE";
      }

      // Create post
      const postResp = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        {
          author: `urn:li:person:${account.providerAccountId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: content || "Posted from Digital Simba" },
              shareMediaCategory,
              media: mediaArray,
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      return { success: true, data: postResp.data, platform: "linkedin" };
    } catch (error: any) {
      logger.error(`LinkedIn post error: ${error}`);
      if (error?.response?.status === 401) {
        try {
          await (prisma as any).socialAccount.updateMany({
            where: { userId, platform: "linkedin" },
            data: { connected: false },
          });
        } catch (updateError: any) {
          logger.warn(
            `Failed to mark LinkedIn account disconnected after unauthorized error: ${updateError}`
          );
        }
      }
      throw error;
    }
  };

  fetchEngagement = async (
    linkedInPostId: string,
    userId: string
  ): Promise<EngagementResult> => {
    try {
      const result = await retryWithBackoff(async () => {
        const account = await this.getAccount(userId);
        const accessToken = account.accessToken;

        // LinkedIn provides socialCounts via the socialActions endpoint
        const socialActionsUrl = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(
          linkedInPostId
        )}`;

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "LinkedIn-Version": "202305",
          },
        };

        return await axios.get(socialActionsUrl, config);
      });

      if (result.data) {
        const data = result.data;
        // Extract engagement metrics from LinkedIn response
        const likes = data.likesSummary?.totalLikes || 0;
        const comments = data.commentsSummary?.totalComments || 0;
        const shares = data.sharesSummary?.totalShares || 0;
        // LinkedIn doesn't provide view counts in this endpoint
        const views = 0;

        return {
          success: true,
          metrics: {
            likes,
            comments,
            shares,
            views,
          },
        };
      }
      return { success: false, error: "No engagement data available" };
    } catch (error) {
      logger.error(`Error fetching LinkedIn engagement after retries: ${error}`);
      return { success: false, error: error.message };
    }
  };

  batchFetchEngagement = async (postIds: string[], userId: string) => {
    if (!postIds || postIds.length === 0) return {};

    const results = {};

    for (const postId of postIds) {
      try {
        const engagement = await this.fetchEngagement(postId, userId);
        if (engagement.success && engagement.metrics) {
          results[postId] = engagement.metrics;
        }
      } catch (error) {
        logger.error(`Error fetching engagement for LinkedIn post ${postId}: ${error}`);
        // Continue with other posts even if one fails
      }
    }

    return results;
  };
}

export default new LinkedinProvider();
