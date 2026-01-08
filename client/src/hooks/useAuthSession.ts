// src/hooks/useAuthSession.ts
import { useNavigate } from 'react-router-dom';

export function useAuthSession() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || '';

  function logout(socket?: any) {
    socket?.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/connexion');
  }

  return { userId, logout };
}