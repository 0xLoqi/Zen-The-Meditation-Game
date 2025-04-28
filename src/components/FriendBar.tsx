import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useGameStore } from '../store';
import { COLORS } from '../constants/theme';
import { setFriendCode } from '../firebase/user';
import MiniZenni from './MiniZenni';
import cosmetics from '../../assets/data/cosmetics.json';
import { cosmeticImages } from './Store/cosmeticImages';

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

function getRandomCosmeticId(category) {
  const filtered = cosmetics.filter((c) => c.category === category);
  if (!filtered.length) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)].id;
}

function getRandomFriendProps() {
  return {
    outfitId: getRandomCosmeticId('outfit'),
    headgearId: getRandomCosmeticId('headgear'),
    auraId: getRandomCosmeticId('aura'),
    faceId: getRandomCosmeticId('face'),
    accessoryId: getRandomCosmeticId('accessory'),
    companionId: getRandomCosmeticId('companion'),
  };
}

const MOCK_NAMES = ['Milo', 'Nova', 'Echo'];

const FriendDen = () => {
  const friends = useGameStore((s) => s.friends);
  const hasRealFriends = friends && friends.length > 0;
  const mockFriends = Array.from({ length: 3 }).map((_, i) => ({
    ...getRandomFriendProps(),
    name: MOCK_NAMES[i] || `Friend${i + 1}`,
  }));

  return (
    <View style={styles.denRowBg}>
      <View style={styles.denRow}>
        {hasRealFriends
          ? friends.map((friend) => (
              <View key={friend.id} style={styles.friendCol}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.friendInitial}>{friend.name[0]}</Text>
                </View>
                <Text style={styles.friendName}>{friend.name}</Text>
              </View>
            ))
          : mockFriends.map((f, i) => (
              <View key={f.name} style={styles.friendCol}>
                <View style={[styles.avatarCircle, styles.mockAvatarCircle]}>
                  <MiniZenni {...f} size="small" style={{ opacity: 0.45 }} />
                </View>
                <Text style={[styles.friendName, styles.mockName]}>{f.name}</Text>
              </View>
            ))}
        <View style={styles.friendCol}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <View style={styles.addCircle}>
              <Text style={styles.addPlus}>+</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.friendName, { opacity: 0 }]}>Add</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  denRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  friendCol: {
    alignItems: 'center',
    marginRight: 18,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#232014',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  mockAvatarCircle: {
    backgroundColor: '#232014',
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  friendInitial: {
    color: '#FFD580',
    fontSize: 28,
    fontWeight: 'bold',
  },
  friendName: {
    color: '#FFD580',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  mockName: {
    opacity: 0.6,
  },
  addCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  addCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFD580',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addPlus: {
    color: '#232014',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  denRowBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 18,
    marginHorizontal: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default FriendDen; 