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
    signInWithGoogle, 
    googleAuthLoading, 
    googleAuthError 
  } = useAuthStore();

  // Animation state
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const zenAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log('Google sign in error:', error);
    }
  };

  // Handle signup navigation
  const handleSignupPress = () => {
    // Fun exit animation before navigating
    if (formRef.current && logoRef.current && titleRef.current) {
      try {
        const formPromise = formRef.current.fadeOutDown?.(300) || Promise.resolve();
        const logoPromise = logoRef.current.fadeOutUp?.(300) || Promise.resolve();
        const titlePromise = titleRef.current.fadeOutUp?.(300) || Promise.resolve();
        
        Promise.all([formPromise, logoPromise, titlePromise])
          .then(() => {
            setTimeout(() => {
              navigation.navigate('Signup');
            }, 300);
          })
          .catch(() => {
            navigation.navigate('Signup');
          });
      } catch (error) {
        // Fallback in case animation fails
        navigation.navigate('Signup');
      }
    } else {
      navigation.navigate('Signup');
    }
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
            animation="fadeIn"
            duration={800}
            delay={700}
            useNativeDriver={Platform.OS !== 'web'}
            style={styles.formContainer}
          >
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

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              isLoading={googleAuthLoading}
              style={styles.googleSignInButton}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink} onPress={handleSignupPress}>
                  Sign Up
                </Text>
              </Text>
            </View>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xxlarge,
    paddingHorizontal: SPACING.large,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.small,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  signupText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.regular_size,
    color: COLORS.textSecondary,
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: FONTS.bold as '700',
  },
  formContainer: {
    // Add appropriate styles for the form container
  },
});

export default LoginScreen;