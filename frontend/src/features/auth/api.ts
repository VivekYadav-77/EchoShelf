import { api } from '@/lib/axios';
import { ApiResponse, AuthResponse, User } from '@/types';

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<ApiResponse<string>> => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
  register: async (userData: Record<string, string>): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
  logout: async (): Promise<ApiResponse<void>> => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/api/auth/me');
    return data.data; // ApiResponse.data
  }
};
