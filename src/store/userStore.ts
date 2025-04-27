import { create } from 'zustand';
import { User, DailyCheckIn, OutfitId } from '../types';
import * as userService from '../firebase/user';
import * as Animatable from 'react-native-animatable';
import { grant } from '../services/CosmeticsService';
import { useAuthStore } from './authStore';

interface UserState {
  userData: User | null;
  todayCheckIn: DailyCheckIn | null;
  isLoadingUser: boolean;
  isLoadingCheckIn: boolean;
  userError: string | null;
  checkInError: string | null;
  checkInSubmitted: boolean;
  referralCode: string;
  isPlus: boolean;
  screenTime?: number;
  reduceTikTok?: boolean;
  soundPackId?: 'rain' | 'waves' | 'silence';
  isPremium: boolean;
  setScreenTime: (minutes: number) => void;
  setReduceTikTok: (reduce: boolean) => void;
  setSoundPackId: (id: 'rain' | 'waves' | 'silence') => void;
  setPremium: (value: boolean) => void;
  getUserData: () => Promise<void>;
  getTodayCheckIn: () => Promise<void>;
  submitDailyCheckIn: (rating: number, reflection?: string) => Promise<void>;
  equipOutfit: (outfitId: OutfitId) => Promise<void>;
  getReferralCode: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  todayCheckIn: null,
  isLoadingUser: false,
  isLoadingCheckIn: false,
  userError: null,
  checkInError: null,
  checkInSubmitted: false,
  referralCode: '',
  isPlus: false,
  screenTime: undefined,
  reduceTikTok: undefined,
  soundPackId: 'rain',
  isPremium: false,
  setScreenTime: (minutes: number) => set({ screenTime: minutes }),
  setReduceTikTok: (reduce: boolean) => set({ reduceTikTok: reduce }),
  setSoundPackId: (id) => set({ soundPackId: id }),
  setPremium: (value) => set({ isPremium: value }),
  
  getUserData: async () => {
    try {
      set({ isLoadingUser: true, userError: null });
      const { user } = useAuthStore.getState();
      if (!user || !user.uid) throw new Error('No authenticated user');
      let userData = await userService.getUserData(user.uid, user.email ?? undefined);
      if (!userData) {
        // User does not exist; create and use initial state
        const initialUserData = {
          user: {
            name: '',
            element: '',
            trait: '',
            email: user.email ?? '',
            motivation: '',
          },
          friends: [],
          progress: {
            streak: 0,
            xp: 0,
            lastMeditatedAt: '',
            tokens: 0,
          },
          cosmetics: {
            owned: [],
            equipped: {
              outfit: '',
              headgear: '',
              aura: '',
            },
          },
          achievements: {
            unlocked: [],
          },
          quests: {
            dailyQuests: [],
            progress: {},
            lastReset: '',
          },
          firstMeditationRewarded: false,
          lowPowerMode: false,
        };
        await userService.syncUserDoc(user.uid, initialUserData);
        set({ userData: initialUserData, isLoadingUser: false });
        return;
      }
      set({ userData, isLoadingUser: false });
    } catch (error: any) {
      set({ userError: error.message, isLoadingUser: false });
    }
  },
  
  getTodayCheckIn: async () => {
    try {
      set({ isLoadingCheckIn: true, checkInError: null });
      const checkIn = await userService.getTodayCheckIn();
      set({ todayCheckIn: checkIn, isLoadingCheckIn: false });
    } catch (error: any) {
      set({ checkInError: error.message, isLoadingCheckIn: false });
    }
  },
  
  submitDailyCheckIn: async (rating: number, reflection: string = '') => {
    try {
      set({ isLoadingCheckIn: true, checkInError: null });
      await userService.submitDailyCheckIn(rating, reflection);
      
      // Create new check-in object for the UI
      const newCheckIn: DailyCheckIn = {
        id: `checkin-${Date.now()}`,
        userId: get().userData?.id || 'unknown',
        date: new Date().toISOString(), // Add the required date field
        rating,
        reflection,
        timestamp: new Date(),
      };
      
      set({ 
        todayCheckIn: newCheckIn, 
        isLoadingCheckIn: false, 
        checkInSubmitted: true 
      });

      // Zenni+ Glowbag: grant epic if isPlus and not already granted today
      const { isPlus } = get();
      const today = new Date().toISOString().slice(0, 10);
      const lastPlusGlowbag = await userService.getLastPlusGlowbagDate?.();
      if (isPlus && lastPlusGlowbag !== today) {
        grant('glowbag_epic');
        if (userService.setLastPlusGlowbagDate) {
          await userService.setLastPlusGlowbagDate(today);
        }
      }

      // Refresh user data after check-in
      get().getUserData();
    } catch (error: any) {
      set({ 
        checkInError: error.message, 
        isLoadingCheckIn: false 
      });
    }
  },
  
  equipOutfit: async (outfitId: OutfitId) => {
    try {
      set({ isLoadingUser: true, userError: null });
      await userService.equipOutfit(outfitId);
      
      // Update user data with new outfit
      const currentUserData = get().userData;
      if (currentUserData) {
        set({
          userData: {
            ...currentUserData,
            equippedOutfit: outfitId,
          },
          isLoadingUser: false,
        });
      }
    } catch (error: any) {
      set({ userError: error.message, isLoadingUser: false });
    }
  },
  
  getReferralCode: async () => {
    try {
      const code = await userService.getReferralCode();
      set({ referralCode: code });
    } catch (error: any) {
      // Don't set an error state for referral code
      console.error('Failed to get referral code:', error);
    }
  },
}));