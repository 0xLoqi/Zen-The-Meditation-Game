import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { auth, firestore } from './config';
import { User, DailyCheckIn, OutfitId } from '../types';

/**
 * Get user data from Firestore
 * @returns User data object or null if not found
 */
export const getUserData = async (): Promise<User | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userDoc = doc(firestore, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userSnapshot.data();
    
    // Convert Timestamp objects to Date objects
    const lastMeditationDate = userData.lastMeditationDate 
      ? userData.lastMeditationDate.toDate() 
      : null;
    const createdAt = userData.createdAt.toDate();
    
    return {
      ...userData,
      lastMeditationDate,
      createdAt
    } as User;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Submit a daily mood check-in
 * @param rating - Mood rating (1-5)
 * @param reflection - Optional reflection text
 */
export const submitDailyCheckIn = async (rating: number, reflection?: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const checkInCollection = collection(firestore, 'checkIns');
    const newCheckInDoc = doc(checkInCollection);
    
    const checkInData: DailyCheckIn = {
      id: newCheckInDoc.id,
      userId: currentUser.uid,
      rating,
      reflection: reflection || '',
      timestamp: new Date(),
    };
    
    await setDoc(newCheckInDoc, {
      ...checkInData,
      timestamp: Timestamp.fromDate(checkInData.timestamp),
    });
  } catch (error) {
    console.error('Error submitting check-in:', error);
    throw new Error('Failed to submit check-in');
  }
};

/**
 * Get today's check-in for the current user
 * @returns Today's check-in or null if none exists
 */
export const getTodayCheckIn = async (): Promise<DailyCheckIn | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    // Calculate the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get the end of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Query for check-ins within today
    const checkInsCollection = collection(firestore, 'checkIns');
    const q = query(
      checkInsCollection,
      where('userId', '==', currentUser.uid),
      where('timestamp', '>=', Timestamp.fromDate(today)),
      where('timestamp', '<', Timestamp.fromDate(tomorrow))
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Should only be one check-in per day, so get the first one
    const checkInData = querySnapshot.docs[0].data();
    
    return {
      ...checkInData,
      timestamp: checkInData.timestamp.toDate(),
    } as DailyCheckIn;
  } catch (error) {
    console.error('Error getting today check-in:', error);
    return null;
  }
};

/**
 * Equip an outfit for the current user
 * @param outfitId - ID of the outfit to equip
 */
export const equipOutfit = async (outfitId: OutfitId): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userDoc = doc(firestore, 'users', currentUser.uid);
    await updateDoc(userDoc, {
      equippedOutfit: outfitId,
    });
  } catch (error) {
    console.error('Error equipping outfit:', error);
    throw new Error('Failed to equip outfit');
  }
};

/**
 * Get user's current streak
 * @returns Number of days in streak
 */
export const getUserStreak = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.streak || 0;
  } catch (error) {
    console.error('Error getting user streak:', error);
    return 0;
  }
};

/**
 * Get user's current XP
 * @returns User's XP
 */
export const getUserXP = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.xp || 0;
  } catch (error) {
    console.error('Error getting user XP:', error);
    return 0;
  }
};

/**
 * Get user's current tokens
 * @returns User's tokens
 */
export const getUserTokens = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.tokens || 0;
  } catch (error) {
    console.error('Error getting user tokens:', error);
    return 0;
  }
};

/**
 * Get user's current level
 * @returns User's level
 */
export const getUserLevel = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.level || 1;
  } catch (error) {
    console.error('Error getting user level:', error);
    return 1;
  }
};

/**
 * Get user's referral code
 * @returns User's referral code
 */
export const getReferralCode = async (): Promise<string> => {
  try {
    const userData = await getUserData();
    return userData?.referralCode || '';
  } catch (error) {
    console.error('Error getting referral code:', error);
    return '';
  }
};