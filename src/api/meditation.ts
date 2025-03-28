import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseFunctions } from './firebase';
import { MeditationType, MeditationDuration, MeditationSession } from '../types';

// Submit a completed meditation session
export const submitMeditationSession = async (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number,
  didUseBreathTracking: boolean
): Promise<{
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
}> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const firestore = getFirebaseFirestore();
    
    // Add meditation session to history
    await addDoc(collection(firestore, 'meditationSessions'), {
      userId: user.uid,
      type,
      duration,
      breathScore,
      didUseBreathTracking,
      timestamp: new Date()
    });
    
    // Call cloud function to update user stats
    const functions = getFirebaseFunctions();
    const updateUserStats = httpsCallable(functions, 'updateUserStats');
    const result = await updateUserStats({
      userId: user.uid,
      sessionType: type,
      sessionDuration: duration,
      breathScore,
      didUseBreathTracking
    });
    
    return result.data as {
      xpGained: number;
      tokensEarned: number;
      streakUpdated: number;
      leveledUp: boolean;
    };
  } catch (error) {
    console.error('Error submitting meditation session:', error);
    throw error;
  }
};

// Calculate the rewards for a meditation session (preview)
export const calculateSessionRewards = (
  type: MeditationType,
  duration: MeditationDuration,
  breathScore: number,
  didUseBreathTracking: boolean
): { xp: number; tokens: number } => {
  // Base rewards
  let baseXP = 0;
  let baseTokens = 0;
  
  // Duration-based rewards
  switch (duration) {
    case 5:
      baseXP = 10;
      baseTokens = 5;
      break;
    case 10:
      baseXP = 20;
      baseTokens = 10;
      break;
    default:
      baseXP = 10;
      baseTokens = 5;
  }
  
  // Type multiplier
  const typeMultiplier = type === 'Focus' ? 1.2 : 1.0;
  
  // Breath tracking bonus (if used)
  const trackingMultiplier = didUseBreathTracking ? 1.0 + (breathScore / 100) : 1.0;
  
  // Calculate final rewards
  const xp = Math.round(baseXP * typeMultiplier * trackingMultiplier);
  const tokens = Math.round(baseTokens * typeMultiplier * trackingMultiplier);
  
  return { xp, tokens };
};

// Get the XP required for the next level
export const getXPForNextLevel = (currentLevel: number): number => {
  // Simple formula: 100 * level
  return currentLevel * 100;
};
