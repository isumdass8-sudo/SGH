import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_data');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  async function login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_data', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
