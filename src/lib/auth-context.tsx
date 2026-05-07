'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// We extend the Supabase user to include properties expected by the frontend
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  displayName?: string;
  balance: number;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, affiliateCode?: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string, type: 'signup' | 'recovery' | 'email_change') => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
  updateProfileDetails: (updates: { username?: string; display_name?: string }) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSetUser = async (sbUser: SupabaseUser | null) => {
    if (!sbUser || !sbUser.email) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('available_balance, username, display_name')
        .eq('id', sbUser.id)
        .single();

      setUser({
        id: sbUser.id,
        email: sbUser.email,
        name: sbUser.email.split('@')[0],
        username: profile?.username || `user_${sbUser.id.substring(0,6)}`,
        displayName: profile?.display_name || 'User',
        balance: profile?.available_balance ? Number(profile.available_balance) : 0,
        joinDate: new Date(sbUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      });
    } catch (e) {
      setUser({
        id: sbUser.id,
        email: sbUser.email,
        name: sbUser.email.split('@')[0],
        username: `user_${sbUser.id.substring(0,6)}`,
        displayName: 'User',
        balance: 0,
        joinDate: new Date(sbUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSetUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // If we already have the user object and just the token refreshed, don't refetch
        if (!user || user.id !== session.user.id) {
          fetchProfileAndSetUser(session.user);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateBalance = (newBalance: number) => {
    setUser((prev) => prev ? { ...prev, balance: newBalance } : null);
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during login' };
    }
  };

  const register = async (email: string, password: string, affiliateCode?: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            affiliate_code: affiliateCode
          }
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during registration' };
    }
  };

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'recovery' | 'email_change') => {
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during verification' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred sending reset email' };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred updating password' };
    }
  };

  const updateProfileDetails = async (updates: { username?: string; display_name?: string }) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates });
      
      if (error) {
        if (error.code === '23505') return { success: false, error: 'Username is already taken' };
        return { success: false, error: error.message };
      }
      
      setUser(prev => prev ? { 
        ...prev, 
        username: updates.username ?? prev.username,
        displayName: updates.display_name ?? prev.displayName 
      } : null);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) return { success: false, error: error.message };
      // After this, user needs to verify OTP. Session doesn't change immediately until verified.
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update email' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      loading,
      login, 
      register, 
      verifyOtp,
      resetPassword,
      updatePassword,
      logout,
      updateBalance,
      updateProfileDetails,
      updateEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
