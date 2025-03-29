import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from './config';

// Firebase user type definition
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

/**
 * Check if a username is available
 * @param username - Username to check
 * @returns True if username is available
 */
export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username uniqueness:', error);
    throw error;
  }
};

/**
 * Sign up a new user
 * @param email - User email
 * @param password - User password
 * @param username - User's chosen username
 * @returns Firebase user object
 */
export const signup = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  try {
    // Check if username is available
    const isUsernameAvailable = await checkUsernameUnique(username);
    if (!isUsernameAvailable) {
      throw new Error('Username is already taken');
    }

    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Set the display name
    await updateProfile(user, { displayName: username });

    // Create user document in Firestore
    const userDoc = doc(firestore, 'users', user.uid);
    await setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      username: username,
      displayName: username,
      level: 1,
      xp: 0,
      tokens: 0,
      streak: 0,
      joinedAt: new Date(),
      lastLoginAt: new Date(),
      outfits: ['default'],
      equippedOutfit: 'default',
      completedMeditations: [],
      purchasedItems: ['default'],
    });

    // Return user object
    return {
      uid: user.uid,
      email: user.email,
      displayName: username,
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Log in an existing user
 * @param email - User email
 * @param password - User password
 * @returns Firebase user object
 */
export const login = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Update last login timestamp
    const userDoc = doc(firestore, 'users', user.uid);
    await setDoc(userDoc, { lastLoginAt: new Date() }, { merge: true });

    // Return user object
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  // Set up auth state listener
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    } else {
      // User is signed out
      callback(null);
    }
  });
};

/**
 * Generate a referral code based on user ID
 * @param userId - User ID to base the code on
 * @returns A unique referral code
 */
export const generateReferralCode = (userId: string): string => {
  // Take the first 8 characters of the user ID and add a prefix
  const shortId = userId.substring(0, 8);
  return `ZEN-${shortId}`;
};