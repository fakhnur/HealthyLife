import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const VPS_BACKEND_URL = 'http://23.226.132.173:5001/api';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return VPS_BACKEND_URL;
};
import { resolveImageSource } from '../theme/assets';
export { resolveImageSource };

export const resolveImageUrl = (url, fallback) => {
  const defaultFallback =
    fallback ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  if (!url || typeof url !== 'string' || !url.trim()) {
    return defaultFallback;
  }
  if (url.startsWith('/figma/')) {
    if (url.includes('meal-hero') || url.includes('balanced-meal')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    }
    if (url.includes('workout')) {
      return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
    }
    if (url.includes('budi-avatar')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    }
    return defaultFallback;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('hl_mobile_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
};

export const contentService = {
  getContents: (params) => api.get('/content', { params }).then((r) => r.data),
  getContentById: (id) => api.get(`/content/${id}`).then((r) => r.data),
  getCategories: () => api.get('/content/categories').then((r) => r.data),
};

export const activityService = {
  getSummary: () => api.get('/activities/summary').then((r) => r.data),
  getActivities: (params) => api.get('/activities', { params }).then((r) => r.data),
  createActivity: (data) => api.post('/activities', data).then((r) => r.data),
  deleteActivity: (id) => api.delete(`/activities/${id}`).then((r) => r.data),
  updateWater: (amount) => api.patch('/activities/metrics/water', { amount }).then((r) => r.data),
  updateSteps: (steps) => api.patch('/activities/metrics/steps', { steps }).then((r) => r.data),
};

export const favoriteService = {
  getFavorites: (params) => api.get('/favorites', { params }).then((r) => r.data),
  toggleFavorite: (contentId) => api.post(`/favorites/${contentId}`).then((r) => r.data),
};

export default api;
