import { create } from 'zustand';
import { MeditationType, MeditationDuration } from '../types';
import * as meditationApi from '../api/meditation';
import { getMicroLesson } from '../constants/microLessons';

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
  
  selectMeditationSettings: (type: MeditationType, duration: MeditationDuration) => void;
  submitMeditationSession: (breathScore: number, didUseBreathTracking: boolean) => Promise<void>;
  resetMeditationSession: () => void;
}

// Helper functions for calculating rewards
const calculateXP = (duration: MeditationDuration, breathScore: number): number => {
  // Base XP based on duration
  const baseXP = duration === 5 ? 25 : 50;
  
  // Bonus XP based on breath score (up to 100% bonus)
  const breathBonus = Math.floor(baseXP * (breathScore / 100));
  
  return baseXP + breathBonus;
};

const calculateTokens = (duration: MeditationDuration, breathScore: number): number => {
  // Tokens are usually fewer than XP
  // Base tokens based on duration
  const baseTokens = duration === 5 ? 5 : 10;
  
  // Bonus tokens based on breath score (up to 50% bonus)
  const breathBonus = Math.floor(baseTokens * (breathScore / 200));
  
  return baseTokens + breathBonus;
};

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
      
      const result = await meditationApi.submitMeditationSession(
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
      });
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
      microLesson: '',
      error: null,
    });
  },
}));