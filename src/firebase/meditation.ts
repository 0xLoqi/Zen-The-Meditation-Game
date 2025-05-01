import { MeditationType, MeditationDuration } from '../types';
import { getUserData } from './user';

// Mock user data is imported from the user module

export interface MeditationResult {
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
  isFirstMeditationOfDay: boolean;
}

// Keep track of the user's meditation sessions
const mockMeditationSessions: any[] = [];

/**
 * Submit a completed meditation session
 * @param type - Type of meditation completed
 * @param duration - Duration of meditation in minutes
 * @param breathScore - Score from breath tracking (0-100)
 * @param didUseBreathTracking - Whether user used breath tracking
 * @returns Results of the session (XP, tokens, etc.)
 */
export const submitMeditationSession = async (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number,
  didUseBreathTracking: boolean
): Promise<MeditationResult & { isFirstMeditationOfDay: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get the current user data
  const userData = await getUserData();
  if (!userData) {
    throw new Error('User data not found');
  }
  
  // Calculate rewards
  const result = calculateSessionRewards(
    type,
    duration,
    breathScore,
    userData.streak
  );
  
  // Create a session record
  const newSession = {
    id: `session-${Date.now()}`,
    userId: userData.uid,
    type,
    duration,
    breathScore,
    didUseBreathTracking,
    timestamp: new Date(),
  };
  
  // Add to our mock sessions
  mockMeditationSessions.push(newSession);
  
  // Check if we need to update streak
  const now = new Date();
  let newStreak = userData.streak;
  let isFirst = false;
  
  // If there's a last meditation date and it's not today, check if we need to increment streak
  if (userData.lastMeditationDate) {
    const lastMeditationDate = new Date(userData.lastMeditationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastMedDate = new Date(lastMeditationDate);
    lastMedDate.setHours(0, 0, 0, 0);
    
    // If the last meditation was yesterday, increment streak
    if (lastMedDate.getTime() === yesterday.getTime()) {
      newStreak = userData.streak + 1;
      isFirst = true;
    } 
    // If the last meditation was before yesterday, reset streak to 1
    else if (lastMedDate.getTime() < yesterday.getTime()) {
      newStreak = 1;
      isFirst = true;
    } else {
      isFirst = false;
    }
  } else {
    // First meditation ever, start streak at 1
    newStreak = 1;
    isFirst = true;
  }
  
  // Calculate new XP and check for level up
  const newXP = userData.xp + result.xpGained;
  const xpForNextLevel = getXPForNextLevel(userData.level);
  const leveledUp = newXP >= xpForNextLevel;
  const newLevel = leveledUp ? userData.level + 1 : userData.level;
  
  // Calculate new tokens
  const newTokens = userData.tokens + result.tokensEarned;
  
  // Update the mock user data
  userData.xp = newXP;
  userData.level = newLevel;
  userData.tokens = newTokens;
  userData.streak = newStreak;
  userData.lastMeditationDate = now;
  
  return {
    xpGained: result.xpGained,
    tokensEarned: result.tokensEarned,
    streakUpdated: newStreak,
    leveledUp,
    isFirstMeditationOfDay: isFirst,
  };
};

/**
 * Calculate rewards for a meditation session
 * @param type - Type of meditation
 * @param duration - Duration in minutes
 * @param breathScore - Score from breath tracking (0-100)
 * @param currentStreak - User's current streak
 * @returns Calculated rewards
 */
export const calculateSessionRewards = (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number,
  currentStreak: number
): Omit<MeditationResult, 'isFirstMeditationOfDay'> => {
  // Base XP is determined by duration and type
  let baseXP = duration * 5;
  
  // Different types might give different rewards
  if (type === 'focus') {
    baseXP += 5;
  } else if (type === 'calm') {
    baseXP += 3;
  }
  
  // Add bonus for breath score
  const breathBonus = Math.floor(breathScore / 10);
  
  // Streak bonus (every 5 days gives a 10% bonus, with a cap of 100%)
  const streakMultiplier = Math.min(2, 1 + Math.floor(currentStreak / 5) * 0.1);
  
  // Calculate total XP and tokens
  const totalXP = Math.floor((baseXP + breathBonus) * streakMultiplier);
  const tokens = Math.floor(totalXP / 10) + 1; // 1 token per 10 XP, minimum 1
  
  return {
    xpGained: totalXP,
    tokensEarned: tokens,
    streakUpdated: currentStreak, // This will be updated in the submitMeditationSession function
    leveledUp: false, // This will be determined in the submitMeditationSession function
  };
};

/**
 * Calculate the amount of XP needed for the next level
 * Uses a simple formula: nextLevel * 100
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  return (currentLevel + 1) * 100;
};