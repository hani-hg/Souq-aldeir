import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken, hasActiveSession } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ email: '', phone: '', whatsapp: '' });

  useEffect(() => {
    async function boot() {
      try {
        const s = await api.get('/api/settings');
        setSettings(s.settings || {});
      } catch (e) {}
      const token = getToken();
      if (hasActiveSession()) {
        try {
          const data = await api.get('/api/auth/me');
          setUser(data.user);
        } catch (e) {
          setToken(null);
        }
      }
      setLoading(false);
    }
    boot();
    api.post('/api/visit').catch(() => {});
  }, []);

  useEffect(() => {
    async function onAuthState() {
      if (hasActiveSession()) {
        try {
          const data = await api.get('/api/auth/me');
          setUser(data.user);
        } catch (e) {
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    window.addEventListener('souq-auth', onAuthState);
    return () => window.removeEventListener('souq-auth', onAuthState);
  }, []);

  async function login(identifier, password) {
    const data = await api.post('/api/auth/login', { identifier, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register({ name, phone, email, password }) {
    const data = await api.post('/api/auth/register', { name, phone, email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, settings, setSettings, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
