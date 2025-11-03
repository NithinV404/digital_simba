import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTeamInviteBody {
  email: string;
  organization_id: string;
  role: string;
  invited_by: string;
  status: string;
  invite_token: string;
  expires_at: string;
  created_by_id: string;
  created_by: string;
  is_sample?: boolean;
}

interface UpdateTeamInviteBody extends CreateTeamInviteBody {}

class TeamInviteController {
  // GET /api/teamInvites - Get all team invites
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const teamInvites = await (prisma as any).teamInvite.findMany({
        include: { user: true },
      });
      res.json(teamInvites);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch teamInvites" });
    }
  };

  // GET /api/teamInvites/:id - Get a specific team invite
  static get = async (req: Request, res: Response): Promise<void> => {
    try {
      const teamInvite = await (prisma as any).teamInvite.findUnique({
        where: { id: req.params.id },
        include: { user: true },
      });
      if (!teamInvite) {
        res.status(404).json({ error: "TeamInvite not found" });
        return;
      }
      res.json(teamInvite);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch teamInvite" });
    }
  };

  // POST /api/teamInvites - Create a new team invite
  static post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as CreateTeamInviteBody;
      const {
        email,
        organization_id,
        role,
        invited_by,
        status,
        invite_token,
        expires_at,
        created_by_id,
        created_by,
        is_sample,
      } = body;

      const newTeamInvite = await (prisma as any).teamInvite.create({
        data: {
          email,
          organization_id,
          role,
          invited_by,
          status,
          invite_token,
          expires_at: new Date(expires_at),
          created_by_id,
          created_by,
          is_sample,
        },
      });
      res.status(201).json(newTeamInvite);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to create teamInvite" });
    }
  };

  // PUT /api/teamInvites/:id - Update a team invite
  static edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as UpdateTeamInviteBody;
      const {
        email,
        organization_id,
        role,
        invited_by,
        status,
        invite_token,
        expires_at,
        created_by_id,
        created_by,
        is_sample,
      } = body;

      const updatedTeamInvite = await (prisma as any).teamInvite.update({
        where: { id: req.params.id },
        data: {
          email,
          organization_id,
          role,
          invited_by,
          status,
          invite_token,
          expires_at: new Date(expires_at),
          created_by_id,
          created_by,
          is_sample,
        },
      });
      res.json(updatedTeamInvite);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update teamInvite" });
    }
  };

  // DELETE /api/teamInvites/:id - Delete a team invite
  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await (prisma as any).teamInvite.delete({ where: { id: req.params.id } });
      res.json({ message: "TeamInvite deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete teamInvite" });
    }
  };
}

export default TeamInviteController;
