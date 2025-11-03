import cron from "node-cron";
import { logger } from "../utils/logger";
import AnalyticsSyncService from "../scripts/analyticsSyncService";

const startAnalyticsSyncCron = () => {
  // Run analytics sync every hour
  cron.schedule("0 */4 * * *", async () => {
    logger.info(
      `Analytics sync cron job starting at ${new Date().toISOString()}`
    );
    try {
      await AnalyticsSyncService.syncAnalytics();
      logger.info("Analytics sync cron job completed successfully");
    } catch (error) {
      logger.error(`Analytics sync cron job failed: ${error.message}`);
    }
  });

  logger.info("Analytics sync cron started - will run every hour");
};

export { startAnalyticsSyncCron };
