import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { triggerHapticFeedback } from '../../utils/haptics';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email');
    return isValid;
  };
  
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : 'Password must be at least 6 characters');
    return isValid;
  };
  
  const handleLogin = async () => {
    triggerHapticFeedback('selection');
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      await login(email, password);
    }
  };
  
  const handleSignup = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('Signup');
  };
  
  const handleForgotPassword = () => {
    // Not implemented yet
    triggerHapticFeedback('selection');
    console.log('Forgot password');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Zen</Text>
            <Text style={styles.tagline}>Find your inner peace</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              error={emailError}
              leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.neutralMedium} />}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              showPasswordToggle
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.neutralMedium} />}
            />
            
            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          
          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.m,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoText: {
    ...FONTS.heading.h1,
    fontSize: 48,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: 'bold' as const,
  },
  tagline: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  loginButton: {
    marginTop: SPACING.m,
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  forgotText: {
    ...FONTS.body.small,
    color: COLORS.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: SPACING.m,
  },
  noAccountText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
    marginRight: SPACING.xs,
  },
  signupText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default LoginScreen;