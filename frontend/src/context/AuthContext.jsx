import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('pulse_token');
    const savedUser = localStorage.getItem('pulse_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('pulse_token', data.access_token);
    localStorage.setItem('pulse_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    handleAuthSuccess(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    handleAuthSuccess(res.data);
    return res.data;
  };

  const demoLogin = async (role = 'patient') => {
    const res = await authAPI.demoLogin(role);
    handleAuthSuccess(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    setUser(res.data);
    localStorage.setItem('pulse_user', JSON.stringify(res.data));
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isDoctor: user?.role === 'doctor',
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
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
