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
    console.log('[STORE] submitMeditationSession called', { selectedType, selectedDuration, breathScore, didUseBreathTracking });
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
      console.log('[STORE] meditationService result', result);
      console.log('[STORE] Setting sessionCompleted: true');
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
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to complete meditation session',
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