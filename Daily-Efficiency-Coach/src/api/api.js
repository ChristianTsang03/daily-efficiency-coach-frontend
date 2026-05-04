import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If token expires or is invalid, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes('/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);
export default api;