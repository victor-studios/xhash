'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  balance: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('xhash_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (!email || !password) return false;
    // Demo: accept any credentials
    const demoUser: User = {
      email,
      name: email.split('@')[0],
      balance: '$1,247.50',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setUser(demoUser);
    localStorage.setItem('xhash_user', JSON.stringify(demoUser));
    return true;
  };

  const register = (email: string, password: string): boolean => {
    if (!email || !password) return false;
    const demoUser: User = {
      email,
      name: email.split('@')[0],
      balance: '$0.00',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setUser(demoUser);
    localStorage.setItem('xhash_user', JSON.stringify(demoUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xhash_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
