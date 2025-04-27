import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressDots from '../../components/ProgressDots';
// import * as Notifications from 'expo-notifications'; // Uncomment if using expo-notifications

const ReminderPrompt = ({ navigation, route }: any) => {
  const { step = 7, total = 9 } = route.params || {};
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    // const { status } = await Notifications.requestPermissionsAsync();
    // if (status === 'granted') {
    //   // Schedule first daily reminder here
    //   setGranted(true);
    // }
    setTimeout(() => {
      setGranted(true);
      setLoading(false);
    }, 1000); // Placeholder for async permission
  };

  const handleContinue = () => {
    navigation.navigate('Account', { ...route.params });
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>Enable daily reminders?</Text>
        <Text style={styles.description}>Stay on track with gentle daily notifications.</Text>
        <TouchableOpacity
          style={[styles.button, granted && styles.buttonDisabled]}
          onPress={handleAllow}
          disabled={granted || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Requesting...' : granted ? 'Allowed' : 'Allow'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !granted && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!granted}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default ReminderPrompt; 