import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import ProgressDots from '../../components/ProgressDots';
// import * as Notifications from 'expo-notifications'; // Uncomment if using expo-notifications

const ReminderPrompt = ({ navigation, route }: any) => {
  const { step = 7, total = 9 } = route.params || {};
  // Get username from route params, default to empty string if not passed
  const username = route.params?.username || ''; 
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
    // Pass username along to the next screen (Signup)
    navigation.navigate('Signup', { ...route.params, username: username });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/daily_reminders_bg.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <ProgressDots step={step} total={total} />
        <View style={styles.centeredOuter}>
          <View style={styles.card}>
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
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    aspectRatio: 9 / 16,
    alignSelf: 'center',
  },
  centeredOuter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 16,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default ReminderPrompt; 