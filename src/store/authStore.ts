import { create } from 'zustand';
import * as AuthAPI from '../api/auth';
import { FirebaseUser } from '../types';

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
    // For now, just simulate auth check
    // Later, implement with Firebase Auth
    console.log('Checking auth state...');
    
    // Automatically set a user for development purposes
    // This helps with testing authenticated views
    // In production, we'd use Firebase Auth state listener
    
    // MOCK USER FOR DEVELOPMENT
    // Remove this in production or replace with actual Firebase Auth
    const mockUser: FirebaseUser = {
      uid: 'mock-user-id-123',
      email: 'user@example.com',
      displayName: 'ZenUser',
    };
    
    set({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },
  
  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    
    try {
      const isUnique = await AuthAPI.checkUsernameUnique(username);
      
      if (!isUnique) {
        set({ isLoading: false, error: 'Username is already taken' });
        return;
      }
      
      const user = await AuthAPI.signup(email, password, username);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up',
      });
    }
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await AuthAPI.login(email, password);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to log in',
      });
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await AuthAPI.signOut();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      });
    }
  },
  
  checkUsernameUnique: async (username) => {
    try {
      return await AuthAPI.checkUsernameUnique(username);
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      return false;
    }
  },
}));