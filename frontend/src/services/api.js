import axios from 'axios';
import { session, SESSION_EXPIRED_EVENT } from './session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 on a request that carried a token means the session is gone (login failures carry none).
    if (error.response?.status === 401 && session.getToken()) {
      session.clear();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
};

// Content APIs
export const contentService = {
  getContents: (params) => api.get('/content', { params }).then((r) => r.data),
  getContentById: (id) => api.get(`/content/${id}`).then((r) => r.data),
  getCategories: () => api.get('/content/categories').then((r) => r.data),
};

// Activities APIs
export const activityService = {
  getSummary: () => api.get('/activities/summary').then((r) => r.data),
  getActivities: (params) => api.get('/activities', { params }).then((r) => r.data),
  createActivity: (data) => api.post('/activities', data).then((r) => r.data),
  deleteActivity: (id) => api.delete(`/activities/${id}`).then((r) => r.data),
  updateWater: (amount) => api.patch('/activities/metrics/water', { amount }).then((r) => r.data),
  updateSteps: (steps) => api.patch('/activities/metrics/steps', { steps }).then((r) => r.data),
};

// Favorites APIs
export const favoriteService = {
  getFavorites: (params) => api.get('/favorites', { params }).then((r) => r.data),
  toggleFavorite: (contentId) => api.post(`/favorites/${contentId}`).then((r) => r.data),
};

export default api;
