import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  
  // Animation refs
  const logoRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const subtitleRef = useRef<any>(null);
  
  // Animation for pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
    
    // Run entrance animations with sequence
    if (logoRef.current) {
      logoRef.current.animate(
        { 0: { opacity: 0, scale: 0.5 }, 1: { opacity: 1, scale: 1 } },
        500
      );
    }
    
    setTimeout(() => {
      titleRef.current?.fadeInUp(400);
    }, 300);
    
    setTimeout(() => {
      brandRef.current?.fadeInUp(500);
    }, 500);
    
    setTimeout(() => {
      subtitleRef.current?.fadeInUp(600);
    }, 700);
    
    setTimeout(() => {
      formRef.current?.fadeIn(800);
    }, 900);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      // Shake animation on error
      formRef.current?.shake(800);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the store
      formRef.current?.shake(800);
    }
  };

  const handleSignupPress = () => {
    // Add a slight bounce before navigating
    formRef.current?.bounceOut(500).then(() => {
      navigation.navigate('Signup');
    });
  };

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
          <View style={styles.header}>
            <Animatable.View 
              ref={logoRef} 
              style={styles.logoContainer}
              useNativeDriver
            >
              <Animated.View 
                style={[
                  styles.logoImageWrapper,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <ImageBackground 
                  source={require('../../../assets/zenni.png')} 
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
              Welcome to
            </Animatable.Text>
            
            <Animatable.Text
              ref={brandRef}
              style={styles.brandTitle}
              useNativeDriver
            >
              Zen
            </Animatable.Text>
            
            <Animatable.Text
              ref={subtitleRef}
              style={styles.subtitle}
              useNativeDriver
            >
              Your mindful meditation journey starts here
            </Animatable.Text>
          </View>

          <Animatable.View 
            ref={formRef}
            style={styles.formContainer}
            useNativeDriver
            animation="fadeIn"
            duration={800}
            delay={900}
          >
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
              }
            />

            {error && (
              <Animatable.Text 
                style={styles.errorText}
                animation="shake"
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
            >
              <Button
                title="Sign In"
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.loginButton}
              />
            </Animatable.View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount={1}
              useNativeDriver
            >
              <TouchableOpacity
                style={styles.signupContainer}
                onPress={handleSignupPress}
              >
                <Text style={styles.signupText}>
                  Don't have an account?{' '}
                  <Text style={styles.signupLink}>Sign Up</Text>
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
  header: {
    alignItems: 'center',
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.xlarge,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logoImageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75, 
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
    fontSize: FONTS.xlarge,
    color: COLORS.text,
    marginBottom: SPACING.tiny,
  },
  brandTitle: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.bold as '700',
    fontSize: FONTS.huge,
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
  loginButton: {
    marginTop: SPACING.large,
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
});

export default LoginScreen;