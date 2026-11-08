import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({ count: 0, refresh: () => {} });

// Single source for the sidebar badge; pages call refresh() after toggling a bookmark.
export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    try {
      const res = await favoriteService.getFavorites();
      setCount(res.count ?? res.data?.length ?? 0);
    } catch {
      // Keep the last known count; the badge is informational only.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <FavoritesContext.Provider value={{ count, refresh }}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);
