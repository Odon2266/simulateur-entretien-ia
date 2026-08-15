import React from 'react';
import { Bot, Sparkles, Key, CheckCircle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/50 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              InterviewPrep<span className="text-indigo-500">.ai</span>
            </span>
          </div>
          <button 
            onClick={onStart}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            Se connecter
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simulateur d'Entretien IA avec BYOK (Bring Your Own Key)</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight mb-6">
          Maîtrisez vos entretiens avec l'Intelligence Artificielle en <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">temps réel</span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Entraînez-vous face à un recruteur virtuel personnalisé. Configurez votre rôle, fournissez votre clé Ollama Cloud et perfectionnez vos réponses techniques.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/25"
          >
            Lancer une simulation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mockup de la plateforme */}
        <div className="w-full max-w-4xl bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-2xl shadow-indigo-500/10 text-left">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs text-slate-500 ml-2 font-mono">session-live.interviewprep.ai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Poste Vise</span>
              <p className="text-sm font-medium text-slate-200">Développeur Full-Stack Python/React</p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Moteur IA</span>
              <p className="text-sm font-medium text-indigo-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Ollama Cloud (gpt-oss)
              </p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Sécurité Clé</span>
              <p className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Stockée en BD sécurisée
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cartes d'Avantages */}
      <section className="py-16 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Key className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Bring Your Own Key (BYOK)</h3>
            <p className="text-sm text-slate-400">Conservez le contrôle total de vos crédits en connectant directement votre propre clé Ollama Cloud.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Bot className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Recruteur Adaptatif</h3>
            <p className="text-sm text-slate-400">L'IA analyse le titre et la description du poste pour vous poser des questions techniques sur mesure.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Historique de Session</h3>
            <p className="text-sm text-slate-400">Vos conversations sont conservées pour vous permettre de revoir vos réponses et de progresser.</p>
          </div>
        </div>
      </section>
    </div>
  );
}