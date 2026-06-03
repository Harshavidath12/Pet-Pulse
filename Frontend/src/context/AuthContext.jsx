import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('petpulse_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('petpulse_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Register a new user — calls POST /api/auth/register */
  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error('All fields are required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const { data } = await authAPI.register({ name, email, password });
    // data = { _id, name, email, role, token }

    const userData = {
      id:     data._id,
      name:   data.name,
      email:  data.email,
      role:   data.role,
      avatar: data.name?.[0]?.toUpperCase() || 'U',
      token:  data.token,
    };

    localStorage.setItem('petpulse_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  /** Login — calls POST /api/auth/login */
  const login = async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required.');

    const { data } = await authAPI.login({ email, password });

    const userData = {
      id:     data._id,
      name:   data.name,
      email:  data.email,
      role:   data.role,
      avatar: data.name?.[0]?.toUpperCase() || 'U',
      token:  data.token,
    };

    localStorage.setItem('petpulse_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('petpulse_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
