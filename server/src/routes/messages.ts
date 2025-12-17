// src/routes/messages.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { MessagesController } from '../controllers/messagesController';

const router = Router();
const messagesController = new MessagesController();

// Envoyer un message privé
router.post('/direct', authenticateToken, messagesController.sendDM);

// Récupérer l'historique privé
router.get('/direct/:contactId', authenticateToken, messagesController.getDMs);

// Envoyer un message de groupe
router.post('/group', authenticateToken, messagesController.sendGroupMsg);

// Récupérer l'historique de groupe
router.get('/group/:groupId', authenticateToken, messagesController.getGroupMsgs);

export default router;