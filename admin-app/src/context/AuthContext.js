import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = sessionStorage.getItem('admin_user');
    const t = sessionStorage.getItem('admin_token');
    if (u && t) setAdmin(JSON.parse(u));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await adminAuthAPI.login({ email, password });
    sessionStorage.setItem('admin_token', data.token);
    sessionStorage.setItem('admin_user', JSON.stringify(data.user));
    setAdmin(data.user);
    return data.user;
  };

  const signup = async (name, email, password, adminCode) => {
    const { data } = await adminAuthAPI.signup({ name, email, password, adminCode });
    sessionStorage.setItem('admin_token', data.token);
    sessionStorage.setItem('admin_user', JSON.stringify(data.user));
    setAdmin(data.user);
    return data.user;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, signup, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
