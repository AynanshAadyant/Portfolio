import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 5000,
  withCredentials: true, // Send HTTP-only cookies with requests
});

// Request interceptor: attach bearer token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 on admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/api/admin')) {
      // Clear expired token
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  }
);

export default api;
