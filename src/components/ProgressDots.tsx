import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressDotsProps {
  step: number;
  total: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ step, total }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i + 1 === step ? styles.dotActive : null]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 24 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#eee', margin: 6 },
  dotActive: { backgroundColor: '#6C63FF' },
});

export default ProgressDots; 