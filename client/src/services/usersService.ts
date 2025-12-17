// src/services/usersService.ts
import axios from 'axios';
import { type User } from '../types/userType';


// Configurer l'en-tête d'authentification
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Récupérer tous les utilisateurs
export const getAllUsersService = async (): Promise<User[]> => { 
    const response = await axios.get<User[]>("/api/users/allUsers", getAuthConfig());
    return response.data;
};