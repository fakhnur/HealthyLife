import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { session, SESSION_EXPIRED_EVENT } from '../services/session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (session.getToken() ? session.getUser() : null));
  const [token, setToken] = useState(() => session.getToken());
  // Only block rendering while a stored session is being verified.
  const [loading, setLoading] = useState(() => !!session.getToken());

  const clearAuth = useCallback(() => {
    session.clear();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    if (!session.getToken()) return undefined;
    let cancelled = false;
    authService
      .getMe()
      .then((res) => {
        if (cancelled) return;
        setUser(res.data.user);
        session.updateUser(res.data.user);
      })
      .catch((err) => {
        // Only drop the session when the server rejected it, not on a network blip.
        if (!cancelled && err.response?.status === 401) clearAuth();
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [clearAuth]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, clearAuth);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearAuth);
  }, [clearAuth]);

  const startSession = (res, remember) => {
    const { user: authUser, token: authToken } = res.data;
    session.save({ token: authToken, user: authUser }, remember);
    setUser(authUser);
    setToken(authToken);
    return authUser;
  };

  const login = async (email, password, remember = true) =>
    startSession(await authService.login({ email, password }), remember);

  const register = async (name, email, password) =>
    startSession(await authService.register({ name, email, password }), true);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout: clearAuth,
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
