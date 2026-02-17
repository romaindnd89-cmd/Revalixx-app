import { PhotoItem, VideoItem, TourDate } from './types';

// Using the uploaded image URL as the main logo
export const REVALIXX_LOGO_URL = "https://i.postimg.cc/mkPJmVMC/1000000712.png";

// Placeholder specifically if the above fails or for the chaos effect
export const PLACEHOLDER_LOGO = "https://i.postimg.cc/mkPJmVMC/1000000712.png"; 

export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1574431957262-632b73307452?q=80&w=2000&auto=format&fit=crop',
    caption: 'RAVE 01 // PARIS',
    timestamp: Date.now()
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop',
    caption: 'DARK ROOM SESSION',
    timestamp: Date.now() - 10000
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2000&auto=format&fit=crop',
    caption: 'CROWD CONTROL',
    timestamp: Date.now() - 20000
  }
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: '1',
    url: 'https://www.youtube.com/watch?v=M5QY2_8704o', // Placeholder Techno set
    title: 'HARD TECHNO MIX 2024',
    timestamp: Date.now()
  }
];

export const DEFAULT_TOUR_DATES: TourDate[] = [
  {
    id: '1',
    city: 'LYON',
    event: 'DARKNESS RITUAL',
    active: true
  }
];