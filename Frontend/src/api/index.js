import axios from 'axios';

// Base URL — Vite proxy will forward /api/* to http://localhost:5000
const api = axios.create({
  baseURL: 'https://petpulse-backend-olqa.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('petpulse_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { }
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export default api;
