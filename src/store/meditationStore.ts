import create from 'zustand';
import { 
  submitMeditationSession as apiSubmitMeditationSession,
  calculateSessionRewards as apiCalculateSessionRewards
} from '../api/meditation';
import { MeditationType, MeditationDuration, MeditationSession } from '../types';
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
  
  selectMeditationSettings: (type, duration) => {
    set({ 
      selectedType: type, 
      selectedDuration: duration,
      sessionCompleted: false,
      breathScore: 0,
      xpGained: 0,
      tokensEarned: 0,
      streakUpdated: 0,
      leveledUp: false
    });
  },
  
  submitMeditationSession: async (breathScore, didUseBreathTracking) => {
    const { selectedType, selectedDuration } = get();
    
    if (!selectedType || !selectedDuration) {
      set({ error: 'Meditation settings not selected' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const result = await apiSubmitMeditationSession(
        selectedType,
        selectedDuration,
        breathScore,
        didUseBreathTracking
      );
      
      // Get a micro lesson based on the selected meditation type
      const microLesson = getMicroLesson(selectedType);
      
      set({
        breathScore,
        didUseBreathTracking,
        xpGained: result.xpGained,
        tokensEarned: result.tokensEarned,
        streakUpdated: result.streakUpdated,
        leveledUp: result.leveledUp,
        sessionCompleted: true,
        isLoading: false,
        microLesson
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
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
      error: null
    });
  }
}));
