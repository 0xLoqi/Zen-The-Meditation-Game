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

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  // State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    isLoading, 
    error, 
    checkUsernameUnique, 
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

  // Validate username
  const validateUsername = async () => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }

    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }

    try {
      const isAvailable = await checkUsernameUnique(username);
      if (!isAvailable) {
        setUsernameError('Username is already taken');
        return false;
      }
      setUsernameError('');
      return true;
    } catch (error) {
      setUsernameError('Error checking username');
      return false;
    }
  };

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
    const isUsernameValid = await validateUsername();
    const isPasswordValid = validatePassword();

    if (!email || !isUsernameValid || !isPasswordValid) {
      return;
    }

    try {
      await signup(email, password, username);
    } catch (error) {
      console.log('Signup error:', error);
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

  return (
    <SafeAreaView style={styles.container}>
      <FloatingLeaves count={20} style={styles.leavesBackground} />
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
              onPress={() => {
                if (backButtonRef.current) {
                  try {
                    backButtonRef.current.fadeOut?.(300)
                      .then(() => {
                        navigation.goBack();
                      })
                      .catch(() => {
                        navigation.goBack();
                      });
                  } catch (error) {
                    navigation.goBack();
                  }
                } else {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
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
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              onBlur={validateUsername}
              error={usernameError}
              leftIcon={
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              }
              containerStyle={styles.inputContainer}
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
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Sign Up"
              onPress={handleSignup}
              isLoading={isLoading}
              disabled={
                isLoading ||
                !email ||
                !username ||
                !password ||
                !confirmPassword ||
                !!usernameError ||
                !!passwordError
              }
              style={styles.signupButton}
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
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    marginBottom: SPACING.large,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginBottom: SPACING.medium,
  },
  signupButton: {
    marginTop: SPACING.large,
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
});

export default SignupScreen;