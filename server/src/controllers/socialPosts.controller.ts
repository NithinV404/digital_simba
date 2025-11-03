import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import TwitterProvider from "../providers/xProvider";
import LinkedinProvider from "../providers/linkedinProvider";
import MetaProvider from "../providers/metaProvider";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
  files?: any[];
}

interface CreatePostBody {
  content?: string;
  platforms?: string | string[];
  media_urls?: string | string[];
  scheduled_for?: string;
  status?: string;
  hashtags?: string[];
  published_data?: any;
}

interface EditPostBody {
  content?: string;
  platforms?: string[];
  media_urls?: string[];
  scheduled_for?: Date;
  hashtags?: string[];
}

interface PublishPostBody {
  platforms?: string[];
}

interface SocialPostData {
  id: string;
  content: string;
  platforms: string[];
  scheduled_for: Date;
  status: string;
  media_urls: string[];
  hashtags: string[];
  published_data: any;
  engagement_data: any;
  engagement_last_synced: Date | null;
  created_date: Date;
  updated_date: Date;
  created_by: string;
  created_by_id: string;
  is_sample: boolean;
}

class SocialPostsController {
  // POST /api/socialPosts - Create a new social post
  static post = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const incoming = (req.body as CreatePostBody) || {};
      const defaultStatus =
        incoming.status || (incoming.scheduled_for ? "scheduled" : "accepted");

      const payload = {
        content: incoming.content ?? "",
        platforms: Array.isArray(incoming.platforms)
          ? incoming.platforms
          : incoming.platforms
          ? [incoming.platforms]
          : [],
        media_urls: Array.isArray(incoming.media_urls)
          ? incoming.media_urls
          : incoming.media_urls
          ? [incoming.media_urls]
          : [],
        scheduled_for: incoming.scheduled_for
          ? new Date(incoming.scheduled_for)
          : new Date(),
        status: defaultStatus,
        hashtags: incoming.hashtags ?? [],
        published_data: incoming.published_data ?? {},
      };

      const user = await (prisma as any).user.findUnique({
        where: { id: req.user.id },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      (payload as any).created_by = user.full_name;
      (payload as any).user = { connect: { id: req.user.id } };

      const newPost = await (prisma as any).socialPost.create({
        data: payload,
      });
      res.status(201).json({ message: "Social post created successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message, code: err.code });
    }
  };

  // GET /api/socialPosts/:id - Get a specific social post
  static get = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await (prisma as any).socialPost.findMany({
        where: { id: req.params.id },
      });
      if (!post) {
        res.status(404).json({ error: "Social post not found" });
        return;
      }
      res.json(post);
    } catch (err: any) {
      res.status(500).json({ error: err.message, code: err.code });
    }
  };

  // GET /api/socialPosts - Get all social posts for user
  static getAll = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const { sort, limit, offset } = req.query as {
      sort?: string;
      limit?: string;
      offset?: string;
    };
    let order_by: any = { created_date: "desc" };
    if (sort === "-scheduled_for") {
      order_by = { scheduled_for: "desc" };
    } else {
      order_by = { created_date: "desc" };
    }

    const take = limit ? parseInt(limit, 10) : 50;
    const skip = offset ? parseInt(offset, 10) : 0;

