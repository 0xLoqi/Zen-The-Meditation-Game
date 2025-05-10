import { create } from 'zustand';
import { User, DailyCheckIn, OutfitId } from '../types';
import * as userService from '../firebase/user';
import * as Animatable from 'react-native-animatable';
import { grant } from '../services/CosmeticsService';
import { useAuthStore } from './authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserData } from '../firebase/user';

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
  updateUserData: (dataToUpdate: Partial<User>) => Promise<void>;
  clearUserData: () => void;
}

let isFetchingUserData = false;

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
      const auth = useAuthStore.getState(); // Get the whole auth store state
      const firebaseUser = auth.user;      // Firebase auth user from the store

      let userId = firebaseUser?.uid;
      let userEmail = firebaseUser?.email ?? undefined;

      // Only try AsyncStorage if there's no Firebase user AND auth isn't currently loading.
      // This prevents fetching a guest ID if a Firebase login is in progress.
      if (!userId && !auth.isLoading) {
        console.log('[userStore.getUserData] No Firebase user and auth is not loading. Checking AsyncStorage for guest ID.');
        userId = await AsyncStorage.getItem('@user_id') || undefined;
        // If we get a userId from AsyncStorage here, it's a guest, so email should be undefined.
        if (userId) {
            userEmail = undefined; // Explicitly ensure email is not carried over for guest IDs from storage
        }
      }

      if (!userId) {
        console.log('[userStore.getUserData] No user ID found from Firebase auth or AsyncStorage. Aborting.');
        set({ isLoadingUser: false, userData: null }); // Clear userData if no ID
        // Optional: throw new Error('No authenticated user or guest session ID');
        return;
      }

      console.log(`[userStore.getUserData] Proceeding with userId: ${userId}, email: ${userEmail}`);
      const userDataFromService = await userService.getUserData(userId, userEmail);

      if (!userDataFromService) {
        console.error(`[userStore.getUserData] Failed to load or create user data for UID: ${userId}`);
        // Keep existing error state logic
        set({ userError: 'Failed to load or create user', isLoadingUser: false });
        return;
      }
      set({ userData: userDataFromService, isLoadingUser: false });
    } catch (error: any) {
      console.error('[userStore.getUserData] Error:', error);
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

  updateUserData: async (dataToUpdate: Partial<User>) => {
    const currentUserId = await AsyncStorage.getItem('@user_id');
    if (!currentUserId) {
      console.error('[updateUserData] No user ID found in storage. Cannot update.');
      throw new Error('User session not found for update.');
    }
    
    // Prevent setting isLoadingUser here, as it might interfere with AuthLoadingScreen logic
    // set({ isLoadingUser: true, userError: null });
    console.log(`[updateUserData] Updating user ${currentUserId} with:`, dataToUpdate);

    try {
      // Call the utility to merge data in Firestore
      await setUserData(currentUserId, dataToUpdate);
      console.log(`[updateUserData] Firestore updated for user ${currentUserId}.`);

      // Merge the update into the local state
      set((state) => ({
        userData: state.userData ? { ...state.userData, ...dataToUpdate } : (dataToUpdate as User), // Cast needed if initial state is null
        // isLoadingUser: false, // Don't set loading false here if not set true initially
        userError: null,
      }));
      console.log('[updateUserData] Local user store state updated.');

    } catch (error: any) {
      console.error(`[updateUserData] Failed to update user data for ${currentUserId}:`, error);
      set({
        // isLoadingUser: false,
        userError: error.message || 'Failed to update user data.',
      });
      throw error; // Re-throw error so calling function knows it failed
    }
  },

  clearUserData: () => {
    set({ userData: null, userError: null, isLoadingUser: false });
  },
}));

export const resetUserStore = () => {
  console.log('[resetUserStore] Called. Clearing user store state.');
  useUserStore.setState({
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
  });
};