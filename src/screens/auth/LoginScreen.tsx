import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
  Easing,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { playSoundById } from '../../services/audio';

import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import FloatingLeaves from '../../components/FloatingLeaves';
import MiniZenni from '../../components/MiniZenni';
import PatternBackground from '../../components/PatternBackground';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animation refs
  const logoRef = useRef<Animatable.View & View>(null);
  const titleRef = useRef<Animatable.View & View>(null);
  const formRef = useRef<Animatable.View & View>(null);

  // Auth state
  const { 
    login, 
    isLoading, 
    error, 
    googleAuthLoading, 
    googleAuthError,
    firebaseSignInWithGoogle
  } = useAuthStore();

  // Animation state
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const zenAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Google Auth Request
  // Load client IDs from environment variables
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID; // Use the general web client ID
  const iosClientIdEnv = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;
  const androidClientIdEnv = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;

  // Log the raw environment variable values
  console.log("LoginScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID (for web):", webClientId);
  console.log("LoginScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS:", iosClientIdEnv);
  console.log("LoginScreen: Raw env EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID:", androidClientIdEnv);

  // --- MODIFICATION: Revert to native redirect URI and native Client ID for native platforms ---
  let redirectUri;
  let effectiveClientId;

  if (Platform.OS === 'web') {
    redirectUri = AuthSession.makeRedirectUri({
      preferLocalhost: true, // Required for web to correctly generate http://localhost... 
    });
    effectiveClientId = webClientId; 
  } else {
    // For native, use the app scheme and a path. This should match your app.config.js scheme.
    // Expo's makeRedirectUri will use the scheme from app.config.js by default for native.
    redirectUri = AuthSession.makeRedirectUri({
        path: 'oauthredirect', // Ensure a path component
        // scheme: 'com.zenmeditation.app' // Already in app.config.js
    });
    effectiveClientId = androidClientIdEnv; // Use Android Client ID on Android
    if (Platform.OS === 'ios') {
        effectiveClientId = iosClientIdEnv; // Use iOS Client ID on iOS (if defined)
    }
  }
  console.log("LoginScreen: Determined redirectUri for platform:", Platform.OS, redirectUri);
  console.log("LoginScreen: Effective Client ID for Google request for platform:", Platform.OS, effectiveClientId);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: effectiveClientId,          // This will be the native ID on native platforms
    iosClientId: iosClientIdEnv,          // Still pass for consistency, hook might use it
    androidClientId: androidClientIdEnv,    // Still pass for consistency, hook might use it
    redirectUri: redirectUri, 
  });
  // --- END MODIFICATION ---

  // Log the effective clientId being used in the request URL (dynamically chosen by the library)
  useEffect(() => {
    if (request) {
      // The request.url will contain the client_id that is actually being sent to Google.
      // This is a good way to verify which ID is active for the current platform.
      console.log("LoginScreen: Auth Request URL (check client_id parameter):", request.url);
    }
  }, [request]);

  useEffect(() => {
    // ---- MODIFIED FOR MORE LOGGING ----
    console.log("LoginScreen: Google Response received:", JSON.stringify(response, null, 2)); // Log the full response

    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log("LoginScreen: Google Sign-In Success, id_token present:", !!id_token);
      if (id_token) {
        firebaseSignInWithGoogle(id_token);
      } else {
        console.error("LoginScreen: Google Sign-In Success, but id_token is missing in response.params", response.params);
      }
    } else if (response?.type === 'error') {
      console.error("LoginScreen: Google Sign-In Response Error:", response.error);
    } else if (response?.type === 'dismiss') {
      console.log("LoginScreen: Google Sign-In Dismissed by user.");
    } else if (response) {
      // Catch any other response types or states
      console.log("LoginScreen: Google Sign-In Response (unhandled type):", response.type, response);
    }
    // ---- END MODIFICATION ----
  }, [response]);

  // Set up floating animation
  useEffect(() => {
    // Initial animation for form and content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(zenAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: Platform.OS !== 'web',
        easing: Easing.out(Easing.elastic(1.2))
      })
    ]).start();
    
    // Subtle breathing effect for Zenni
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
  }, []);

  // Handle login button press
  const handleLogin = async () => {
    if (!email || !password) {
      playSoundById('alert');
      return;
    }
    try {
      playSoundById('select');
      await login(email, password);
    } catch (error) {
      playSoundById('alert');
      console.log('Login error:', error);
    }
  };

  // Handle Apple sign-in
  const handleAppleSignIn = async () => {
    // TODO: Implement Apple sign-in logic and link to Firebase
    console.log('Apple sign-in pressed');
  };

  // Interpolate floating animation
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  return (
    <SafeAreaView style={styles.container}>
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      <PatternBackground style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animatable.View 
              ref={logoRef}
              animation="fadeIn"
              duration={800}
              delay={300}
              useNativeDriver={Platform.OS !== 'web'}
              style={styles.header}
            >
              <Animated.View style={{ transform: [{ translateY }] }}>
                <MiniZenni 
                  outfitId="default" 
                  size="large" 
                  animationState="idle"
                  autoPlay 
                  loop
                />
              </Animated.View>
            </Animatable.View>

            <Animatable.View
              ref={titleRef}
              animation="fadeIn"
              duration={800}
              delay={500}
              useNativeDriver={Platform.OS !== 'web'}
              style={styles.titleContainer}
            >
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Continue your mindfulness journey</Text>
            </Animatable.View>

            <Animatable.View
              ref={formRef}
              animation="fadeInUp"
              duration={800}
              delay={700}
              useNativeDriver={Platform.OS !== 'web'}
              style={styles.formContainer}
            >
              {/* Google Sign-In Button */}
              <GoogleSignInButton
                onPress={() => promptAsync()}
                isLoading={googleAuthLoading}
                style={styles.googleSignInButton}
              />
              {/* Apple Sign-In Button is hidden until developer account is ready */}
              {/* {Platform.OS === 'ios' && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={5}
                  style={styles.appleSignInButton}
                  onPress={handleAppleSignIn}
                />
              )} */}
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              {/* Email/Password Form */}
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                containerStyle={styles.inputContainer}
              />

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {error && <Text style={styles.errorText}>{error}</Text>}
              {googleAuthError && <Text style={styles.errorText}>Google Sign-In Error: {googleAuthError}</Text>}

              <Button
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
                disabled={isLoading || !email || !password}
                style={styles.loginButton}
                size="large"
                textStyle={{ fontSize: 16, fontWeight: '600' }}
              />
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PatternBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.large,
    marginBottom: SPACING.medium,
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.small,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.medium,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginBottom: SPACING.medium,
  },
  loginButton: {
    marginTop: SPACING.medium,
    height: 48,
    paddingVertical: SPACING.small,
  },
  googleSignInButton: {
    marginVertical: SPACING.small,
  },
  appleSignInButton: {
    width: '100%',
    height: 44,
    marginTop: 12,
    marginBottom: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.small,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutralLight,
  },
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.neutralMedium,
    fontSize: 16,
  },
  formContainer: {
    // Add appropriate styles for the form container
  },
});

export default LoginScreen;