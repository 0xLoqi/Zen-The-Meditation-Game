import React, { useState } from 'react';
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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
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
            <View style={styles.logoContainer}>
              {/* Use the Zenni character as logo */}
              <View style={styles.logoImageWrapper}>
                <ImageBackground 
                  source={require('../../../assets/zenni.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.brandTitle}>Zen</Text>
            <Text style={styles.subtitle}>
              Your mindful meditation journey starts here
            </Text>
          </View>

          <View style={styles.formContainer}>
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

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.signupContainer}
              onPress={handleSignupPress}
            >
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign Up</Text>
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