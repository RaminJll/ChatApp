// server/src/routes/auth.ts

import { Router} from 'express';
import { AuthController } from '../controllers/AuthController';

const router: Router = Router();
const authController = new AuthController();

router.post('/sign-up', authController.register);

router.post('/login', authController.login);

export default router;