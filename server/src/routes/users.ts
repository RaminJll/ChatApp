// server/src/routes/users.ts

import { Router} from 'express';
import { UserController } from '../controllers/UsersController';
import { authenticateToken } from '../middlewares/auth.middleware';


const router: Router = Router();
const userController = new UserController();

router.get('/allUsers', userController.allUsers);


export default router;