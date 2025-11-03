import express from "express";
const router = express.Router();
import cors from "cors";
import AnalyticsController from "../controllers/analytics";
import authMiddleware from "../middleware/authMiddleware";

// Public analytics endpoint - requires auth to access user's posts
router.get("/analytics", authMiddleware, AnalyticsController.list);

// Manual analytics sync endpoint
router.post("/analytics/sync", authMiddleware, AnalyticsController.manualSync);

export default router;
