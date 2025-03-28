import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  const { login, isLoading, error } = useAuthStore();
  
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
    const isValid = password.length >= 6;
    
    if (!isValid) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      await login(email, password);
    }
  };
  
  const navigateToSignup = () => {
    navigation.navigate('Signup');
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
          <View style={styles.logoContainer}>
            {/* Logo will go here */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>Zen</Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.headingText}>Welcome back</Text>
            <Text style={styles.subheadingText}>
              Log in to continue your meditation journey
            </Text>
            
            <View style={styles.inputsContainer}>
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
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                error={passwordError}
                secureTextEntry
                showPasswordToggle
              />
            </View>
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              isLoading={isLoading}
              style={styles.loginButton}
            />
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...FONTS.heading.large,
    color: COLORS.white,
  },
  formContainer: {
    marginTop: SPACING.xxl,
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
  loginButton: {
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
  signupText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen;