import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getCountdown = (lastMeditationDate) => {
  if (!lastMeditationDate) return { hours: 0, mins: 0, warning: false };
  const lastMed = new Date(lastMeditationDate);
  const expiry = new Date(lastMed.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const msLeft = expiry.getTime() - now.getTime();
  const hours = Math.max(0, Math.floor(msLeft / (1000 * 60 * 60)));
  const mins = Math.max(0, Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)));
  const warning = msLeft < 6 * 60 * 60 * 1000;
  return { hours, mins, warning };
};

const ProfileStatsBar = ({ streak, level, xp, xpForNext, globalRank, lastMeditationDate }) => {
  const progress = Math.min(xp / xpForNext, 1);
  const { hours, mins, warning } = useMemo(() => getCountdown(lastMeditationDate), [lastMeditationDate]);
  return (
    <View style={styles.pill}>
      {/* Streak */}
      <View style={styles.statCol}>
        <View style={styles.rowCenter}>
          <Ionicons name="flame" size={18} color="#FFD580" style={{marginRight:2}} />
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
        <Text style={[styles.timer, warning && styles.timerWarning]}>
          {hours}h {mins}m left
        </Text>
      </View>
      {/* Level */}
      <View style={styles.statCol}>
        <Text style={styles.levelPill}>Level {level}</Text>
      </View>
      {/* XP Bar */}
      <View style={styles.xpCol}>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{xp} / {xpForNext} XP</Text>
      </View>
      {/* Global Rank */}
      <View style={styles.statCol}>
        <Text style={styles.rankPill}>{globalRank}</Text>
        <Text style={styles.label}>Rank</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35,32,20,0.85)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statCol: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 48,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  streakNum: { color: '#FFD580', fontWeight: 'bold', fontSize: 16 },
  label: { color: '#FFD580', fontSize: 11, marginTop: 2 },
  timer: { color: '#fff', fontSize: 11, marginTop: 2 },
  timerWarning: { color: '#FF8C42', fontWeight: 'bold' },
  levelPill: { backgroundColor: '#FFD580', color: '#232014', fontWeight: 'bold', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2, fontSize: 14, overflow: 'hidden', marginBottom: 2 },
  xpCol: { flex: 1, alignItems: 'center', marginHorizontal: 8 },
  xpBarBg: { width: '100%', height: 8, backgroundColor: '#444', borderRadius: 4, overflow: 'hidden', marginBottom: 2 },
  xpBarFill: { height: '100%', backgroundColor: '#FFD580' },
  xpText: { color: '#fff', fontSize: 11 },
  rankPill: { backgroundColor: '#FFD580', color: '#232014', fontWeight: 'bold', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2, fontSize: 14, overflow: 'hidden', marginBottom: 2 },
});

export default ProfileStatsBar; 