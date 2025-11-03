import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { revokeRefreshToken } from "../utils/token";

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access-secret";

async function authMiddleware(req, res, next) {
  const tokenFromCookie = req.cookies?.sessionToken || req.cookies?.accessToken;
  const authHeader = req.headers?.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  const refreshToken = req.cookies?.refreshToken;

  if (!token) {
    logger.warn("No access token provided");
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    // If token is expired
    if (err.name === "TokenExpiredError") {
      logger.info(
        `Token expired for user, refresh token available: ${!!refreshToken}`
      );
      // Don't redirect here - let the client handle token refresh
      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_EXPIRED",
        hasRefreshToken: !!refreshToken,
      });
    }

    // Handle tampered or invalid tokens
    if (err.name === "JsonWebTokenError") {
      try {
        // Revoke refresh token if it exists
        if (refreshToken) {
          await revokeRefreshToken(refreshToken);
          logger.info("Refresh token revoked due to tampered access token");
        }

        // Clear all auth cookies
        res.clearCookie("sessionToken");
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
      } catch (clearErr) {
        logger.error(`Error clearing cookies: ${clearErr}`);
      }

      logger.warn(
        `Tampered or invalid access token detected from ${
          req.ip || "unknown IP"
        }`
      );
      return res.status(401).json({
        error: "Invalid token",
        code: "TOKEN_INVALID",
      });
    }

    // Other JWT errors
    logger.error(`JWT verification error: ${err}`);
    return res.status(401).json({ error: "Token verification failed" });
  }
}

export default authMiddleware;
