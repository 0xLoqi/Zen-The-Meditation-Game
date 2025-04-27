import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useGameStore } from '../store';
import { COLORS } from '../constants/theme';
import { setFriendCode } from '../firebase/user';

const shareReferral = async () => {
  // For demo: use a static userId, in real app use auth
  const userId = 'demoUser';
  let code = 'demo-code'; // Placeholder referral code
  await setFriendCode(userId, code);
  const url = `https://yourapp.com/?code=${code}`;
  const message = `Join me on Zen! Use my link to get rewards: ${url}`;
  try {
    await Share.share({ message });
  } catch (error) {
    alert(message);
  }
};

const FriendBar = () => {
  const friends = useGameStore((s) => s.friends);

  if (!friends || friends.length === 0) {
    return (
      <TouchableOpacity style={styles.addFriendContainer} onPress={shareReferral}>
        <Text style={styles.addFriendPlus}>+</Text>
        <Text style={styles.addFriendText}>Add a friend!</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bar}>
      {friends.map((friend) => (
        <View key={friend.id} style={styles.friendBubble}>
          <Text style={styles.friendInitial}>{friend.name[0]}</Text>
          <Text style={styles.friendName}>{friend.name}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.addFriendBubble} onPress={shareReferral}>
        <Text style={styles.addFriendPlus}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
  },
  friendBubble: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  friendInitial: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  friendName: {
    color: COLORS.white,
    fontSize: 10,
  },
  addFriendBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 24,
    width: 48,
    height: 48,
  },
  addFriendPlus: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.success,
    borderRadius: 24,
    margin: 12,
    justifyContent: 'center',
  },
  addFriendText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default FriendBar; 