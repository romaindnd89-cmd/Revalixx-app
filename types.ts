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

export type ViewState = 'home' | 'gallery' | 'videos' | 'bio';