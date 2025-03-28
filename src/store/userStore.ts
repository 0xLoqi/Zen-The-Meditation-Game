import { create } from 'zustand';
import { User, DailyCheckIn, OutfitId } from '../types';
import * as userApi from '../api/user';

interface UserState {
  userData: User | null;
  todayCheckIn: DailyCheckIn | null;
  isLoadingUser: boolean;
  isLoadingCheckIn: boolean;
  userError: string | null;
  checkInError: string | null;
  checkInSubmitted: boolean;
  referralCode: string;
  getUserData: () => Promise<void>;
  getTodayCheckIn: () => Promise<void>;
  submitDailyCheckIn: (rating: number, reflection?: string) => Promise<void>;
  equipOutfit: (outfitId: OutfitId) => Promise<void>;
  getReferralCode: () => Promise<void>;
}

// Mock user data for development purposes
const mockUser: User = {
  id: 'mock-user-id',
  username: 'ZenMaster',
  email: 'user@example.com',
  level: 5,
  xp: 350,
  tokens: 120,
  streak: 7,
  lastMeditationDate: new Date(),
  equippedOutfit: 'default',
  unlockedOutfits: ['default', 'zen_master'],
  referralCode: 'ZENMASTER123',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
};

export const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  todayCheckIn: null,
  isLoadingUser: false,
  isLoadingCheckIn: false,
  userError: null,
  checkInError: null,
  checkInSubmitted: false,
  referralCode: '',
  
  getUserData: async () => {
    try {
      set({ isLoadingUser: true, userError: null });
      const userData = await userApi.getUserData();
      set({ userData, isLoadingUser: false });
    } catch (error: any) {
      set({ userError: error.message, isLoadingUser: false });
    }
  },
  
  getTodayCheckIn: async () => {
    try {
      set({ isLoadingCheckIn: true, checkInError: null });
      const checkIn = await userApi.getTodayCheckIn();
      set({ todayCheckIn: checkIn, isLoadingCheckIn: false });
    } catch (error: any) {
      set({ checkInError: error.message, isLoadingCheckIn: false });
    }
  },
  
  submitDailyCheckIn: async (rating: number, reflection: string = '') => {
    try {
      set({ isLoadingCheckIn: true, checkInError: null });
      await userApi.submitDailyCheckIn(rating, reflection);
      
      // Create new check-in object for the UI
      const newCheckIn: DailyCheckIn = {
        id: `checkin-${Date.now()}`,
        userId: get().userData?.id || 'unknown',
        rating,
        reflection,
        timestamp: new Date(),
      };
      
      set({ 
        todayCheckIn: newCheckIn, 
        isLoadingCheckIn: false, 
        checkInSubmitted: true 
      });
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
      await userApi.equipOutfit(outfitId);
      
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
      const code = await userApi.getReferralCode();
      set({ referralCode: code });
    } catch (error: any) {
      // Don't set an error state for referral code
      console.error('Failed to get referral code:', error);
    }
  },
}));