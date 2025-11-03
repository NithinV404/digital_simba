import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import TwitterProvider from "../providers/xProvider";
import LinkedinProvider from "../providers/linkedinProvider";
import MetaProvider from "../providers/metaProvider";

const prisma = new PrismaClient();

interface PublishedData {
  twitter?: { tweet_id: string };
  linkedin?: { post_id: string };
  facebook?: { post_id: string };
}

interface Results {
  twitter?: any;
  linkedin?: any;
  facebook?: any;
}

const startScheduledPostCron = () => {
  // Cron job to check every minute for due posts
  cron.schedule("* * * * *", async () => {
    logger.info(`Cron job scheduler post at ${new Date().toISOString()}`);
    try {
      const now = new Date();
      const duePosts = await prisma.socialPost.findMany({
        where: {
          scheduled_for: { lte: now },
          status: { in: ["scheduled", "accepted"] }, // Check for both scheduled and accepted posts
        },
      });

      for (const post of duePosts) {
        try {
          const publishedData: any = {};
          const results: Results = {};

          if ((post.platforms as string[]).includes("twitter")) {
            const twitterResult = await TwitterProvider.publishPost(
              post.content,
              (post.media_urls as string[]) || [],
              post.created_by_id
            );
            results.twitter = twitterResult;
            if (twitterResult.success) {
              publishedData.twitter = { tweet_id: twitterResult.data.data.id };
            }
          }
          if ((post.platforms as string[]).includes("linkedin")) {
            const linkedinResult = await LinkedinProvider.publishPost(
              post.content,
              (post.media_urls as string[]) || [],
              post.created_by_id
            );
            results.linkedin = linkedinResult;
            if (linkedinResult.success) {
              publishedData.linkedin = { post_id: linkedinResult.data?.id };
            }
          }
          if ((post.platforms as string[]).includes("facebook")) {
            const facebookResult = await MetaProvider.publishPost(
              post.content,
              (post.media_urls as string[]) || [],
              post.created_by_id
            );
            results.facebook = facebookResult;
            if (facebookResult.success) {
              publishedData.facebook = { post_id: facebookResult.data?.id };
            }
          }
          console.log(`Posted to platforms:`, post.platforms);

          // Update status to 'published', set published_data, and created_date
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "published",
              published_data: publishedData,
            },
          });
        } catch (postErr) {
          logger.error(`Error posting: ${postErr}`);
        }
      }
    } catch (err) {
      logger.error(`Error in scheduled post cron: ${err}`);
    }
  });

  logger.info("Scheduled post cron started");
};

export { startScheduledPostCron };
