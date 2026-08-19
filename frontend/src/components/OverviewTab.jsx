import React from 'react';
import { 
  PlayCircle, 
  Activity, 
  TrendingUp, 
  Clock, 
  History, 
  ChevronRight, 
  Briefcase, 
  CheckCircle2, 
  Mic, 
  Loader2 
} from 'lucide-react';

export default function OverviewTab({ sessions, loadingSessions, onNewSession, onSelectSession, onViewAllHistory }) {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/20">
            Espace de Préparation
          </span>
          <h1 className="text-2xl font-bold text-white">Prêt pour votre prochain entretien ?</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Entraînez-vous avec des questions techniques sur-mesure (React, Node.js, Python, System Design) et obtenez une évaluation détaillée instantanée.
          </p>
        </div>
        <button 
          onClick={onNewSession}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
        >
          <PlayCircle className="w-4 h-4 fill-slate-950" />
          <span>Lancer une session</span>
        </button>
      </div>

      {/* Grille de Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-mono">Simulations effectuées</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white">{sessions.length}</span>
              <span className="text-[10px] text-slate-500">session(s)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-mono">Moyenne globale</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white">--</span>
              <span className="text-[10px] text-slate-500">/ 100 pt</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-mono">Temps de pratique</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white">{sessions.length * 15}</span>
              <span className="text-[10px] text-slate-500">minutes env.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Historique & Module de Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Dernières prestations</span>
            </h2>
            <button 
              onClick={onViewAllHistory}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {loadingSessions ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
              <span className="text-xs">Chargement...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Aucune simulation enregistrée</p>
                <p className="text-[11px] text-slate-500 mt-1">Vos résultats et analyses apparaîtront ici dès votre première session.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.slice(0, 4).map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className="group bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 p-4 rounded-xl transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {session.job_title}
                      </h3>
                      <p className="text-slate-500 text-[10px] truncate">
                        {session.job_description || 'Sans description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    <span>ID: #{session.id}</span>
                    <span className="text-cyan-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Reprendre <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Objectifs de Compétences */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Objectifs d'apprentissage</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Questions Techniques</span>
                <span className="font-mono text-slate-500 text-[10px]">{Math.min(sessions.length, 5)}/5</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.min((sessions.length / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Aisance à l'Oral</span>
                <span className="font-mono text-slate-500 text-[10px]">0%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-0 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}