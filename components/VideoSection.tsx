import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Play, Loader, Instagram } from 'lucide-react';
import { VideoItem } from '../types';
import { supabase } from '../supabaseClient';

interface VideoSectionProps {
  isAdmin: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ isAdmin }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      if (data) setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    const subscription = supabase
      .channel('videos_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, (payload) => {
        fetchVideos();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getInstagramId = (url: string) => {
    // Supporte /p/ (post), /reel/ (reels), /tv/ (IGTV)
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)\/?/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newItem = {
      id: Date.now().toString(),
      url: newUrl,
      title: newTitle || 'NO TITLE',
      timestamp: Date.now(),
    };

    const { error } = await supabase.from('videos').insert([newItem]);

    if (!error) {
      setNewUrl('');
      setNewTitle('');
      setIsAdding(false);
    } else {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette vidéo ?')) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) alert("Erreur lors de la suppression");
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
          <h3 className="text-xl text-red-500 mb-4 font-bold uppercase brand-font">Ajouter une vidéo</h3>
          <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Supporte: YouTube & Instagram (Reels/Posts)</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Lien (URL)</label>
              <input 
                type="text" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://youtube.com/... ou https://instagram.com/reel/..."
                required
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Titre</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Closing Set 2024..."
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-white text-black px-6 py-2 font-bold hover:bg-gray-200 uppercase brand-font">
            Confirmer
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 text-red-600">
           <Loader className="animate-spin w-12 h-12" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {videos.map((video) => {
            const ytId = getYoutubeId(video.url);
            const instaId = getInstagramId(video.url);
            
            // Logique de classe pour la mise en page
            // Si c'est Instagram, on centre le contenu dans la case
            const containerClass = instaId 
                ? "bg-neutral-900/50 border border-gray-800 p-4 flex flex-col items-center" 
                : "relative bg-neutral-900 border border-gray-800 p-2 group hover:border-red-600 transition-colors";

            return (
              <div key={video.id} className={`${containerClass} animate-fade-in shadow-lg`}>
                
                {ytId ? (
                   // --- YOUTUBE LAYOUT (16:9) ---
                   <>
                    <div className="aspect-video w-full bg-black overflow-hidden relative">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${ytId}`} 
                          title={video.title}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                    </div>
                    <div className="flex justify-between items-center p-4 w-full">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Play size={18} className="text-red-500 shrink-0" />
                        <h3 className="brand-font text-xl md:text-2xl text-white truncate uppercase">{video.title}</h3>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleDelete(video.id)} className="text-gray-500 hover:text-red-600 transition-colors ml-4 shrink-0">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                   </>
                ) : instaId ? (
                   // --- INSTAGRAM LAYOUT (9:16 Vertical) ---
                   <>
                    {/* Conteneur format téléphone vertical */}
                    <div className="w-full max-w-[340px] aspect-[9/16] bg-black overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-900 rounded-sm">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          /* Note: pas de /captioned/ ici pour réduire le texte, et scrolling="no" */
                          src={`https://www.instagram.com/p/${instaId}/embed/`} 
                          title={video.title}
                          frameBorder="0" 
                          allowFullScreen
                          className="bg-black"
                          scrolling="no"
                          style={{ overflow: 'hidden' }} 
                        ></iframe>
                    </div>
                    <div className="flex justify-between items-center pt-4 w-full max-w-[340px]">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Instagram size={16} className="text-red-500 shrink-0" />
                        <h3 className="brand-font text-lg text-gray-300 truncate uppercase">{video.title}</h3>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleDelete(video.id)} className="text-gray-500 hover:text-red-600 transition-colors ml-2 shrink-0">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                   </>
                ) : (
                    // --- ERROR STATE ---
                    <div className="aspect-video w-full bg-black flex items-center justify-center text-red-600 flex-col gap-2">
                      <Play size={48} />
                      <span className="text-sm font-mono tracking-widest">SIGNAL PERDU / LIEN INVALIDE</span>
                      {isAdmin && <button onClick={() => handleDelete(video.id)} className="mt-2 text-white"><Trash2/></button>}
                    </div>
                )}
                
              </div>
            );
          })}
           {videos.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <Play size={48} className="mb-4" />
              <p className="text-xl">Aucune transmission vidéo.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoSection;