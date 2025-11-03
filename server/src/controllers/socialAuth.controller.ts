import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import TwitterProvider from "../providers/xProvider";
import LinkedinProvider from "../providers/linkedinProvider";
import MetaProvider from "../providers/metaProvider";

const prisma = new PrismaClient();

interface SocialAccount {
  id: number;
  type: string;
  name: string;
  username: string;
  connected: boolean;
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    google_connected?: boolean;
    username?: string;
  };
}

interface ConnectionStatus {
  connected: boolean;
  username?: string | null;
  error?: string;
}

class SocialAuthController {
  // GET /api/socialAuth/accounts - Get all social accounts status
  static getAllSocialAccounts = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const SOCIALACCOUNTS: SocialAccount[] = [
      {
        id: 1,
        type: "google",
        name: "Google Account",
        username: "",
        connected: false,
      },
      {
        id: 2,
        type: "twitter",
        name: "Twitter Account",
        username: "",
        connected: false,
      },
      {
        id: 3,
        type: "facebook",
        name: "Facebook Account",
        username: "",
        connected: false,
      },
      {
        id: 4,
        type: "linkedin",
        name: "LinkedIn Account",
        username: "",
        connected: false,
      },
    ];

    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }

    try {
      await Promise.all(
        SOCIALACCOUNTS.map(async (account) => {
          switch (account.type) {
            case "google":
              // await checkgoogle(user);
              account.connected = !!user.google_connected;
              break;
            case "twitter":
              const twitterStatus = await TwitterProvider.isConnected(user.id);
              logger.debug(
                `User ${user.id} twitter_connected: ${twitterStatus.connected}`
              );
              account.connected = twitterStatus.connected;
              account.username = twitterStatus.username || "";
              break;
            case "facebook":
              const facebookStatus = await MetaProvider.isConnected(user.id);
              logger.debug(
                `User ${user.id} facebook_connected: ${facebookStatus.connected}`
              );
              account.connected = facebookStatus.connected;
              account.username = facebookStatus.username || "";
              break;
            case "linkedin":
              const linkedinStatus = await LinkedinProvider.isConnected(
                user.id
              );
              logger.debug(
                `User ${user.id} linkedin_connected: ${linkedinStatus.connected}`
              );
              account.connected = linkedinStatus.connected;
              account.username = linkedinStatus.username || "";
              break;
          }
        })
      );

      res.json(SOCIALACCOUNTS);
    } catch (err: any) {
      logger.error("Error checking social account status", err);
      res.status(500).json({ error: "internal_error" });
    }
  };

  // GET /api/socialAuth/accounts/:platform - Get specific account status
  static getAccount = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }
    const platform = req.params.platform;

    try {
      let result: ConnectionStatus;
      switch (platform) {
        case "google":
          // await checkgoogle(user);
          result = {
            connected: !!user.google_connected,
            username: user.username,
          };
          break;
        case "twitter":
          result = await TwitterProvider.isConnected(user.id);
          break;
        case "facebook":
          result = await MetaProvider.isConnected(user.id);
          break;
        case "linkedin":
          result = await LinkedinProvider.isConnected(user.id);
          break;
        default:
          result = { error: "unsupported_platform", connected: false };
      }
      res.json(result);
    } catch (e: any) {
      logger.error("Error getting social account status", e);
      res.status(400).json({ message: "Failed to get social media status" });
    }
  };

  // DELETE /api/socialAuth/accounts/:platform - Disconnect social account
  static disconnect = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      const platform = req.params.platform;

      switch (platform) {
        case "linkedin":
          await LinkedinProvider.disconnect(req.user.id);
          break;
        case "facebook":
          await MetaProvider.disconnect(req.user.id);
          break;
        case "twitter":
          await TwitterProvider.disconnect(req.user.id);
          break;
      }

      logger.info(`User ${user.id} disconnected platform ${platform}`);
      res.json({ success: true, message: `Disconnected platform ${platform}` });
    } catch (err: any) {
      logger.error("Error disconnecting social account", err);
      res.status(500).json({ error: "internal_error" });
    }
  };
}

export default SocialAuthController;
