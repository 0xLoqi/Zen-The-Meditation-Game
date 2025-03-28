import React, { useState } from 'react';
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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
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

  const validateUsername = async () => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    try {
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setUsernameError('Username is already taken');
        return false;
      }
      
      setUsernameError(null);
      return true;
    } catch (error) {
      setUsernameError('Error checking username');
      return false;
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
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
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Join Zen</Text>
            <Text style={styles.subtitle}>
              Create an account to start your meditation journey
            </Text>
          </View>

          <View style={styles.formContainer}>
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

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Create Account"
              onPress={handleSignup}
              isLoading={isLoading}
              style={styles.signupButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.loginContainer}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Sign In</Text>
              </Text>
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
  title: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.bold,
    fontSize: FONTS.xxlarge,
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.regular,
    fontSize: FONTS.medium,
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
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
});

export default SignupScreen;