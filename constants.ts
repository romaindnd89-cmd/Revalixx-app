import { PhotoItem, VideoItem, TourDate, ArtistProfile } from './types';

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

export const DEFAULT_ARTISTS: ArtistProfile[] = [
  {
    id: 'alixx',
    name: 'ALIXX',
    role: 'CO-FOUNDER / DJ',
    bio: 'Spécialiste de la Hard Techno industrielle aux kicks dévastateurs. Son style sombre et chirurgical définit l\'identité sonore de REVALIXX.',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'revaxx',
    name: 'DJ REVAXX',
    role: 'CO-FOUNDER / DJ',
    bio: 'Maître des percussions abrasives et des textures noise. DJ Revaxx fusionne l\'énergie brute de la rave avec une précision technique implacable.',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'
  }
];