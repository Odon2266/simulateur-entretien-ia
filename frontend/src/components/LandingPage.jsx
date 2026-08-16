import React from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  Layers, 
  BarChart3, 
  Key, 
  CheckCircle2, 
  Lock,
  Workflow
} from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-mono font-bold text-base tracking-tight text-slate-100">
              DevInterview<span className="text-indigo-400">.lab</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
            <a href="#workflow" className="hover:text-slate-200 transition-colors">Workflow</a>
            <a href="#architecture" className="hover:text-slate-200 transition-colors">Architecture</a>
            <a href="#features" className="hover:text-slate-200 transition-colors">Fonctionnalités</a>
          </div>

          <button 
            onClick={onStart}
            className="text-xs font-mono uppercase tracking-wider font-semibold px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            Lancer la console
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 text-xs font-mono mb-8">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Environnement d'entraînement IA 100% BYOK & Confidentialité</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold max-w-4xl tracking-tight leading-tight mb-6">
          Préparez vos entretiens techniques avec un <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">moteur d'évaluation personnalisé</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-sans">
          Connectez votre propre clé d'API Ollama Cloud, simulez des échanges sur des cas réels et obtenez une analyse détaillée de vos réponses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={onStart}
            className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            Commencer une session
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* APERÇU CONSOLE / DASHBOARD */}
        <div className="w-full max-w-4xl bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl text-left font-mono">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <span className="text-xs text-slate-500 ml-2">dev-interview-lab --environment=prod</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              STATUS: READY
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">01 // POSTE & CONTEXTE</span>
              <p className="text-slate-200 font-semibold">Full-Stack Engineer (Python / React)</p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">02 // PROVIDER IA</span>
              <p className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Ollama Cloud (BYOK)
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">03 // SÉCURITÉ DONNÉES</span>
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Chiffrement des clés API
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW EN 3 ÉTAPES */}
      <section id="workflow" className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block mb-2">// Processus</span>
            <h2 className="text-2xl md:text-3xl font-bold">Comment se déroule une simulation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Paramétrage du poste</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Indiquez le titre du poste et la fiche de description pour cadrer le niveau d'exigence et les sujets abordés.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Échange interactif</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Répondez aux questions posées par l'agent virtuel. L'IA adapte ses relances selon la précision de vos réponses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-sm font-bold flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Synthèse de session</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Examinez l'historique complet pour identifier vos axes d'amélioration techniques et vos points forts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE & FONCTIONNALITÉS */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block mb-2">// Caractéristiques</span>
            <h2 className="text-2xl md:text-3xl font-bold">Un outil conçu pour les développeurs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <Key className="w-6 h-6 text-indigo-400 mb-4" />
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Modèle BYOK (Bring Your Own Key)</h3>
              <p className="text-xs text-slate-400">
                Vous utilisez votre propre infrastructure LLM. Aucune surfacturation appliquée sur vos jetons d'utilisation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <Code2 className="w-6 h-6 text-sky-400 mb-4" />
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Mises en situation techniques</h3>
              <p className="text-xs text-slate-400">
                Entraînez-vous sur de la conception d'architecture, du refactoring et des questions de culture technique.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <BarChart3 className="w-6 h-6 text-teal-400 mb-4" />
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Historique et traçabilité</h3>
              <p className="text-xs text-slate-400">
                Retrouvez l'intégralité de vos sessions précédentes pour évaluer vos progrès au fil des entraînements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-slate-900/80 p-10 rounded-2xl border border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Prêt à lancer votre première simulation ?
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto mb-8">
              Configurez votre clé d'API et démarrez immédiatement un entretien d'entraînement.
            </p>
            <button 
              onClick={onStart}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-all"
            >
              Accéder à l'application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>DevInterview.lab</span>
          </div>
          <div>
            © {new Date().getFullYear()} DevInterview.lab — Développé pour la préparation d'entretiens techniques.
          </div>
        </div>
      </footer>

    </div>
  );
}