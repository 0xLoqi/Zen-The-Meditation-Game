import { User, DailyCheckIn, OutfitId } from '../types';

// Mock user for development
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

// Mock check-in
const mockCheckIn: DailyCheckIn = {
  id: 'mock-check-in-id',
  userId: 'mock-user-id',
  rating: 4,
  reflection: 'Feeling peaceful today',
  timestamp: new Date(),
};

export const getUserData = async (): Promise<User | null> => {
  try {
    // In a real app, this would fetch the user's data from Firestore
    // For now, return mock data
    return mockUser;
  } catch (error: any) {
    console.error('Error getting user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

export const submitDailyCheckIn = async (rating: number, reflection?: string): Promise<void> => {
  try {
    // In a real app, this would save the check-in to Firestore
    console.log('Submitting daily check-in:', { rating, reflection });
    // Simulate a small delay for the API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  } catch (error: any) {
    console.error('Error submitting daily check-in:', error);
    throw new Error('Failed to submit daily check-in');
  }
};

export const getTodayCheckIn = async (): Promise<DailyCheckIn | null> => {
  try {
    // In a real app, this would fetch today's check-in from Firestore if it exists
    // For now, randomly return a check-in or null to simulate both states
    const hasCheckedIn = Math.random() > 0.7; // 30% chance of having already checked in
    return hasCheckedIn ? mockCheckIn : null;
  } catch (error: any) {
    console.error('Error getting today\'s check-in:', error);
    throw new Error('Failed to fetch today\'s check-in');
  }
};

export const equipOutfit = async (outfitId: OutfitId): Promise<void> => {
  try {
    // In a real app, this would update the user's equipped outfit in Firestore
    console.log('Equipping outfit:', outfitId);
    // Simulate a small delay for the API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  } catch (error: any) {
    console.error('Error equipping outfit:', error);
    throw new Error('Failed to equip outfit');
  }
};

export const getUserStreak = async (): Promise<number> => {
  try {
    // In a real app, this would be calculated from the user's meditation history
    return mockUser.streak;
  } catch (error: any) {
    console.error('Error getting user streak:', error);
    throw new Error('Failed to fetch user streak');
  }
};

export const getUserXP = async (): Promise<number> => {
  try {
    return mockUser.xp;
  } catch (error: any) {
    console.error('Error getting user XP:', error);
    throw new Error('Failed to fetch user XP');
  }
};

export const getUserTokens = async (): Promise<number> => {
  try {
    return mockUser.tokens;
  } catch (error: any) {
    console.error('Error getting user tokens:', error);
    throw new Error('Failed to fetch user tokens');
  }
};

export const getUserLevel = async (): Promise<number> => {
  try {
    return mockUser.level;
  } catch (error: any) {
    console.error('Error getting user level:', error);
    throw new Error('Failed to fetch user level');
  }
};

export const getReferralCode = async (): Promise<string> => {
  try {
    return mockUser.referralCode;
  } catch (error: any) {
    console.error('Error getting referral code:', error);
    throw new Error('Failed to fetch referral code');
  }
};