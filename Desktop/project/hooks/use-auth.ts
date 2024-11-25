"use client";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  role: 'buyer' | 'seller';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => {
        set({ isAuthenticated: false, user: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
      checkAuth: () => get().isAuthenticated
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);