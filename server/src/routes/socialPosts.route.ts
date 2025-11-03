import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware";
import SocialPostsController from "../controllers/socialPosts.controller";

router.post("/social-posts", authMiddleware, SocialPostsController.post);
router.get("/social-posts", authMiddleware, SocialPostsController.get);
router.put("/social-posts/:id", authMiddleware, SocialPostsController.edit);
router.delete(
  "/social-posts/:id",
  authMiddleware,
  SocialPostsController.delete
);
router.post(
  "/social-posts/:id/publish",
  authMiddleware,
  SocialPostsController.publish
);
router.get(
  "/social-posts/:id/engagement",
  authMiddleware,
  SocialPostsController.getEngagement
);

export default router;
