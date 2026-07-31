import axios from 'axios';

const isServer = typeof window === 'undefined';
const baseURL = isServer 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')
  : '';

// Create a custom axios instance
export const api = axios.create({
  baseURL,
  withCredentials: true, // Important for sending/receiving the HTTP-only JWT cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle 401 Unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401, redirect to login unless we are already on the login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
