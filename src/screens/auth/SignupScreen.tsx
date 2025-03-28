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

const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { signup, checkUsernameUnique, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  // Validate username
  const validateUsername = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    // Check if username contains only alphanumeric characters and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    // Check if username is unique
    setIsCheckingUsername(true);
    try {
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setUsernameError('Username is already taken');
        setIsCheckingUsername(false);
        return false;
      }
    } catch (error) {
      setUsernameError('Error checking username availability');
      setIsCheckingUsername(false);
      return false;
    }
    
    setIsCheckingUsername(false);
    setUsernameError('');
    return true;
  };
  
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
  
  // Validate confirm password
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    setConfirmPasswordError('');
    return true;
  };
  
  // Handle signup
  const handleSignup = async () => {
    // Validate form
    const isUsernameValid = await validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    try {
      await signup(email, password, username);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    }
  };
  
  // Navigate to login screen
  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your mindfulness journey with Zen
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              onBlur={validateUsername}
              error={usernameError}
              autoCapitalize="none"
              leftIcon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={SIZES.icon.medium}
                  color={COLORS.neutralMedium}
                />
              }
              rightIcon={
                isCheckingUsername ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : null
              }
            />
            
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
              placeholder="Create a password"
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
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword}
              error={confirmPasswordError}
              secureTextEntry
              showPasswordToggle
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={SIZES.icon.medium}
                  color={COLORS.neutralMedium}
                />
              }
            />
            
            <Button
              title="Create Account"
              onPress={handleSignup}
              isLoading={isLoading}
              style={styles.signupButton}
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Login</Text>
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
    marginTop: SPACING.l,
    marginBottom: SPACING.xl,
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
  signupButton: {
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
  loginText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});

export default SignupScreen;
