import React from 'react';
import { Briefcase, ChevronRight, Loader2 } from 'lucide-react';

export default function HistoryTab({ sessions, loadingSessions, onSelectSession }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Historique complet</h2>
        <p className="text-xs text-slate-400">Retrouvez toutes vos anciennes sessions et leurs rapports d'évaluation.</p>
      </div>

      {loadingSessions ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
          <span className="text-xs">Chargement...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 bg-slate-900/20">
          <p className="text-xs">Aucun historique disponible pour le moment.</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{session.job_title}</h3>
                    <p className="text-xs text-slate-500 truncate max-w-md">
                      {session.job_description || 'Sans description'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">ID: #{session.id}</span>
                  <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                    Consulter <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}