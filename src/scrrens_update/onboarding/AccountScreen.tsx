import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { AppleSignInButton, GoogleSignInButton } from '../../components'; // Uncomment if available
import { useGameStore } from '../../store';
import ProgressDots from '../../components/ProgressDots';

const AccountScreen = ({ navigation, route }: any) => {
  const setAccountDeferred = useGameStore((s) => s.setAccountDeferred || (() => {}));
  const { step = 8, total = 9 } = route.params || {};

  const handleSkip = () => {
    setAccountDeferred(true);
    navigation.navigate('FirstSessionIntro', { ...route.params });
  };

  const handleContinue = () => {
    // Handle successful sign-in (placeholder)
    navigation.navigate('FirstSessionIntro', { ...route.params });
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>Create an account?</Text>
        <Text style={styles.description}>Sign in to sync your progress and unlock all features.</Text>
        {/* <AppleSignInButton onSuccess={handleContinue} />
        <GoogleSignInButton onSuccess={handleContinue} /> */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Sign in (placeholder)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 16 },
  description: { fontSize: 16, marginBottom: 32, textAlign: 'center' },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  skipButton: { marginTop: 24 },
  skipText: { color: '#6C63FF', fontWeight: 'bold', fontSize: 16 },
});

export default AccountScreen; 