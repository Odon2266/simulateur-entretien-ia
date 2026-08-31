import React, { useState } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, 
  Cpu, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Database, 
  HardDrive, 
  MessageSquare, 
  RefreshCw,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export default function SystemDesignPractice({ onBack }) {
  const scenarios = [
    {
      id: 'netflix',
      title: 'Plateforme de Streaming Vidéo à Grande Échelle',
      target: '10M d\'utilisateurs actifs quotidiens, streaming vidéo 4K à faible latence.',
      constraints: 'Haute disponibilité, distribution géographique (CDN), stockage massif.'
    },
    {
      id: 'whatsapp',
      title: 'Système de Messagerie Instantanée Temps Réel',
      target: '50M de messages par minute, livraison garantie et statut de lecture.',
      constraints: 'Faible latence, connexions WebSockets persistantes, chiffrement de bout en bout.'
    },
    {
      id: 'ticketing',
      title: 'Système de Réservation de Billets (Type Ticketmaster)',
      target: 'Pics soudains de trafic (ventes flash 100k req/sec sur une seule ressource).',
      constraints: 'Consistance stricte (ACID), prévention du double-booking, gestion des files d\'attente.'
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [databaseChoice, setDatabaseChoice] = useState('PostgreSQL + Redis');
  const [cacheStrategy, setCacheStrategy] = useState('Cache-Aside with Redis');
  const [messagingStrategy, setMessagingStrategy] = useState('Apache Kafka pour la gestion des événements');
  const [architectureDetails, setArchitectureDetails] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  // Configuration identique au QCM
  const API_BASE_URL = 'http://localhost:8000/api';
  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!architectureDetails.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      
      const response = await axios.post(
        `${API_BASE_URL}/system-design/evaluate/`,
        {
          scenario_title: selectedScenario.title,
          database_choice: databaseChoice,
          cache_strategy: cacheStrategy,
          messaging_strategy: messagingStrategy,
          architecture_details: architectureDetails
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` 
          }
        }
      );

      setEvaluation(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Session expirée ou non autorisée (401). Veuillez vous reconnecter.");
      } else {
        setError(err.response?.data?.error || err.message || "Erreur lors de l'évaluation de l'architecture.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Barre de retour */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Hub d'entraînement</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>Évaluation Architecturale IA</span>
        </div>
      </div>

      {!evaluation ? (
        /* Formulaire d'évaluation d'architecture */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sélection du Scénario */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white block">1. Choisissez une étude de cas</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedScenario.id === sc.id
                      ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <h4 className="text-xs font-bold text-white mb-1">{sc.title}</h4>
                  <p className="text-[11px] text-slate-400 mb-2">{sc.target}</p>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 block w-fit">
                    {sc.constraints}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Choix d'infrastructure de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Base de données principale</span>
              </label>
              <input
                type="text"
                value={databaseChoice}
                onChange={(e) => setDatabaseChoice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="ex: PostgreSQL (Partitioning) + MongoDB"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Stratégie de Cache</span>
              </label>
              <input
                type="text"
                value={cacheStrategy}
                onChange={(e) => setCacheStrategy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="ex: Redis (Write-Through) + CDN Cloudflare"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Message Broker / Asynchrone</span>
              </label>
              <input
                type="text"
                value={messagingStrategy}
                onChange={(e) => setMessagingStrategy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="ex: RabbitMQ / Kafka / WebSockets"
              />
            </div>
          </div>

          {/* Zone d'explications détaillées */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white block">
              2. Décrivez l'architecture technique détaillée
            </label>
            <p className="text-xs text-slate-400">
              Expliquez le flux de données, l'équilibrage de charge (Load Balancing), la haute disponibilité, l'invalidation de cache et la gestion des échecs (Failover).
            </p>
            <textarea
              rows={8}
              value={architectureDetails}
              onChange={(e) => setArchitectureDetails(e.target.value)}
              placeholder="Exemple : 
1. Les requêtes clients passent par Nginx comme Ingress / Load Balancer.
2. API Gateway transmet les requêtes aux microservices isolés dans des conteneurs Docker.
3. Les données de lecture fréquente sont en cache Redis avec invalidation par TTL.
4. Les événements d'écriture sont publiés dans Kafka pour traitement asynchrone par les workers backend..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
            />
          </div>

          {/* Affichage de l'erreur */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !architectureDetails.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyse architecturale par l'IA en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Soumettre l'architecture pour évaluation</span>
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        /* Affichage du Rapport d'Évaluation IA */
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Rapport d'Architecture</span>
              <h2 className="text-xl font-bold text-white">{selectedScenario.title}</h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-950 px-6 py-3 rounded-xl border border-slate-800">
              <div className="text-center">
                <span className="text-xs text-slate-500 block font-mono">Note IA</span>
                <span className={`text-3xl font-extrabold ${evaluation.score >= 80 ? 'text-emerald-400' : evaluation.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {evaluation.score}/100
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Points Forts & Bons Choix</span>
              </div>
              <ul className="space-y-2">
                {evaluation.strengths?.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Vecteurs d'échec & SPOF</span>
              </div>
              <ul className="space-y-2">
                {evaluation.weaknesses?.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Analyse de Scalabilité & Montée en charge</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
              {evaluation.scalability_notes}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Recommandations d'Architecture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
              {evaluation.recommendations}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Tester une autre proposition</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}