    try {
      const posts = await (prisma as any).socialPost.findMany({
        where: { userId: user.id },
        orderBy: order_by,
        take: take,
        skip: skip,
        select: {
          id: true,
          content: true,
          platforms: true,
          scheduled_for: true,
          status: true,
          media_urls: true,
          hashtags: true,
          published_data: true,
          engagement_data: true,
          engagement_last_synced: true,
          created_date: true,
          updated_date: true,
          created_by: true,
          created_by_id: true,
          is_sample: true,
        },
      });

      if (posts) {
        res.status(200).json(posts);
        return;
      }
      res.status(400).json({ message: "No posts found" });
    } catch (e: any) {
      logger.error(e);
      res.status(400).json({ message: "Failed to get posts" });
    }
  };

  // PUT /api/socialPosts/:id - Edit a social post
  static edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const allowedFields = [
        "content",
        "platforms",
        "media_urls",
        "scheduled_for",
        "hashtags",
      ];
      const updateData: any = {};
      const body = req.body as EditPostBody;

      for (const field of allowedFields) {
        if (body[field as keyof EditPostBody] !== undefined) {
          updateData[field] = body[field as keyof EditPostBody];
        }
      }

      const updatedPost = await (prisma as any).socialPost.update({
        where: { id: req.params.id },
        data: updateData,
      });
      res.json(updatedPost);
    } catch (err: any) {
      res.status(400).json({ error: err.message, code: err.code });
    }
  };

  // DELETE /api/socialPosts/:id - Delete a social post
  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedPost = await (prisma as any).socialPost.delete({
        where: { id: req.params.id },
      });
      res.status(200).json({ message: "Deleted the post successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message, code: err.code });
    }
  };

  // POST /api/socialPosts/:id/publish - Publish a social post
  static publish = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const postId = req.params.id;
      const socialPost = await (prisma as any).socialPost.findUnique({
        where: { id: postId },
      });

      if (!socialPost) {
        res.status(404).json({ error: "Social post not found" });
        return;
      }

      const body = req.body as PublishPostBody;
      const platformsToPost = body.platforms || socialPost.platforms || [];
      const results: any = {};
      const publishedPlatforms: string[] = [];

      // Twitter publishing
      if (platformsToPost.includes("twitter")) {
        try {
          const mediaBuffers: any[] = [];
          if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              mediaBuffers.push({ buffer: file.buffer, type: file.mimetype });
            }
          } else if (
            socialPost.media_urls &&
            socialPost.media_urls.length > 0
          ) {
            mediaBuffers.push(...socialPost.media_urls);
          }

          const result = await TwitterProvider.publishPost(
            socialPost.content,
            mediaBuffers,
            req.user.id
          );
          results.twitter = result;
        } catch (twitterError: any) {
          console.error("Twitter posting failed:", twitterError);
          try {
            const fallbackResult = await TwitterProvider.publishPost(
              socialPost.content,
              [],
              req.user.id
            );
            results.twitter = fallbackResult;
          } catch (fallbackError: any) {
            console.error("Text-only tweet failed:", fallbackError);
            throw fallbackError;
          }
        }
      }

      // LinkedIn publishing
      if (platformsToPost.includes("linkedin")) {
        try {
          const mediaBuffers: any[] = [];
          if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              mediaBuffers.push({ buffer: file.buffer, type: file.mimetype });
            }
          } else if (
            socialPost.media_urls &&
            socialPost.media_urls.length > 0
          ) {
            mediaBuffers.push(...socialPost.media_urls);
          }

          const result = await LinkedinProvider.publishPost(
            socialPost.content,
            mediaBuffers,
            req.user.id
          );
          results.linkedin = result;
        } catch (linkedinError: any) {
          console.error("LinkedIn posting failed:", linkedinError);
          try {
            const fallbackResult = await LinkedinProvider.publishPost(
              socialPost.content,
              [],
              req.user.id
            );
            results.linkedin = fallbackResult;
          } catch (fallbackError: any) {
            console.error("Text-only LinkedIn post failed:", fallbackError);
            throw fallbackError;
          }
        }
      }

      // Facebook publishing
      if (platformsToPost.includes("facebook")) {
        try {
          const mediaBuffers: any[] = [];
          if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              mediaBuffers.push({ buffer: file.buffer, type: file.mimetype });
            }
          } else if (
            socialPost.media_urls &&
            socialPost.media_urls.length > 0
          ) {
            mediaBuffers.push(...socialPost.media_urls);
          }

          const result = await MetaProvider.publishPost(
            socialPost.content,
            mediaBuffers,
            req.user.id
          );
          results.facebook = result;
        } catch (e: any) {
          console.error("Facebook posting failed:", e);
          throw new Error(`Facebook: ${e.message}`);
        }
      }

      const publishedData = socialPost.published_data || {};
      if (results.twitter && results.twitter.success) {
        publishedData.twitter = { tweet_id: results.twitter.data.data.id };
        publishedPlatforms.push("twitter");
      }
      if (results.linkedin && results.linkedin.success) {
        publishedData.linkedin = { post_id: results.linkedin.data?.id };
        publishedPlatforms.push("linkedin");
      }
      if (results.facebook && results.facebook.success) {
        publishedData.facebook = { post_id: results.facebook.data?.id };
        publishedPlatforms.push("facebook");
      }

      // Update the social post
      await (prisma as any).socialPost.update({
        where: { id: socialPost.id },
        data: {
          status: "published",
          created_date: new Date(),
          published_data: publishedData,
        },
      });

      res.json({
        success: true,
        message: `Posted successfully to ${publishedPlatforms.join(", ")}`,
        data: results,
      });
    } catch (err: any) {
      console.error("Error publishing post:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to publish post",
      });
    }
  };

  // GET /api/socialPosts/:id/engagement - Get engagement data for a post
  static getEngagement = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const postId = req.params.id;
      const post = await (prisma as any).socialPost.findUnique({
        where: { id: postId },
      });
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      const published = post.published_data || {};
      const engagement = post.engagement_data || {};

      const results = { engagement: {}, updated: false };

      // Twitter engagement
      if (published.twitter && published.twitter.tweet_id) {
        const tweetId = published.twitter.tweet_id;
        const twitterRes = await TwitterProvider.fetchEngagement(
          tweetId,
          req.user.id
        );
        if (twitterRes.success) {
          logger.info("twitter response", twitterRes);
          engagement.twitter = twitterRes.metrics;
          (results.engagement as any).twitter = twitterRes.metrics;
          results.updated = true;
        } else {
          logger.warn(
            `Twitter engagement fetch failed for post ${postId}: ${twitterRes.error}`
          );
        }
      }

      // LinkedIn engagement
      if (published.linkedin && published.linkedin.post_id) {
        const linkedInPostId = published.linkedin.post_id;
        const linkedinRes = await LinkedinProvider.fetchEngagement(
          linkedInPostId,
          req.user.id
        );
        if (linkedinRes.success) {
          engagement.linkedin = linkedinRes.metrics;
          (results.engagement as any).linkedin = linkedinRes.metrics;
          results.updated = true;
        } else {
          logger.warn(
            `LinkedIn engagement fetch failed for post ${postId}: ${linkedinRes.error}`
          );
        }
      }

      if (results.updated) {
        await (prisma as any).socialPost.update({
          where: { id: postId },
          data: {
            engagement_data: engagement,
            engagement_last_synced: new Date(),
          },
        });
      }

      res.json({
        success: true,
        engagement: engagement,
        last_synced: post.engagement_last_synced,
      });
    } catch (err: any) {
      logger.error("Error fetching engagement:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
}

export default SocialPostsController;
