// src/services/authService.ts
import axios from 'axios';
import { type RegisterFormData, type LoginFormData, type LoginResponse } from '../types/authType';

export const registerUser = async (data: RegisterFormData) => {
  const response = await axios.post('/api/auth/inscription', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/connexion', data);
  return response.data;
}