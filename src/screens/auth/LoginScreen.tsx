import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Validate email
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  // Validate password
  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  // Handle login
  const handleLogin = async () => {
    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };
  
  // Navigate to signup screen
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Zen</Text>
            <Text style={styles.subtitle}>
              Login to continue your meditation journey
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={SIZES.icon.medium}
                  color={COLORS.neutralMedium}
                />
              }
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              error={passwordError}
              secureTextEntry
              showPasswordToggle
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={SIZES.icon.medium}
                  color={COLORS.neutralMedium}
                />
              }
            />
            
            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignup}>
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
    backgroundColor: COLORS.neutralLight,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  loginButton: {
    marginTop: SPACING.l,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.warning,
    marginTop: SPACING.m,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.l,
  },
  footerText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  signupText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen;
