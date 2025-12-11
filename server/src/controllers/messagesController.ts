// src/controllers/messagesController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { MessagesService } from '../services/messagesService';

const messagesService = new MessagesService();

export class MessagesController {

async sendDM(req: AuthRequest, res: Response) {
    try {
      const senderId = req.userId;
      const { receiverId, content } = req.body;

      if (!senderId) return res.status(401).json({ error: "Non authentifié" });
      if (!receiverId || !content) return res.status(400).json({ error: "Données manquantes" });

      const message = await messagesService.sendDirectMessage(senderId, receiverId, content);

      const io = req.app.get('io');
      
      io.to(receiverId).emit('receive_message', message);
      io.to(senderId).emit('receive_message', message);

      return res.status(201).json(message);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur envoi message privé" });
    }
  }

  async getDMs(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { contactId } = req.params;

      if (!userId) return res.status(401).json({ error: "Non authentifié" });

      const messages = await messagesService.getDirectMessages(userId, contactId);
      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur récupération messages privés" });
    }
  }

  async sendGroupMsg(req: AuthRequest, res: Response) {
    try {
      const senderId = req.userId;
      const { groupId, content } = req.body;

      if (!senderId) return res.status(401).json({ error: "Non authentifié" });
      if (!groupId || !content) return res.status(400).json({ error: "Données manquantes" });

      const message = await messagesService.sendGroupMessage(senderId, groupId, content);

      const io = req.app.get('io');
      io.to(groupId).emit('receive_message', message);

      return res.status(201).json(message);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getGroupMsgs(req: AuthRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const messages = await messagesService.getGroupMessages(groupId);
      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(500).json({ error: "Erreur récupération messages groupe" });
    }
  }
}