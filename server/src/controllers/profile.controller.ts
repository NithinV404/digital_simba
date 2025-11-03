import { handlePrismaError } from "../utils/prismaErrorHandler";
import { logger } from "../utils/logger";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ProfileController {
  static get = async (req, res) => {
    try {
      let user = null;
      try {
        user = await prisma.user.findUnique({
          where: { id: req.user.id },
          include: {
            social_accounts: {
              select: {
                id: true,
                platform: true,
                username: true,
                connected: true,
              },
            },
          },
        });
      } catch (includeErr) {
        logger.error(
          "Error including socialAccounts on profile fetch",
          includeErr
        );
        user = await prisma.user.findUnique({ where: { id: req.user.id } });
      }

      if (!user) return res.status(404).json({ error: "User not found" });

      const userInfo = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        organization_id: user.organization_id,
        organization_role: user.organization_role,
        social_accounts: user.social_accounts ? user.social_accounts : [],
      };

      return res.json(userInfo);
    } catch (err) {
      // Log and return friendly error
      logger.error("Profile route failed", err);
      const { status, message } = handlePrismaError(err);
      return res.status(status).json({ error: message });
    }
  };

  static edit = async (req, res) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: req.body,
      });
      return res
        .status(200)
        .json({ message: "Updated user successfully", updatedUser });
    } catch (err) {
      logger.error("Failed to update user", err);
      const { status, message } = handlePrismaError(err);
      return res.status(status).json({ error: message });
    }
  };

  static delete = async (req, res) => {
    try {
      await prisma.user.delete({ where: { id: req.user.id } });
      return res.status(200).json({ message: "Deleted the user successfully" });
    } catch (err) {
      logger.error("Failed to delete user", err);
      const { status, message } = handlePrismaError(err);
      return res.status(status).json({ error: message });
    }
  };
}

export default ProfileController;
