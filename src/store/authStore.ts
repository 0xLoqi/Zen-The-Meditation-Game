import { create } from 'zustand';
import { auth } from '../firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  googleAuthLoading: boolean;
  googleAuthError: string | null;
  checkAuth: () => (() => void); // Returns the unsubscribe function
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  firebaseSignInWithGoogle: (idToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  googleAuthLoading: false,
  googleAuthError: null,

  checkAuth: () => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false,
        error: null
      });
    });
    return unsubscribe;
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error signing up', 
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error logging in', 
        isLoading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error signing out', 
        isLoading: false 
      });
      throw error;
    }
  },

  continueAsGuest: () => {
    // Optionally implement guest logic or leave as a no-op
    set({ 
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  firebaseSignInWithGoogle: async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      set({ isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message || 'Google sign-in failed' });
      throw error;
    }
  },
}));