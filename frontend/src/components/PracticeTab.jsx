import React, { useState } from 'react';
import QuickQuiz from './QuizPractice'; // Composant qui affichera les questions du backend

export default function PracticeTab() {
  const [activeQuiz, setActiveQuiz] = useState(null); // 'technical' | 'system-design' | null

  // Si un quiz est sélectionné, on affiche l'interface du test
  if (activeQuiz === 'technical') {
    return <QuickQuiz onBack={() => setActiveQuiz(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Module d'Entraînement</h2>
        <p className="text-xs text-slate-400">Révisez vos fondamentaux techniques et préparez-vous aux tests de code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte Test Technique */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-white">Questions Techniques Rapides</h3>
            <p className="text-slate-400 text-xs">Séries de questions à choix multiples sur React, Node.js, Python et BD.</p>
          </div>
          
          <button
            onClick={() => setActiveQuiz('technical')}
            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            Commencer le test
          </button>
        </div>

        {/* Carte System Design */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between opacity-60">
          <div className="space-y-3">
            <h3 className="font-bold text-white">System Design & Architecture</h3>
            <p className="text-slate-400 text-xs">Cas pratiques sur la conception de systèmes distribués.</p>
          </div>
          <span className="mt-4 inline-block text-center bg-slate-800 text-slate-500 text-xs py-2 rounded-xl font-medium">
            Bientôt disponible
          </span>
        </div>
      </div>
    </div>
  );
}