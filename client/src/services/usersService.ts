// src/services/usersService.ts
import { api } from './api';
import { type User } from '../types/userType';

// Récupérer tous les utilisateurs
export const getAllUsersService = async (): Promise<User[]> => { 
    const response = await api.get<User[]>('/api/users/allUsers');
    return response.data;
};