import { create } from 'zustand';
import { FirebaseUser, checkUsernameUnique, signup, login, signOut, listenToAuthState } from '../firebase/auth';
import { useGoogleAuth } from '../firebase/googleAuth';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  googleAuthLoading: boolean;
  googleAuthError: string | null;
  checkAuth: () => (() => void); // Returns the unsubscribe function
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkUsernameUnique: (username: string) => Promise<boolean>;
  continueAsGuest: () => void;
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
    const unsubscribe = listenToAuthState((user) => {
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false,
        error: null
      });
    });

    return unsubscribe;
  },

  signup: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await signup(email, password, username);
      set({ user, isAuthenticated: true, isLoading: false });
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
      const user = await login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error logging in', 
        isLoading: false 
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ googleAuthLoading: true, googleAuthError: null });
    
    try {
      // We're using the custom hook directly to leverage Firebase Auth providers
      const { signInWithGoogle } = useGoogleAuth();
      
      const result = await signInWithGoogle();
      
      // The actual auth state update is handled by the listenToAuthState effect
      // Since Firebase Auth will emit an event when the user signs in with Google
      set({ googleAuthLoading: false });
      
      if (!result) {
        throw new Error('Google sign in failed');
      }
    } catch (error: any) {
      set({ 
        googleAuthError: error.message || 'Error signing in with Google', 
        googleAuthLoading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut();
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

  checkUsernameUnique: async (username: string) => {
    try {
      return await checkUsernameUnique(username);
    } catch (error: any) {
      set({ error: error.message || 'Error checking username' });
      throw error;
    }
  },

  continueAsGuest: () => {
    const guestUser: FirebaseUser = {
      uid: `guest-${Date.now()}`,
      email: null,
      displayName: 'Guest User',
    };
    set({ 
      user: guestUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  },
}));