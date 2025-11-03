import authMiddleware from "../middleware/authMiddleware";
import express from "express";
const router = express.Router();
import SocialAuthController from "../controllers/socialAuth.controller";

router.get(
  "/social-accounts/status",
  authMiddleware,
  SocialAuthController.getAllSocialAccounts
);
router.get(
  "/social-accounts/:platform",
  authMiddleware,
  SocialAuthController.getAccount
);
router.delete(
  "/social-accounts/:platform",
  authMiddleware,
  SocialAuthController.disconnect
);

export default router;
