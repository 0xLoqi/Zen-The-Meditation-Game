import React, { useEffect, useRef } from 'react';
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
  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
  const { userData, isLoadingUser, getUserData } = useUserStore();
  const hasNavigatedRef = useRef(false);

  // Reset navigation flag when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[AuthLoadingScreen] Screen focused, resetting navigation flag.');
      hasNavigatedRef.current = false;
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


  // Navigation logic effect - SIMPLIFIED
  useEffect(() => {
    if (hasNavigatedRef.current) {
      console.log('[AuthLoadingScreen] Already navigated (ref check), skipping.');
      return;
    }

    // Wait for initial auth check AND user data if authenticated
    if (isAuthLoading || (isAuthenticated && isLoadingUser && !userData)) {
       console.log(`[AuthLoadingScreen] Waiting... isAuthLoading=${isAuthLoading}, isAuthenticated=${isAuthenticated}, isLoadingUser=${isLoadingUser}, hasUserData=${!!userData}`);
       return;
    }

    // Determine the INITIAL target route
    let targetRoute: keyof RootStackParamList | null = null;
    if (isAuthenticated) {
        // Only check username *after* loading is done
        if (userData?.username) {
            console.log('[AuthLoadingScreen] Determined route: MainApp (Authenticated + Username)');
            targetRoute = 'MainApp';
        } else {
             console.log('[AuthLoadingScreen] Determined route: Onboarding (Authenticated, no Username)');
             targetRoute = 'Onboarding'; 
        }
    } else {
      console.log('[AuthLoadingScreen] Determined route: Onboarding (Not Authenticated)');
      targetRoute = 'Onboarding'; 
    }

    // Navigate using reset ONLY ONCE
    if (targetRoute) {
       console.log(`[AuthLoadingScreen] Resetting navigation ONCE to: ${targetRoute} (ref update)`);
       hasNavigatedRef.current = true;
       navigation.reset({
         index: 0,
         routes: [{ name: targetRoute }],
       });
    } else {
        console.log('[AuthLoadingScreen] Could not determine target route after loading finished.');
    }

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