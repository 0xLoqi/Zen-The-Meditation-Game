import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function getCountdown(lastMeditationDate) {
  if (!lastMeditationDate) return { hours: 0, mins: 0, warning: false };
  const lastMed = new Date(lastMeditationDate);
  const expiry = new Date(lastMed.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const msLeft = expiry.getTime() - now.getTime();
  const hours = Math.max(0, Math.floor(msLeft / (1000 * 60 * 60)));
  const mins = Math.max(0, Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)));
  const warning = msLeft < 6 * 60 * 60 * 1000;
  return { hours, mins, warning };
}

const StreakTimer = ({ streak, lastMeditationDate }) => {
  const { hours, mins, warning } = useMemo(() => getCountdown(lastMeditationDate), [lastMeditationDate]);
  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Ionicons name="flame" size={28} color={warning ? '#FF8C42' : '#FFD580'} />
        <Text style={[styles.streakText, warning && styles.streakWarning]}>Streak: {streak || 0} days</Text>
      </View>
      <Text style={[styles.countdown, warning && styles.countdownWarning]}>
        Expires in {hours}h {mins}m
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems:'center', marginBottom:18 },
  streakRow: { flexDirection:'row', alignItems:'center', marginBottom:2 },
  streakText: { color:'#FFD580', fontWeight:'bold', fontSize:18, marginLeft:8 },
  streakWarning: { color:'#FF8C42' },
  countdown: { color:'#fff', fontSize:14 },
  countdownWarning: { color:'#FF8C42', fontWeight:'bold' },
});

export default StreakTimer; 