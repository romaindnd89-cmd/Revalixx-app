export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  timestamp: number;
}

export interface VideoItem {
  id: string;
  url: string; // YouTube URL or Embed ID
  title?: string;
  timestamp: number;
}

export interface TourDate {
  id: string;
  city: string;
  event: string;
  active: boolean;
}

export interface ArtistProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export type ViewState = 'home' | 'gallery' | 'videos' | 'bio';