import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Eye, 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  TrendingUp, 
  Server,
  Zap
} from 'lucide-react';
import axios from 'axios';

export default function AdminStats({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/admin/stats/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Erreur récupération stats :", err);
      setError("Accès refusé ou serveur injoignable. Vérifiez vos privilèges d'administrateur.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const uniqueRatio = stats?.total_visits > 0 
    ? Math.round((stats.unique_visitors / stats.total_visits) * 100) 
    : 0;
  
  const dailyAverage = stats?.week_visits 
    ? Math.round(stats.week_visits / 7) 
    : 0;

  const kpis = [
    { 
      title: "Visites Totales", 
      value: stats?.total_visits, 
      icon: Eye, 
      desc: "Cumul global des requêtes",
      borderColor: "hover:border-indigo-500/40",
      badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      textClass: "text-indigo-400"
    },
    { 
      title: "Aujourd'hui", 
      value: stats?.today_visits, 
      icon: Calendar, 
      desc: "Dernières 24 heures",
      borderColor: "hover:border-emerald-500/40",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      textClass: "text-emerald-400"
    },
    { 
      title: "7 Derniers Jours", 
      value: stats?.week_visits, 
      icon: Activity, 
      desc: `Moy. ~${dailyAverage} / jour`,
      borderColor: "hover:border-cyan-500/40",
      badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      textClass: "text-cyan-400"
    },
    { 
      title: "Visiteurs Uniques", 
      value: stats?.unique_visitors, 
      icon: Users, 
      desc: `${uniqueRatio}% du trafic global`,
      borderColor: "hover:border-purple-500/40",
      badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      textClass: "text-purple-400"
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Arrière-plan global */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" 
          alt="Abstract Network Background" 
          className="w-full h-full object-cover opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-5 sm:p-8 space-y-6 sm:space-y-8">
        
        {/* En-tête Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 active:scale-95 hover:text-white hover:bg-white/10 transition-all shadow-sm backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETOUR</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 font-mono font-bold text-xs sm:text-sm tracking-tight text-slate-200">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>DevInterview<span className="text-indigo-400">.lab</span> <span className="hidden xs:inline">/ Admin</span></span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Système Actif
            </span>

            <button
              onClick={() => fetchStats(true)}
              disabled={loading || refreshing}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 active:scale-95 hover:text-slate-100 hover:bg-white/10 transition-all disabled:opacity-50 backdrop-blur-sm"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Chargement */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-500">Chargement des métriques...</span>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-mono shadow-lg backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Contenu principal */}
        {!loading && stats && (
          <div className="space-y-6">
            
            {/* Grille KPI - 2 colonnes sur mobile, 4 sur desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {kpis.map((kpi, idx) => (
                <div key={idx} className={`relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all group shadow-xl backdrop-blur-md ${kpi.borderColor}`}>
                  <div className="flex items-center justify-between text-slate-400 mb-2 sm:mb-4">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider truncate mr-1">{kpi.title}</span>
                    <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border ${kpi.badgeClass}`}>
                      <kpi.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${kpi.textClass} tracking-tight drop-shadow-md`}>
                      {kpi.value?.toLocaleString() || 0}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-1 sm:mt-2 truncate">{kpi.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cartes inférieures */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              
              {/* Carte Engagement */}
              <div className="relative lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" 
                    alt="Analytics" 
                    className="w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80"></div>
                </div>
                
                <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6 backdrop-blur-sm h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-200 font-semibold uppercase">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      <span>Engagement</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                      Uniques / Total
                    </span>
                  </div>

                  <div className="space-y-2.5 bg-black/30 p-3.5 sm:p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Taux de visiteurs uniques</span>
                      <span className="text-purple-400 font-bold">{uniqueRatio}%</span>
                    </div>
                    <div className="w-full bg-black/50 h-2.5 sm:h-3 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(uniqueRatio, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs font-mono">
                    <div className="bg-white/5 p-2.5 sm:p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[9px] sm:text-[10px] mb-0.5">PÉRIODE ACTIVE</span>
                      <span className="text-slate-200 font-medium text-[11px] sm:text-xs">7 derniers jours</span>
                    </div>
                    <div className="bg-white/5 p-2.5 sm:p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[9px] sm:text-[10px] mb-0.5">DENSITÉ DU TRAFIC</span>
                      <span className="text-slate-200 font-medium text-[11px] sm:text-xs">~{dailyAverage} req/jour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Serveur */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" 
                    alt="Server" 
                    className="w-full h-full object-cover opacity-[0.12] group-hover:opacity-20 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent"></div>
                </div>

                <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-200 font-semibold uppercase">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <span>État API Backend</span>
                    </div>
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-slate-300 text-[11px] sm:text-xs">Endpoint Stats</span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] sm:text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        200 OK
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-slate-300 text-[11px] sm:text-xs">Authentification</span>
                      <span className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[11px] sm:text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        Token Validé
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400/80 text-right bg-black/20 p-2 rounded-lg border border-white/5">
                    Relevé : {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}