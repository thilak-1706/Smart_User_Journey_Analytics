import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, localCart, localEvents } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,         setUser]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [sessionStart, setSessionStart] = useState(null);

  // Restore session on page reload
  useEffect(() => {
    const u = sessionStorage.getItem('u_user');
    const t = sessionStorage.getItem('token');
    const s = sessionStorage.getItem('u_session_start');
    if (u && t) {
      setUser(JSON.parse(u));
      setSessionStart(s ? new Date(s) : new Date());
    }
    setLoading(false);
  }, []);

  // Called after login or signup — clears session-level data only (not localStorage orders)
  const _save = (token, userData) => {
    const now = new Date();
    sessionStorage.setItem('token',           token);
    sessionStorage.setItem('u_user',          JSON.stringify(userData));
    sessionStorage.setItem('u_session_start', now.toISOString());
    sessionStorage.setItem('u_session',       'session_' + userData.id);
    // Clear cart + events for the new session (orders persist in localStorage per user)
    localCart.clear();
    localEvents.clear();
    setUser(userData);
    setSessionStart(now);
  };

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    _save(data.token, data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data } = await authAPI.signup({ name, email, password });
    _save(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    // Clear cart + events for this user only
    localCart.clear();
    localEvents.clear();
    // Orders stay in localStorage under their user-specific key — safe to keep
    sessionStorage.clear();
    setUser(null);
    setSessionStart(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, sessionStart }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
