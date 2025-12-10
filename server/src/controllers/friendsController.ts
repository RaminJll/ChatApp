// src/controllers/friendsController.ts
import { Response } from 'express';
// Assure-toi que le chemin vers ton middleware est correct
import { AuthRequest } from '../middlewares/auth.middleware';
import { FriendsService } from '../services/friendsService';

const friendsService = new FriendsService();

export class FriendsController {
  async sendRequest(req: AuthRequest, res: Response) {
    try {
      const senderId = req.userId;
      const { receiverId } = req.body;

      if (!senderId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      if (!receiverId) {
        return res.status(400).json({ error: "L'ID du destinataire est manquant" });
      }

      const result = await friendsService.sendRequestService(senderId, receiverId);

      return res.status(201).json({
        message: "Demande d'ami envoyée !",
        data: result
      });

    } catch (error: any) {
      console.error("Erreur sendFriendRequest:", error);
      return res.status(400).json({
        error: error.message || "Erreur lors de l'envoi de la demande"
      });
    }
  }

  async getReceivedRequests(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ error: "Non authentifié" });

      const requests = await friendsService.getReceivedRequestsService(userId);
      
      return res.status(200).json(requests);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur lors de la récupération des demandes." });
    }
  }

  async acceptRequest(req: AuthRequest, res: Response) {
    try {
      const receiverId = req.userId;
      const { senderId } = req.params;

      if (!receiverId) return res.status(401).json({ error: "Non authentifié" });

      await friendsService.acceptRequestService(receiverId, senderId);

      return res.status(200).json({ message: "Ami accepté avec succès !" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async refuseRequest(req: AuthRequest, res: Response) {
    try {
      const receiverId = req.userId;
      const { senderId } = req.params;

      if (!receiverId) return res.status(401).json({ error: "Non authentifié" });

      await friendsService.refuseRequestService(receiverId, senderId);

      return res.status(200).json({ message: "Demande refusée." });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getFriends(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ error: "Non authentifié" });

      const friends = await friendsService.getFriendsListService(userId);
      
      return res.status(200).json(friends);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur lors de la récupération des amis." });
    }
  }
};