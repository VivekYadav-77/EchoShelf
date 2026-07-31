import { api } from '@/lib/axios';

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/api/auth/me');
    return data.data; // ApiResponse.data
  }
};
