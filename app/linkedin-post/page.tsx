"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinkedInPostPage() {
  const [input, setInput] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [tone, setTone] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (input.length > 1000) {
      setShowPremiumModal(true);
    } else {
      setShowPremiumModal(false);
    }
  }, [input]);

  const generatePost = () => {
    let detectedTone = 'Professionnel';
    if (input.toLowerCase().includes('je') || input.toLowerCase().includes('moi')) {
      detectedTone = 'Humain';
    }
    setTone(detectedTone);
    const post = `Post généré basé sur vos idées :\n\n${input}`;
    setGeneratedPost(post);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Générateur de Post LinkedIn</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder="Décrivez les idées ou le contenu de votre post..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-sm text-right text-gray-500 mt-1">{input.length} / 1000 caractères</p>
      </div>

      <button
        onClick={generatePost}
        disabled={input.trim() === ''}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Générer le post
      </button>

      <AnimatePresence>
        {generatedPost && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow"
          >
            <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full mb-4">
              Ton détecté : {tone}
            </span>
            <pre className="whitespace-pre-wrap text-gray-800">{generatedPost}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Limite atteinte</h2>
            <p className="text-sm text-gray-700 mb-4">
              Vous avez dépassé la limite gratuite de 1000 caractères. Pour continuer, veuillez passer à la version premium.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
