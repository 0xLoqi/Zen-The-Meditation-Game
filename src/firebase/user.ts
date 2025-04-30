import { User, DailyCheckIn, OutfitId } from '../types';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

// Store the last date the Zenni+ Glowbag was granted (mock, not persisted)
let lastPlusGlowbagDate: string | null = null;

// Mock Firestore collection for friend codes (uid → code)
const friendCodes: Record<string, string> = {};

/**
 * Get user data from Firestore
 * @returns User data object or null if not found
 */
export const getUserData = async (uid: string, email?: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as User;
  } else {
    const newUser: User = {
      uid,
      username: email ? email.split('@')[0] : 'ZenUser',
      email: email || null,
      xp: 0,
      level: 1,
      tokens: 0,
      streak: 0,
      lastMeditationDate: null,
      outfits: ['default'],
      equippedOutfit: 'default',
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, newUser);
    return newUser;
  }
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
  const newCode = 'demo-code'; // Placeholder referral code
  mockUser.referralCode = newCode;
  
  return newCode;
};

export const getLastPlusGlowbagDate = async (): Promise<string | null> => {
  return lastPlusGlowbagDate;
};

export const setLastPlusGlowbagDate = async (date: string): Promise<void> => {
  lastPlusGlowbagDate = date;
};

export const setFriendCode = async (uid: string, code: string): Promise<void> => {
  friendCodes[uid] = code;
};

export const getFriendCode = async (uid: string): Promise<string | null> => {
  return friendCodes[uid] || null;
};

/**
 * Write a user's friend code to Firestore /friendCodes collection
 * @param uid - User ID
 * @param code - Friend code
 */
export const setFriendCodeFirestore = async (uid: string, code: string): Promise<void> => {
  // This function is no longer used in the mock system
};

/**
 * Fetch a user's friend code from Firestore /friendCodes collection
 * @param uid - User ID
 * @returns Friend code or null
 */
export const getFriendCodeFirestore = async (uid: string): Promise<string | null> => {
  // This function is no longer used in the mock system
  return null;
};

export const setUserData = async (uid: string, data: User): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
};