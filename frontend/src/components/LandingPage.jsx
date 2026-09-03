import React from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  Sparkles,
  Bot,
  Zap,
  Server
} from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-sky-500/10 to-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* NAVBAR */}
      <nav className="border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/70 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shadow-inner">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-mono font-bold text-base tracking-tight text-slate-100">
              DevInterview<span className="text-indigo-400">.lab</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
            <a href="#workflow" className="hover:text-indigo-400 transition-colors">Workflow</a>
            <a href="#communaute" className="hover:text-indigo-400 transition-colors">Utilisateurs</a>
          </div>

          <button 
            onClick={onStart}
            className="text-xs font-mono uppercase tracking-wider font-semibold px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer"
          >
            Lancer la console
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Badge BYOK */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Environnement d'entraînement IA 100% BYOK & Confidentialité</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight mb-6 text-white">
          Préparez vos entretiens techniques avec un <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 bg-clip-text text-transparent">moteur d'évaluation personnalisé</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed">
          Connectez votre propre clé d'API, simulez des échanges sur des cas d'architecture réels, du refactoring et obtenez un feedback instantané.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/25 active:scale-95 cursor-pointer"
          >
            <span>Commencer une session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* APERÇU CONSOLE / DASHBOARD */}
        <div className="w-full max-w-5xl bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl text-left font-mono backdrop-blur-xl relative group">
          
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs text-slate-400 ml-2 font-mono">dev-interview-lab --environment=prod</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              STATUS: READY
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800/80 bg-slate-950/40">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Contexte cible</span>
                <p className="text-xs text-slate-200 font-bold">Full-Stack (React / Node / Python)</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Moteur LLM</span>
                <p className="text-xs text-sky-400 font-bold">Ollama / Custom API (BYOK)</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Confidentialité</span>
                <p className="text-xs text-emerald-400 font-bold">Chiffrement local des clés</p>
              </div>
            </div>
          </div>

          {/* Simulation de chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 p-6 space-y-4 font-sans text-xs">
              <div className="flex items-start gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/60">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-indigo-300 font-mono">Recruteur Tech (IA)</p>
                  <p className="text-slate-300 leading-relaxed">
                    "Comment optimiseriez-vous les performances d'une API REST sous Express traitant de fortes charges de requêtes SQL ?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20 ml-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Candidate en pleine session" 
                  className="w-7 h-7 rounded-lg object-cover border border-teal-500/30 shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-teal-300 font-mono">Session Candidat</p>
                  <p className="text-slate-300 leading-relaxed">
                    "J'implémenterais un niveau de mise en cache avec Redis, un pool de connexions PostgreSQL et de la pagination offset/cursor."
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[220px] overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" 
                alt="Développeurs épanouis en train d'utiliser la plateforme" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                <span className="text-[11px] font-mono text-emerald-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Session en direct
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK BAR */}
      <section className="py-8 border-y border-slate-800/60 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-6">
            Conçu pour s'entraîner sur les stacks modernes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-300 font-mono text-xs text-slate-300">
            <span className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800"><Code2 className="w-4 h-4 text-cyan-400" /> React / Next.js</span>
            <span className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800"><Server className="w-4 h-4 text-emerald-400" /> Node.js & Express</span>
            <span className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800"><Zap className="w-4 h-4 text-amber-400" /> Python & FastAPI</span>
            <span className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800"><Cpu className="w-4 h-4 text-indigo-400" /> Docker & Microservices</span>
          </div>
        </div>
      </section>

      {/* GALERIE D'UTILISATEURS EN ACTION */}
      <section id="communaute" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block">// Expérience utilisateur</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white">Une expérience fluide et stimulante</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Des développeurs qui s'entraînent dans des conditions réelles et en toute autonomie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[4/3] shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Développeur satisfait travaillant sur son code" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-5">
                <p className="text-xs font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
                  Préparation aux entretiens Fullstack
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[4/3] shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="Ingénieure satisfaite en cours de test" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-5">
                <p className="text-xs font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
                  Simulation d'architecture & System Design
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[4/3] shadow-xl sm:col-span-2 lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" 
                alt="Développeur joyeux devant son écran" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-5">
                <p className="text-xs font-mono text-slate-200 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
                  Feedback instantané & progression
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WORKFLOW EN 3 ÉTAPES */}
      <section id="workflow" className="py-20 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block mb-2">// Processus</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white">Comment se déroule une simulation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-2xl bg-slate-900/50 border border-slate-800/80 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" 
                  alt="Paramétrage poste" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-slate-950/90 border border-indigo-500/40 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center">
                  01
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                  Paramétrage du poste
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Renseignez le poste ciblé et la fiche de poste. L'IA adapte instantanément la difficulté et les questions d'architecture.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl bg-slate-900/50 border border-slate-800/80 overflow-hidden hover:border-sky-500/50 transition-all duration-300 shadow-xl">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80" 
                  alt="Échange interactif" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-slate-950/90 border border-sky-500/40 text-sky-400 font-mono text-sm font-bold flex items-center justify-center">
                  02
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-sky-400 transition-colors">
                  Échange interactif
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Répondez en direct aux relances. Le modèle évalue la clarté, la précision technique et vos choix de conception.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl bg-slate-900/50 border border-slate-800/80 overflow-hidden hover:border-teal-500/50 transition-all duration-300 shadow-xl">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" 
                  alt="Synthèse et métriques" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-slate-950/90 border border-teal-500/40 text-teal-400 font-mono text-sm font-bold flex items-center justify-center">
                  03
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-teal-400 transition-colors">
                  Synthèse & Recommandations
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consultez un bilan complet avec des notes détaillées sur vos compétences et des pistes concrètes d'amélioration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 border-t border-slate-900 bg-slate-950 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-10 sm:p-14 rounded-3xl border border-indigo-500/30 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 relative z-10">
              Prêt à réussir vos prochains entretiens ?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
              Configurez votre clé API et lancez immédiatement une session d'entraînement personnalisée.
            </p>
            <button 
              onClick={onStart}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 relative z-10 cursor-pointer"
            >
              <span>Accéder à la console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>DevInterview.lab</span>
          </div>
          <div>
            © {new Date().getFullYear()} DevInterview.lab — Plateforme de préparation technique pour développeurs.
          </div>
        </div>
      </footer>

    </div>
  );
}