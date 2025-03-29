import { create } from 'zustand';
import { FirebaseUser } from '../types';
import { 
  login as firebaseLogin, 
  signup as firebaseSignup, 
  signOut as firebaseSignOut, 
  checkUsernameUnique as firebaseCheckUsernameUnique,
  listenToAuthState
} from '../firebase/auth';
import * as Animatable from 'react-native-animatable';

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
  isLoading: true, // Start with loading true to check auth state
  error: null,
  isAuthenticated: false,

  checkAuth: () => {
    set({ isLoading: true });
    
    // Set up auth state listener
    const unsubscribe = listenToAuthState((user) => {
      if (user) {
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
  },

  signup: async (email: string, password: string, username: string) => {
    try {
      set({ isLoading: true, error: null });
      const isUnique = await firebaseCheckUsernameUnique(username);
      
      if (!isUnique) {
        set({ isLoading: false, error: 'Username is already taken' });
        return;
      }

      const user = await firebaseSignup(email, password, username);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await firebaseLogin(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await firebaseSignOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  checkUsernameUnique: async (username: string) => {
    try {
      return await firebaseCheckUsernameUnique(username);
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    }
  }
}));