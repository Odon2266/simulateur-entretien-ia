import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Code2, 
  Zap, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import QuickQuiz from './QuizPractice';
import SystemDesignPractice from './SystemDesignPractice';
import CodeReviewPractice from './CodeReviewPractice';

export default function PracticeTab() {
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    {
      id: 'technical',
      title: 'QCM & Quiz IA Sur-Mesure',
      description: "Testez vos connaissances théoriques avec 20 questions générées par l'IA sur la technologie de votre choix.",
      icon: BookOpen,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      status: 'Disponible',
      tags: ['React', 'Node.js', 'Python', 'SQL', 'Sur-mesure'],
      level: 'Tous niveaux'
    },
    {
      id: 'system-design',
      title: 'System Design & Architecture',
      description: "Concevez des architectures résilientes et scalables sur des cas réels (Microservices, Caching, Databases) évalués par l'IA.",
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      status: 'Disponible',
      tags: ['Docker', 'PostgreSQL', 'Redis', 'Load Balancing'],
      level: 'Intermédiaire / Avancé'
    },
    {
      id: 'code-review',
      title: 'Revue de Code & Débogage',
      description: "Analysez des extraits de code contenant des bugs, failles de sécurité ou problèmes de performance et soumettez vos corrections.",
      icon: Code2,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      status: 'Disponible',
      tags: ['Refactoring', 'Security', 'Clean Code', 'Performance'],
      level: 'Intermédiaire'
    },
    {
      id: 'algo',
      title: 'Algorithmique & Complexité',
      description: "Résolvez des défis de logique, structures de données et analysez la complexité temporelle/spatiale O(n) avec feedback IA.",
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      status: 'À venir',
      tags: ['Data Structures', 'Big O', 'Logic', 'Optimization'],
      level: 'Tous niveaux'
    }
  ];

  if (activeModule === 'technical') {
    return <QuickQuiz onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'system-design') {
    return <SystemDesignPractice onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'code-review') {
    return <CodeReviewPractice onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="space-y-8">
      
      {/* En-tête principal */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Centre de Préparation Technique</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Module d'Entraînement</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Sélectionnez un mode de révision pour perfectionner vos compétences techniques, votre logique algorithmique et votre vision d'architecture.
        </p>
      </div>

      {/* Grille des 4 modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isInteractive = mod.id === 'technical' || mod.id === 'system-design' || mod.id === 'code-review';

          return (
            <div
              key={mod.id}
              className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-slate-950 font-bold shadow-lg`}>
                    <Icon className="w-6 h-6 text-slate-950" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${mod.badgeColor}`}>
                    {mod.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {mod.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Niveau : {mod.level}</span>
                <button
                  onClick={() => isInteractive && setActiveModule(mod.id)}
                  disabled={!isInteractive}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isInteractive 
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md cursor-pointer' 
                      : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>{isInteractive ? "Lancer l'entraînement" : "Bientôt disponible"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}