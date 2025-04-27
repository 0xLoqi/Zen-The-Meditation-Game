import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

const TikTokQ = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Would you like to reduce your TikTok usage?</Text>
      <View style={styles.buttonRow}>
        <Button title="Yes" onPress={() => onNext(true)} style={styles.button} />
        <Button title="No" onPress={() => onNext(false)} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24 },
  label: { fontSize: 18, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, marginHorizontal: 8 },
});

export default TikTokQ; 