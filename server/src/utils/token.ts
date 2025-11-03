/**
 * Token utilities: create access token and store refresh tokens in DB
 * Uses Prisma client generated via the default @prisma/client output
 */

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"; // 🔧 Add crypto import

const prisma = new PrismaClient();

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

function parseExpiryToMs(expiry) {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 60 * 60 * 1000; // default 1 hour

  const value = parseInt(match[1]);
  const unit = match[2];

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * units[unit];
}

function setAuthCookies(
  res,
  { accessToken, refreshToken } = {} as {
    accessToken?: string;
    refreshToken?: string;
  }
) {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: parseExpiryToMs(ACCESS_TOKEN_EXPIRES_IN),
      path: "/",
    });
  }
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: parseExpiryToMs(REFRESH_TOKEN_EXPIRES_IN),
      path: "/",
    });
  }
}

function createAccessToken(userId, userEmail) {
  return (jwt.sign as any)(
    { id: String(userId), email: String(userEmail) },
    process.env.ACCESS_JWT_SECRET || process.env.JWT_SECRET || "access-secret",
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

async function createRefreshToken(
  userId,
  userEmail,
  extraPayload = {},
  expiresIn = REFRESH_TOKEN_EXPIRES_IN
) {
  if (!userId) throw new Error("createRefreshToken requires userId");

  const payload = {
    id: String(userId),
    email: String(userEmail),
    jti: crypto.randomUUID(),
    ...extraPayload,
  };

  const newrefreshToken = (jwt.sign as any)(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
    { expiresIn }
  );

  const decoded = jwt.decode(newrefreshToken);
  const expires =
    decoded && typeof decoded === "object" && decoded.exp
      ? new Date(decoded.exp * 1000)
      : null;

  await prisma.refreshToken.create({
    data: {
      token: newrefreshToken,
      userId,
      expiresAt: expires,
    },
  });

  return newrefreshToken;
}

async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({ where: { token } });
}

function isRefreshTokenExpired(expires) {
  return new Date() > new Date(expires);
}

async function revokeRefreshToken(token, replacedBy = null) {
  return prisma.refreshToken.updateMany({
    where: { token, revoked: false },
    data: { revoked: true, replacedBy },
  });
}

async function revokeAllUserRefreshTokens(userId) {
  return prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
}

export {
  setAuthCookies,
  createAccessToken,
  createRefreshToken,
  findRefreshToken,
  isRefreshTokenExpired,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
};
