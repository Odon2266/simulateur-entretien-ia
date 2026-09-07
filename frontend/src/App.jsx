import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import AdminStats from './components/AdminStats';

// Normalise is_staff / is_superuser : gère les cas où l'API renvoie
// un booléen (true/false) ou une chaîne ("true"/"false") selon le serializer Django.
function isAdminUser(userData) {
  const isStaff = userData?.is_staff;
  const isSuperuser = userData?.is_superuser;
  return isStaff === true || isStaff === 'true' || isSuperuser === true || isSuperuser === 'true';
}

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'auth' | 'dashboard' | 'admin'
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Enregistrement automatique de la visite
  useEffect(() => {
    fetch('http://localhost:8000/api/track-visit/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch((err) => console.error("Erreur de suivi de visite :", err));
  }, []);

  // 2. Restauration de la session utilisateur au rechargement
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken') || localStorage.getItem('access_token');
    const savedUserInfo = localStorage.getItem('user_info');

    if (savedToken && savedUserInfo) {
      try {
        const parsedUser = JSON.parse(savedUserInfo);
        setUser(parsedUser);

        // 🔍 Debug : vérifie dans la console ce que contient réellement l'objet utilisateur
        console.debug('[Auth] Utilisateur restauré depuis localStorage :', parsedUser);

        // Redirection automatique vers Admin ou Dashboard selon le rôle
        if (isAdminUser(parsedUser)) {
          setCurrentView('admin');
        } else {
          setCurrentView('dashboard');
        }
      } catch (e) {
        console.error("Erreur lecture user_info:", e);
      }
    }
    setIsInitializing(false);
  }, []);

  // 3. Traitement après connexion réussie dans AuthModal
  const handleLoginSuccess = (userData) => {
    setUser(userData);

    // 🔍 Debug : vérifie dans la console ce que renvoie réellement le backend au login
    console.debug('[Auth] Utilisateur reçu après connexion :', userData);

    // Si c'est un compte admin / staff Django -> Vue Admin
    if (isAdminUser(userData)) {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user_info');
    setUser(null);
    setCurrentView('landing');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthModal 
        onBack={() => setCurrentView('landing')} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminStats 
        onBack={handleLogout} 
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