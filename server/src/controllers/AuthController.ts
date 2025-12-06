// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: "Remplissez les {}" });
        }

        try {
            const newUser = await authService.registerUser(email, password, username);

            return res.status(201).json({ 
                message: 'Inscription réussie', 
                user: newUser 
            });

        } catch (error) {
            console.error("Erreur d'inscription", error);
            
            if (error instanceof Error && error.message.includes('Le compte existe déjà')) {
                return res.status(409).json({ error: "Cet email est déjà utilisé." });
            }
            
            return res.status(500).json({ error: "Erreur lors de l'inscription." });
        }
    }
}