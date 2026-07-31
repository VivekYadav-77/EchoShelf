import { api } from '@/lib/axios';
import { LibraryItem, SaveLibraryItemRequest, UpdateLibraryItemRequest } from '@/types';

export const libraryApi = {
  getLibrary: async (page: number = 0, size: number = 20): Promise<{ content: LibraryItem[], totalElements: number, totalPages: number }> => {
    const { data } = await api.get('/api/library', { params: { page, size } });
    return data.data;
  },
  saveToLibrary: async (albumData: SaveLibraryItemRequest): Promise<LibraryItem> => {
    const { data } = await api.post('/api/library', albumData);
    return data.data;
  },
  updateLibraryItem: async (id: number, updates: UpdateLibraryItemRequest): Promise<LibraryItem> => {
    const { data } = await api.put(`/api/library/${id}`, updates);
    return data.data;
  },
  deleteLibraryItem: async (id: number): Promise<void> => {
    await api.delete(`/api/library/${id}`);
  }
};
