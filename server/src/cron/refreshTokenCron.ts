import cron from "node-cron";
import { main as runCleanup } from "../scripts/cleanupRefreshTokens";
import { logger } from "../utils/logger";

const DEFAULT_CRON = process.env.REFRESH_CLEANUP_CRON || "0 3 * * *";

function startRefreshTokenCron() {
  try {
    // schedule the task
    cron.schedule(
      DEFAULT_CRON,
      async () => {
        logger.info("[refresh-cron] running scheduled refresh token cleanup");
        try {
          await runCleanup();
        } catch (err) {
          logger.error(`[refresh-cron] cleanup failed: ${err}`);
        }
      },
      { scheduled: true }
    );

    logger.info(
      `[refresh-cron] scheduled cleanup with cron expr: ${DEFAULT_CRON}`
    );
  } catch (err) {
    logger.error(`[refresh-cron] failed to schedule cleanup: ${err}`);
  }
}

export { startRefreshTokenCron };
