
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader, Copy } from 'lucide-react';

const BioAI: React.FC = () => {
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [promptTopic, setPromptTopic] = useState('');

  const generateBio = async () => {
    setLoading(true);
    setBio('');
    
    try {
      // Always initialize with named parameter and direct process.env.API_KEY access
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Écris une biographie courte, agressive, chaotique et puissante (en français) pour le duo de DJ Hard Techno 'Revalixx'. 
        Ton: Industriel, sombre, rave, underground. 
        Focus: ${promptTopic || 'Destruction de dancefloor, BPM élevé, atmosphère sombre'}. 
        Maximum 150 mots. Texte brut sans mise en forme markdown.`,
      });

      // Directly access .text property from GenerateContentResponse
      setBio(response.text || "Erreur de génération.");
    } catch (error) {
      console.error(error);
      setBio("Erreur lors de la connexion à l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen flex flex-col items-center">
      <div className="w-full text-center mb-12">
        <h2 className="brand-font text-5xl md:text-6xl text-white neon-text mb-4">REVALIXX <span className="text-red-600">AI</span></h2>
        <p className="text-gray-400 text-lg">Générez des transmissions textuelles brutales via Gemini.</p>
      </div>

      <div className="w-full bg-neutral-900/80 border border-red-900 p-8 rounded-xl backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        <div className="mb-6">
            <label className="block text-red-500 font-bold mb-2 uppercase tracking-wider">Objectif de la transmission</label>
            <input 
                type="text" 
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder="Ex: Sortie d'album, Event à Berlin..."
                className="w-full bg-black border border-gray-700 p-4 text-white focus:border-red-600 outline-none transition-colors"
            />
        </div>

        <button 
            onClick={generateBio}
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? <Loader className="animate-spin" /> : <Sparkles />}
            {loading ? 'INITIALISATION...' : 'GÉNÉRER AVEC IA'}
        </button>

        {bio && (
            <div className="mt-8 p-6 bg-black border border-gray-800 relative group animate-fade-in">
                <p className="text-gray-200 text-lg leading-relaxed font-mono whitespace-pre-wrap">{bio}</p>
                <button 
                    onClick={() => navigator.clipboard.writeText(bio)}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <Copy size={20}/>
                </button>
            </div>
        )}
      </div>

      <div className="mt-20 w-full text-center">
        <h3 className="brand-font text-3xl mb-6 border-b border-gray-800 pb-2 inline-block">MANIFESTE</h3>
        <p className="text-gray-400 max-w-2xl mx-auto leading-7 italic">
            "Le chaos n'est pas une erreur, c'est notre partition." — Revalixx apporte une vision industrielle sans compromis, fusionnant percussions chirurgicales et textures abrasives.
        </p>
      </div>
    </div>
  );
};

export default BioAI;
