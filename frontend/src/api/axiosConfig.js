import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hpms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Security & Auth Exceptions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized exception
      localStorage.removeItem('hpms_token');
      localStorage.removeItem('hpms_user');
    }
    return Promise.reject(error);
  }
);

export default api;
