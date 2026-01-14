// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regex pour valider le mot de passe (au moins 8 caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;

export class AuthController {
    async register(req: Request, res: Response) {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: "Remplissez les champs manquants" });
        }
        else if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email non valide"})
        }
        else if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Mot de passe non valide"})
        }

        try {
            const newUser = await authService.registerUser(email, password, username);

            return res.status(200).json({ 
                message: 'Inscription réussie', 
                user: newUser 
            });

        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "L'utilisateur existe déjà") {
                    return res.status(500).json({ error: error.message });
                }
            }

            return res.status(500).json({ error: "Erreur interne lors de l'inscription." + error });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Remplissez les champs manquants" });
        }
        
        try {
            const authData = await authService.loginUser(email, password);

            return res.status(200).json({
                message: "Connexion réussie",
                token: authData.token,
                user: authData.user,
            });

        } catch (error) {
            console.error("Erreur de connexion:", error);

            if (error instanceof Error) {
                if (error.message === "Identifiants invalides") {
                    return res.status(500).json({ error: error.message });
                }
            }

            return res.status(500).json({ error: "Erreur serveur lors de la connexion." });
        }
    }
}