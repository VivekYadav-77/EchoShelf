import { api } from '@/lib/axios';

export const libraryApi = {
  getLibrary: async (page: number = 0, size: number = 20) => {
    const { data } = await api.get('/api/library', { params: { page, size } });
    return data.data;
  },
  saveToLibrary: async (albumData: any) => {
    const { data } = await api.post('/api/library', albumData);
    return data.data;
  },
  updateLibraryItem: async (id: number, updates: any) => {
    const { data } = await api.put(`/api/library/${id}`, updates);
    return data.data;
  },
  deleteLibraryItem: async (id: number) => {
    await api.delete(`/api/library/${id}`);
  }
};
