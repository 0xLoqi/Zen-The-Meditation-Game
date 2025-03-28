import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseFunctions } from './firebase';

// Check if username is unique
export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  try {
    const functions = getFirebaseFunctions();
    const checkUniqueUsername = httpsCallable(functions, 'checkUniqueUsername');
    const result = await checkUniqueUsername({ username });
    return (result.data as { isUnique: boolean }).isUnique;
  } catch (error) {
    console.error('Error checking username uniqueness:', error);
    throw error;
  }
};

// Sign up a new user
export const signup = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  try {
    // Check if username is unique first
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      throw new Error('Username is already taken');
    }

    // Create the user with email and password
    const auth = getFirebaseAuth();
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const firestore = getFirebaseFirestore();
    await setDoc(doc(firestore, 'users', user.uid), {
      username,
      email,
      createdAt: new Date(),
      level: 1,
      xp: 0,
      tokens: 0,
      streak: 0,
      lastMeditationDate: null,
      equippedOutfit: 'default',
      unlockedOutfits: ['default'],
      referralCode: generateReferralCode(username),
    });
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in an existing user
export const login = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const auth = getFirebaseAuth();
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen to auth state changes
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

// Generate a referral code based on username
const generateReferralCode = (username: string): string => {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${username.substring(0, 4).toUpperCase()}-${randomChars}`;
};
