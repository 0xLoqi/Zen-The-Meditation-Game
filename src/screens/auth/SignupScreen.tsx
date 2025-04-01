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
  ImageBackground,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING, SHADOWS, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import FloatingLeaves from '../../components/FloatingLeaves';
import MiniZenni from '../../components/MiniZenni';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const navigationNative = useNavigation();
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation refs
  const backButtonRef = useRef<Animatable.View & View>(null);
  const logoRef = useRef<Animatable.View & View>(null);
  const titleRef = useRef<Animatable.View & View>(null);
  const subtitleRef = useRef<Animatable.View & View>(null);
  const formRef = useRef<Animatable.View & View>(null);

  // Animation state
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Auth state
  const { 
    signup, 
    isLoading: authIsLoading, 
    error: authError, 
    signInWithGoogle, 
    googleAuthLoading 
  } = useAuthStore();

  // Set up floating animation
  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, rotateAnim]);

  // Validate password
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    setPasswordError('');
    return true;
  };

  // Handle signup button press
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password);
      // After successful signup, navigate to onboarding
      navigation.replace('Welcome');
    } catch (error: any) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Handle login navigation
  const handleLoginPress = () => {
    // Fun exit animation before navigating
    if (formRef.current && logoRef.current && titleRef.current && subtitleRef.current) {
      try {
        const formPromise = formRef.current.fadeOutDown?.(300) || Promise.resolve();
        const logoPromise = logoRef.current.fadeOutUp?.(300) || Promise.resolve();
        const titlePromise = titleRef.current.fadeOutUp?.(300) || Promise.resolve();
        const subtitlePromise = subtitleRef.current.fadeOutUp?.(300) || Promise.resolve();
        
        Promise.all([formPromise, logoPromise, titlePromise, subtitlePromise])
          .then(() => {
            setTimeout(() => {
              navigation.navigate('Login');
            }, 300);
          })
          .catch(() => {
            navigation.navigate('Login');
          });
      } catch (error) {
        // Fallback in case animation fails
        navigation.navigate('Login');
      }
    } else {
      navigation.navigate('Login');
    }
  };

  // Interpolate floating animation
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  
  // Interpolate rotation animation (subtle)
  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg']
  });

  const handleBack = () => {
    navigationNative.goBack();
  };

  return (
    <ImageBackground
      source={require('../../../assets/pattern_bg.png')}
      resizeMode="repeat"
      style={styles.backgroundImage}
    >
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
              ref={backButtonRef}
              animation="fadeIn"
              duration={500}
              useNativeDriver
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
              ref={logoRef}
              animation="fadeIn"
              duration={800}
              delay={200}
              useNativeDriver
              style={styles.logoContainer}
            >
              <Animated.View
                style={{
                  transform: [
                    { translateY },
                    { rotateZ }
                  ]
                }}
              >
                <MiniZenni 
                  outfitId="default" 
                  size="small" 
                  animationState="idle"
                  style={styles.miniZenni}
                />
              </Animated.View>
            </Animatable.View>

            <Animatable.View
              ref={titleRef}
              animation="fadeIn"
              duration={800}
              delay={400}
              useNativeDriver
            >
              <Text style={styles.title}>Create Account</Text>
            </Animatable.View>

            <Animatable.View
              ref={subtitleRef}
              animation="fadeIn"
              duration={800}
              delay={500}
              useNativeDriver
            >
              <Text style={styles.subtitle}>Start your mindfulness journey</Text>
            </Animatable.View>

            <Animatable.View
              ref={formRef}
              animation="fadeInUp"
              duration={800}
              delay={600}
              useNativeDriver
            >
              <GoogleSignInButton
                onPress={handleGoogleSignIn}
                isLoading={googleAuthLoading}
                style={styles.googleSignInButton}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

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
                style={styles.input}
                textStyle={styles.inputText}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={passwordError}
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
                style={styles.input}
                textStyle={styles.inputText}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                onBlur={validatePassword}
                leftIcon={
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                }
                containerStyle={styles.inputContainer}
                style={styles.input}
                textStyle={styles.inputText}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Sign Up"
                onPress={handleSignup}
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !!passwordError
                }
                style={styles.signupButton}
                size="large"
                textStyle={{ fontSize: 18, fontWeight: '700', color: COLORS.white }}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink} onPress={handleLoginPress}>
                    Log In
                  </Text>
                </Text>
              </View>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 225, 0.95)',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.large,
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.xxlarge,
  },
  inputContainer: {
    marginBottom: SPACING.medium,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: SPACING.medium,
    ...SHADOWS.small,
  },
  inputText: {
    ...FONTS.body.regular,
    fontSize: 16,
    color: COLORS.neutralDark,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginBottom: SPACING.medium,
  },
  signupButton: {
    marginTop: SPACING.large,
    height: 48,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    ...SHADOWS.medium,
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
  loginContainer: {
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  loginText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.regular_size,
    color: COLORS.textSecondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: FONTS.bold as '700',
  },
  miniZenni: {
    marginBottom: SPACING.medium,
  },
});

export default SignupScreen;