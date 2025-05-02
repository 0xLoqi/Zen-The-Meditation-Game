import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getXPForNextLevel } from '../../firebase/meditation';

const XPBar = ({ xp, level, globalRank }) => {
  const xpForNext = getXPForNextLevel(level - 1);
  const progress = Math.min(xp / xpForNext, 1);
  return (
    <View style={styles.container}>
      <View style={styles.levelRow}>
        <Text style={styles.levelText}>Level {level}</Text>
        {globalRank && (
          <View style={styles.rankPill}>
            <Text style={styles.rankText}>{globalRank}</Text>
          </View>
        )}
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>{xp} / {xpForNext} XP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems:'center', marginBottom:18 },
  levelRow: { flexDirection:'row', alignItems:'center', marginBottom:4 },
  levelText: { color:'#FFD580', fontWeight:'bold', fontSize:18, marginRight:8 },
  rankPill: { backgroundColor:'#232014', borderRadius:12, paddingHorizontal:10, paddingVertical:2, marginLeft:4 },
  rankText: { color:'#FFD580', fontWeight:'bold', fontSize:14 },
  barBg: { width:'100%', height:10, backgroundColor:'#444', borderRadius:5, overflow:'hidden', marginBottom:2 },
  barFill: { height:'100%', backgroundColor:'#FFD580' },
  xpText: { color:'#fff', fontSize:12 },
});

export default XPBar; 