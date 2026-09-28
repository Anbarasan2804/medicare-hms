import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import type { Role, User } from '../types';

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medicare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('medicare_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem('medicare_token', token);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('medicare_user', JSON.stringify(user));
  }, [user]);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
  }

  function hasRole(...roles: Role[]) {
    return !!user && roles.includes(user.role);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
