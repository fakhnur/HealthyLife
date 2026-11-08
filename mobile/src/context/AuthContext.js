import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('hl_mobile_token');
        const storedUser = await AsyncStorage.getItem('hl_mobile_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load stored auth:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { user: authUser, token: authToken } = res.data;
      setUser(authUser);
      setToken(authToken);
      await AsyncStorage.setItem('hl_mobile_token', authToken);
      await AsyncStorage.setItem('hl_mobile_user', JSON.stringify(authUser));
      return authUser;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      const { user: authUser, token: authToken } = res.data;
      setUser(authUser);
      setToken(authToken);
      await AsyncStorage.setItem('hl_mobile_token', authToken);
      await AsyncStorage.setItem('hl_mobile_user', JSON.stringify(authUser));
      return authUser;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('hl_mobile_token');
    await AsyncStorage.removeItem('hl_mobile_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
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
