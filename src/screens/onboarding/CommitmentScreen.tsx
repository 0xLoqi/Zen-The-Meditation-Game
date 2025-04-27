import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useGameStore } from '../../store';
import ProgressDots from '../../components/ProgressDots';

const PRESETS = [1, 5, 10];

const CommitmentScreen = ({ navigation, route }: any) => {
  const { step = 5, total = 9 } = route.params || {};
  const [minutes, setMinutes] = useState(5);
  const setCommitment = useGameStore((s) => s.setCommitmentMinutes || (() => {}));

  const handleContinue = () => {
    setCommitment(minutes);
    navigation.navigate('SoundPref', { ...route.params });
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>How many minutes can you practice daily?</Text>
        <View style={styles.presetsRow}>
          {PRESETS.map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.preset, minutes === val && styles.presetActive]}
              onPress={() => setMinutes(val)}
            >
              <Text style={[styles.presetText, minutes === val && styles.presetTextActive]}>{val} min</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={minutes}
          onValueChange={setMinutes}
          minimumTrackTintColor="#6C63FF"
          maximumTrackTintColor="#eee"
          thumbTintColor="#6C63FF"
        />
        <Text style={styles.label}>I can practice {minutes} min per day</Text>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 24 },
  presetsRow: { flexDirection: 'row', marginBottom: 16 },
  preset: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, margin: 8 },
  presetActive: { backgroundColor: '#6C63FF' },
  presetText: { color: '#6C63FF', fontWeight: 'bold' },
  presetTextActive: { color: '#fff' },
  label: { fontSize: 16, marginVertical: 16 },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default CommitmentScreen; 