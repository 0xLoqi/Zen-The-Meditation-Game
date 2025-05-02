import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGameStore } from '../../store';
import { COLORS } from '../../constants/theme';

const StoreHeader = ({ onHowToEarn }: { onHowToEarn: () => void }) => {
  const tokens = useGameStore((s) => s.progress.tokens);
  const anim = useRef(new Animated.Value(1)).current;
  const prevTokens = useRef(tokens);

  useEffect(() => {
    if (tokens !== prevTokens.current) {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      prevTokens.current = tokens;
    }
  }, [tokens]);

  return (
    <View style={styles.header}>
      <Animated.Text style={[styles.tokens, { transform: [{ scale: anim }] }]}>💰 {tokens}</Animated.Text>
      <TouchableOpacity onPress={onHowToEarn}>
        <Text style={styles.howToEarn}>How to earn?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.primary },
  tokens: { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  howToEarn: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14, marginLeft: 16 },
});

export default StoreHeader; 