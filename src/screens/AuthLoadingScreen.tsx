import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { RootStackParamList } from '../navigation/RootNavigator'; // Adjust path if needed
import { COLORS } from '../constants/theme'; // Adjust path if needed

// Use NativeStackNavigationProp with RootStackParamList
type AuthLoadingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthLoading'>;

const AuthLoadingScreen = () => {
  const navigation = useNavigation<AuthLoadingNavigationProp>();
  // Get necessary state and actions
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { userData, isLoadingUser } = useUserStore();
  // Ref purely for initial load stabilization if needed elsewhere, not blocking nav
  const hasNavigatedInitiallyRef = useRef(false);
  const [hasDetectedErrorRecently, setHasDetectedErrorRecently] = useState(false);

  // Reset navigation flag and error detection when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[AuthLoadingScreen] Screen focused. Resetting hasDetectedErrorRecently.');
      setHasDetectedErrorRecently(false); 
      // hasNavigatedInitiallyRef.current = false; // Keep this if needed for specific initial nav logic
    }, [])
  );

  // Navigation logic effect - Revised
  useEffect(() => {
    const authState = useAuthStore.getState();
    const currentAuthError = authState.error;

    if (currentAuthError) {
      console.log(`[AuthLoadingScreen] Auth error detected ('${currentAuthError}'). Halting navigation logic and flagging error.`);
      setHasDetectedErrorRecently(true); // Flag that an error was seen
      return; 
    }

    // If we previously detected an error, and it's now null (cleared by a new login attempt starting),
    // reset our flag and allow navigation to proceed if other conditions are met.
    if (hasDetectedErrorRecently && !currentAuthError) {
      console.log('[AuthLoadingScreen] Previously detected error has been cleared. Resetting flag.');
      setHasDetectedErrorRecently(false);
    }

    // If we are in an error-flagged state, don't navigate further until error is cleared AND re-evaluated
    if (hasDetectedErrorRecently) {
      console.log('[AuthLoadingScreen] In flagged error state, awaiting error to be cleared by new login attempt.');
      return;
    }

    // Wait for initial loading checks to settle (only if no error is present and not in flagged error state)
    if (authState.isLoading || (authState.isAuthenticated && (isLoadingUser || !userData))) {
       console.log(`[AuthLoadingScreen] Waiting for userData... isAuthLoading=${authState.isLoading}, isAuthenticated=${authState.isAuthenticated}, isLoadingUser=${isLoadingUser}, hasUserData=${!!userData}`);
       return;
    }

    // Debug logs for userData and username
    console.log('[AuthLoadingScreen] userData:', userData);
    console.log('[AuthLoadingScreen] userData.username:', userData?.username);

    // Determine the target route based on current state
    let targetRoute: keyof RootStackParamList | null = null;
    if (authState.isAuthenticated && userData && userData.username) {
        targetRoute = 'MainApp';
    } else {
        targetRoute = 'Onboarding';
    }
    // console.log(`[AuthLoadingScreen] Current state suggests route: ${targetRoute}`); // Reduced logging here for clarity

    const navState = navigation.getState();
    const currentRouteName = navState?.routes[navState?.index ?? 0]?.name;
    // console.log(`[AuthLoadingScreen] Current navigator route: ${currentRouteName}`); // Reduced logging

    if (!targetRoute || currentRouteName === targetRoute) {
        // console.log(`[AuthLoadingScreen] Navigation not needed (target: ${targetRoute}, current: ${currentRouteName}).`); // Reduced logging
        if(!hasNavigatedInitiallyRef.current && targetRoute) {
            // console.log('[AuthLoadingScreen] Setting initial navigation flag.'); // Reduced logging
            hasNavigatedInitiallyRef.current = true;
        }
        return;
    }

    console.log(`[AuthLoadingScreen] PRE-RESET: Target: ${targetRoute}, Current: ${currentRouteName}, AuthLoading: ${authState.isLoading}, Authenticated: ${authState.isAuthenticated}, UserData: ${!!userData}, AuthStoreError (should be null): ${authState.error}`);
    if (!hasNavigatedInitiallyRef.current) {
        hasNavigatedInitiallyRef.current = true;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: targetRoute }],
    });

  }, [isAuthLoading, isAuthenticated, isLoadingUser, userData, navigation, hasDetectedErrorRecently]); // Added hasDetectedErrorRecently

  // Render loading indicator
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background || '#FEFBF3', // Provide fallback background
  },
});

export default AuthLoadingScreen; 