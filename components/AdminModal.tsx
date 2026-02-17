import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mot de passe simple pour la démo.
    if (password === 'revalixx') {
      onLogin();
      onClose();
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-red-900 p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X />
        </button>
        
        <div className="flex flex-col items-center mb-6">
            <div className="p-4 rounded-full bg-red-900/20 mb-4">
                <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="brand-font text-3xl tracking-widest text-white">ADMIN ACCESS</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="w-full bg-black border border-gray-700 p-4 text-white text-center tracking-[0.5em] focus:border-red-600 outline-none transition-colors"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-center text-sm font-mono tracking-wider animate-pulse">
              ACCESS DENIED
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-black font-bold tracking-widest transition-colors uppercase"
          >
            Enter System
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;