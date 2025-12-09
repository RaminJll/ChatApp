import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
    async allUsers(req: Request, res: Response) {
        try {
            const allUsers = await userService.allUsersService();

            return res.status(200).json(allUsers);

        } catch (error) {
            return res.status(500).json({ 
                error: "Erreur interne du serveur lors de la récupération des utilisateurs."
            });
        }
    }
}
