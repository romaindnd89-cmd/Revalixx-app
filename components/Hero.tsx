import React, { useState, useEffect } from 'react';
import { REVALIXX_LOGO_URL, DEFAULT_TOUR_DATES } from '../constants';
import { TourDate } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface HeroProps {
  setView: (v: any) => void;
  isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ setView, isAdmin }) => {
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [newCity, setNewCity] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [loading, setLoading] = useState(true);

  // Connexion temps réel à Firebase
  useEffect(() => {
    try {
      const q = query(collection(db, 'tour_dates'), orderBy('id', 'desc')); // On peut trier par ID ou ajouter un timestamp
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const dates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourDate));
        setTourDates(dates.length > 0 ? dates : []);
        setLoading(false);
      }, (error) => {
        console.error("Erreur Firebase (Dates):", error);
        // Fallback pour éviter l'écran blanc si pas de config
        setTourDates(DEFAULT_TOUR_DATES); 
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.log("Firebase non configuré");
      setTourDates(DEFAULT_TOUR_DATES);
      setLoading(false);
    }
  }, []);

  const handleAddDate = async () => {
    if (!newCity || !newEvent) return;
    try {
      await addDoc(collection(db, 'tour_dates'), {
        city: newCity.toUpperCase(),
        event: newEvent.toUpperCase(),
        active: true,
        // Astuce: utiliser Date.now() comme ID pour le tri si besoin, ou laisser Firestore gérer
        timestamp: Date.now() 
      });
      setNewCity('');
      setNewEvent('');
    } catch (error) {
      alert("Erreur: Impossible d'ajouter (Vérifiez votre config Firebase)");
    }
  };

  const handleDeleteDate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tour_dates', id));
    } catch (error) {
      console.error("Error deleting date", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      
      {/* Top Ambient Light REMOVED to eliminate oval glow */}
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center animate-fade-in text-center">
        
        {/* Top Text: UNDERGROUND RESISTANCE */}
        <div className="mb-8 md:mb-12 w-full flex items-center justify-center gap-4 opacity-50">
             <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-red-600"></div>
             <span className="text-[10px] md:text-xs tracking-[0.6em] text-gray-500 uppercase font-mono">
                Underground Resistance
             </span>
             <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-red-600"></div>
        </div>

        {/* Logo Container - Clean, no background aura */}
        <div className="relative group cursor-pointer mb-12 flex items-center justify-center" onClick={() => setView('gallery')}>
            <img 
              src={REVALIXX_LOGO_URL} 
              alt="REVALIXX LOGO" 
              className="relative z-10 w-80 md:w-[32rem] lg:w-[42rem] object-contain drop-shadow-[0_0_35px_rgba(220,38,38,0.6)] hover:scale-105 transition-transform duration-700 animate-dying-light"
            />
        </div>

        {/* Genre List */}
        <div className="mb-12 md:mb-16 text-center relative z-10">
            <p className="text-gray-500 tracking-[0.3em] text-[10px] md:text-xs uppercase font-mono flex flex-wrap justify-center gap-4 md:gap-8">
                <span className="hover:text-red-500 transition-colors cursor-default">HARD TECHNO</span>
                <span className="text-red-900">•</span>
                <span className="hover:text-red-500 transition-colors cursor-default">RAW</span>
                <span className="text-red-900">•</span>
                <span className="hover:text-red-500 transition-colors cursor-default">HARDCORE</span>
                <span className="text-red-900">•</span>
                <span className="hover:text-red-500 transition-colors cursor-default">UPTEMPO</span>
            </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-[500px] mb-12 px-4 relative z-10">
            <button 
                onClick={() => setView('gallery')}
                className="flex-1 bg-white text-black py-3 px-4 hover:bg-gray-200 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                <span className="brand-font text-sm md:text-base font-bold tracking-[0.15em] uppercase">
                    Enter The Void
                </span>
            </button>

            <button 
                onClick={() => setView('videos')}
                className="flex-1 border border-red-900/50 bg-black/40 backdrop-blur-sm py-3 px-4 hover:border-red-500 transition-colors duration-300 group"
            >
                <span className="brand-font text-sm md:text-base text-gray-400 group-hover:text-red-500 tracking-[0.15em] uppercase">
                    Transmissions
                </span>
            </button>
        </div>

        {/* Dynamic Tour Dates */}
        <div className="flex flex-col items-center gap-2 mb-8 relative z-10 w-full min-h-[50px]">
            {loading ? (
                <div className="text-red-900 animate-pulse text-xs tracking-widest">LOADING TRANSMISSIONS...</div>
            ) : tourDates.map((date) => (
                <div key={date.id} className="flex items-center gap-4 text-xs tracking-[0.2em] text-gray-600 font-mono group animate-fade-in">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
                    <span className="group-hover:text-red-400 transition-colors font-bold uppercase tracking-[0.2em]">NEXT: {date.city} — {date.event}</span>
                    {isAdmin && (
                        <button onClick={() => handleDeleteDate(date.id)} className="text-red-500 hover:text-white ml-2">
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            ))}
            
            {isAdmin && (
                <div className="mt-4 flex gap-2 items-center bg-gray-900/50 p-2 rounded border border-gray-800">
                    <input 
                        className="bg-black border border-gray-700 text-white text-xs p-1 w-24" 
                        placeholder="CITY"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                    />
                    <input 
                        className="bg-black border border-gray-700 text-white text-xs p-1 w-32" 
                        placeholder="EVENT"
                        value={newEvent}
                        onChange={(e) => setNewEvent(e.target.value)}
                    />
                    <button onClick={handleAddDate} className="bg-red-900 text-white p-1 hover:bg-red-700 rounded">
                        <Plus size={14} />
                    </button>
                </div>
            )}
        </div>

        {/* Slogan */}
        <div className="flex flex-col items-center leading-tight mb-6 relative z-10">
            <h1 className="brand-font text-2xl md:text-4xl font-bold text-white tracking-wide mb-2">
                NO COMPROMISE.
            </h1>
            <h1 className="brand-font text-2xl md:text-4xl font-bold text-red-600 tracking-wide">
                JUST VIOLENCE.
            </h1>
        </div>

        {/* Description */}
        <p className="max-w-xl text-gray-400/80 text-center text-xs md:text-sm leading-relaxed tracking-wider font-light mb-12 relative z-10 px-4">
            Revalixx stands at the intersection of industrial noise and rhythmic precision. Curating sounds that thrive in the shadows.
        </p>

      </div>
    </div>
  );
};

export default Hero;