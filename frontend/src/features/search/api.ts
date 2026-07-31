import { api } from '@/lib/axios';

export const searchApi = {
  searchAlbums: async (query: string, limit: number = 20) => {
    const { data } = await api.get('/api/search', {
      params: { query, limit, type: 'album' }
    });
    return data.data; // ApiResponse.data -> ItunesSearchResponse
  }
};
