import { User, DailyCheckIn, OutfitId } from '../types';
import { generateReferralCode } from './auth';

// Mock user data for development
const mockUser: User = {
  uid: 'mock-user-123',
  username: 'ZenMaster',
  email: 'user@example.com',
  level: 5,
  xp: 350,
  tokens: 120,
  streak: 7,
  lastMeditationDate: new Date(),
  outfits: ['default', 'zen_master', 'nature_lover'],
  equippedOutfit: 'default',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  referralCode: 'ZEN-12345678'
};

// Mock check-in data
let mockCheckIn: DailyCheckIn | null = null;

/**
 * Get user data from Firestore
 * @returns User data object or null if not found
 */
export const getUserData = async (): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUser;
};

/**
 * Submit a daily mood check-in
 * @param rating - Mood rating (1-5)
 * @param reflection - Optional reflection text
 */
export const submitDailyCheckIn = async (rating: number, reflection?: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Create a new check-in
  mockCheckIn = {
    id: `check-in-${Date.now()}`,
    userId: mockUser.uid,
    date: new Date().toISOString(),
    rating,
    reflection: reflection || '',
    timestamp: new Date()
  };
  
  console.log('Check-in submitted:', mockCheckIn);
};

/**
 * Get today's check-in for the current user
 * @returns Today's check-in or null if none exists
 */
export const getTodayCheckIn = async (): Promise<DailyCheckIn | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCheckIn;
};

/**
 * Equip an outfit for the current user
 * @param outfitId - ID of the outfit to equip
 */
export const equipOutfit = async (outfitId: OutfitId): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  mockUser.equippedOutfit = outfitId;
  console.log(`Equipped outfit: ${outfitId}`);
};

/**
 * Get user's current streak
 * @returns Number of days in streak
 */
export const getUserStreak = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockUser.streak;
};

/**
 * Get user's current XP
 * @returns User's XP
 */
export const getUserXP = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockUser.xp;
};

/**
 * Get user's current tokens
 * @returns User's tokens
 */
export const getUserTokens = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockUser.tokens;
};

/**
 * Get user's current level
 * @returns User's level
 */
export const getUserLevel = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockUser.level;
};

/**
 * Get user's referral code
 * @returns User's referral code
 */
export const getReferralCode = async (): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (mockUser.referralCode) {
    return mockUser.referralCode;
  }
  
  // Generate a new code if none exists
  const newCode = generateReferralCode(mockUser.uid);
  mockUser.referralCode = newCode;
  
  return newCode;
};