import express from "express";
const router = express.Router();
import cors from "cors";
import AuthController from "../controllers/auth.controller";
import GoogleProvider from "../providers/googleProvider";
import TwitterProvider from "../providers/xProvider";
import LinkedinProvider from "../providers/linkedinProvider";
import authMiddleware from "../middleware/authMiddleware";

router.options("/twitter", cors());

router.get("/google", GoogleProvider.googleAuth);
router.get("/google/callback", GoogleProvider.googleCallback);

router.get("/twitter/connect", authMiddleware, TwitterProvider.connect);
router.get("/twitter/callback", authMiddleware, TwitterProvider.callback);

router.get("/linkedin/connect", authMiddleware, (req, res) =>
  LinkedinProvider.connect(req as any, res as any)
);
router.get("/linkedin/callback", authMiddleware, (req, res) =>
  LinkedinProvider.callback(req as any, res as any)
);

router.post("/refresh-token", AuthController.refreshToken);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;
