import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, 
  Briefcase, 
  Trash2, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Loader2,
  TrendingUp,
  Award
} from 'lucide-react';

export default function HistoryTab({ sessions = [], setSessions, onSelectSession }) {
  const [activeSubTab, setActiveSubTab] = useState('simulations'); // 'simulations' ou 'quizzes'
  const [deletingId, setDeletingId] = useState(null);
  
  // États pour l'historique des QCM
  const [practiceResults, setPracticeResults] = useState([]);
  const [loadingPractice, setLoadingPractice] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';
  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

  // Récupérer les résultats de QCM
  useEffect(() => {
    if (activeSubTab === 'quizzes') {
      fetchPracticeResults();
    }
  }, [activeSubTab]);

  const fetchPracticeResults = async () => {
    setLoadingPractice(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/practice-results/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setPracticeResults(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des QCM :", err);
    } finally {
      setLoadingPractice(false);
    }
  };

  // Suppression d'une session de simulation IA
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) return;

    setDeletingId(sessionId);
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/sessions/${sessionId}/`, {
        headers: { Authorization: `Token ${token}` }
      });

      if (setSessions) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch (err) {
      console.error("Erreur de suppression :", err);
      alert("Impossible de supprimer la session.");
    } finally {
      setDeletingId(null);
    }
  };

  // Suppression d'un résultat de QCM
  const handleDeletePracticeResult = async (resultId, e) => {
    e.stopPropagation();
    if (!window.confirm("Voulez-vous supprimer ce résultat d'entraînement ?")) return;

    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/practice-results/${resultId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setPracticeResults((prev) => prev.filter((r) => r.id !== resultId));
    } catch (err) {
      console.error("Erreur de suppression du QCM :", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getScoreBadgeStyle = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (percentage >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Historique complet</h2>
            <p className="text-xs text-slate-400">Retrouvez vos activités et performances passées.</p>
          </div>
        </div>

        {/* Commutateur de sous-onglets */}
        <div className="flex bg-slate-900/80 p-1 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('simulations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'simulations'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Simulations IA ({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quizzes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'quizzes'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Entraînements QCM</span>
          </button>
        </div>
      </div>

      {/* CONTENU : SIMULATIONS IA */}
      {activeSubTab === 'simulations' && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">Aucune simulation enregistrée</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Lancez un entretien simulé dans l'onglet "Simulation IA" pour commencer.
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl text-cyan-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{session.job_title}</h4>
                    <p className="text-[10px] text-slate-400">ID: #{session.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectSession(session)}
                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-lg border border-cyan-500/20 flex items-center gap-1 transition-all"
                  >
                    Reprendre <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    disabled={deletingId === session.id}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Supprimer la session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONTENU : ENTRAÎNEMENTS QCM */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-3">
          {loadingPractice ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-sm">Chargement des résultats de QCM...</p>
            </div>
          ) : practiceResults.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">Aucun test QCM enregistré</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Réalisez un test dans l'onglet "Entraînement" pour enregistrer vos scores ici.
              </p>
            </div>
          ) : (
            practiceResults.map((result) => {
              const percentage = Math.round((result.score / result.total_questions) * 100);
              const badgeStyle = getScoreBadgeStyle(result.score, result.total_questions);

              return (
                <div 
                  key={result.id}
                  className="bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">{result.category}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(result.created_at)}
                      </span>
                      <span>•</span>
                      <span>{result.total_questions} questions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Score</span>
                      <p className="text-xs font-bold text-white">{percentage}%</p>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${badgeStyle}`}>
                      {result.score} / {result.total_questions}
                    </div>

                    <button
                      onClick={(e) => handleDeletePracticeResult(result.id, e)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                      title="Supprimer ce résultat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}