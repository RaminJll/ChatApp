// src/routes/friends.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { FriendsController } from '../controllers/friendsController';

const router = Router();
const friendsController = new FriendsController();

router.post('/request', authenticateToken, friendsController.sendRequest);

router.get('/received', authenticateToken, friendsController.getReceivedRequests);

router.patch('/request/:senderId/accept', authenticateToken, friendsController.acceptRequest);

router.delete('/request/:senderId/refuse', authenticateToken, friendsController.refuseRequest);

router.get('/list', authenticateToken, friendsController.getFriends);

export default router;