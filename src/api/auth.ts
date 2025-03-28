import { FirebaseUser } from '../types';

// Mock data storage
const mockUsers: Record<string, { email: string; password: string; username: string; uid: string }> = {
  'user@example.com': {
    email: 'user@example.com',
    password: 'password123',
    username: 'ZenUser',
    uid: 'mock-user-id-123',
  },
};

const usernameLookup: Record<string, string> = {
  'ZenUser': 'user@example.com',
};

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if a username is available
 * @param username - Username to check
 * @returns True if username is available
 */
export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  // Simulate network request
  await delay(800);
  
  // Check if username exists in our mock lookup
  return !usernameLookup[username];
};

/**
 * Sign up a new user
 * @param email - User email
 * @param password - User password
 * @param username - User's chosen username
 * @returns Firebase user object
 */
export const signup = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  // Simulate network request
  await delay(1500);
  
  // Check if email is already registered
  if (mockUsers[email]) {
    throw new Error('Email already in use');
  }
  
  // Check if username is already taken
  if (usernameLookup[username]) {
    throw new Error('Username is already taken');
  }
  
  // Create a new user
  const uid = `user-${Date.now()}`;
  
  // Store in our mock databases
  mockUsers[email] = { email, password, username, uid };
  usernameLookup[username] = email;
  
  // Return Firebase user format
  return {
    uid,
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
  // Simulate network request
  await delay(1000);
  
  // Check if user exists
  const user = mockUsers[email];
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if password matches
  if (user.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Return Firebase user format
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.username,
  };
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  // Simulate network request
  await delay(500);
  
  // Nothing to do for mock implementation
  return;
};

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  // For now, just immediately call with mock user
  // In a real implementation, this would set up a Firebase listener
  const mockUser: FirebaseUser = {
    uid: 'mock-user-id-123',
    email: 'user@example.com',
    displayName: 'ZenUser',
  };
  
  setTimeout(() => {
    callback(mockUser);
  }, 0);
  
  // Return unsubscribe function
  return () => {
    // Nothing to clean up in mock implementation
  };
};