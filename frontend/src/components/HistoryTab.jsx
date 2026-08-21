import React, { useState } from 'react';
import axios from 'axios';
import { History, Briefcase, Trash2, ArrowRight } from 'lucide-react';

export default function HistoryTab({ sessions = [], setSessions, onSelectSession }) {
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';
  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-cyan-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Historique complet</h2>
          <p className="text-xs text-slate-400">Retrouvez et gérez l'ensemble de vos simulations.</p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
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
        ))}
      </div>
    </div>
  );
}