import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '../types';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Успішний вхід в систему');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);

      const { user: newUser, token: authToken } = response.data;

      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      toast.success('Реєстрація успішна');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Успішний вихід з системи');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await apiClient.put<{ data: User }>('/auth/profile', data);
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Профіль оновлено');
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      toast.success('Пароль успішно змінено');
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
