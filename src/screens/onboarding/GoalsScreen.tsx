import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store';
import ProgressDots from '../../components/ProgressDots';

const GOALS = ['Stress', 'Focus', 'Sleep', 'Screen-Time'];

const GoalsScreen = ({ navigation, route }: any) => {
  const { step = 4, total = 9 } = route.params || {};
  const [selected, setSelected] = useState<string[]>([]);
  const setGoals = useGameStore((s) => s.setGoals || (() => {}));

  const toggleGoal = (goal: string) => {
    setSelected((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleContinue = () => {
    setGoals(selected);
    navigation.navigate('Commitment', { ...route.params });
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>What brings you to Zen?</Text>
        <View style={styles.chipsRow}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[styles.chip, selected.includes(goal) && styles.chipActive]}
              onPress={() => toggleGoal(goal)}
            >
              <Text style={[styles.chipText, selected.includes(goal) && styles.chipTextActive]}>{goal}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 24 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 },
  chip: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, margin: 8 },
  chipActive: { backgroundColor: '#6C63FF' },
  chipText: { color: '#6C63FF', fontWeight: 'bold' },
  chipTextActive: { color: '#fff' },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginTop: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default GoalsScreen; 