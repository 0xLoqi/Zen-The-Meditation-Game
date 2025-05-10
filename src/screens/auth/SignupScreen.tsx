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
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { setUserData } from '../../firebase/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING, SHADOWS, SIZES } from '../../constants/theme';

import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import FloatingLeaves from '../../components/FloatingLeaves';
import MiniZenni from '../../components/MiniZenni';

type SignupScreenNavigationProp = any;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
  route: any;
}

WebBrowser.maybeCompleteAuthSession();

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation, route }) => {
  const navigationNative = useNavigation();
  const username = route.params?.username || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const logoRef = useRef<Animatable.View & View>(null);
  const titleRef = useRef<Animatable.View & View>(null);
  const subtitleRef = useRef<Animatable.View & View>(null);
  const formRef = useRef<Animatable.View & View>(null);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    signup,
    isLoading: authIsLoading,
    error: authError,
    firebaseSignInWithGoogle,
    googleAuthLoading,
    continueAsGuest,
  } = useAuthStore();

  const { updateUserData } = useUserStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID || '<YOUR_WEB_CLIENT_ID>',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_IOS_CLIENT_ID || '<YOUR_IOS_CLIENT_ID>',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_ANDROID_CLIENT_ID || '<YOUR_ANDROID_CLIENT_ID>',
  });

  useEffect(() => {
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

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        firebaseSignInWithGoogle(id_token)
          .then(async () => {
            console.log('Google Sign-In successful via Firebase.');
            const firebaseUser = auth.currentUser;
            if (firebaseUser?.uid && username) {
              console.log(`Saving username '${username}' for user ${firebaseUser.uid}`);
              await updateUserData({ username });
            } else {
              console.warn('Could not save username after Google sign-in: No UID or username');
            }
            console.log('Navigating to Paywall...');
            navigation.navigate('Paywall');
          })
          .catch((err) => {
            console.error("Firebase Google Sign-In Error:", err);
            Alert.alert('Google Sign-In Failed', 'Could not sign in with Google via Firebase.');
          });
      } else {
        Alert.alert('Google Sign-In Error', 'Could not get ID token from Google response.');
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Session Error:', response.error);
      Alert.alert('Google Sign-In Error', 'An error occurred during Google sign-in.');
    }
  }, [response, firebaseSignInWithGoogle, navigation, username, updateUserData]);

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

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    if (!validatePassword()) {
      Alert.alert('Password Issue', passwordError || 'Please check your password.');
      return;
    }

    if (authIsLoading || googleAuthLoading) return;

    try {
      await signup(email, password);
      console.log('Email/Pass Signup successful.');
      const firebaseUser = auth.currentUser;
      if (firebaseUser?.uid && username) {
        console.log(`Saving username '${username}' for user ${firebaseUser.uid}`);
        await updateUserData({ username });
      } else {
        console.warn('Could not save username after email/pass sign-up: No UID or username');
      }
      console.log('Navigating to Paywall...');
      navigation.navigate('Paywall');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error?.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Email Already Registered',
          'This email address is already in use. Please log in or use a different email address.'
        );
      } else {
        Alert.alert('Signup Failed', authError || 'Could not create account. Please try again.');
      }
    }
  };

  const handleAppleSignIn = async () => {
    Alert.alert('Coming Soon', 'Sign in with Apple is not yet available.');
  };

  const handleLoginPress = () => {
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
        navigation.navigate('Login');
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const handleContinueAsGuest = async () => {
    if (authIsLoading || googleAuthLoading) return;

    try {
      console.log('[SignupScreen] Attempting to continue as guest...');
      await continueAsGuest();
      console.log('[SignupScreen] Continue as guest successful.');
      
      const guestId = await AsyncStorage.getItem('@user_id');
      if (guestId && username) {
        console.log(`Saving username '${username}' for guest user ${guestId}`);
        await updateUserData({ username });
      } else {
        console.warn('Could not save username after guest setup: No guest ID or username');
      }
      console.log('[SignupScreen] Navigating to Paywall...');
      navigation.navigate('Paywall');
    } catch (error) {
      console.error('[SignupScreen] Continue as Guest Error:', error);
      Alert.alert('Error', 'Could not continue as guest. Please try again.');
    }
  };

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  
  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg']
  });

  return (
    <ImageBackground
      source={require('../../../assets/images/pattern_bg.png')}
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
                onPress={() => promptAsync()}
                isLoading={googleAuthLoading}
                style={styles.googleSignInButton}
              />

              {Platform.OS === 'ios' && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={SIZES.radiusLarge}
                  style={styles.appleSignInButton}
                  onPress={handleAppleSignIn}
                />
              )}

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
                containerStyle={styles.inputContainer}
                style={styles.input}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={passwordError}
                containerStyle={styles.inputContainer}
                style={styles.input}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                onBlur={validatePassword}
                containerStyle={styles.inputContainer}
                style={styles.input}
              />

              {authError && <Text style={styles.errorText}>{authError}</Text>}

              <Button
                title="Sign Up"
                onPress={handleSignup}
                isLoading={authIsLoading}
                disabled={
                  googleAuthLoading ||
                  authIsLoading ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !!passwordError
                }
                style={styles.signupButton}
                size="large"
                textStyle={styles.signupButtonText}
              />

              <View style={styles.bottomLinksContainer}>
                <Text style={styles.bottomText}>
                  Already have an account?{' '}
                  <Text style={styles.bottomLink} onPress={handleLoginPress}>
                    Log In
                  </Text>
                </Text>
                <Text style={[styles.bottomText, { marginTop: SPACING.small }]}>
                  Or{' '}
                  <Text style={styles.bottomLink} onPress={handleContinueAsGuest}>
                    Continue as Guest
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
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.large,
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.small,
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
    marginBottom: SPACING.large,
  },
  inputContainer: {
    marginBottom: SPACING.small,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: SPACING.medium,
    ...SHADOWS.small,
  },
  inputText: {
    fontFamily: FONTS.secondary,
    fontWeight: FONTS.regular,
    fontSize: 16,
    color: COLORS.neutralDark,
  },
  errorText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: SPACING.medium,
    height: 50,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLarge,
    ...SHADOWS.medium,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  googleSignInButton: {
    marginVertical: SPACING.small,
    height: 50,
    borderRadius: SIZES.radiusLarge,
  },
  appleSignInButton: {
    width: '100%',
    height: 50,
    marginVertical: SPACING.small,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.large,
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
  bottomLinksContainer: {
    alignItems: 'center',
    marginTop: SPACING.medium,
    paddingBottom: SPACING.small,
  },
  bottomText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomLink: {
    color: COLORS.primary,
    fontFamily: FONTS.secondary,
    fontWeight: FONTS.bold as '700',
    fontSize: FONTS.base,
  },
  miniZenni: {
    marginBottom: SPACING.medium,
  },
});

export default SignupScreen;