// src/services/UserService.ts

import prisma from '../lib/prisma';

export class UserService {
    async allUsersService() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true
                }
            });
            return users;
            
        } catch (error) {
            throw error;
        }
    }
}