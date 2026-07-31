import { api } from '@/lib/axios';

export const analyticsApi = {
  getGenreDistribution: async () => {
    const { data } = await api.get('/api/analytics/genre-distribution');
    return data.data;
  },
  getReleasesByYear: async () => {
    const { data } = await api.get('/api/analytics/releases-by-year');
    return data.data;
  },
  getTopArtists: async () => {
    const { data } = await api.get('/api/analytics/top-artists');
    return data.data;
  },
  getRatingDistribution: async () => {
    const { data } = await api.get('/api/analytics/rating-distribution');
    return data.data;
  },
  getPriceHistogram: async () => {
    const { data } = await api.get('/api/analytics/price-histogram');
    return data.data;
  }
};
