import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from './src/constants/theme';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Import images
const zenni = require('./assets/images/zenni.png');
const miniZenni = require('./assets/images/minizenni.png');

// Create stack navigators for auth and main flows
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

// Mock auth state for demo
const mockAuth = {
  isAuthenticated: false,
  isLoading: false,
  login: (email: string, password: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = true;
        resolve();
      }, 1500);
    });
  },
  signup: (email: string, username: string, password: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = true;
        resolve();
      }, 1500);
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = false;
        resolve();
      }, 500);
    });
  }
};

// Splash Screen Component
const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    // Simulate loading assets or checking auth state
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={zenni} 
          style={styles.zenniLogo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Zen Meditation</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
};

// Login Screen Component
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await mockAuth.login(email, password);
      // After successful login, navigation will be handled by the auth state change
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.zenniImageContainer}>
          <Image 
            source={zenni} 
            style={styles.zenniImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Welcome Back</Text>
          <Text style={styles.screenSubtitle}>Sign in to continue your meditation journey</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.neutralMedium}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.neutralMedium}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Signup Screen Component
const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await mockAuth.signup(email, username, password);
      // After successful signup, navigation will be handled by the auth state change
    } catch (error) {
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.zenniImageContainerSmall}>
          <Image 
            source={zenni} 
            style={styles.zenniImageSmall}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Create Account</Text>
          <Text style={styles.screenSubtitle}>Start your mindfulness journey with Zen</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.neutralMedium}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={COLORS.neutralMedium}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create password"
              placeholderTextColor={COLORS.neutralMedium}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.neutralMedium}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Home Screen Component (simplified)
const HomeScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    await mockAuth.logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zen Meditation</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.welcomeSection}>
          <View style={styles.miniZenniContainer}>
            <Image 
              source={miniZenni} 
              style={styles.miniZenniImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeText}>Welcome to Zen!</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionTitle}>Daily Check-in</Text>
          <Text style={styles.actionText}>How zen do you feel today? Take a moment to reflect on your mental state.</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionTitle}>Start Meditation</Text>
          <Text style={styles.actionText}>Choose a meditation type and duration to begin your practice.</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Navigation configurations
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
    </MainStack.Navigator>
  );
};

// Main App Component
export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication state check
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(mockAuth.isAuthenticated);
      setIsInitializing(false);
    };

    checkAuth();

    // Set up an interval to check auth state every second (for demo purposes)
    const interval = setInterval(() => {
      setIsAuthenticated(mockAuth.isAuthenticated);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Shared styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.screenHorizontal,
  },
  
  // Splash Screen styles
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  zenniLogo: {
    width: 150, 
    height: 150,
    marginBottom: SPACING.m,
  },
  appName: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading1,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: SPACING.m,
  },
  
  // Loading Container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // Zenni Image Styles
  zenniImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  zenniImage: {
    width: 180,
    height: 180,
  },
  zenniImageContainerSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  zenniImageSmall: {
    width: 120,
    height: 120,
  },
  miniZenniContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  miniZenniImage: {
    width: 150,
    height: 150,
  },
  
  // Auth screens shared styles
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: SPACING.l,
  },
  screenTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading1,
    fontWeight: '600',
    color: COLORS.neutralDark,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.regular_size,
    color: COLORS.neutralMedium,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.small,
    fontWeight: '500',
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    fontFamily: FONTS.secondary,
    fontSize: FONTS.regular_size,
    color: COLORS.neutralDark,
    height: SIZES.inputHeight,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    height: SIZES.buttonMediumHeight,
    ...SHADOWS.small,
  },
  buttonDisabled: {
    backgroundColor: COLORS.neutralMedium,
  },
  buttonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.regular_size,
    fontWeight: '600',
    color: COLORS.white,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.neutralMedium,
  },
  footerLink: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.primary,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  backButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.regular_size,
    color: COLORS.primary,
  },
  
  // Home Screen styles
  header: {
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.xxl,
    paddingBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    elevation: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading3,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  logoutText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.white,
    fontWeight: '500',
  },
  homeContent: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  welcomeText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.neutralDark,
    marginTop: SPACING.s,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.m,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  statValue: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading3,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.neutralMedium,
    marginTop: SPACING.xs,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  actionTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.regular_size,
    color: COLORS.neutralMedium,
    lineHeight: 22,
  },
});