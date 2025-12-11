// src/routes/messages.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { MessagesController } from '../controllers/messagesController';

const router = Router();
const messagesController = new MessagesController();


router.post('/direct', authenticateToken, messagesController.sendDM);
router.get('/direct/:contactId', authenticateToken, messagesController.getDMs);

router.post('/group', authenticateToken, messagesController.sendGroupMsg);
router.get('/group/:groupId', authenticateToken, messagesController.getGroupMsgs);

export default router;