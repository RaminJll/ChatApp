import axios from 'axios';

export const api = axios.create({
  // baseURL volontairement vide: on garde les chemins `/api/...` (proxy Vite éventuel)
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      // évite les états "semi-connectés" si le token a expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

