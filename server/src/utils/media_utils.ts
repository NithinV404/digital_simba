import path from "path";
import fs from "fs";
import mime from "mime-types";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

interface MediaBuffer {
  data: Buffer;
  mimeType: string;
}

class MediaUtils {
  resolveBuffer = async (media: string): Promise<MediaBuffer | null> => {
    if (!media) return null;

    const mediaParts = media.split("/");
    if (mediaParts[mediaParts.length - 1] === "file") {
      const assetId = mediaParts[mediaParts.length - 2];
      const asset = await (prisma as any).mediaAsset.findUnique({
        where: { id: assetId },
      });
      if (!asset || !asset.file_url) {
        logger.warn(`Media asset not found for ID: ${assetId}`);
        return null;
      }
      const filePath = path.resolve(
        __dirname,
        "../../",
        asset.file_url.replace(/^[./]+/, "")
      );
      const buffer = await fs.promises.readFile(filePath);
      const mimeType = this.normalizeMime(path.extname(filePath));
      return { data: buffer, mimeType };
    } else {
      const response = await fetch(media);
      if (!response.ok) {
        throw new Error(
          `Fetch failed: ${response.status} ${response.statusText}`
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return { data: buffer, mimeType: this.normalizeMime(media) };
    }
  };

  normalizeMime = (file: string): string => {
    if (!file) return "application/octet-stream";
    const value = mime.lookup(file);
    const mimeTypeRef: Record<string, string> = {
      "application/mp4": "video/mp4",
    };
    const mimeValue = typeof value === "string" ? value : "";
    const result =
      mimeTypeRef[mimeValue] || mimeValue || "application/octet-stream";
    logger.debug(
      `normalizeMime: input=${file}, lookup=${value}, result=${result}`
    );
    return result;
  };

  inferCategory = (mimeType: string = ""): string => {
    if (typeof mimeType !== "string") return "tweet_image";
    const type = mimeType.toLowerCase();
    const mimeToCategory: Record<string, string> = {
      // Images
      "image/jpeg": "tweet_image",
      "image/jpg": "tweet_image",
      "image/png": "tweet_image",
      "image/webp": "tweet_image",
      "image/bmp": "tweet_image",
      "image/tiff": "tweet_image",

      // Gifs
      "image/gif": "tweet_gif",

      // Videos
      "video/mp4": "tweet_video",
      "video/quicktime": "tweet",
      "video/mpeg": "tweet_video",
      "video/webm": "tweet_video",
      "video/ogg": "tweet_video",
      "video/x-flv": "tweet_video",
      "video/x-matroska": "tweet_video",
      "video/3gpp": "tweet_video",
      "video/3gpp2": "tweet_video",
    };

    return mimeToCategory[type] || "tweet_image";
  };
}

export default new MediaUtils();
