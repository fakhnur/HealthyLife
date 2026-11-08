// Auth persistence: "Ingat saya" -> localStorage, otherwise sessionStorage (cleared with the tab).
const KEYS = ['hl_token', 'hl_user'];

const read = (key) => localStorage.getItem(key) ?? sessionStorage.getItem(key);

export const session = {
  getToken: () => read('hl_token'),
  getUser: () => {
    try {
      const raw = read('hl_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save: ({ token, user }, remember = true) => {
    session.clear();
    const store = remember ? localStorage : sessionStorage;
    store.setItem('hl_token', token);
    store.setItem('hl_user', JSON.stringify(user));
  },
  // Keep the user object fresh in whichever store currently holds the session.
  updateUser: (user) => {
    const store = localStorage.getItem('hl_token') ? localStorage : sessionStorage;
    store.setItem('hl_user', JSON.stringify(user));
  },
  clear: () => {
    KEYS.forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  },
};

export const SESSION_EXPIRED_EVENT = 'hl:session-expired';
