import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store';
import { COLORS } from '../constants/theme';

const Leaderboard = () => {
  const friends = useGameStore((s) => s.friends);
  const user = useGameStore((s) => s.user);
  // Add self to leaderboard
  const leaderboard = [
    ...friends,
    { id: 'me', name: user.name || 'You', xp: 1000 }, // Replace 1000 with real XP if available
  ].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.map((entry, idx) => (
        <View key={entry.id} style={styles.row}>
          <Text style={styles.rank}>{idx + 1}.</Text>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.xp}>{entry.xp || 0} XP</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 12,
    padding: 12,
    ...(
      // @ts-ignore
      COLORS.shadow ? { shadowColor: COLORS.shadow } : {}
    ),
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rank: {
    width: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.neutralDark,
  },
  xp: {
    fontWeight: 'normal',
    color: COLORS.neutralMedium,
  },
});

export default Leaderboard; 