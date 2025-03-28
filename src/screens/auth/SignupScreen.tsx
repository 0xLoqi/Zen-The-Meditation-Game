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

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, isLoading, error, checkUsernameUnique } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  const validateUsername = async (username: string): Promise<boolean> => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    try {
      setIsCheckingUsername(true);
      const isUnique = await checkUsernameUnique(username);
      setIsCheckingUsername(false);
      
      if (!isUnique) {
        setUsernameError('Username is already taken');
        return false;
      }
      
      setUsernameError('');
      return true;
    } catch (error) {
      setIsCheckingUsername(false);
      setUsernameError('Failed to check username availability');
      return false;
    }
  };
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email');
    return isValid;
  };
  
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = (confirmPassword: string): boolean => {
    const isValid = confirmPassword === password;
    setConfirmPasswordError(isValid ? '' : 'Passwords do not match');
    return isValid;
  };
  
  const handleSignup = async () => {
    triggerHapticFeedback('selection');
    
    const isUsernameValid = await validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      await signup(email, password, username);
    }
  };
  
  const handleLogin = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('Login');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.neutralDark} />
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subheaderText}>Join the Zen community today</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Input
              label="Username"
              placeholder="Choose a unique username"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              onBlur={() => validateUsername(username)}
              error={usernameError}
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.neutralMedium} />}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email address"
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
              placeholder="Create a secure password"
              secureTextEntry
              showPasswordToggle
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.neutralMedium} />}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry
              showPasswordToggle
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              error={confirmPasswordError}
              leftIcon={<Ionicons name="shield-checkmark-outline" size={20} color={COLORS.neutralMedium} />}
            />
            
            <Button
              title="Sign Up"
              onPress={handleSignup}
              isLoading={isLoading || isCheckingUsername}
              style={styles.signupButton}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={styles.haveAccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  headerText: {
    ...FONTS.heading.h1,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
    fontWeight: 'bold' as const,
  },
  subheaderText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  signupButton: {
    marginTop: SPACING.m,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: SPACING.m,
  },
  haveAccountText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
    marginRight: SPACING.xs,
  },
  loginText: {
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

export default SignupScreen;