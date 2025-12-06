// src/services/AuthService.ts
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class AuthService {
    async registerUser(email: string, password: string, username: string) {
        
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("L'utilisateur existe déjà");
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });

        return user;
    }
}