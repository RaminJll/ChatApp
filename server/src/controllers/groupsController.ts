// src/controllers/groupsController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GroupsService } from '../services/groupsService';

const groupsService = new GroupsService();

export class GroupsController {

  // Créer un groupe
  async createGroup(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.userId;
      const { name } = req.body;

      if (!creatorId) return res.status(401).json({ error: "Non authentifié" });
      if (!name) return res.status(400).json({ error: "Le nom du groupe est requis" });

      const newGroup = await groupsService.createGroupService(name, creatorId);

      return res.status(201).json({ message: "Groupe créé !", data: newGroup });
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur lors de la création du groupe" });
    }
  }

  // Mes groupes
  async getMyGroups(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ error: "Non authentifié" });

      const groups = await groupsService.getUserGroupsService(userId);
      return res.status(200).json(groups);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur récupération des groupes" });
    }
  }

  // POST: Ajouter un membre
  async addMember(req: AuthRequest, res: Response) {
    try {
      const requesterId = req.userId; 
      const { groupId, userIdToAdd } = req.body;

      if (!requesterId) return res.status(401).json({ error: "Non authentifié" });
      if (!groupId || !userIdToAdd) {
        return res.status(400).json({ error: "ID du groupe et de l'utilisateur requis" });
      }

      await groupsService.addMemberToGroupService(groupId, userIdToAdd, requesterId);

      return res.status(200).json({ message: "Ami ajouté au groupe avec succès !" });

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}