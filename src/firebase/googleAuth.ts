import { auth } from './config';
import { 
  GoogleAuthProvider, 
  signInWithCredential, 
  UserCredential 
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { FirebaseUser } from './auth';
import { Platform } from 'react-native';

// Register the web browser redirect handler
WebBrowser.maybeCompleteAuthSession();

// Get client ID from environment variables
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Custom hook for Google Sign In
 * @returns Object with signInWithGoogle function and loading state
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure Google Auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    // For iOS and Android native apps
    androidClientId: Platform.OS === 'android' ? GOOGLE_CLIENT_ID : undefined,
    iosClientId: Platform.OS === 'ios' ? GOOGLE_CLIENT_ID : undefined,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleCredential(id_token);
    }
  }, [response]);

  /**
   * Handle Firebase sign in with Google credential
   * @param idToken - ID token from Google
   * @returns Firebase user
   */
  const handleGoogleCredential = async (idToken: string): Promise<FirebaseUser | null> => {
    try {
      setLoading(true);
      setError(null);

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase with the Google credential
      const userCredential: UserCredential = await signInWithCredential(auth, googleCredential);
      const { user } = userCredential;

      // Map Firebase user to our custom user type
      const customUser: FirebaseUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      return customUser;
    } catch (err: any) {
      const errorMessage = err.message || 'Error signing in with Google';
      setError(errorMessage);
      console.error('Google Sign In Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger Google Sign In
   */
  const signInWithGoogle = async () => {
    if (!request) {
      setError('Google Sign In is not configured correctly');
      return null;
    }

    try {
      setLoading(true);
      await promptAsync();
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error with Google Sign In';
      setError(errorMessage);
      console.error('Google Sign In Prompt Error:', errorMessage);
      return null;
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