import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseFunctions } from './firebase';
import { User, DailyCheckIn, OutfitId } from '../types';

// Get current user data
export const getUserData = async (): Promise<User | null> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }
    
    const firestore = getFirebaseFirestore();
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Submit daily check-in
export const submitDailyCheckIn = async (rating: number, reflection?: string): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const firestore = getFirebaseFirestore();
    
    // Add check-in to history
    await addDoc(collection(firestore, 'checkIns'), {
      userId: user.uid,
      rating,
      reflection: reflection || '',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error submitting daily check-in:', error);
    throw error;
  }
};

// Get today's check-in if it exists
export const getTodayCheckIn = async (): Promise<DailyCheckIn | null> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }
    
    const firestore = getFirebaseFirestore();
    
    // Get start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStart = Timestamp.fromDate(today);
    const todayEnd = Timestamp.fromDate(tomorrow);
    
    // Query check-ins for today
    const checkInsRef = collection(firestore, 'checkIns');
    const q = query(
      checkInsRef,
      where('userId', '==', user.uid),
      where('timestamp', '>=', todayStart),
      where('timestamp', '<', todayEnd),
      orderBy('timestamp', 'desc'),
      // limit(1) // Not needed as we'll just take the first one if multiple exist
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const checkInDoc = querySnapshot.docs[0];
    return { id: checkInDoc.id, ...checkInDoc.data() } as DailyCheckIn;
  } catch (error) {
    console.error('Error fetching today\'s check-in:', error);
    throw error;
  }
};

// Equip an outfit for Mini Zenni
export const equipOutfit = async (outfitId: OutfitId): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userData = await getUserData();
    
    if (!userData) {
      throw new Error('User data not found');
    }
    
    // Check if outfit is unlocked
    if (!userData.unlockedOutfits.includes(outfitId)) {
      throw new Error('Outfit not unlocked');
    }
    
    const firestore = getFirebaseFirestore();
    
    // Update the equipped outfit
    await updateDoc(doc(firestore, 'users', user.uid), {
      equippedOutfit: outfitId
    });
  } catch (error) {
    console.error('Error equipping outfit:', error);
    throw error;
  }
};

// Get user streak
export const getUserStreak = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.streak || 0;
  } catch (error) {
    console.error('Error getting user streak:', error);
    throw error;
  }
};

// Get user XP
export const getUserXP = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.xp || 0;
  } catch (error) {
    console.error('Error getting user XP:', error);
    throw error;
  }
};

// Get user tokens
export const getUserTokens = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.tokens || 0;
  } catch (error) {
    console.error('Error getting user tokens:', error);
    throw error;
  }
};

// Get user level
export const getUserLevel = async (): Promise<number> => {
  try {
    const userData = await getUserData();
    return userData?.level || 1;
  } catch (error) {
    console.error('Error getting user level:', error);
    throw error;
  }
};

// Get user referral code
export const getReferralCode = async (): Promise<string> => {
  try {
    const userData = await getUserData();
    return userData?.referralCode || '';
  } catch (error) {
    console.error('Error getting referral code:', error);
    throw error;
  }
};
