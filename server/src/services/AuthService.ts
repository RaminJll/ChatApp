// src/services/AuthService.ts
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length === 0) {
    throw new Error("JWT_SECRET n'est pas défini");
}

export class AuthService {
    async registerUser(email: string, password: string, username: string) {

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("L'utilisateur existe déjà");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

    async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Identifiants invalides");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Identifiants invalides");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET!,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        };
    }
}