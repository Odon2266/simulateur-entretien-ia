import React, { useState } from 'react';
import { Terminal, Lock, Mail, Eye, EyeOff, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function AuthModal({ onBack, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const endpoint = isLogin 
        ? 'http://localhost:8000/api/auth/custom-login/' 
        : 'http://localhost:8000/api/auth/register/';

      const payload = isLogin 
        ? { username: formData.username, password: formData.password } 
        : { email: formData.email, password: formData.password, username: formData.username };

      const response = await axios.post(endpoint, payload);

      const { token, key, user } = response.data;
      const authToken = token || key;

      let userData = user;

      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }
      
      const finalUserData = userData || { username: formData.username, is_staff: false, is_superuser: false };
      localStorage.setItem('user_info', JSON.stringify(finalUserData));
      localStorage.setItem('userEmail', finalUserData.email || finalUserData.username);

      onLoginSuccess(finalUserData);
    } catch (error) {
      console.error('Erreur authentification :', error.response?.data);
      const msg = error.response?.data?.detail 
        || error.response?.data?.non_field_errors?.[0]
        || 'Identifiants invalides ou erreur serveur.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrorMessage('');
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/api/auth/google/', {
          access_token: tokenResponse.access_token,
        });

        const authToken = response.data.key || response.data.token;
        if (authToken) {
          localStorage.setItem('authToken', authToken);
        }

        const userData = response.data.user || { email: 'Utilisateur', is_staff: false };
        localStorage.setItem('user_info', JSON.stringify(userData));
        localStorage.setItem('userEmail', userData.email);

        onLoginSuccess(userData);
      } catch (error) {
        console.error('Erreur Google Login :', error.response?.data);
        setErrorMessage('Échec de la connexion Google avec le serveur.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Échec Google Login :', error);
      setErrorMessage('Échec de l\'authentification Google.');
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 selection:bg-indigo-500 selection:text-white">
      
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETOUR À L'ACCUEIL</span>
        </button>

        <div className="flex items-center gap-2 text-slate-200 font-mono font-bold text-sm">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>DevInterview<span className="text-indigo-400">.lab</span></span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-8 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isLogin ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CONNEXION
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isLogin ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INSCRIPTION
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">
            {isLogin ? 'Espace Authentification' : 'Créer un compte Dev'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Accédez à votre espace Candidat ou Administrateur' : 'Rejoignez la plateforme et configurez votre environnement'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={() => loginWithGoogle()}
          type="button"
          disabled={loading}
          className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-xs font-mono mb-6 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
          </svg>
          Continuer avec Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase">OU IDENTIFIANT</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">ADRESSE EMAIL</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nom@domaine.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
              {isLogin ? "IDENTIFIANT OU EMAIL" : "NOM D'UTILISATEUR"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder={isLogin ? "Nom d'utilisateur ou e-mail" : "Votre pseudo"}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5">MOT DE PASSE</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              isLogin ? 'Se connecter' : 'Créer mon compte'
            )}
          </button>
        </form>
      </div>

      <div className="max-w-md mx-auto text-center flex items-center justify-center gap-2 text-slate-600 text-[11px] font-mono">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>Connexion sécurisée par Token & OAuth 2.0</span>
      </div>
    </div>
  );
}