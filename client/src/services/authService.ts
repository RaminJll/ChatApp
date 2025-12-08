// src/services/authService.ts
import axios from 'axios';
import { type RegisterFormData } from '../types/authType';

const API_URL = '/api/auth'; 

export const registerUser = async (data: RegisterFormData) => {
  const response = await axios.post(`${API_URL}/inscription`, data);
  return response.data;
};