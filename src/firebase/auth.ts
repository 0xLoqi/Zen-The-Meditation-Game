// Firebase user type definition
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

// Store mock users in memory for testing
let mockUsers: Record<string, {
  uid: string;
  email: string;
  displayName: string;
  password: string;
}> = {
  'test@example.com': {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    password: 'password123'
  }
};

// Store the current user in memory
let currentUser: FirebaseUser | null = null;

// Keep track of auth state listeners
const authListeners: ((user: FirebaseUser | null) => void)[] = [];

// Notify all listeners about auth state changes
export const notifyAuthStateChanged = (user: FirebaseUser | null) => {
  currentUser = user;
  authListeners.forEach(listener => listener(user));
};

/**
 * Check if a username is available
 * @param username - Username to check
 * @returns True if username is available
 */
export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if username exists in our mock users
  for (const userEmail in mockUsers) {
    if (mockUsers[userEmail].displayName.toLowerCase() === username.toLowerCase()) {
      return false;
    }
  }
  
  return true;
};

/**
 * Sign up a new user
 * @param email - User email
 * @param password - User password
 * @param username - User's chosen username
 * @returns Firebase user object
 */
export const signup = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (mockUsers[email]) {
    throw new Error('Email already in use');
  }
  
  // Check if username is available
  const isUsernameAvailable = await checkUsernameUnique(username);
  if (!isUsernameAvailable) {
    throw new Error('Username is already taken');
  }
  
  // Create new user
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser = {
    uid: userId,
    email: email,
    displayName: username,
    password: password
  };
  
  // Add to mock users store
  mockUsers[email] = newUser;
  
  // Create the user object to return
  const userObject: FirebaseUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
  };
  
  // Update auth state
  notifyAuthStateChanged(userObject);
  
  return userObject;
};

/**
 * Log in an existing user
 * @param email - User email
 * @param password - User password
 * @returns Firebase user object
 */
export const login = async (email: string, password: string): Promise<FirebaseUser> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if user exists
  const user = mockUsers[email];
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check password
  if (user.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Create the user object to return
  const userObject: FirebaseUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
  
  // Update auth state
  notifyAuthStateChanged(userObject);
  
  return userObject;
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update auth state to null (signed out)
  notifyAuthStateChanged(null);
};

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  // Add the callback to our listeners
  authListeners.push(callback);
  
  // Initial callback with current state
  callback(currentUser);
  
  // Return an unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index !== -1) {
      authListeners.splice(index, 1);
    }
  };
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