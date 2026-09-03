import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { ArrowLeft, Play, AlertTriangle, CheckCircle, Code, Zap, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function AlgoPractice({ onBack }) {
  const [topic, setTopic] = useState('Structures de données');
  const [difficulty, setDifficulty] = useState('moyen');
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [problem, setProblem] = useState(null);

  const [candidateCode, setCandidateCode] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Helper d'authentification identique à CodeReviewPractice
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return token ? { headers: { Authorization: `Token ${token}` } } : {};
  };

  // 1. Génération du problème via Django / Ollama
  const handleGenerateProblem = async () => {
    setLoadingProblem(true);
    setProblem(null);
    setEvaluation(null);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/generate-algo/',
        { topic, difficulty },
        getAuthHeaders()
      );
      if (res.data) {
        setProblem(res.data);
        setCandidateCode(res.data.initial_code || '# Écrivez votre solution ici\n');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erreur lors de la génération de l'exercice par l'IA.");
    } finally {
      setLoadingProblem(false);
    }
  };

  // 2. Évaluation du code et de la complexité
  const handleSubmitSolution = async () => {
    if (!candidateCode.trim()) return alert("Veuillez saisir du code avant de soumettre.");
    setLoadingEvaluation(true);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/evaluate-algo/',
        {
          problem_statement: problem.description,
          candidate_code: candidateCode,
          time_complexity: timeComplexity,
          space_complexity: spaceComplexity,
        },
        getAuthHeaders()
      );
      setEvaluation(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erreur lors de l'évaluation du code.");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Bouton Retour & En-tête */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour aux modules
        </button>

        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
          <Zap size={16} />
          <span>Algorithmique & Complexité</span>
        </div>
      </div>

      {/* Barre de Configuration */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Thème</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Structures de données">Structures de données</option>
              <option value="Tableaux & Hachage">Tableaux & Hachage</option>
              <option value="Arbres & Graphes">Arbres & Graphes</option>
              <option value="Programmation Dynamique">Programmation Dynamique</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Difficulté</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateProblem}
          disabled={loadingProblem}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          {loadingProblem ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
          <span>{loadingProblem ? "Génération IA..." : "Générer un exercice"}</span>
        </button>
      </div>

      {/* Énoncé & Éditeur de code */}
      {problem && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Énoncé */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2 text-amber-400">
              <Code size={18} /> {problem.title}
            </h2>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 max-h-[450px] overflow-y-auto">
              {problem.description}
            </div>
          </div>

          {/* Éditeur Monaco & Inputs de complexité */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 font-mono">Votre Solution</h3>
              
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <Editor
                  height="260px"
                  language="python"
                  theme="vs-dark"
                  value={candidateCode}
                  onChange={(val) => setCandidateCode(val || '')}
                  options={{ minimap: { enabled: false }, fontSize: 13 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Complexité Temporelle</label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    placeholder="ex: O(n log n)"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Complexité Spatiale</label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    placeholder="ex: O(1)"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitSolution}
                disabled={loadingEvaluation}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex justify-center items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loadingEvaluation ? "Évaluation en cours..." : <><Play size={16} fill="currentColor" /> Soumettre la Solution</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rapport de résultat */}
      {evaluation && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle size={18} /> Rapport d'Évaluation
            </h3>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
              Score : {evaluation.score} / 100
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-mono text-slate-400">Analyse de la solution :</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {evaluation.correctness}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Complexité Temporelle Réelle</span>
              <span className="text-xs font-bold text-emerald-400">{evaluation.actual_time_complexity}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Complexité Spatiale Réelle</span>
              <span className="text-xs font-bold text-emerald-400">{evaluation.actual_space_complexity}</span>
            </div>
          </div>

          {evaluation.optimizations?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Pistes d'optimisation
              </h4>
              <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                {evaluation.optimizations.map((opt, i) => <li key={i}>{opt}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}