import { create } from 'zustand';
import { auth } from '../firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetUserStore } from './userStore';
import { resetGameStore } from './index';
import { useMeditationStore } from './meditationStore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getUserData } from '../firebase/user';

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
  isLoading: true,
  error: null,
  isAuthenticated: false,
  googleAuthLoading: false,
  googleAuthError: null,

  checkAuth: () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentState = get(); // Get current store state
      console.log(`[authStore.onAuthStateChanged] Received user: ${user ? user.uid : null}. Current store error before set: ${currentState.error}`);

      if (user) {
      set({ 
        user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
        await AsyncStorage.setItem('@user_id', user.uid);
        await AsyncStorage.setItem('@auth_type', 'firebase');
        await AsyncStorage.removeItem('@user_token');
      } else {
        try {
          const storedUserId = await AsyncStorage.getItem('@user_id');
          const authType = await AsyncStorage.getItem('@auth_type');
          const isNonFirebaseAuthenticated = false; // Assume false initially for non-firebase users on startup

          console.log('[checkAuth] No Firebase user. AsyncStorage check:', { storedUserId, authType, isNonFirebaseAuthenticated });
          // Get current store state AGAIN right before this specific set, in case it changed due to another parallel operation (less likely here but good for debugging)
          const currentStateInElse = get(); 
          console.log(`[authStore.onAuthStateChanged] ELSE block. Current store error before set: ${currentStateInElse.error}`);
          set(state => ({
            ...state,
            user: null,
            isAuthenticated: isNonFirebaseAuthenticated,
            isLoading: false,
          }));
        } catch (e) {
          console.error("[checkAuth] AsyncStorage error when checking non-Firebase auth:", e);
          set({ user: null, isAuthenticated: false, isLoading: false, error: 'Failed to check session' });
        }
      }
    });

    return unsubscribe;
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await getUserData(userCredential.user.uid, email);
      await AsyncStorage.removeItem('@user_id');
      await AsyncStorage.removeItem('@auth_type');
      set({ isLoading: false });
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
      await getUserData(userCredential.user.uid, email);
      await AsyncStorage.removeItem('@user_id');
      await AsyncStorage.removeItem('@auth_type');
      set({ isLoading: false });
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
      await AsyncStorage.removeItem('@user_id');
      await AsyncStorage.removeItem('@auth_type');
      await AsyncStorage.removeItem('@user_token');
      await AsyncStorage.removeItem('gameStore');
      resetUserStore();
      resetGameStore();
      useMeditationStore.getState().resetMeditationSession();
      set({ isAuthenticated: false, user: null, isLoading: false, error: null });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error signing out', 
        isLoading: false 
      });
      throw error;
    }
  },

  continueAsGuest: async () => {
    set({ isLoading: true });
    let guestId: string | null = null;
    try {
      guestId = uuidv4(); // Generate ID

      // Add check to satisfy TypeScript and ensure ID exists
      if (guestId) { 
        console.log(`[authStore] Attempting to set @user_id: ${guestId}`);
        await AsyncStorage.setItem('@user_id', guestId); // Store ID
        console.log(`[authStore] Finished setting @user_id`);

        console.log(`[authStore] Attempting to set @auth_type: anonymous`);
        await AsyncStorage.setItem('@auth_type', 'anonymous'); // Store auth type
        console.log(`[authStore] Finished setting @auth_type`);

        console.log('[authStore] Successfully stored guest info, updating state...');
        // Update state AFTER successful storage
        set({
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        // Should realistically never happen with uuidv4
        throw new Error('Failed to generate guest ID.'); 
      }

    } catch (error: any) {
      console.error("[authStore] Error during continueAsGuest:", error);
      set({
        user: null,
        error: error.message || 'Failed to start guest session',
        isLoading: false,
        isAuthenticated: false
      });
    }
  },

  firebaseSignInWithGoogle: async (idToken: string) => {
    set({ googleAuthLoading: true, googleAuthError: null });
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      set({ googleAuthLoading: false });
    } catch (error: any) {
      set({ googleAuthLoading: false, googleAuthError: error.message || 'Google sign-in failed' });
      throw error;
    }
  },
}));