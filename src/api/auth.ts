import { FirebaseUser } from '../types';

/**
 * Check if a username is available
 * @param username - Username to check
 * @returns True if username is available
 */
export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  // Simulate API call to check username availability
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo, let's say all usernames except "taken" are available
  return username.toLowerCase() !== 'taken';
};

/**
 * Sign up a new user
 * @param email - User email
 * @param password - User password
 * @param username - User's chosen username
 * @returns Firebase user object
 */
export const signup = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  // Simulate API call to create a new user
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  if (!email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  // Return a mock user object
  return {
    uid: `user_${Math.random().toString(36).substring(2, 9)}`,
    email,
    displayName: username,
  };
};

/**
 * Log in an existing user
 * @param email - User email
 * @param password - User password
 * @returns Firebase user object
 */
export const login = async (email: string, password: string): Promise<FirebaseUser> => {
  // Simulate API call to authenticate
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo credentials check
  if (email === 'demo@example.com' && password === 'password') {
    return {
      uid: '123456789',
      email,
      displayName: 'DemoUser',
    };
  }
  
  // For demo purposes, accept any combination except empty
  if (email && password) {
    return {
      uid: `user_${Math.random().toString(36).substring(2, 9)}`,
      email,
      displayName: email.split('@')[0],
    };
  }
  
  throw new Error('Invalid email or password');
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  // Simulate API call to sign out
  await new Promise(resolve => setTimeout(resolve, 500));
  return;
};

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  // In a real app, this would use Firebase's onAuthStateChanged
  // For the demo, we'll just immediately return a mock user
  
  const mockUser: FirebaseUser = {
    uid: '123456789',
    email: 'demo@example.com',
    displayName: 'DemoUser',
  };
  
  // Return a mock unsubscribe function
  return () => {};
};