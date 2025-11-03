import google_passport from "../config/googleOAuth";
import { handlePrismaError } from "../utils/prismaErrorHandler";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
} from "../utils/token";
import { logger } from "../utils/logger";

const FRONTEND_URL = process.env.FRONTEND_URL;

class GoogleProvider {
  googleAuth = google_passport.authenticate("google", {
    scope: ["email", "profile"],
  });

  googleCallback = (req, res, next) => {
    google_passport.authenticate("google", async (error, user) => {
      if (error || !user) {
        return res.redirect(`${FRONTEND_URL}/home`);
      }
      try {
        const userFromDB = await prisma.user.findUnique({
          where: { email: user.email },
        });
        const accessToken = createAccessToken(userFromDB.id, userFromDB.email);
        const refreshToken = await createRefreshToken(
          userFromDB.id,
          userFromDB.email
        );
        setAuthCookies(res, { accessToken, refreshToken });
        res.redirect(`${FRONTEND_URL}`);
      } catch (e) {
        logger.error(e);
        const { status, message } = handlePrismaError(e);
        logger.error(e);
        res.status(status).json({ error: message });
        res.redirect(`${FRONTEND_URL}/login`);
      }
    })(req, res, next);
  };
}

export default new GoogleProvider();
