import { api } from '@/lib/axios';
import { AiInsightResponse } from '@/types';

export const aiApi = {
  getLibrarySummary: async (): Promise<AiInsightResponse> => {
    const { data } = await api.get('/api/ai/library-summary');
    return data.data;
  },
  generateLibrarySummary: async (): Promise<AiInsightResponse> => {
    const { data } = await api.post('/api/ai/library-summary/generate');
    return data.data;
  }
};
