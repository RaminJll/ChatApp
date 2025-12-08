// server/src/routes/auth.ts

import { Router} from 'express';
import { AuthController } from '../controllers/AuthController';

const router: Router = Router();
const authController = new AuthController();

router.post('/inscription', authController.register);

router.post('/connexion', authController.login);

export default router;