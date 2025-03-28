import { create } from 'zustand';
import { FirebaseUser } from '../types';
import { login as apiLogin, signup as apiSignup, signOut as apiSignOut, checkUsernameUnique as apiCheckUsernameUnique } from '../api/auth';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  checkAuth: () => void;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUsernameUnique: (username: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  checkAuth: () => {
    // Simulating auth state in a demo
    const mockUser: FirebaseUser = {
      uid: '123456789',
      email: 'demo@example.com',
      displayName: 'DemoUser',
    };
    
    // For demo purposes, we're setting authenticated to false to show login screen
    set({ 
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  signup: async (email: string, password: string, username: string) => {
    try {
      set({ isLoading: true, error: null });
      const isUnique = await apiCheckUsernameUnique(username);
      
      if (!isUnique) {
        set({ isLoading: false, error: 'Username is already taken' });
        return;
      }

      const user = await apiSignup(email, password, username);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await apiLogin(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await apiSignOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  checkUsernameUnique: async (username: string) => {
    try {
      return await apiCheckUsernameUnique(username);
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    }
  }
}));