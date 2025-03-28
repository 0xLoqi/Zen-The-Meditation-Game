import create from 'zustand';
import { 
  signup as apiSignup, 
  login as apiLogin, 
  signOut as apiSignOut,
  listenToAuthState,
  checkUsernameUnique as apiCheckUsernameUnique
} from '../api/auth';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  checkAuth: () => void;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUsernameUnique: (username: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  checkAuth: () => {
    const unsubscribe = listenToAuthState((user) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    });
    
    // Return the unsubscribe function for cleanup
    return unsubscribe;
  },
  
  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiSignup(email, password, username);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiLogin(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiSignOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  checkUsernameUnique: async (username) => {
    try {
      return await apiCheckUsernameUnique(username);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
