import React from 'react';
import { View, StyleSheet } from 'react-native';
import MiniZenni from '../MiniZenni';

const TopFriendsRow = ({ friends }) => {
  if (!Array.isArray(friends) || friends.length === 0) return null;
  return (
    <View style={styles.row}>
      {friends.slice(0,5).map(f => (
        <MiniZenni key={f.id || f.name} size="small" {...f.cosmetics?.equipped || f} style={styles.avatar} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:18 },
  avatar: { marginHorizontal:4 },
});

export default TopFriendsRow; 