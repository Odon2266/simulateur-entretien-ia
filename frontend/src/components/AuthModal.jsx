import React, { useState } from 'react';
import { Terminal, Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function AuthModal({ onBack, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({ email: formData.email });
  };

  // Récupération de l'access_token valide auprès de Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post('http://localhost:8000/api/auth/google/', {
          access_token: tokenResponse.access_token,
        });

        console.log('Connexion réussie !', response.data);
        localStorage.setItem('authToken', response.data.key);
        onLoginSuccess({ email: response.data.user?.email || 'Utilisateur Google' });
      } catch (error) {
        console.error('Erreur backend Django :', error.response?.data);
        alert('Échec de la connexion avec le serveur.');
      }
    },
    onError: (error) => console.error('Échec Google Login :', error),
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
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

      {/* Formulaire central */}
      <div className="max-w-md w-full mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Toggle Connexion / Inscription */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-8 font-mono text-xs">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isLogin ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CONNEXION
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isLogin ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INSCRIPTION
          </button>
        </div>

        {/* Titre */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">
            {isLogin ? 'Espace Authentification' : 'Créer un compte Dev'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Accédez à votre terminal et vos clés API' : 'Rejoignez la plateforme et configurez votre environnement'}
          </p>
        </div>

        {/* Bouton Google OAuth Personnalisé */}
        <button
          onClick={() => loginWithGoogle()}
          type="button"
          className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-xs font-mono mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Continuer avec Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase">OU</span>
        </div>

        {/* Formulaire Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">NOM D'UTILISATEUR</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="dev_candidate"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5">ADRESSE EMAIL</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="dev@example.com"
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

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-[10px] font-mono text-indigo-400 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider mt-2"
          >
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto text-center flex items-center justify-center gap-2 text-slate-600 text-[11px] font-mono">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>Connexion sécurisée par JWT & OAuth 2.0</span>
      </div>
    </div>
  );
}