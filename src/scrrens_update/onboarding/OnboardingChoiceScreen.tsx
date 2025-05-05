import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { NewOnboardingStackParamList } from '../../navigation/NewOnboardingNavigator';

// Type navigation prop specific to this screen within its navigator
type OnboardingChoiceNavigationProp = NativeStackNavigationProp<
  NewOnboardingStackParamList,
  'OnboardingChoice'
>;

export default function OnboardingChoiceScreen() {
  const navigation = useNavigation<OnboardingChoiceNavigationProp>();
  const { continueAsGuest, isLoading: isAuthLoading } = useAuthStore();
  const { getUserData } = useUserStore();
  const [isProcessingGuest, setIsProcessingGuest] = React.useState(false);

  const handleContinueOnboarding = async () => {
    setIsProcessingGuest(true);
    try {
      await continueAsGuest();
      console.log('[OnboardingChoice] Guest session created, fetching user data...');
      await getUserData();
      console.log('[OnboardingChoice] State updated. Navigating to Welcome...');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error("Failed to start guest session or fetch user data:", error);
      setIsProcessingGuest(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Zen!</Text>
      <Text style={styles.subtitle}>Would you like to continue onboarding or sign in now?</Text>

      {(isAuthLoading || isProcessingGuest) ? (
        <ActivityIndicator size="large" color="#4B9CD3" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinueOnboarding}
            disabled={isAuthLoading || isProcessingGuest}
          >
            <Text style={styles.buttonText}>Start Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.replace('Login')}
            disabled={isAuthLoading || isProcessingGuest}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B9CD3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 