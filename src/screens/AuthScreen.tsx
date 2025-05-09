import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session'; // <-- IMPORT AuthSession
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path } from 'react-native-svg'; // Import react-native-svg
import { useAuthStore } from '../store/authStore'; // Import the store

// Ensure web browser closes correctly
WebBrowser.maybeCompleteAuthSession();

// --- TODO: Replace with your actual credentials ---
// These can be stored securely, perhaps via environment variables or a config file
// const GOOGLE_CLIENT_ID_WEB = 'YOUR_GOOGLE_CLIENT_ID_WEB.apps.googleusercontent.com'; // Not used directly in this native flow logic
// const GOOGLE_CLIENT_ID_IOS = 'YOUR_GOOGLE_CLIENT_ID_IOS.apps.googleusercontent.com'; // Loaded from env
// const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_GOOGLE_CLIENT_ID_ANDROID.apps.googleusercontent.com'; // Loaded from env
// ---

// Define your stack param list if needed
// type RootStackParamList = { ... AuthScreen: undefined; HomeScreen: undefined; ... };
// type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthScreen'>;
type AuthScreenNavigationProp = StackNavigationProp<any, 'AuthScreen'>; // Generic fallback

// --- Google SVG Icon Component ---
const GoogleIcon = () => (
  <Svg 
    viewBox="0 0 18 18"
  >
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></Path>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></Path>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></Path>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></Path>
    <Path fill="none" d="M0 0h48v48H0z"></Path>
  </Svg>
);
// ---

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false); // Keep isLoading state
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Get necessary functions/state from auth store
  const { 
    googleAuthLoading, 
    googleAuthError,
    firebaseSignInWithGoogle,
    continueAsGuest // Destructure continueAsGuest
  } = useAuthStore(); 

  // Load client IDs from environment variables
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID; // For web (not primary for native hook)
  const iosClientIdEnv = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;
  const androidClientIdEnv = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;

  // Log the raw environment variable values
  console.log("AuthScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID (for web):", webClientId);
  console.log("AuthScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS:", iosClientIdEnv);
  console.log("AuthScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID:", androidClientIdEnv);

  let redirectUri;
  let effectiveClientId;

  if (Platform.OS === 'web') {
    redirectUri = AuthSession.makeRedirectUri({
      preferLocalhost: true, 
    });
    effectiveClientId = webClientId; 
  } else {
    redirectUri = AuthSession.makeRedirectUri({
        path: 'oauthredirect',
    });
    effectiveClientId = Platform.OS === 'android' ? androidClientIdEnv : iosClientIdEnv;
  }
  console.log("AuthScreen: Determined redirectUri for platform:", Platform.OS, redirectUri);
  console.log("AuthScreen: Effective Client ID for Google request for platform:", Platform.OS, effectiveClientId);
  
  const isGoogleSignInConfigured = !!effectiveClientId;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: effectiveClientId,       
    iosClientId: iosClientIdEnv,      
    androidClientId: androidClientIdEnv, 
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (request) {
      console.log("AuthScreen: Auth Request URL (check client_id parameter):", request.url);
    }
  }, [request]);

  useEffect(() => {
    console.log("AuthScreen: Google Response received:", JSON.stringify(response, null, 2));
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log("AuthScreen: Google Sign-In Success, id_token present:", !!id_token);
      setIsLoading(true);
      if (id_token) {
        firebaseSignInWithGoogle(id_token)
          .then(() => {
            AsyncStorage.removeItem('@user_id'); 
            AsyncStorage.removeItem('@auth_type');
            // Navigation handled by App.tsx state change
          })
          .catch((error) => {
            console.error("AuthScreen: Firebase signInWithCredential error:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        console.error("AuthScreen: Google Sign-In Success, but id_token is missing in response.params", response.params);
        setIsLoading(false);
      }
    } else if (response?.type === 'error') {
      console.error("AuthScreen: Google Sign-In Response Error:", response.error);
      setIsLoading(false);
    } else if (response?.type === 'dismiss') {
      console.log("AuthScreen: Google Sign-In Dismissed by user.");
      setIsLoading(false); // Ensure loading stops if dismissed
    } else if (response) {
      console.log("AuthScreen: Google Sign-In Response (unhandled type):", response.type, response);
      setIsLoading(false);
    }
  }, [response, firebaseSignInWithGoogle]);

  const handleGoogleSignIn = () => {
    if (!isGoogleSignInConfigured) {
        console.error('AuthScreen: Google Sign-In is not configured for this platform. Missing Client ID.');
        return;
    }
    promptAsync(); 
  };

  const handleContinueAsGuest = async () => {
    console.log('Continuing without account...');
    setIsLoading(true); // Set loading state
    try {
      await continueAsGuest(); 
    } catch (error) {
      console.error("Continue as Guest error:", error);
    } finally {
       // setIsLoading(false); // As per original logic
    }
  };

  // Keep existing Google button styles
  const googleButtonStyle = isDarkMode ? styles.gsiMaterialButtonDark : styles.gsiMaterialButtonLight;
  const googleButtonDisabledStyle = isDarkMode ? styles.gsiMaterialButtonDarkDisabled : styles.gsiMaterialButtonLightDisabled;
  const googleButtonContentStyle = isDarkMode ? styles.gsiMaterialButtonContentsDark : styles.gsiMaterialButtonContentsLight;
  const googleButtonContentDisabledStyle = isDarkMode ? styles.gsiMaterialButtonContentsDarkDisabled : styles.gsiMaterialButtonContentsLightDisabled;
  const googleButtonIconDisabledStyle = isDarkMode ? styles.gsiMaterialButtonIconDarkDisabled : styles.gsiMaterialButtonIconLightDisabled;

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode ? styles.safeAreaDark : styles.safeAreaLight]}>
      <View style={styles.container}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>Create Account</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.textDarkSec : styles.textLightSec]}>Sign in or continue anonymously</Text>

        {(isLoading || googleAuthLoading) ? ( 
           <ActivityIndicator size="large" color={isDarkMode ? "#FFF" : "#007AFF"} />
        ) : (
          <>
            {/* Conditionally render explanation if not configured */}
            {!isGoogleSignInConfigured && (
                <Text style={styles.errorText}>
                    Google Sign-In is not configured for this platform.
                    Missing {Platform.OS === 'android' ? 'Android' : 'iOS'} Client ID.
                </Text>
            )}
            
            <TouchableOpacity
              style={[
                styles.gsiMaterialButtonBase, 
                googleButtonStyle,             
                (!request || !isGoogleSignInConfigured) && googleButtonDisabledStyle 
              ]}
              disabled={!request || !isGoogleSignInConfigured}
              onPress={handleGoogleSignIn} 
              activeOpacity={0.8} 
            >
               {/* Keep inner content for Google Button */}
               <View style={styles.gsiMaterialButtonContentWrapper}>
                 <View style={styles.gsiMaterialButtonIconContainer}>
                   <View style={[styles.gsiMaterialButtonIcon, !request && googleButtonIconDisabledStyle]}>
                     <GoogleIcon />
                   </View>
                 </View>
                 <Text style={[
                     styles.gsiMaterialButtonContentsBase, 
                     googleButtonContentStyle,             
                     (!request || !isGoogleSignInConfigured) && googleButtonContentDisabledStyle 
                   ]}>
                   Sign in with Google
                 </Text>
               </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.button, isDarkMode ? styles.anonymousButtonDark : styles.anonymousButtonLight]}
              onPress={handleContinueAsGuest}
            >
               <Text style={isDarkMode ? styles.anonymousButtonTextDark : styles.anonymousButtonTextLight}>
                 Continue without Account
               </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Display Google Auth Error */}
        {googleAuthError && (
            <Text style={styles.errorText}>{googleAuthError}</Text>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- General & Theme Base ---
  safeArea: { // Base safe area
    flex: 1,
  },
  safeAreaLight: { // Light theme background
    backgroundColor: '#fff',
  },
  safeAreaDark: { // Dark theme background
    backgroundColor: '#131314', // Match button background? Or app dark theme
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
  },
  textLight: { // Light theme primary text
    color: '#1f1f1f',
  },
  textDark: { // Dark theme primary text
    color: '#e3e3e3',
  },
  textLightSec: { // Light theme secondary text
     color: '#666',
  },
   textDarkSec: { // Dark theme secondary text
     color: '#8e918f',
   },
  button: { // Base for anonymous button
     width: '100%',
     paddingVertical: 15,
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'row',
     marginBottom: 15,
     height: 40, // Match GSI button height
  },
  separator: {
     height: 20,
  },

  // --- Google Sign-In Button Base Structure/Layout Styles ---
  gsiMaterialButtonBase: {
    borderWidth: 1,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    // Common shadows (approximated for :hover state)
    shadowColor: 'rgba(60, 64, 67, .30)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  gsiMaterialButtonContentWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  gsiMaterialButtonIconContainer: {
    marginRight: 12,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
   gsiMaterialButtonIcon: { // View container for the SVG
    height: 20,
    width: 20,
  },
  gsiMaterialButtonContentsBase: {
    fontFamily: 'Roboto', // Ensure font is loaded or use system default
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.25,
    textAlign: 'center',
    flexGrow: 1,
  },

  // --- Google Sign-In Light Theme Styles ---
  gsiMaterialButtonLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#747775',
  },
  gsiMaterialButtonContentsLight: {
    color: '#1f1f1f',
  },
  gsiMaterialButtonLightDisabled: {
    backgroundColor: '#ffffff61',
    borderColor: '#1f1f1f1f',
    shadowColor: 'transparent',
    elevation: 0,
  },
  gsiMaterialButtonContentsLightDisabled: {
     opacity: 0.38,
  },
   gsiMaterialButtonIconLightDisabled: {
     opacity: 0.38,
   },

  // --- Google Sign-In Dark Theme Styles ---
  gsiMaterialButtonDark: {
    backgroundColor: '#131314',
    borderColor: '#8e918f',
  },
  gsiMaterialButtonContentsDark: {
    color: '#e3e3e3',
  },
  gsiMaterialButtonDarkDisabled: {
    backgroundColor: '#13131461',
    borderColor: '#8e918f1f',
    shadowColor: 'transparent',
    elevation: 0,
  },
  gsiMaterialButtonContentsDarkDisabled: {
     opacity: 0.38,
  },
   gsiMaterialButtonIconDarkDisabled: {
     opacity: 0.38,
   },

  // --- Anonymous Button Theme Styles ---
  anonymousButtonLight: {
     backgroundColor: '#e0e0e0',
  },
  anonymousButtonTextLight: {
     color: '#444',
     fontSize: 16, // Keep font size consistent? Or adjust per theme?
     fontWeight: '500',
  },
   anonymousButtonDark: {
     backgroundColor: '#414142', // Example dark theme gray
   },
   anonymousButtonTextDark: {
      color: '#e3e3e3',
      fontSize: 16,
      fontWeight: '500',
   },
   errorText: { // Add error text style if missing
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
  },
});

export default AuthScreen; 