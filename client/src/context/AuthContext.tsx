import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ redirectUrl: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoUser: (role: 'ADMIN' | 'TALENT_US' | 'TALENT_UK' | 'TALENT_IN' | 'CLIENT_US' | 'CLIENT_IN') => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('openbench_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('openbench_token')) {
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch {
      localStorage.removeItem('openbench_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password = 'Password123!'): Promise<{ redirectUrl: string }> => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('openbench_token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return { redirectUrl: res.data.redirectUrl };
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('openbench_token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const switchDemoUser = async (demoKey: 'ADMIN' | 'TALENT_US' | 'TALENT_UK' | 'TALENT_IN' | 'CLIENT_US' | 'CLIENT_IN'): Promise<string> => {
    const demoAccounts: Record<string, string> = {
      ADMIN: 'alex@openbench.io',
      TALENT_US: 'marcus.vance@gmail.com',
      TALENT_UK: 'elena.rostova@designpod.co.uk',
      TALENT_IN: 'arjun.mehta@devstack.in',
      CLIENT_US: 'sarah.connor@apexscale.com',
      CLIENT_IN: 'vikram.singh@zenithflow.in',
    };

    const targetEmail = demoAccounts[demoKey] || 'alex@openbench.io';
    const res = await login(targetEmail, 'Password123!');
    return res.redirectUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
