import { create } from 'zustand';
import { MeditationType, MeditationDuration } from '../types';
import * as meditationService from '../firebase/meditation';
import { getMicroLesson } from '../constants/microLessons';
import * as Animatable from 'react-native-animatable';
import { useUserStore } from './userStore';

interface MeditationState {
  isLoading: boolean;
  error: string | null;
  selectedType: MeditationType | null;
  selectedDuration: MeditationDuration | null;
  breathScore: number;
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
  didUseBreathTracking: boolean;
  sessionCompleted: boolean;
  microLesson: string;
  isFirstMeditationOfDay: boolean | null;
  
  selectMeditationSettings: (type: MeditationType, duration: MeditationDuration) => void;
  submitMeditationSession: (breathScore: number, didUseBreathTracking: boolean) => Promise<void>;
  resetMeditationSession: () => void;
}

export const useMeditationStore = create<MeditationState>((set, get) => ({
  isLoading: false,
  error: null,
  selectedType: null,
  selectedDuration: null,
  breathScore: 0,
  xpGained: 0,
  tokensEarned: 0,
  streakUpdated: 0,
  leveledUp: false,
  didUseBreathTracking: false,
  sessionCompleted: false,
  microLesson: '',
  isFirstMeditationOfDay: null,
  
  selectMeditationSettings: (type: MeditationType, duration: MeditationDuration) => {
    set({
      selectedType: type,
      selectedDuration: duration,
      microLesson: getMicroLesson(type),
    });
  },
  
  submitMeditationSession: async (breathScore: number, didUseBreathTracking: boolean) => {
    const { selectedType, selectedDuration } = get();
    
    if (!selectedType || !selectedDuration) {
      set({ error: 'No meditation type or duration selected' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      const result = await meditationService.submitMeditationSession(
        selectedType,
        selectedDuration,
        breathScore,
        didUseBreathTracking
      );
      
      set({
        isLoading: false,
        breathScore,
        xpGained: result.xpGained,
        tokensEarned: result.tokensEarned,
        streakUpdated: result.streakUpdated,
        leveledUp: result.leveledUp,
        didUseBreathTracking,
        sessionCompleted: true,
        isFirstMeditationOfDay: result.isFirstMeditationOfDay,
      });
      
      // Update user data after meditation session
      const getUserData = useUserStore.getState().getUserData;
      getUserData();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },
  
  resetMeditationSession: () => {
    set({
      selectedType: null,
      selectedDuration: null,
      breathScore: 0,
      xpGained: 0,
      tokensEarned: 0,
      streakUpdated: 0,
      leveledUp: false,
      didUseBreathTracking: false,
      sessionCompleted: false,
      isFirstMeditationOfDay: null,
      microLesson: '',
      error: null,
    });
  },
}));