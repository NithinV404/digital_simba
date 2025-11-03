import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { handlePrismaError } from "../utils/prismaErrorHandler";
import {
  createAccessToken,
  createRefreshToken,
  isRefreshTokenExpired,
  setAuthCookies,
} from "../utils/token";
import { logger } from "../utils/logger";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService";

class AuthController {
  static refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      logger.error("No refresh Token Provided");
      return res.status(400).json({ error: "No refresh Token Provided" });
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      logger.error("Invalid token try logging in again");
      res.status(401).json({ error: "Invalid token try logging in again" });
      return;
    }

    if (tokenRecord.revoked) {
      logger.error("Token revoked try logging in again");
      res.status(401).json({ error: "Token revoked try logging in again" });
      return;
    }

    if (isRefreshTokenExpired(tokenRecord.expiresAt)) {
      await prisma.refreshToken
        .delete({ where: { token: refreshToken } })
        .catch((e) => {
          logger.error(e);
        });
      logger.error("Refresh Token expired");
      res.status(401).json({ error: "Refresh token expired" });
      return;
    }

    try {
      const accessToken = createAccessToken(
        tokenRecord.user.id,
        tokenRecord.user.email
      );
      const newRefreshToken = await createRefreshToken(
        tokenRecord.user.id,
        tokenRecord.user.email
      );

      setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

      await prisma.$transaction(async (tx) => {
        const refresh_token_record = await tx.refreshToken.findUnique({
          where: { token: newRefreshToken },
        });
        logger.info(`New token record ID: ${refresh_token_record?.id}`);

        await tx.refreshToken.update({
          where: { token: refreshToken },
          data: { revoked: true, replacedBy: refresh_token_record?.id },
        });
      });

      logger.info(`Token refreshed for user:${tokenRecord.user.id}`);
      return res.status(200).json({ message: "Token refreshed" });
    } catch (e) {
      logger.error(e);
      return res.status(400).json({ error: e });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        logger.error("Invalid credentials");
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const accessToken = createAccessToken(user.id, user.email);
      const refreshRecord = await createRefreshToken(user.id, user.email);
      setAuthCookies(res, { accessToken, refreshToken: refreshRecord });
      logger.info("Login successful", user.id);
      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      const { status, message } = handlePrismaError(err);
      logger.error(err);
      res.status(status).json({ error: message });
    }
  };

  static register = async (req, res) => {
    try {
      const { email, password, ...otherData } = req.body;

      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT, 10)
      );
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          ...otherData,
        },
      });
      const accessToken = createAccessToken(user.id, user.email);
      const refreshRecord = await createRefreshToken(user.id, user.email);
      setAuthCookies(res, { accessToken, refreshToken: refreshRecord });
      logger.info("User created successfully:", user.id);
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      const { status, message } = handlePrismaError(err);
      logger.error(err);
      res.status(status).json({ error: message });
    }
  };

  static logout = async (req, res) => {
    try {
      const refreshToken = req.cookies && req.cookies.refreshToken;
      if (refreshToken) {
        await prisma.refreshToken
          .deleteMany({ where: { token: refreshToken } })
          .catch((e) => {
            logger.error("Error deleting refresh token:", e);
          });
      }

      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      logger.info("User logged out successfully");
      return res.json({ message: "Logged out" });
    } catch (err) {
      logger.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Don't reveal if user exists for security
        return res.status(200).json({
          message: "If the email exists, a reset link has been sent.",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken,
          resetPasswordExpires,
        },
      });

      // Send email
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password for your Digital Simba account.</p>
                            <p>Click the button below to reset your password:</p>
                            <a href="${resetUrl}" class="button">Reset Password</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Digital Simba. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      await sendEmail(
        user.email,
        "Password Reset Request - Digital Simba",
        html
      );

      res.status(200).json({
        message: "If the email exists, a reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res
        .status(500)
        .json({ error: "Failed to process password reset request" });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ error: "Token and new password are required" });
      }

      // Validate password strength
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      // Hash the token to compare with stored hash
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return res.status(400).json({
          error: "Invalid or expired reset token",
        });
      }

      // Hash new password - using same salt as register
      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT, 10)
      );

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      // Send confirmation email
      const confirmationHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Successful</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Your password has been successfully reset for your Digital Simba account.</p>
                            <p>If you did not make this change, please contact our support team immediately.</p>
                            <p>You can now log in with your new password.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Digital Simba. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      await sendEmail(
        user.email,
        "Password Reset Successful - Digital Simba",
        confirmationHtml
      );

      logger.info("Password reset successful for user:", user.id);
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  };
}

export default AuthController;
