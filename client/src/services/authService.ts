// src/services/authService.ts
import axios from 'axios';
import { type RegisterFormData, type LoginFormData, type LoginResponse } from '../types/authType';

// Enregistrer un nouvel utilisateur
export const registerUser = async (data: RegisterFormData) => {
  const response = await axios.post('/api/auth/sign-up', data);
  return response.data;
};

// Connecter un utilisateur
export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', data);
  return response.data;
}