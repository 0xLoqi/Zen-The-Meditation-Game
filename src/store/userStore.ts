import create from 'zustand';
import { 
  getUserData as apiGetUserData, 
  submitDailyCheckIn as apiSubmitDailyCheckIn,
  getTodayCheckIn as apiGetTodayCheckIn,
  equipOutfit as apiEquipOutfit,
  getReferralCode as apiGetReferralCode
} from '../api/user';
import { User, DailyCheckIn, OutfitId } from '../types';

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
    set({ isLoadingUser: true, userError: null });
    try {
      const userData = await apiGetUserData();
      set({ userData, isLoadingUser: false });
    } catch (error: any) {
      set({ userError: error.message, isLoadingUser: false });
    }
  },
  
  getTodayCheckIn: async () => {
    set({ isLoadingCheckIn: true, checkInError: null });
    try {
      const todayCheckIn = await apiGetTodayCheckIn();
      set({ 
        todayCheckIn, 
        isLoadingCheckIn: false,
        checkInSubmitted: !!todayCheckIn
      });
    } catch (error: any) {
      set({ checkInError: error.message, isLoadingCheckIn: false });
    }
  },
  
  submitDailyCheckIn: async (rating, reflection) => {
    set({ isLoadingCheckIn: true, checkInError: null });
    try {
      await apiSubmitDailyCheckIn(rating, reflection);
      
      // Refresh the check-in data
      await get().getTodayCheckIn();
      
      set({ checkInSubmitted: true, isLoadingCheckIn: false });
    } catch (error: any) {
      set({ checkInError: error.message, isLoadingCheckIn: false });
    }
  },
  
  equipOutfit: async (outfitId) => {
    set({ isLoadingUser: true, userError: null });
    try {
      await apiEquipOutfit(outfitId);
      
      // Refresh user data to get updated outfit
      await get().getUserData();
    } catch (error: any) {
      set({ userError: error.message, isLoadingUser: false });
    }
  },
  
  getReferralCode: async () => {
    try {
      const code = await apiGetReferralCode();
      set({ referralCode: code });
    } catch (error: any) {
      set({ userError: error.message });
    }
  }
}));
