import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard'
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  if (currentView === 'auth') {
    return (
      <AuthModal 
        onBack={() => setCurrentView('landing')} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Bienvenue sur votre Dashboard</h2>
          <p className="text-slate-400 text-sm mb-6">Connecté en tant que {user?.email}</p>
          <button 
            onClick={() => setCurrentView('landing')}
            className="text-xs font-mono text-indigo-400 hover:underline"
          >
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return <LandingPage onStart={() => setCurrentView('auth')} />;
}