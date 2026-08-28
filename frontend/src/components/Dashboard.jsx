import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Dumbbell, 
  History, 
  LogOut, 
  Mic, 
  Zap, 
  ChevronRight,
  CheckCircle2,
  Key,
  X,
  Loader2,
  Briefcase,
  Trash2,
  Upload,
  FileText
} from 'lucide-react';
import SimulationChat from './SimulationChat';
import OverviewTab from './OverviewTab';
import PracticeTab from './PracticeTab';
import HistoryTab from './HistoryTab';

export default function Dashboard({ user, userEmail = "fidinjaharisoaodon@gmail.com", onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Récupération des informations utilisateur Google (Prop ou LocalStorage)
  const storedUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const currentUser = user || storedUser;

  const displayName = currentUser.name || currentUser.first_name || userEmail.split('@')[0];
  const email = currentUser.email || userEmail;
  const avatarUrl = currentUser.picture || currentUser.avatar;

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

  const fetchSessions = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/sessions/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error('Erreur de chargement des sessions :', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Validation du fichier CV (PDF uniquement)
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else if (file) {
      alert('Veuillez sélectionner un fichier au format PDF.');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsCreating(true);
    try {
      const token = getToken();

      // Étape A : Téléversement du CV vers l'endpoint profil si un fichier est sélectionné
      if (cvFile) {
        const formData = new FormData();
        formData.append('cv_file', cvFile);

        await axios.post(`${API_BASE_URL}/profiles/upload_cv/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Étape B : Création de la session d'entretien
      const res = await axios.post(
        `${API_BASE_URL}/sessions/`,
        { job_title: jobTitle, job_description: jobDescription },
        { headers: { Authorization: `Token ${token}` } }
      );

      setShowNewModal(false);
      setJobTitle('');
      setJobDescription('');
      setCvFile(null);
      
      setSessions([res.data, ...sessions]);
      setActiveSession(res.data);
    } catch (err) {
      console.error('Erreur :', err);
      alert('Impossible de démarrer la session. Vérifiez votre backend et votre clé API.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) return;

    setDeletingId(sessionId);
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/sessions/${sessionId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Erreur lors de la suppression de la session :", err);
      alert("Impossible de supprimer la session.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSavingKey(true);
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/profile/update-key/`, 
        { api_key: apiKey },
        { headers: { Authorization: `Token ${token}` } }
      );

      setStatusMessage({ type: 'success', text: 'Clé enregistrée avec succès !' });
      setApiKey('');
      setTimeout(() => {
        setShowKeyModal(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      console.error('Erreur sauvegarde clé API :', err);
      setStatusMessage({ type: 'error', text: 'Échec de l’enregistrement de la clé.' });
    } finally {
      setIsSavingKey(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bar Navigation */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Mic className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            DevInterview<span className="text-cyan-400">.lab</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowKeyModal(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs transition-all"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clé Ollama</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Moteur IA Prêt</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          {/* Profil Utilisateur Google */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200 capitalize">{displayName}</p>
              <p className="text-[10px] text-slate-500">{email}</p>
            </div>

            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="w-9 h-9 rounded-xl border border-slate-700 object-cover shadow-inner"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 shadow-inner">
                {displayName[0].toUpperCase()}
              </div>
            )}

            <button 
              onClick={onLogout}
              title="Déconnexion"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Latérale */}
        <aside className="w-60 border-r border-slate-800/80 bg-slate-900/30 p-4 space-y-6 hidden md:flex flex-col justify-between">
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Vue générale', icon: LayoutDashboard },
              { id: 'simulation', label: 'Simulation IA', icon: PlayCircle },
              { id: 'practice', label: 'Entraînement', icon: Dumbbell },
              { id: 'history', label: 'Historique', icon: History },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !activeSession;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setActiveSession(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-cyan-300' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Compte Gratuit</span>
            </div>
            <p className="text-[10px] text-slate-400">3 simulations restantes ce mois-ci.</p>
          </div>
        </aside>

        {/* Zone de Contenu Principal */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          {activeSession ? (
            <div className="h-full flex flex-col">
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                <button onClick={() => { setActiveSession(null); fetchSessions(); }} className="hover:text-white transition-colors">
                  Vue générale
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-cyan-400">Entretien : {activeSession.job_title}</span>
              </div>
              <SimulationChat 
                sessionData={activeSession} 
                onBack={() => { setActiveSession(null); fetchSessions(); }} 
              />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <OverviewTab 
                  sessions={sessions}
                  setSessions={setSessions}
                  loadingSessions={loadingSessions}
                  onNewSession={() => setShowNewModal(true)}
                  onSelectSession={(session) => setActiveSession(session)}
                  onViewAllHistory={() => setActiveTab('history')}
                />
              )}

              {activeTab === 'simulation' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Simulations d'Entretien IA</h2>
                      <p className="text-xs text-slate-400">Lancez une nouvelle session ou rejoignez une simulation en cours.</p>
                    </div>
                    <button 
                      onClick={() => setShowNewModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <PlayCircle className="w-4 h-4 fill-slate-950" />
                      <span>Nouvelle Session</span>
                    </button>
                  </div>

                  {loadingSessions ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
                      <span className="text-xs">Chargement des sessions...</span>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4 bg-slate-900/20">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-cyan-400">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-200">Aucune simulation active</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">Créez votre première simulation d'entretien pour commencer à vous entraîner avec l'IA.</p>
                      </div>
                      <button
                        onClick={() => setShowNewModal(true)}
                        className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                      >
                        Lancer un entretien
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => setActiveSession(session)}
                          className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                                <Briefcase className="w-5 h-5" />
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-500">ID: #{session.id}</span>
                                <button
                                  onClick={(e) => handleDeleteSession(session.id, e)}
                                  disabled={deletingId === session.id}
                                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                  title="Supprimer la session"
                                >
                                  {deletingId === session.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                                {session.job_title}
                              </h3>
                              <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                                {session.job_description || 'Aucune description fournie.'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-cyan-400 font-semibold">
                            <span>Lancer la simulation</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'practice' && <PracticeTab />}

              {activeTab === 'history' && (
                <HistoryTab 
                  sessions={sessions}
                  setSessions={setSessions}
                  loadingSessions={loadingSessions}
                  onSelectSession={(session) => setActiveSession(session)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal Nouvel Entretien avec Upload CV */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Nouvel Entretien</h3>
              <p className="text-xs text-slate-400">Ajoutez votre CV et le poste pour adapter les questions de l'IA.</p>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              {/* Zone d'upload du CV (PDF) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Votre CV (Optionnel, format PDF)</label>
                <div className="border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 transition-colors bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleCvChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {cvFile ? (
                    <div className="flex items-center gap-2 text-cyan-400 font-medium text-xs">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{cvFile.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-400">
                      <Upload className="w-5 h-5 mx-auto text-slate-500" />
                      <p className="text-xs">Glissez votre CV PDF ici ou <span className="text-cyan-400 underline">parcourez</span></p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Intitulé du poste *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Développeur Full-Stack React / Node"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description / Exigences du poste</label>
                <textarea
                  rows={3}
                  placeholder="Collez ici la fiche de poste ou les compétences clés recherchées..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création de la session...</span>
                  </>
                ) : (
                  <span>Démarrer l'entretien</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Clé Ollama */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Clé Ollama / API
              </h3>
              <p className="text-xs text-slate-400">Configurez votre clé d'accès pour exécuter les simulations via Ollama.</p>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Clé Ollama / API *</label>
                <input
                  type="password"
                  required
                  placeholder="Saisissez votre clé..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {statusMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingKey}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isSavingKey ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <span>Enregistrer la clé</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}