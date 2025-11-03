import express from "express";
const router = express.Router();
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import MediaAssetController from "../controllers/mediaAsset.controller";
import authMiddleware from "../middleware/authMiddleware";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/media");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow images and videos
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|wmv|flv|webm/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"));
    }
  },
});

router.get("/mediaAssets/:id/file", authMiddleware, MediaAssetController.get);
router.get("/mediaAssets", authMiddleware, MediaAssetController.getAll);
router.post(
  "/mediaAssets/upload",
  authMiddleware,
  upload.single("media"),
  MediaAssetController.post
);
router.delete("/mediaAssets/:id", authMiddleware, MediaAssetController.delete);

export default router;
