import React from 'react';
import { Dumbbell, CheckCircle2 } from 'lucide-react';

export default function PracticeTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Module d'Entraînement</h2>
        <p className="text-xs text-slate-400">Révisez vos fondamentaux techniques et préparez-vous aux tests de code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 w-fit">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">Questions Techniques Rapides</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Séries de questions à choix multiples et synthèses rapides sur React, Node.js, Python et bases de données.
          </p>
          <span className="inline-block text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
            Bientôt disponible
          </span>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">System Design & Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cas pratiques sur la conception de systèmes distribués, bases de données et microservices.
          </p>
          <span className="inline-block text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
            Bientôt disponible
          </span>
        </div>
      </div>
    </div>
  );
}