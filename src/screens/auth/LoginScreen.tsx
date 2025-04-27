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

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import FloatingLeaves from '../../components/FloatingLeaves';
import MiniZenni from '../../components/MiniZenni';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // State
  const [email, setEmail] = useState('admin@z.com');
  const [password, setPassword] = useState('adminn');
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
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '<YOUR_EXPO_CLIENT_ID>',
    iosClientId: '<YOUR_IOS_CLIENT_ID>',
    androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
    webClientId: '<YOUR_WEB_CLIENT_ID>',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        firebaseSignInWithGoogle(id_token);
      }
    }
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
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
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
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              }
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
              }
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.neutralDark}
                  />
                </TouchableOpacity>
              }
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.large,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxlarge,
    marginBottom: SPACING.xxlarge,
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
    marginBottom: SPACING.xxlarge,
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
    marginBottom: SPACING.medium,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.large,
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
    marginTop: SPACING.large,
    height: 48,
    paddingVertical: SPACING.small,
  },
  googleSignInButton: {
    marginVertical: SPACING.medium,
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
    marginVertical: 16,
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