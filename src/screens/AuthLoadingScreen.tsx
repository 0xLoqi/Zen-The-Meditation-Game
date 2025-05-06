import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
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
  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
  const { userData, isLoadingUser, getUserData } = useUserStore();
  // Ref purely for initial load stabilization if needed elsewhere, not blocking nav
  const hasNavigatedInitiallyRef = useRef(false);

  // Reset navigation flag when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[AuthLoadingScreen] Screen focused.');
      // If needed, reset flags here, but primary logic below avoids blocking
      // hasNavigatedInitiallyRef.current = false;
    }, [])
  );

  // Run initial auth check on mount
  useEffect(() => {
    console.log('[AuthLoadingScreen] Running checkAuth...');
    const unsubscribe = checkAuth(); // Setup listener
    return unsubscribe; // Cleanup on unmount
  }, [checkAuth]);

  // Attempt to load user data if authenticated but data isn't loaded/loading
   useEffect(() => {
    // Only fetch if authenticated AND we don't have user data AND it's not already loading
    if (isAuthenticated && !userData && !isLoadingUser) {
      console.log('[AuthLoadingScreen] Authenticated, attempting to fetch user data...');
      getUserData().catch(err => console.error('[AuthLoadingScreen] Error fetching user data:', err));
    }
  }, [isAuthenticated, userData, isLoadingUser, getUserData]);


  // Navigation logic effect - Revised
  useEffect(() => {
    // Wait for initial loading checks to settle
    if (isAuthLoading || (isAuthenticated && isLoadingUser && !userData)) {
       console.log(`[AuthLoadingScreen] Waiting... isAuthLoading=${isAuthLoading}, isAuthenticated=${isAuthenticated}, isLoadingUser=${isLoadingUser}, hasUserData=${!!userData}`);
       return;
    }

    // Determine the target route based on current state
    let targetRoute: keyof RootStackParamList | null = null;
    // If authenticated and user data has been successfully fetched (even if incomplete),
    // navigate to the main app. Handle missing profile info within MainApp/ProfileScreen.
    if (isAuthenticated && userData) { 
        targetRoute = 'MainApp';
    } else {
        // Covers !isAuthenticated or cases where userData fetch failed (userData is null)
        targetRoute = 'Onboarding';
    }
    console.log(`[AuthLoadingScreen] Current state suggests route: ${targetRoute}`);

    // Get the current route name from the navigation state
    const navState = navigation.getState();
    const currentRoute = navState?.routes[navState?.index ?? 0]?.name;
    console.log(`[AuthLoadingScreen] Current navigator route: ${currentRoute}`);

    // Prevent redundant navigation resets *to the same target*
    // Also prevent resetting if we haven't determined a target yet
    if (!targetRoute || currentRoute === targetRoute) {
        console.log(`[AuthLoadingScreen] Navigation not needed (target: ${targetRoute}, current: ${currentRoute}).`);
        // Ensure initial navigation flag is set if we stabilize here and it wasn't set
        if(!hasNavigatedInitiallyRef.current && targetRoute) {
            console.log('[AuthLoadingScreen] Setting initial navigation flag.');
            hasNavigatedInitiallyRef.current = true;
        }
        return;
    }

    // Perform the navigation reset if the target route is different
    console.log(`[AuthLoadingScreen] Resetting navigation to: ${targetRoute}`);
    // Set initial flag after first successful navigation if needed
    if (!hasNavigatedInitiallyRef.current) {
        hasNavigatedInitiallyRef.current = true;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: targetRoute }],
    });

  }, [isAuthLoading, isAuthenticated, isLoadingUser, userData, navigation]);

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