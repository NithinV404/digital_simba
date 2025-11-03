import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import TwitterProvider from "../providers/xProvider";
import LinkedinProvider from "../providers/linkedinProvider";

const prisma = new PrismaClient();

interface Metrics {
  likes?: number;
  shares?: number;
  comments?: number;
  views?: number;
  engagement_rate?: number | null;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  viewCount?: number;
}

interface AnalyticsData {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  engagement_rate: number | null;
}

interface PlatformPosts {
  twitter: Array<{ postId: string; tweetId: string }>;
  linkedin: Array<{ postId: string; linkedinPostId: string }>;
}

function safeNumber(v: any): number {
  if (v === undefined || v === null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function extractMetrics(metrics: any): AnalyticsData {
  if (!metrics || typeof metrics !== "object") {
    return {
      likes: 0,
      shares: 0,
      comments: 0,
      views: 0,
      engagement_rate: null,
    };
  }

  const likes = safeNumber(
    metrics.likeCount ||
      metrics.likes ||
      metrics.like_count ||
      (metrics.likes && metrics.likes.total) ||
      0
  );
  const shares = safeNumber(
    metrics.shareCount || metrics.shares || metrics.share_count || 0
  );
  const comments = safeNumber(
    metrics.commentCount || metrics.comments || metrics.comment_count || 0
  );
  const views = safeNumber(metrics.viewCount || metrics.views || 0);
  const engagement_rate =
    views > 0
      ? ((likes + shares + comments) / views) * 100
      : metrics.engagement_rate || null;

  return { likes, shares, comments, views, engagement_rate };
}

class AnalyticsSyncService {
  // Sync analytics for posts that haven't been synced in the last 4 hours
  // If force=true, sync all published posts regardless of last sync time
  async syncAnalytics(force = false): Promise<void> {
    try {
      logger.info(`Starting analytics sync${force ? " (force mode)" : ""}...`);

      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

      // First, let's check what posts exist
      const allPosts = await (prisma as any).socialPost.findMany({
        select: {
          id: true,
          status: true,
          engagement_last_synced: true,
          published_data: true,
          created_by_id: true,
        },
      });

      logger.info(`Total posts in database: ${allPosts.length}`);
      const publishedPosts = allPosts.filter(
        (p: any) => p.status === "published"
      );
      logger.info(`Published posts: ${publishedPosts.length}`);
      const postsWithPublishedData = publishedPosts.filter(
        (p: any) => p.published_data && Object.keys(p.published_data).length > 0
      );
      logger.info(
        `Posts with published data: ${postsWithPublishedData.length}`
      );

      // Find published posts that need syncing
      const postsToSync = await (prisma as any).socialPost.findMany({
        where: {
          status: "published",
          ...(force
            ? {}
            : {
                OR: [
                  { engagement_last_synced: null },
                  { engagement_last_synced: { lt: fourHoursAgo } },
                ],
              }),
        },
        include: {
          user: {
            include: {
              social_accounts: true,
            },
          },
        },
      });

      logger.info(
        `Found ${postsToSync.length} posts to sync analytics for${
          force ? " (force sync)" : ""
        }`
      );
      if (!force) {
        logger.info(`Four hours ago: ${fourHoursAgo.toISOString()}`);
      }

      if (postsToSync.length === 0 && publishedPosts.length > 0) {
        logger.info("Sample published posts:");
        for (const post of publishedPosts.slice(0, 3)) {
          logger.info(
            `Post ${post.id}: status=${post.status}, last_synced=${
              post.engagement_last_synced
            }, has_published_data=${!!post.published_data}`
          );
        }
      }

      // Group posts by user and platform for batch processing
      const userPlatformPosts: Record<string, PlatformPosts> = {};

      for (const post of postsToSync) {
        const userId = post.created_by_id;
        const publishedData = post.published_data || {};

        if (!userPlatformPosts[userId]) {
          userPlatformPosts[userId] = { twitter: [], linkedin: [] };
        }

        if ((publishedData as any).twitter?.tweet_id) {
          userPlatformPosts[userId].twitter.push({
            postId: post.id,
            tweetId: (publishedData as any).twitter.tweet_id,
          });
        }
        if ((publishedData as any).linkedin?.post_id) {
          userPlatformPosts[userId].linkedin.push({
            postId: post.id,
            linkedinPostId: (publishedData as any).linkedin.post_id,
          });
        }
      }

      let successCount = 0;
      let errorCount = 0;

      // Process each user's posts in batches
      for (const [userId, platforms] of Object.entries(userPlatformPosts)) {
        try {
          const userSuccessCount = await this.syncUserAnalytics(
            userId,
            platforms
          );
          successCount += userSuccessCount;
        } catch (error: any) {
          logger.error(
            `Failed to sync analytics for user ${userId}: ${error.message}`
          );
          errorCount += platforms.twitter.length + platforms.linkedin.length;
        }

        // Delay between users to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      logger.info(
        `Analytics sync completed. Success: ${successCount}, Errors: ${errorCount}`
      );
    } catch (error: any) {
      logger.error(`Analytics sync failed: ${error.message}`);
    }
  }

  async syncUserAnalytics(
    userId: string,
    platforms: PlatformPosts
  ): Promise<number> {
    const engagementDataMap: Record<string, any> = {};

    // Batch fetch Twitter engagements
    if (platforms.twitter.length > 0) {
      try {
        const tweetIds = platforms.twitter.map((p) => p.tweetId);
        const twitterResults = await TwitterProvider.batchFetchEngagement(
          tweetIds,
          userId
        );

        for (const post of platforms.twitter) {
          const metrics = twitterResults[post.tweetId];
          if (metrics) {
            engagementDataMap[post.postId] = {
              ...engagementDataMap[post.postId],
              twitter: extractMetrics(metrics),
            };
          }
        }
      } catch (error: any) {
        logger.warn(
          `Failed to batch fetch Twitter analytics for user ${userId}: ${error.message}`
        );
      }
    }

    // Batch fetch LinkedIn engagements
    if (platforms.linkedin.length > 0) {
      try {
        const postIds = platforms.linkedin.map((p) => p.linkedinPostId);
        const linkedinResults = await LinkedinProvider.batchFetchEngagement(
          postIds,
          userId
        );

        for (const post of platforms.linkedin) {
          const metrics = linkedinResults[post.linkedinPostId];
          if (metrics) {
            engagementDataMap[post.postId] = {
              ...engagementDataMap[post.postId],
              linkedin: extractMetrics(metrics),
            };
          }
        }
      } catch (error: any) {
        logger.warn(
          `Failed to batch fetch LinkedIn analytics for user ${userId}: ${error.message}`
        );
      }
    }

    // Update all posts in batch
    const updatePromises = Object.entries(engagementDataMap).map(
      ([postId, engagementData]) =>
        (prisma as any).socialPost.update({
          where: { id: postId },
          data: {
            engagement_data: engagementData,
            engagement_last_synced: new Date(),
          },
        })
    );

    await Promise.all(updatePromises);
    logger.info(
      `Updated analytics for ${updatePromises.length} posts for user ${userId}`
    );
    return updatePromises.length;
  }

  // Sync analytics for a single post
  async syncPostAnalytics(post: any): Promise<void> {
    const userId = post.created_by_id;
    const publishedData = post.published_data || {};
    const engagementData: Record<string, AnalyticsData> = {};

    // Fetch Twitter engagement
    if ((publishedData as any).twitter?.tweet_id) {
      try {
        const result = await TwitterProvider.fetchEngagement(
          (publishedData as any).twitter.tweet_id,
          userId
        );
        if (result.success) {
          engagementData.twitter = extractMetrics(result.metrics);
        }
      } catch (error: any) {
        logger.warn(
          `Failed to fetch Twitter engagement for post ${post.id}: ${error.message}`
        );
      }
    }

    // Fetch LinkedIn engagement
    if ((publishedData as any).linkedin?.post_id) {
      try {
        const result = await LinkedinProvider.fetchEngagement(
          (publishedData as any).linkedin.post_id,
          userId
        );
        if (result.success) {
          engagementData.linkedin = extractMetrics(result.metrics);
        }
      } catch (error: any) {
        logger.warn(
          `Failed to fetch LinkedIn engagement for post ${post.id}: ${error.message}`
        );
      }
    }

    // Update the post
    await (prisma as any).socialPost.update({
      where: { id: post.id },
      data: {
        engagement_data: engagementData,
        engagement_last_synced: new Date(),
      },
    });
  }

  // Manual refresh for specific posts (useful for frontend refresh button)
  async refreshPostAnalytics(postId: string): Promise<{ success: boolean }> {
    try {
      const post = await (prisma as any).socialPost.findUnique({
        where: { id: postId },
        include: {
          user: {
            include: {
              social_accounts: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status !== "published") {
        throw new Error("Post is not published");
      }

      await this.syncPostAnalytics(post);
      return { success: true };
    } catch (error: any) {
      logger.error(
        `Manual refresh failed for post ${postId}: ${error.message}`
      );
      throw error;
    }
  }
}

export default new AnalyticsSyncService();
