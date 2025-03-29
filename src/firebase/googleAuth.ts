import { useState } from 'react';
import { FirebaseUser } from './auth';
import { notifyAuthStateChanged } from './auth'; // Import this from auth.ts

// This is a mock Google Auth implementation that doesn't require any real Google credentials

/**
 * Custom hook for Google Sign In
 * @returns Object with signInWithGoogle function and loading state
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mock Google Sign In - creates a random Google user
   */
  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create a mock Google user
      const googleUser: FirebaseUser = {
        uid: `google-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: `google-user-${Math.floor(Math.random() * 1000)}@gmail.com`,
        displayName: `Google User ${Math.floor(Math.random() * 1000)}`,
      };
      
      // Update auth state with this user
      notifyAuthStateChanged(googleUser);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error with Google Sign In';
      setError(errorMessage);
      console.error('Google Sign In Error:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
  };
};