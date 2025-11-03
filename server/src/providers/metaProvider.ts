import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { PrismaClient } from "@prisma/client";
import MediaUtils from "../utils/media_utils";
import FormData from "form-data";

const prisma = new PrismaClient();

const FACEBOOK_URL_BASE = "https://www.facebook.com";
const GRAPH_API_BASE = "https://graph.facebook.com/v18.0";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

if (!FACEBOOK_CLIENT_ID || !FACEBOOK_CLIENT_SECRET) {
  throw new Error(
    "Missing Facebook OAuth credentials. Set FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET."
  );
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
  query: any;
}

interface FacebookProfile {
  id: string;
  name: string;
  email?: string;
}

interface FacebookTokenResponse {
  access_token: string;
  expires_in?: number;
}

interface MediaSource {
  data: Buffer;
  mimeType: string;
}

interface PublishResult {
  success: boolean;
  data?: any;
  platform: string;
  error?: string;
}

interface EngagementResult {
  success: boolean;
  data?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    engaged_users: number;
  };
  error?: string;
}

interface ConnectionStatus {
  connected: boolean;
  username: string | null;
}

class MetaProvider {
  private facebook_scopes = ["email", "public_profile"].join(",");

  connect = (req: AuthenticatedRequest, res: Response): void => {
    const state = crypto.randomBytes(16).toString("hex");
    try {
      const paramsForAuth = new URLSearchParams({
        client_id: FACEBOOK_CLIENT_ID!,
        redirect_uri: FACEBOOK_CALLBACK_URL!,
        scope: this.facebook_scopes,
        response_type: "code",
        state: state,
      });
      (res as any).redirect(
        `${FACEBOOK_URL_BASE}/v18.0/dialog/oauth?${paramsForAuth.toString()}`
      );
    } catch (e) {
      logger.error(e);
    }
  };

  disconnect = async (userId: string): Promise<{ success: boolean }> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "facebook", connected: true },
      });

      if (account && account.accessToken) {
        try {
          await axios.delete(`${GRAPH_API_BASE}/me/permissions`, {
            params: {
              access_token: account.accessToken,
            },
          });
          logger.info("Facebook token revoked successfully");
        } catch (revokeError: any) {
          logger.warn(
            "Failed to revoke Facebook token: ",
            revokeError.response?.data || revokeError.message
          );
        }
      }

      await (prisma as any).socialAccount.deleteMany({
        where: { userId, platform: "facebook" },
      });

      return { success: true };
    } catch (error: any) {
      logger.error("Error disconnecting Facebook:", error);
      throw error;
    }
  };

  me = async (accessToken: string): Promise<any> => {
    let profileResp;
    try {
      profileResp = await axios.get(`${GRAPH_API_BASE}/me`, {
        params: {
          fields: "id,name,email",
          access_token: accessToken,
        },
      });
    } catch (err: any) {
      logger.error(
        "Failed to fetch Facebook profile",
        err.response ? err.response.data : err.message
      );
    }
    return profileResp;
  };

  getAccount = async (userId: string): Promise<any> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "facebook", connected: true },
      });
      if (!account || !account.accessToken) {
        throw new Error("No valid Facebook access token found");
      }
      return account;
    } catch (error: any) {
      logger.error("Error retrieving Facebook access token:", error);
      throw error;
    }
  };

  callback = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { code, state, error, error_description } = req.query as any;

      if (error) {
        logger.warn(`Facebook OAuth error: ${error} - ${error_description}`);
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?facebook_error=denied`
        );
      }

      if (!code || !state) {
        logger.error("Missing code or state in Facebook callback");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?facebook_error=true`
        );
      }

      // Exchange code for access token
      const tokenParams = new URLSearchParams({
        client_id: FACEBOOK_CLIENT_ID!,
        client_secret: FACEBOOK_CLIENT_SECRET!,
        redirect_uri: FACEBOOK_CALLBACK_URL!,
        code,
      });

      const tokenResp = await axios.get(
        `${GRAPH_API_BASE}/oauth/access_token`,
        { params: tokenParams }
      );

      if (!tokenResp.data.access_token) {
        logger.error("Failed to get Facebook token");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?facebook_error=true`
        );
      }

      // Get user profile
      const profileData = await this.me(tokenResp.data.access_token);
      if (!profileData) {
        logger.error("Failed to fetch Facebook profile");
        return (res as any).redirect(
          `${process.env.FRONTEND_URL}/socialhub?facebook_error=true`
        );
      }

      const facebookUserId = profileData.data.id;
      const fullName = profileData.data.name;
      const userId = req.user.id;

      // Calculate expiration time (Facebook tokens typically last 60 days)
      const expiresAt = tokenResp.data.expires_in
        ? new Date(Date.now() + tokenResp.data.expires_in * 1000)
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

      await (prisma as any).socialAccount.upsert({
        where: { providerAccountId: facebookUserId },
        update: {
          accessToken: tokenResp.data.access_token,
          refreshToken: "",
        },
      });
    } catch (error) {
      logger.error("Error in Facebook callback:", error);
      (res as any).redirect(
        `${process.env.FRONTEND_URL}/socialhub?facebook_error=true`
      );
    }
  };

  publishPost = async (
    content: string,
    mediaUrls: string[],
    userId: string
  ): Promise<any> => {
    // TODO: Implement Facebook post publishing
    throw new Error("Facebook post publishing not implemented yet");
  };

  isConnected = async (
    userId: string
  ): Promise<{ connected: boolean; username: string | null }> => {
    try {
      const account = await (prisma as any).socialAccount.findFirst({
        where: { userId, platform: "facebook", connected: true },
      });
      return { connected: !!account, username: account?.username || null };
    } catch (error) {
      logger.error("Error checking Facebook connection:", error);
      return { connected: false, username: null };
    }
  };
}

export default new MetaProvider();
