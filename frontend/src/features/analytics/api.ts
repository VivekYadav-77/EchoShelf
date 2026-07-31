import { api } from '@/lib/axios';
import { ChartData } from '@/types';

export const analyticsApi = {
  getGenreDistribution: async (): Promise<ChartData[]> => {
    const { data } = await api.get('/api/analytics/genre-distribution');
    return data.data;
  },
  getReleasesByYear: async (): Promise<ChartData[]> => {
    const { data } = await api.get('/api/analytics/releases-by-year');
    return data.data;
  },
  getTopArtists: async (): Promise<ChartData[]> => {
    const { data } = await api.get('/api/analytics/top-artists');
    return data.data;
  },
  getRatingDistribution: async (): Promise<ChartData[]> => {
    const { data } = await api.get('/api/analytics/rating-distribution');
    return data.data;
  },
  getPriceHistogram: async (): Promise<ChartData[]> => {
    const { data } = await api.get('/api/analytics/price-histogram');
    return data.data;
  }
};
