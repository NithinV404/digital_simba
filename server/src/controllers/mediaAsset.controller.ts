import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface MediaAssetQuery {
  userId?: string;
  limit?: string;
  offset?: string;
}

interface CreateMediaAssetBody {
  name?: string;
  source?: string;
  prompt?: string;
  tags?: string | string[];
  is_sample?: string;
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

class MediaAssetController {
  // GET /api/mediaAssets/:id/file - Serve media file
  static get = async (req: Request, res: Response): Promise<void> => {
    try {
      const mediaAsset = await prisma.mediaAsset.findUnique({
        where: { id: req.params.id },
      });

      if (!mediaAsset) {
        res.status(404).json({ error: "Media asset not found" });
        return;
      }

      // Extract filename from file_url (e.g., "/uploads/media/filename.jpg" -> "filename.jpg")
      const filename = path.basename(mediaAsset.file_url);
      const filePath = path.join(__dirname, "../../uploads/media", filename);

      if (fs.existsSync(filePath)) {
        // Set appropriate content type
        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";

        if ([".jpg", ".jpeg"].includes(ext)) contentType = "image/jpeg";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".mp4") contentType = "video/mp4";
        else if (ext === ".webm") contentType = "video/webm";
        else if (ext === ".mov") contentType = "video/quicktime";

        res.setHeader("Content-Type", contentType);
        res.sendFile(filePath);
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (err: any) {
      console.error("Error serving media file:", err);
      res.status(500).json({ error: "Failed to serve media file" });
    }
  };

  // GET /api/mediaAssets - Get all media assets
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        userId,
        limit = "50",
        offset = "0",
      } = req.query as MediaAssetQuery;

      const whereClause = userId ? { created_by_id: userId } : {};

      const mediaAssets = await prisma.mediaAsset.findMany({
        where: whereClause,
        include: { user: true },
        take: parseInt(limit, 10),
        skip: parseInt(offset, 10),
        orderBy: { created_date: "desc" },
      });

      // Add secure URLs to each asset
      const assetsWithUrls = mediaAssets.map((asset) => ({
        ...asset,
        secure_url: `${req.protocol}://${req.get("host")}/api/mediaAssets/${
          asset.id
        }/file`,
      }));

      res.json(assetsWithUrls);
    } catch (err: any) {
      console.error("Error fetching media assets:", err);
      res.status(500).json({ error: "Failed to fetch mediaAssets" });
    }
  };

  // POST /api/mediaAssets - Upload media asset
  static post = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Generate file URL (adjust based on your server setup)
      const fileUrl = `/uploads/media/${req.file.filename}`;

      // Determine file type from mimetype
      const isVideo = req.file.mimetype.startsWith("video/");
      const fileType = isVideo ? "video" : "image";

      const body = req.body as CreateMediaAssetBody;
      const tags = body.tags
        ? typeof body.tags === "string"
          ? body.tags
          : JSON.stringify(body.tags)
        : "[]";

      const newMediaAsset = await prisma.mediaAsset.create({
        data: {
          name: body.name || req.file.originalname,
          file_url: fileUrl,
          file_type: fileType,
          source: body.source || "upload",
          prompt: body.prompt || "",
          tags,
          created_by_id: user.id,
          created_by: user.full_name,
          is_sample: body.is_sample === "true" || false,
        },
      });

      const secureUrl = `${req.protocol}://${req.get("host")}/api/mediaAssets/${
        newMediaAsset.id
      }/file`;

      res.status(201).json({
        message: "Media asset uploaded successfully",
        asset: {
          ...newMediaAsset,
          secure_url: secureUrl,
        },
        file_info: {
          original_name: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (err: any) {
      // Clean up uploaded file if database operation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error uploading media asset:", err);
      res
        .status(500)
        .json({ error: "Failed to upload media asset", details: err.message });
    }
  };

  // DELETE /api/mediaAssets/:id - Delete media asset
  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const mediaAsset = await prisma.mediaAsset.findUnique({
        where: { id: req.params.id },
      });

      if (!mediaAsset) {
        res.status(404).json({ error: "MediaAsset not found" });
        return;
      }

      // Delete file from filesystem if it's a local upload
      if (mediaAsset.file_url && mediaAsset.file_url.startsWith("/uploads/")) {
        const relativePath = mediaAsset.file_url.replace(/^\/+/, "");
        const filePath = path.join(__dirname, "../../", relativePath);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fsErr: any) {
            console.error("Failed to delete local media file", fsErr);
          }
        }
      }

      await prisma.mediaAsset.delete({ where: { id: req.params.id } });
      res.json({ message: "MediaAsset deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting media asset:", err);
      res.status(500).json({ error: "Failed to delete mediaAsset" });
    }
  };
}

export default MediaAssetController;
