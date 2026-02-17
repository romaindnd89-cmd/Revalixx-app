import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Play } from 'lucide-react';
import { VideoItem } from '../types';
import { DEFAULT_VIDEOS } from '../constants';

interface VideoSectionProps {
  isAdmin: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ isAdmin }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('revalixx_videos');
    if (saved) {
      setVideos(JSON.parse(saved));
    } else {
      setVideos(DEFAULT_VIDEOS);
    }
  }, []);

  const saveVideos = (items: VideoItem[]) => {
    setVideos(items);
    localStorage.setItem('revalixx_videos', JSON.stringify(items));
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newItem: VideoItem = {
      id: Date.now().toString(),
      url: newUrl,
      title: newTitle || 'NO TITLE',
      timestamp: Date.now(),
    };

    saveVideos([newItem, ...videos]);
    setNewUrl('');
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette vidéo ?')) {
      saveVideos(videos.filter(v => v.id !== id));
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-red-900/50 pb-4">
        <h2 className="brand-font text-4xl md:text-5xl text-white neon-text uppercase">Video Transmissions</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm font-bold transition-colors brand-font text-sm md:text-lg tracking-wider"
          >
            <Plus size={20} /> AJOUTER
          </button>
        )}
      </div>

      {isAdmin && isAdding && (
        <form onSubmit={handleAdd} className="mb-10 bg-neutral-900 border border-red-900/50 p-6 rounded-lg animate-slide-down">
          <h3 className="text-xl text-red-500 mb-4 font-bold uppercase brand-font">Ajouter une vidéo (YouTube)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Lien YouTube</label>
              <input 
                type="text" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Titre du Set</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Hard Techno Mix 2024..."
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-white text-black px-6 py-2 font-bold hover:bg-gray-200 uppercase brand-font">
            Confirmer
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {videos.map((video) => {
          const ytId = getYoutubeId(video.url);
          return (
            <div key={video.id} className="relative bg-neutral-900 border border-gray-800 p-2 group hover:border-red-600 transition-colors">
              <div className="aspect-video w-full bg-black">
                {ytId ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${ytId}`} 
                    title={video.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-600">
                    <Play size={48} />
                    <span className="ml-2">Lien invalide</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center p-4">
                <h3 className="brand-font text-xl md:text-2xl text-white truncate uppercase">{video.title}</h3>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
         {videos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <Play size={48} className="mb-4" />
            <p className="text-xl">Aucune vidéo disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection;