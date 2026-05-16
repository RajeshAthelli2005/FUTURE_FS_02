import React, { useState, useEffect, createContext, useContext } from 'react';
import { getMe } from './api';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import './App.css';

// ── Auth Context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (!token) { setLoading(false); return; }

    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('crm_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('crm_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? <DashboardLayout /> : <LoginPage />}
    </AuthContext.Provider>
  );
}
