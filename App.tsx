import React, { useState, useEffect, Suspense, ReactNode, ErrorInfo } from 'react';
import Navbar from './components/Navbar';
import ChaosBackground from './components/ChaosBackground';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import AdminModal from './components/AdminModal';
import { ViewState } from './types';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';

// Lazy load ArtistsSection
const ArtistsSection = React.lazy(() => import('./components/ArtistsSection'));

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-red-600 font-mono p-4">
          <div className="text-center max-w-lg border border-red-900/50 p-8 bg-neutral-900/50 backdrop-blur-md rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-500 animate-pulse" />
            <h1 className="text-4xl mb-4 font-bold tracking-widest uppercase">System Failure</h1>
            <p className="text-gray-400 mb-8 text-sm tracking-wider">
              CRITICAL ERROR DETECTED. THE VOID IS UNSTABLE.
            </p>
            <button 
              onClick={() => {
                localStorage.clear(); 
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase transition-all"
            >
              Hard Reset
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    try {
        const session = localStorage.getItem('revalixx_admin_session');
        if (session === 'true') {
            setIsAdmin(true);
        }
    } catch (e) {
        console.warn("Storage access failed", e);
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
    <ErrorBoundary>
        <div className="min-h-screen text-white selection:bg-red-600 selection:text-white relative">
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
            {view === 'bio' && (
                <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center text-red-600 tracking-widest animate-pulse brand-font text-2xl">
                        LOADING ARTISTS...
                    </div>
                }>
                    <ArtistsSection isAdmin={isAdmin} />
                </Suspense>
            )}
          </main>

          <footer className="relative z-10 bg-black pt-16 pb-8 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
                
                <h2 className="brand-font text-5xl text-white tracking-widest mb-2">REVALIXX</h2>
                <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-10">
                    Hard Music Collective & Label
                </p>

                <div className="flex space-x-12 mb-12">
                    <a href="https://www.instagram.com/revalixxoff" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm tracking-widest uppercase hover:text-red-600 font-bold">Instagram</a>
                </div>

                <div className="text-gray-600 text-[10px] tracking-wider font-mono">
                    <p className="mb-2">© 2024 REVALIXX RECORDS. ALL RIGHTS RESERVED.</p>
                </div>
                
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
    </ErrorBoundary>
  );
};

export default App;