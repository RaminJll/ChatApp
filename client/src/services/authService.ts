// src/services/authService.ts
import axios from 'axios';
import { type RegisterFormData } from '../types/authType';
import { type LoginFormData } from '../types/authType';

export const registerUser = async (data: RegisterFormData) => {
  const response = await axios.post('/api/auth/inscription', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData) => {
  const response = await axios.post('/api/auth/connexion', data);
  return response.data;
}