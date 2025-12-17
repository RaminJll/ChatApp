// server/src/routes/users.ts

import { Router} from 'express';
import { UserController } from '../controllers/UsersController';
import { authenticateToken } from '../middlewares/auth.middleware';


const router: Router = Router();
const userController = new UserController();

// Récupérer tous les utilisateurs (pour la recherche d'amis)
router.get('/allUsers', authenticateToken, userController.allUsers);


export default router;