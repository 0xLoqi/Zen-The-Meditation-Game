import { MeditationType, MeditationDuration } from '../types';
import { getFirebaseFirestore } from './firebase';

interface MeditationResult {
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
}

export const submitMeditationSession = async (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number,
  didUseBreathTracking: boolean
): Promise<MeditationResult> => {
  try {
    // In a real app, this would save the meditation session to Firestore
    console.log('Submitting meditation session:', {
      type,
      duration,
      breathScore,
      didUseBreathTracking,
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate rewards
    const result = calculateSessionRewards(type, duration, breathScore);
    
    return result;
  } catch (error: any) {
    console.error('Error submitting meditation session:', error);
    throw new Error('Failed to submit meditation session');
  }
};

export const calculateSessionRewards = (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number
): MeditationResult => {
  // Base XP based on duration
  const baseXP = duration === 5 ? 25 : 50;
  
  // Bonus XP based on breath score (up to 100% bonus)
  const breathBonus = Math.floor(baseXP * (breathScore / 100));
  const xpGained = baseXP + breathBonus;
  
  // Tokens are usually fewer than XP
  const baseTokens = duration === 5 ? 5 : 10;
  const tokenBonus = Math.floor(baseTokens * (breathScore / 200));
  const tokensEarned = baseTokens + tokenBonus;
  
  // Mock streak update and level up
  const streakUpdated = Math.random() > 0.7 ? 1 : 0; // 30% chance the streak was already updated today
  const leveledUp = Math.random() > 0.9; // 10% chance of leveling up
  
  return {
    xpGained,
    tokensEarned,
    streakUpdated,
    leveledUp,
  };
};

/**
 * Calculate the amount of XP needed for the next level
 * Uses a simple formula: nextLevel * 100
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  return (currentLevel + 1) * 100;
};