import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RewardType } from './GlowCardReveal'; // Reuse types if possible

// Reuse helper functions or redefine simplified versions if needed
const TOKEN_ICON = require('../../assets/images/coin.png');
const rewardIcon = (reward: RewardType | null) => {
  if (!reward || reward.type !== 'tokens') return TOKEN_ICON; // Only handle tokens for now
  return TOKEN_ICON;
};
const rewardText = (reward: RewardType | null): string => {
  if (!reward || reward.type !== 'tokens') return '';
  return `${reward.amount} Tokens`;
};

interface SimpleRewardDisplayProps {
  reward: RewardType;
}

const SimpleRewardDisplay: React.FC<SimpleRewardDisplayProps> = ({ reward }) => {
  return (
    <View style={styles.card}>
      <Image source={rewardIcon(reward)} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text}>{rewardText(reward)}</Text>
      {/* Add any card background/styling here */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333', // Example card style
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    minHeight: 200,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SimpleRewardDisplay; 