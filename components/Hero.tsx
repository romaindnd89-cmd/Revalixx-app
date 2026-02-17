import React, { useState, useEffect } from 'react';
import { REVALIXX_LOGO_URL, DEFAULT_TOUR_DATES } from '../constants';
import { TourDate } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface HeroProps {
  setView: (v: any) => void;
  isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ setView, isAdmin }) => {
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [newCity, setNewCity] = useState('');
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    try {
        const saved = localStorage.getItem('revalixx_tour_dates');
        if (saved) {
          setTourDates(JSON.parse(saved));
        } else {
          setTourDates(DEFAULT_TOUR_DATES);
        }
    } catch (e) {
        console.error("Error loading tour dates", e);
        setTourDates(DEFAULT_TOUR_DATES);
    }
  }, []);

  const saveDates = (items: TourDate[]) => {
    setTourDates(items);
    localStorage.setItem('revalixx_tour_dates', JSON.stringify(items));
  };

  const handleAddDate = () => {
    if (!newCity || !newEvent) return;
    const newDate: TourDate = {
      id: Date.now().toString(),
      city: newCity.toUpperCase(),
      event: newEvent.toUpperCase(),
      active: true
    };
    saveDates([...tourDates, newDate]);
    setNewCity('');
    setNewEvent('');
  };

  const handleDeleteDate = (id: string) => {
    saveDates(tourDates.filter(d => d.id !== id));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      
      {/* Top Ambient Light - More Intense Red */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-red-800/30 to-transparent blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center animate-fade-in text-center">
        
        {/* Top Text: UNDERGROUND RESISTANCE */}
        <div className="mb-8 md:mb-12 w-full flex items-center justify-center gap-4 opacity-70">
             <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-red-600"></div>
             <span className="text-[10px] md:text-xs tracking-[0.6em] text-red-500 uppercase font-mono text-shadow-sm">
                Underground Resistance
             </span>
             <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-red-600"></div>
        </div>

        {/* Logo with Chaos Neon */}
        <div className="relative group cursor-pointer mb-8" onClick={() => setView('gallery')}>
            {/* The Neon Red Chaos Behind */}
            <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] bg-red-600/50 blur-[100px] rounded-full animate-breathe pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-red-500/40 blur-[60px] rounded-full animate-aura-pulse pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[100px] border-transparent shadow-[0_0_100px_rgba(220,38,38,0.8)] rounded-full opacity-20 pointer-events-none"></div>
            
            <img 
              src={REVALIXX_LOGO_URL} 
              alt="REVALIXX LOGO" 
              className="relative z-10 w-80 md:w-[32rem] lg:w-[42rem] object-contain drop-shadow-[0_0_50px_rgba(255,0,0,0.6)] hover:scale-105 transition-transform duration-700 animate-dying-light"
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

        {/* Buttons - TAILLE RÉDUITE */}
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
                    Video Transmissions
                </span>
            </button>
        </div>

        {/* Dynamic Tour Dates */}
        <div className="flex flex-col items-center gap-2 mb-8 relative z-10 w-full">
            {tourDates.map((date) => (
                <div key={date.id} className="flex items-center gap-4 text-xs tracking-[0.2em] text-gray-600 font-mono group">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
                    <span className="group-hover:text-red-400 transition-colors">NEXT: {date.city} — {date.event}</span>
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
                        placeholder="CITY (LYON)"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                    />
                    <input 
                        className="bg-black border border-gray-700 text-white text-xs p-1 w-32" 
                        placeholder="EVENT (RITUAL)"
                        value={newEvent}
                        onChange={(e) => setNewEvent(e.target.value)}
                    />
                    <button onClick={handleAddDate} className="bg-red-900 text-white p-1 hover:bg-red-700 rounded">
                        <Plus size={14} />
                    </button>
                </div>
            )}
        </div>

        {/* Slogan - TAILLE RÉDUITE */}
        <div className="flex flex-col items-center leading-tight mb-6 relative z-10">
            <h1 className="brand-font text-2xl md:text-4xl font-bold text-white tracking-wide mb-2">
                NO COMPROMISE.
            </h1>
            <h1 className="brand-font text-2xl md:text-4xl font-bold text-red-600 tracking-wide drop-shadow-[0_0_20px_rgba(220,38,38,0.9)]">
                JUST VIOLENCE.
            </h1>
        </div>

        {/* Description */}
        <p className="max-w-xl text-gray-500 text-center text-xs md:text-sm leading-relaxed tracking-wider font-light mb-12 relative z-10 px-4">
            Revalixx stands at the intersection of industrial noise and rhythmic precision. We curate the sounds that thrive in darkness.
        </p>

      </div>
    </div>
  );
};

export default Hero;