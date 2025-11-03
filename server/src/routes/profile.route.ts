import express from "express";
const router = express.Router();
import cors from "cors";
import ProfileController from "../controllers/profile.controller";
import authMiddleware from "../middleware/authMiddleware";

router.get("/profile", authMiddleware, ProfileController.get);
router.put("/profile", authMiddleware, ProfileController.edit);
router.delete("/profile", authMiddleware, ProfileController.delete);

export default router;
