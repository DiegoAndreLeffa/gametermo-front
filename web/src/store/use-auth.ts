import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  points: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem('loldle-token', token);
    set({ token, user, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('loldle-token');
    set({ token: null, user: null, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('loldle-token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      set({ user: response.data, token, isLoading: false });
    } catch (error) {
      localStorage.removeItem('loldle-token');
      set({ token: null, user: null, isLoading: false });
    }
  },
}));