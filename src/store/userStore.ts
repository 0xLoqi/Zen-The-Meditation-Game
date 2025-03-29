import { create } from 'zustand';
import { User, DailyCheckIn, OutfitId } from '../types';
import * as userService from '../firebase/user';
import * as Animatable from 'react-native-animatable';

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
      const userData = await userService.getUserData();
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