import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { PhotoItem } from '../types';
import { DEFAULT_PHOTOS } from '../constants';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface GalleryProps {
  isAdmin: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isAdmin }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Connexion à Firebase
  useEffect(() => {
    try {
        const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhotoItem));
            setPhotos(items);
            setLoading(false);
        }, (err) => {
            console.error("Firebase error (Gallery):", err);
            // Si erreur, on ne charge rien ou les défauts
            setPhotos([]); 
            setLoading(false);
        });
        return () => unsubscribe();
    } catch (e) {
        setPhotos(DEFAULT_PHOTOS);
        setLoading(false);
    }
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    try {
        await addDoc(collection(db, 'photos'), {
          url: newUrl,
          caption: newCaption || 'REVALIXX MOMENT',
          timestamp: Date.now(),
        });

        setNewUrl('');
        setNewCaption('');
        setIsAdding(false);
    } catch (error) {
        alert("Erreur d'ajout (Vérifiez la connexion DB)");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette photo définitivement ?')) {
      try {
        await deleteDoc(doc(db, 'photos', id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-red-900/50 pb-4">
        <h2 className="brand-font text-5xl text-white neon-text">THE VOID</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm font-bold transition-colors brand-font text-lg tracking-wider"
          >
            <Plus size={20} /> AJOUTER
          </button>
        )}
      </div>

      {isAdmin && isAdding && (
        <form onSubmit={handleAdd} className="mb-10 bg-neutral-900 border border-red-900/50 p-6 rounded-lg animate-slide-down">
          <h3 className="text-xl text-red-500 mb-4 font-bold uppercase">Ajouter une nouvelle photo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-400 text-sm mb-1">URL de l'image</label>
              <input 
                type="url" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Légende</label>
              <input 
                type="text" 
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Concert Paris 2024..."
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-red-600 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-white text-black px-6 py-2 font-bold hover:bg-gray-200 uppercase">
            Confirmer
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-red-600 animate-pulse mt-20 text-xl tracking-widest">LOADING VOID CONTENT...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden border border-gray-800 bg-gray-900 hover:border-red-600 transition-colors">
            <img 
              src={photo.url} 
              alt={photo.caption} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${isAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <p className="brand-font text-2xl text-white">{photo.caption}</p>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-full hover:bg-red-600 transition-colors z-20"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <ImageIcon size={48} className="mb-4" />
            <p className="text-xl">Aucune photo pour le moment.</p>
            {isAdmin && <p className="text-sm mt-2 text-red-500">La base de données est vide. Ajoutez du contenu.</p>}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Gallery;