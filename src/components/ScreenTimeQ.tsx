import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from './Button';

const ScreenTimeQ = ({ onNext }) => {
  const [minutes, setMinutes] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    const value = parseInt(minutes, 10);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid number');
      return;
    }
    setError('');
    onNext(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How many minutes per day do you spend on your phone?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutes}
        onChangeText={setMinutes}
        placeholder="e.g. 120"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24 },
  label: { fontSize: 18, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
});

export default ScreenTimeQ; 