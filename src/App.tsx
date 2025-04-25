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
} from 'react-native';
import { COLORS, FONTS, SPACING } from './constants/theme';
import * as Animatable from 'react-native-animatable';
import FloatingLeaves from './components/FloatingLeaves';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useAuthStore } from './store/authStore';
import { useMiniZenniStore } from './store/miniZenniStore';

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorDetails}>{this.state.error?.toString()}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { initializeMiniZenni } = useMiniZenniStore();

  useEffect(() => {
    console.log('App - Starting Firebase authentication check');

    const initializeApp = async () => {
      try {
        console.log('Initializing Mini Zenni store...');
        await initializeMiniZenni();
        console.log('Mini Zenni store initialized');
        
        console.log('Checking authentication...');
        await checkAuth();
        console.log('Authentication check complete');
      } catch (error) {
        console.error('Error initializing app:', error);
        setError(error.toString());
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to initialize app</Text>
        <Text style={styles.errorDetails}>{error}</Text>
      </View>
    );
  }

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        {/* Floating leaves background animation */}
        <FloatingLeaves count={6} />
        
        {/* Center content */}
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={3000}
          useNativeDriver={Platform.OS !== 'web'}
          style={styles.loadingContent}
        >
          <Image 
            source={require('../assets/images/zenni.png')} 
            style={styles.loadingLogo}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
        </Animatable.View>
        
        {/* "Zen" text at bottom */}
        <Animatable.Text 
          animation="fadeIn"
          useNativeDriver={Platform.OS !== 'web'}
          style={styles.zenText}
        >
          Zen
        </Animatable.Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        <StatusBar style="auto" />
      </NavigationContainer>
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
    ...FONTS.heading.h2,
    color: COLORS.error,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  errorDetails: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
});