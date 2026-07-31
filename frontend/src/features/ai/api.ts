import { api } from '@/lib/axios';

export const aiApi = {
  getLibrarySummary: async () => {
    const { data } = await api.get('/api/ai/library-summary');
    return data.data;
  },
  generateLibrarySummary: async () => {
    const { data } = await api.post('/api/ai/library-summary/generate');
    return data.data;
  }
};
