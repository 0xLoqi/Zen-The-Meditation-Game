import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GlowPointButton = ({ profile, isOwn }) => {
  // Placeholder: profile.glowPointsReceived, profile.glowPointsGivenToday
  const canGive = !isOwn && (profile.glowPointsGivenToday || 0) < 10;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="heart" size={24} color="#FF8C42" />
        <Text style={styles.count}>{profile.glowPointsReceived || 0}</Text>
        <Text style={styles.label}>GlowPoints</Text>
      </View>
      {!isOwn && (
        <TouchableOpacity style={[styles.giveBtn, !canGive && styles.giveBtnDisabled]} disabled={!canGive}>
          <Text style={styles.giveBtnText}>{canGive ? 'Give GlowPoint' : 'No hearts left today'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems:'center', marginBottom:18 },
  row: { flexDirection:'row', alignItems:'center', marginBottom:4 },
  count: { color:'#FFD580', fontWeight:'bold', fontSize:18, marginLeft:8, marginRight:4 },
  label: { color:'#fff', fontSize:14 },
  giveBtn: { backgroundColor:'#FFD580', borderRadius:12, paddingVertical:6, paddingHorizontal:18, marginTop:6 },
  giveBtnDisabled: { backgroundColor:'#ccc' },
  giveBtnText: { color:'#232014', fontWeight:'bold' },
});

export default GlowPointButton; 