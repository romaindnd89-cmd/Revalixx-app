import React from 'react';
import { ViewState } from '../types';
import { Menu, X, Instagram } from 'lucide-react';
import { REVALIXX_LOGO_URL } from '../constants';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems: { id: ViewState; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'gallery', label: 'THE VOID' },
    { id: 'videos', label: 'VIDEOS' },
    { id: 'bio', label: 'ARTISTS' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center w-24 md:w-32" onClick={() => setView('home')}>
             <img 
                src={REVALIXX_LOGO_URL} 
                alt="Revalixx" 
                className="h-8 md:h-10 w-auto object-contain brightness-200 contrast-125 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
             />
          </div>
          
          {/* Center: Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-12">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`text-sm tracking-[0.2em] font-medium transition-all duration-300 hover:text-red-500 uppercase ${
                    currentView === item.id
                      ? 'text-red-600 border-b border-red-600 pb-1'
                      : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right: Instagram Icon */}
          <div className="hidden md:flex w-24 md:w-32 justify-end">
            <a 
                href="https://www.instagram.com/revalixxoff" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
            >
                <Instagram size={20} />
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8 text-red-600" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-red-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={`brand-font text-2xl block w-full text-left px-3 py-2 ${
                  currentView === item.id
                    ? 'text-red-600 bg-red-900/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
             <a 
                href="https://www.instagram.com/revalixxoff"
                target="_blank" 
                rel="noopener noreferrer"
                className="brand-font text-2xl block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
             >
                INSTAGRAM
             </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;