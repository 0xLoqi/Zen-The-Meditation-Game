import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MiniZenniTrait {
  id: string;
  name: string;
  description: string;
  behaviorEffect: string;
}

export interface MiniZenniColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface MiniZenniState {
  name: string | null;
  colorScheme: MiniZenniColor | null;
  trait: MiniZenniTrait | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setMiniZenniName: (name: string) => void;
  setColorScheme: (colorScheme: MiniZenniColor) => void;
  setTrait: (trait: MiniZenniTrait) => void;
  initializeMiniZenni: () => Promise<void>;
  saveMiniZenni: () => Promise<void>;
}

export const useMiniZenniStore = create<MiniZenniState>((set, get) => ({
  name: null,
  colorScheme: null,
  trait: null,
  isInitialized: false,
  isLoading: true,
  error: null,

  setMiniZenniName: (name: string) => {
    set({ name });
  },

  setColorScheme: (colorScheme: MiniZenniColor) => {
    set({ colorScheme });
  },

  setTrait: (trait: MiniZenniTrait) => {
    set({ trait });
  },

  initializeMiniZenni: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const storedData = await AsyncStorage.getItem('miniZenni');
      if (storedData) {
        const data = JSON.parse(storedData);
        set({
          name: data.name,
          colorScheme: data.colorScheme,
          trait: data.trait,
          isInitialized: true,
        });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to initialize Mini Zenni',
      });
    }
  },

  saveMiniZenni: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { name, colorScheme, trait } = get();
      await AsyncStorage.setItem('miniZenni', JSON.stringify({
        name,
        colorScheme,
        trait,
      }));
      
      set({ isInitialized: true, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to save Mini Zenni',
      });
    }
  },
})); 