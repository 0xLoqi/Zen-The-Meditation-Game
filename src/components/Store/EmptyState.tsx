import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../constants/theme';

const EmptyState = ({ onOpenGlowbag, onSwitchCategory }: any) => (
  <View style={styles.container}>
    <Image source={require('../../../assets/images/minizenni.png')} style={styles.illustration} />
    <Text style={styles.title}>All items owned!</Text>
    <Text style={styles.subtitle}>Try opening a Glowbag or switch to another category.</Text>
    <TouchableOpacity style={styles.button} onPress={onOpenGlowbag}>
      <Text style={styles.buttonText}>Open Glowbag</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSwitchCategory}>
      <Text style={[styles.buttonText, styles.secondaryButtonText]}>Switch Category</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32 },
  illustration: { width: 100, height: 100, marginBottom: 16 },
  title: { fontWeight: 'bold', fontSize: 20, color: COLORS.primary, marginBottom: 8 },
  subtitle: { color: COLORS.neutralMedium, fontSize: 14, marginBottom: 24, textAlign: 'center' },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 32, marginBottom: 12 },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: COLORS.neutralLight },
  secondaryButtonText: { color: COLORS.primary },
});

export default EmptyState; 