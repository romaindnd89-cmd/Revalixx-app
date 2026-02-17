import React, { useState, useEffect } from 'react';
import { ArtistProfile } from '../types';
import { DEFAULT_ARTISTS } from '../constants';
import { Save, User, Image as ImageIcon, Type } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';

interface ArtistsSectionProps {
  isAdmin: boolean;
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({ isAdmin }) => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Les artistes sont une collection fixe pour ce cas d'usage, on écoute les changements
      const unsubscribe = onSnapshot(collection(db, 'artists'), (snapshot) => {
        const items = snapshot.docs.map(d => d.data() as ArtistProfile);
        
        // Si la DB est vide (premier lancement), on peut proposer les défauts localement
        // ou l'utilisateur Admin devra les créer.
        if (items.length > 0) {
            // Tri pour garder l'ordre (facultatif si IDs connus)
            setArtists(items.sort((a,b) => a.id.localeCompare(b.id)));
        } else {
            // Optionnel: Initialiser la DB avec les défauts si vide (pour le premier run)
            // Mais ici on laisse vide ou on fallback
            setArtists([]);
        }
        setLoading(false);
      }, (err) => {
        console.error(err);
        setArtists(DEFAULT_ARTISTS); // Fallback si pas de DB
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setArtists(DEFAULT_ARTISTS);
      setLoading(false);
    }
  }, []);

  const handleUpdate = (id: string, field: keyof ArtistProfile, value: string) => {
    const updated = artists.map(a => a.id === id ? { ...a, [field]: value } : a);
    setArtists(updated);
  };

  const saveArtists = async () => {
    try {
        // Sauvegarde chaque artiste dans son document respectif
        const promises = artists.map(artist => {
            // On utilise l'ID de l'artiste comme ID de document pour simplifier
            return setDoc(doc(db, 'artists', artist.id), artist);
        });
        await Promise.all(promises);
        setEditMode(false);
    } catch (e) {
        alert("Erreur lors de la sauvegarde.");
        console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-red-600">LOADING DATA...</div>;

  // Si DB vide et Admin, afficher un bouton pour initialiser
  if (artists.length === 0 && isAdmin) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
            <p>Aucun artiste dans la base de données.</p>
            <button 
                onClick={() => {
                    setArtists(DEFAULT_ARTISTS);
                    // Trigger immédiat de save pour peupler la DB
                    const promises = DEFAULT_ARTISTS.map(a => setDoc(doc(db, 'artists', a.id), a));
                    Promise.all(promises).then(() => window.location.reload());
                }}
                className="bg-red-600 px-4 py-2 font-bold"
            >
                INITIALISER AVEC LES DÉFAUTS
            </button>
        </div>
     )
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-12 border-b border-red-900/50 pb-6">
        <div>
          <h2 className="brand-font text-5xl md:text-6xl text-white neon-text uppercase">Artists</h2>
          <p className="text-red-600 tracking-[0.4em] text-xs mt-2 uppercase font-bold">The masterminds behind chaos</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => editMode ? saveArtists() : setEditMode(true)}
            className={`flex items-center gap-2 px-6 py-2 rounded-sm font-bold transition-all brand-font text-lg tracking-wider ${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            {editMode ? <Save size={20} /> : 'ÉDITER'}
            {editMode ? 'SAUVEGARDER' : ''}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {artists.map((artist) => (
          <div key={artist.id} className="group flex flex-col bg-neutral-900/40 border border-gray-800 hover:border-red-600/50 transition-all duration-500 overflow-hidden relative">
            
            {/* Image Section */}
            <div className="aspect-[4/5] relative overflow-hidden">
              {editMode ? (
                <div className="absolute inset-0 bg-black/80 z-10 p-6 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-1">
                    <ImageIcon size={14} /> URL de la Photo
                  </div>
                  <input 
                    className="w-full bg-neutral-800 border border-gray-700 p-2 text-white text-xs"
                    value={artist.imageUrl}
                    onChange={(e) => handleUpdate(artist.id, 'imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              ) : null}
              <img 
                src={artist.imageUrl} 
                alt={artist.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col gap-4 relative">
              {editMode ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase mb-1">
                       <User size={12} /> Nom de Scène
                    </label>
                    <input 
                      className="w-full bg-black border border-gray-800 p-2 text-white brand-font text-xl uppercase"
                      value={artist.name}
                      onChange={(e) => handleUpdate(artist.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase mb-1">
                       <Type size={12} /> Biographie
                    </label>
                    <textarea 
                      className="w-full bg-black border border-gray-800 p-3 text-gray-300 text-sm h-32 resize-none"
                      value={artist.bio}
                      onChange={(e) => handleUpdate(artist.id, 'bio', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="brand-font text-4xl text-white tracking-tighter mb-1">{artist.name}</h3>
                    <p className="text-red-500 text-[10px] font-mono tracking-[0.3em] font-bold">{artist.role}</p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-red-600 first-letter:mr-1">
                    {artist.bio}
                  </p>
                </>
              )}
            </div>

            {/* Aesthetic accent */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-red-900/20 group-hover:border-red-600 transition-colors pointer-events-none"></div>
          </div>
        ))}
      </div>

      <div className="mt-20 py-12 border-t border-gray-900 text-center">
         <p className="text-gray-600 text-xs tracking-[0.5em] uppercase">Built for the rave since 2024</p>
      </div>
    </div>
  );
};

export default ArtistsSection;