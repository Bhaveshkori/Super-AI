
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, PlanType, BadgeType } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import UserHome from './components/UserHome';
import CompareAI from './components/CompareAI';
import AdminDashboard from './components/AdminDashboard';
import UpgradePro from './components/UpgradePro';
import AppShell from './components/AppShell';
import Chat from './components/Chat';
import Studio from './components/Studio';
import LiveHub from './components/Live';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('super_ai_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('super_ai_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('super_ai_user');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/home" /> : <Auth onLogin={handleLogin} />} />
        
        {/* Wrapped Protected Routes */}
        <Route path="/*" element={
          user ? (
            <AppShell user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/home" element={<UserHome user={user} onLogout={handleLogout} />} />
                <Route path="/compare" element={<CompareAI user={user} />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/live" element={<LiveHub />} />
                <Route path="/upgrade" element={<UpgradePro user={user} />} />
                <Route path="/admin" element={
                  (user.role === UserRole.OWNER || user.role === UserRole.COOWNER) 
                    ? <AdminDashboard user={user} /> 
                    : <Navigate to="/home" />
                } />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </AppShell>
          ) : <Navigate to="/auth" />
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
