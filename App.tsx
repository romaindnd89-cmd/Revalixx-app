import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChaosBackground from './components/ChaosBackground';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import BioAI from './components/BioAI';
import AdminModal from './components/AdminModal';
import { ViewState } from './types';
import { Lock, Unlock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Check login persistence on load
  useEffect(() => {
    const session = localStorage.getItem('revalixx_admin_session');
    if (session === 'true') {
        setIsAdmin(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('revalixx_admin_session', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('revalixx_admin_session');
    setView('home');
  };

  return (
    <div className="min-h-screen text-white selection:bg-red-600 selection:text-white relative">
      {/* Red scanline effect */}
      <div className="scanline"></div>
      
      <ChaosBackground />
      <Navbar currentView={view} setView={setView} />
      
      <AdminModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        onLogin={handleLogin}
      />

      <main className="relative z-10">
        {view === 'home' && <Hero setView={setView} isAdmin={isAdmin} />}
        {view === 'gallery' && <Gallery isAdmin={isAdmin} />}
        {view === 'videos' && <VideoSection isAdmin={isAdmin} />}
        {view === 'bio' && <BioAI />}
      </main>

      <footer className="relative z-10 bg-black pt-16 pb-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            
            <h2 className="brand-font text-5xl text-white tracking-widest mb-2">REVALIXX</h2>
            <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-10">
                Hard Music Collective & Label
            </p>

            {/* Links Section - Only Instagram remains */}
            <div className="flex space-x-12 mb-12">
                <a href="https://www.instagram.com/revalixxoff" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm tracking-widest uppercase hover:text-red-600 font-bold">Instagram</a>
            </div>

            <div className="text-gray-600 text-[10px] tracking-wider font-mono">
                <p className="mb-2">© 2024 REVALIXX RECORDS. ALL RIGHTS RESERVED.</p>
                <p>DEVELOPED FOR ALIXX & DJ REVAXX</p>
            </div>
            
            {/* Admin Toggle in Footer */}
            <div className="mt-8">
                {isAdmin ? (
                    <button 
                        onClick={handleLogout}
                        className="text-red-900 hover:text-red-600 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase border border-red-900/30 px-3 py-1 rounded"
                    >
                        <Unlock size={10} /> Admin Active (Logout)
                    </button>
                ) : (
                    <button 
                        onClick={() => setShowAdminLogin(true)}
                        className="text-gray-800 hover:text-gray-600 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase"
                    >
                        <Lock size={10} /> Admin
                    </button>
                )}
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;