// server/src/routes/auth.ts

import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';

const router: Router = Router();
const authController = new AuthController();

// Route POST pour l'inscription (POST /auth/inscription)
router.post('/inscription', authController.register); // Appel de la méthode register du contrôleur

// Route POST pour la connexion (POST /auth/connexion)
router.post('/connexion', (req: Request, res: Response) => {
  // Logique de connexion ici
  console.log('Nouvelle tentative de connexion:', req.body);
  res.json({ message: 'Connexion réussie (simulée)' });
});

// Exportez le routeur pour qu'il puisse être utilisé par app.ts
export default router;