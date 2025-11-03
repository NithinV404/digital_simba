import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware";
import TeamInviteController from "../controllers/teamInvite.controller";

router.get("/teamInvites", authMiddleware, TeamInviteController.getAll);
router.get("/teamInvites/:id", authMiddleware, TeamInviteController.get);
router.post("/teamInvites", authMiddleware, TeamInviteController.post);
router.put("/teamInvites/:id", authMiddleware, TeamInviteController.edit);
router.delete("/teamInvites/:id", authMiddleware, TeamInviteController.delete);

export default router;
