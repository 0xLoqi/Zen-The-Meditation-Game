import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressDots from '../../components/ProgressDots';

const FirstSessionIntroScreen = ({ navigation, route }: any) => {
  const { step = 9, total = 9 } = route.params || {};

  const handleStart = () => {
    navigation.navigate('Paywall');
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.description}>Welcome to Zen. Let's begin your first meditation session and meet your Mini Zenni.</Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Start Session</Text>
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
});

export default FirstSessionIntroScreen; 