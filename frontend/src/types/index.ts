export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LibraryItem {
  id: number;
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  artworkUrl: string;
  collectionPrice: number;
  userRating?: number;
  userNotes?: string;
  createdAt: string;
}

export interface SaveLibraryItemRequest {
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  artworkUrl: string;
  collectionPrice: number;
}

export interface UpdateLibraryItemRequest {
  userRating?: number;
  userNotes?: string;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface Recommendation {
  title: string;
  artist: string;
  reason: string;
}

export interface AiInsightResponse {
  summary: string;
  recommendations: Recommendation[];
}

export interface ItunesAlbum {
  collectionId: number;
  collectionName: string;
  artistName: string;
  primaryGenreName: string;
  releaseDate: string;
  trackCount: number;
  artworkUrl100: string;
  collectionPrice: number;
}

export interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesAlbum[];
}
