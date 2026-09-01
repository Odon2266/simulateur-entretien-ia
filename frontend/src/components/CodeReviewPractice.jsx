import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { ArrowLeft, Play, AlertTriangle, CheckCircle, Code, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function CodeReviewPractice({ onBack }) {
  const [language, setLanguage] = useState('python');
  const [codeTitle, setCodeTitle] = useState('Exercice de revue de code');
  const [codeSnippet, setCodeSnippet] = useState('');
  
  const [analysis, setAnalysis] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Helper pour récupérer la configuration avec le Token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return token ? { headers: { Authorization: `Token ${token}` } } : {};
  };

  // Génération dynamique de code via l'IA backend (Ollama)
  const handleGenerateAI = async (selectedLang = language) => {
    setGenerating(true);
    setEvaluation(null);
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/generate-code-review/',
        { language: selectedLang },
        getAuthHeaders()
      );
      if (res.data) {
        setCodeTitle(res.data.title || "Exercice Généré par IA");
        setCodeSnippet(res.data.code || "");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du code par Ollama.");
    } finally {
      setGenerating(false);
    }
  };

  // Charger un premier exercice automatiquement au démarrage
  useEffect(() => {
    handleGenerateAI('python');
  }, []);

  // Changement de langage
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    handleGenerateAI(newLang);
  };

  // Soumission de l'analyse pour évaluation par l'IA
  const handleSubmit = async () => {
    if (!analysis.trim()) return alert("Veuillez saisir votre analyse.");
    setLoading(true);
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/evaluate-code-review/',
        {
          code_snippet: codeSnippet,
          candidate_analysis: analysis
        },
        getAuthHeaders()
      );
      setEvaluation(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'évaluation du code par Ollama.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
      >
        <ArrowLeft size={16} /> Retour aux modules
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Éditeur de code */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
            <h2 className="text-sm font-bold flex items-center gap-2 text-cyan-400 truncate">
              <Code size={18} /> {codeTitle}
            </h2>
            
            <div className="flex items-center gap-2">
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="sql">SQL</option>
              </select>

              <button
                onClick={() => handleGenerateAI(language)}
                disabled={generating}
                className="flex items-center gap-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {generating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>Générer par IA</span>
              </button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-slate-800">
            <Editor
              height="380px"
              language={language}
              theme="vs-dark"
              value={codeSnippet}
              onChange={(value) => setCodeSnippet(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
        </div>

        {/* Zone de saisie et de résultat */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 flex-grow">
            <h2 className="text-sm font-bold text-white">Votre Analyse & Corrections</h2>
            <textarea
              className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              placeholder="Décrivez les failles de sécurité, bugs ou problèmes de performance détectés..."
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
            />
            <button 
              onClick={handleSubmit} 
              disabled={loading || generating}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex justify-center items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Évaluation par l'IA en cours..." : <><Play size={16} fill="currentColor"/> Soumettre pour Évaluation</>}
            </button>
          </div>

          {evaluation && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-emerald-400">Résultat du Review</h3>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  Score : {evaluation.score}/100
                </span>
              </div>
              
              {evaluation.identified_bugs?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Points Détectés / Corrections
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                    {evaluation.identified_bugs.map((bug, i) => <li key={i}>{bug}</li>)}
                  </ul>
                </div>
              )}

              {evaluation.code_quality_feedback && (
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Recommandations
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{evaluation.code_quality_feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}