import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  Image,
  ActivityIndicator,
  Platform,
  Text,
  LogBox,
  Button,
} from 'react-native';
import { COLORS, FONTS, SPACING } from './constants/theme';
import * as Animatable from 'react-native-animatable';
import FloatingLeaves from './components/FloatingLeaves';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './store/authStore';
import { useMiniZenniStore } from './store/miniZenniStore';
import { useGameStore } from './store';
import { getUserDoc, auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { grant } from './services/CosmeticsService';
import { handleInitialLink } from './services/referral';
import { ToastProvider, showToast } from './components/Toasts';
import { useUserStore } from './store/userStore';
import { playSoundById } from './services/audio';
import { Audio } from 'expo-av';

// Suppress flexWrap warning for VirtualizedList/FlatList
LogBox.ignoreLogs([
  '`flexWrap: `wrap`` is not supported with the `VirtualizedList` components',
]);

// Global error handler for debugging
if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log('GLOBAL ERROR:', error, isFatal);
    alert('Error: ' + error.message);
  });
}

// Global unhandled promise rejection handler
if (typeof global !== 'undefined') {
  global.onunhandledrejection = (e) => {
    console.log('UNHANDLED PROMISE REJECTION:', e.reason || e);
    alert('Unhandled promise rejection: ' + (e.reason?.message || e.reason || e));
  };
}

// Error boundary component - Add props type
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null as Error | null }; // Add Error type to state

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    alert('ErrorBoundary: ' + (error?.message || String(error))); // Use String() as fallback
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          {/* Error details are optional, check if error exists */}
          {this.state.error && <Text style={styles.errorDetails}>{this.state.error.toString()}</Text>}
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
  const { initializeMiniZenni } = useMiniZenniStore();
  const { userData, isLoadingUser, getUserData } = useUserStore();
  const detectLowPowerMode = useGameStore((s) => s.detectLowPowerMode);
  const resetQuests = useGameStore((s) => s.resetQuests);
  const lastReset = useGameStore((s) => s.quests.lastReset);
  const motivation = useGameStore((s) => s.user.motivation || 'nerd');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeMiniZenni();

        const nowUTC = new Date().toISOString().slice(0, 10);
        const lastResetUTC = lastReset ? lastReset.slice(0, 10) : '';
        if (nowUTC !== lastResetUTC) {
          resetQuests();
        }

        if (typeof window !== 'undefined' && window.location) {
          let referralCode: string | null = null;
          if (window.location.search) {
            const params = new URLSearchParams(window.location.search);
            referralCode = params.get('code');
          }
          if (referralCode) {
            const claimedKey = `referral_claimed_${referralCode}`;
            const alreadyClaimed = await AsyncStorage.getItem(claimedKey);
            if (!alreadyClaimed) {
              grant('glowbag_epic');
              await AsyncStorage.setItem(claimedKey, 'true');
            }
          }
        }
        await handleInitialLink();

      } catch (error: any) {
        console.error('Error initializing app:', error);
        setError(error?.toString() ?? 'Unknown initialization error');
        useAuthStore.setState({ isLoading: false });
      }
    };

    initializeApp();

    const unsubscribeAuth = checkAuth();
    return () => {
      unsubscribeAuth();
    };

  }, [checkAuth, initializeMiniZenni, lastReset, resetQuests]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[App.tsx] Auth state is true, fetching user data...');
      getUserData().catch(err => {
        console.error('[App.tsx] Error fetching user data on auth change:', err);
      });
    } else {
      console.log('[App.tsx] Auth state is false, skipping user data fetch.');
    }
  }, [isAuthenticated, getUserData]);

  useEffect(() => {
    detectLowPowerMode();
  }, [detectLowPowerMode]);

  useEffect(() => {
    // Force lowPowerMode off for testing
    const { setState } = require('./store').useGameStore;
    setState({ lowPowerMode: false });
  }, []);

  useEffect(() => {
    // iOS: allow playback in silent mode
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  }, []);

  useEffect(() => {
    // Play test audio on mount
    playSoundById('rain'); // or any valid audio ID
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to initialize app</Text>
        <Text style={styles.errorDetails}>{error}</Text>
      </View>
    );
  }

  console.log('[App.tsx] Rendering RootNavigator unconditionally...');
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <RootNavigator />
        <Button title="Play Test Audio" onPress={() => playSoundById('rain')} />
        <StatusBar style="auto" />
      </NavigationContainer>
      <ToastProvider />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 150,
    height: 150,
    marginBottom: SPACING.m,
  },
  loadingIndicator: {
    marginTop: SPACING.m,
  },
  zenText: {
    fontFamily: FONTS.primary,
    fontSize: 40,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    position: 'absolute',
    bottom: SPACING.xxxl,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.large,
  },
  errorText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading2,
    fontWeight: FONTS.bold,
    color: COLORS.error,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  errorDetails: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    fontWeight: FONTS.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
});