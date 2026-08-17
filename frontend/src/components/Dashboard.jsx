import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Dumbbell, 
  History, 
  LogOut, 
  Mic, 
  TrendingUp, 
  Clock, 
  Zap, 
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ userEmail = "fidinjaharisoaodon@gmail.com", onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const username = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bar Navigation */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Mic className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            DevInterview<span className="text-cyan-400">.lab</span>
          </span>
        </div>

        {/* Status & User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Moteur IA Prêt</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{username}</p>
              <p className="text-[10px] text-slate-500">{userEmail}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 shadow-inner">
              {username[0].toUpperCase()}
            </div>
            <button 
              onClick={onLogout}
              title="Déconnexion"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        
        {/* Navigation Latérale */}
        <aside className="w-60 border-r border-slate-800/80 bg-slate-900/30 p-4 space-y-6 hidden md:flex flex-col justify-between">
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Vue générale', icon: LayoutDashboard },
              { id: 'simulation', label: 'Simulation IA', icon: PlayCircle },
              { id: 'practice', label: 'Entraînement', icon: Dumbbell },
              { id: 'history', label: 'Historique', icon: History },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-cyan-300' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Compte Gratuit</span>
            </div>
            <p className="text-[10px] text-slate-400">3 simulations restantes ce mois-ci.</p>
          </div>
        </aside>

        {/* Zone de Contenu Principal */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          
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
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap">
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
                  <span className="text-2xl font-bold text-white">0</span>
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
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-[10px] text-slate-500">minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Historique & Module de Progression */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Historique des Derniers Entretiens */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Dernières prestations</span>
                </h2>
                <button className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Voir l'historique complet</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">Aucune simulation enregistrée</p>
                  <p className="text-[11px] text-slate-500 mt-1">Vos résultats et analyses apparaîtront ici dès votre première session.</p>
                </div>
              </div>
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
                    <span className="font-mono text-slate-500 text-[10px]">0/5</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-0 transition-all duration-500"></div>
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

        </main>
      </div>
    </div>
  );
}