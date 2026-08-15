import React, { useState } from 'react';
import LandingPage from './components/LandingPage';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Espace Simulateur</h2>
        <p className="text-slate-400 text-sm mb-6">Connectez-vous pour commencer l'entretien.</p>
        <button 
          onClick={() => setStarted(false)}
          className="text-xs text-slate-500 underline"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}