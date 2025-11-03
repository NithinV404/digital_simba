import "dotenv/config";
import express from "express";
import profileRoute from "./routes/profile.route";
import socialPostRoute from "./routes/socialPosts.route";
import socialAuthRoute from "./routes/socialAuth.route";
import mediaAssetRoute from "./routes/mediaAsset.route";
import authRoutes from "./routes/auth.route";
import analyticsRoutes from "./routes/analytics.route";

import cors from "cors";
import session from "express-session";
import passport from "./config/googleOAuth";
import cookieParser from "cookie-parser";
import { startRefreshTokenCron } from "./cron/refreshTokenCron";
import { logger, requestLogger } from "./utils/logger";
import { startScheduledPostCron } from "./cron/scheduledPostCron";
import { startAnalyticsSyncCron } from "./cron/analyticsSyncCron";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(requestLogger);

app.use("/api", profileRoute);
app.use("/api", socialPostRoute);
app.use("/api", socialAuthRoute);
app.use("/api", mediaAssetRoute);
app.use("/api", analyticsRoutes);

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.listen(3000, () => {
  logger.info("Server running on port 3000");
  try {
    startRefreshTokenCron();
  } catch (err) {
    logger.error(`Failed to start refresh token cron: ${err}`);
  }
  try {
    startScheduledPostCron();
  } catch (err) {
    logger.error(`Failed to start scheduled post cron: ${err}`);
  }
  try {
    startAnalyticsSyncCron();
  } catch (err) {
    logger.error(`Failed to start analytics sync cron: ${err}`);
  }
});
