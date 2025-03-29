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
  Alert,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

import Button from '../../components/Button';
import Input from '../../components/Input';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signup, isLoading, error, checkUsernameUnique } = useAuthStore();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  
  // Animation refs
  const logoRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const subtitleRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const backButtonRef = useRef<any>(null);
  
  // Animation for floating effect
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
    
    // Start subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
    
    // Delayed entrance animations
    backButtonRef.current?.fadeIn(400);
    
    setTimeout(() => {
      logoRef.current?.zoomIn(500);
    }, 100);
    
    setTimeout(() => {
      titleRef.current?.fadeInDown(500);
    }, 400);
    
    setTimeout(() => {
      subtitleRef.current?.fadeInDown(500);
    }, 600);
    
    setTimeout(() => {
      formRef.current?.fadeInUp(600);
    }, 800);
  }, []);

  const validateUsername = async () => {
    if (username.length < 3) {
      formRef.current?.shake(800);
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    try {
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        formRef.current?.shake(800);
        setUsernameError('Username is already taken');
        return false;
      }
      
      setUsernameError(null);
      return true;
    } catch (error) {
      formRef.current?.shake(800);
      setUsernameError('Error checking username');
      return false;
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      formRef.current?.shake(800);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      formRef.current?.shake(800);
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      formRef.current?.shake(800);
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    const isUsernameValid = await validateUsername();
    if (!isUsernameValid) {
      return;
    }
    
    try {
      await signup(email, password, username);
    } catch (error) {
      // Error is handled in the store
      formRef.current?.shake(800);
    }
  };

  const handleLoginPress = () => {
    // Fun exit animation before navigating
    formRef.current?.fadeOutDown(300).then(() => {
      logoRef.current?.fadeOutUp(300);
      titleRef.current?.fadeOutUp(300);
      subtitleRef.current?.fadeOutUp(300);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 300);
    });
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
                backButtonRef.current?.fadeOut(300).then(() => {
                  navigation.goBack();
                });
              }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.header}>
            <Animatable.View 
              ref={logoRef}
              style={styles.logoContainer}
              useNativeDriver
            >
              <Animated.View 
                style={[
                  styles.logoImageWrapper,
                  { 
                    transform: [
                      { translateY },
                      { rotateZ }
                    ] 
                  }
                ]}
              >
                <ImageBackground 
                  source={require('../../../assets/minizenni.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </Animatable.View>
            
            <Animatable.Text
              ref={titleRef} 
              style={styles.title}
              useNativeDriver
            >
              Join Zen
            </Animatable.Text>
            
            <Animatable.Text
              ref={subtitleRef}
              style={styles.subtitle}
              useNativeDriver
            >
              Create an account to start your meditation journey
            </Animatable.Text>
          </View>

          <Animatable.View
            ref={formRef}
            style={styles.formContainer}
            useNativeDriver
          >
            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              onBlur={validateUsername}
              error={usernameError || undefined}
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
              }
            />

            <Input
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} />
              }
            />

            <Input
              label="Password"
              placeholder="Choose a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
              }
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
              }
            />

            {error && (
              <Animatable.Text 
                style={styles.errorText}
                animation="flash"
                useNativeDriver
              >
                {error}
              </Animatable.Text>
            )}

            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              useNativeDriver
              duration={3000}
            >
              <Button
                title="Create Account"
                onPress={handleSignup}
                isLoading={isLoading}
                style={styles.signupButton}
              />
            </Animatable.View>

            <Animatable.View 
              style={styles.dividerContainer}
              animation="fadeIn"
              delay={900}
              useNativeDriver
            >
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </Animatable.View>

            <Animatable.View
              animation="bounceIn"
              delay={1100}
              useNativeDriver
            >
              <TouchableOpacity
                style={styles.loginContainer}
                onPress={handleLoginPress}
              >
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </Animatable.View>
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
  backButton: {
    marginTop: SPACING.medium,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logoImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.bold as '700',
    fontSize: FONTS.heading1,
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.regular as '400',
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  formContainer: {
    width: '100%',
    marginBottom: SPACING.large,
  },
  errorText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginBottom: SPACING.medium,
  },
  signupButton: {
    marginTop: SPACING.large,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
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