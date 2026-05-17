import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('edu_admin_token');
    if (token) {
      authAPI.me()
        .then(res => setAdmin(res.data.admin))
        .catch(() => localStorage.removeItem('edu_admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('edu_admin_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('edu_admin_token');
    setAdmin(null);
  };

  const updateAdmin = (data) => setAdmin(prev => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
