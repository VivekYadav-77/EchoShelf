import { api } from '@/lib/axios';

export const aiApi = {
  getLibrarySummary: async () => {
    const { data } = await api.get('/api/ai/library-summary');
    return data.data;
  }
};
