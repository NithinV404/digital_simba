#!/usr/bin/env node
/*
 * CLI script to cleanup expired and old revoked refresh tokens.
 * This is intended to be run from cron or manually.
 */
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const now = new Date();
    const expired = await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    const retentionDays = parseInt(
      process.env.REFRESH_REVOKED_RETENTION_DAYS || "30",
      10
    );
    const retentionDate = new Date(
      Date.now() - retentionDays * 24 * 60 * 60 * 1000
    );
    const revoked = await prisma.refreshToken.deleteMany({
      where: { revoked: true, createdAt: { lt: retentionDate } },
    });

    logger.info(
      `removed ${expired.count} expired and ${revoked.count} old revoked refresh tokens`
    );
  } catch (err: any) {
    logger.error(`cleanup failed: ${err}`);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
