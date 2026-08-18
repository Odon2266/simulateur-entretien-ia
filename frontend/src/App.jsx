import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard'
  const [user, setUser] = useState(null);

  // Vérification de la session au rechargement de la page
  useEffect(() => {
    // On vérifie les deux noms possibles au cas où
    const savedToken = localStorage.getItem('authToken') || localStorage.getItem('access_token');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedToken && savedEmail) {
      setUser({ email: savedEmail });
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData?.email) {
      localStorage.setItem('userEmail', userData.email);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    setUser(null);
    setCurrentView('landing');
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
      <Dashboard 
        userEmail={user?.email || 'Utilisateur'} 
        onLogout={handleLogout} 
      />
    );
  }

  return <LandingPage onStart={() => setCurrentView('auth')} />;
}