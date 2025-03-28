import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [usernameError, setUsernameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  
  const { signup, checkUsernameUnique, isLoading, error } = useAuthStore();
  
  const validateUsername = async (username: string): Promise<boolean> => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      setUsernameError('Username is already taken');
      return false;
    }
    
    setUsernameError('');
    return true;
  };
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    
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
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    setConfirmPasswordError('');
    return true;
  };
  
  const handleSignup = async () => {
    const isUsernameValid = await validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      await signup(email, password, username);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={navigateToLogin}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <Text style={styles.headingText}>Join Zen</Text>
            <Text style={styles.subheadingText}>
              Create an account to start your meditation journey
            </Text>
            
            <View style={styles.inputsContainer}>
              <Input
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) validateUsername(text);
                }}
                error={usernameError}
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  if (confirmPassword && confirmPasswordError) validateConfirmPassword(confirmPassword);
                }}
                error={passwordError}
                secureTextEntry
                showPasswordToggle
              />
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                error={confirmPasswordError}
                secureTextEntry
                showPasswordToggle
              />
            </View>
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Sign Up"
              onPress={handleSignup}
              variant="primary"
              size="large"
              isLoading={isLoading}
              style={styles.signupButton}
            />
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.l,
  },
  backButton: {
    marginBottom: SPACING.xl,
  },
  backButtonText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  formContainer: {
    marginTop: SPACING.m,
  },
  headingText: {
    ...FONTS.heading.h1,
    color: COLORS.neutralDark,
    marginBottom: SPACING.s,
  },
  subheadingText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
    marginBottom: SPACING.xl,
  },
  inputsContainer: {
    marginBottom: SPACING.l,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.error,
    marginBottom: SPACING.m,
  },
  signupButton: {
    marginTop: SPACING.l,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.l,
  },
  footerText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
  },
  loginText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default SignupScreen;