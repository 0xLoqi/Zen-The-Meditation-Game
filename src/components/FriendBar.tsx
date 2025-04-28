import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useGameStore } from '../store';
import { COLORS } from '../constants/theme';
import { setFriendCode } from '../firebase/user';
import MiniZenni from './MiniZenni';
import cosmetics from '../../assets/data/cosmetics.json';
import { cosmeticImages } from './Store/cosmeticImages';
import { Ionicons } from '@expo/vector-icons';

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

const MOCK_NAMES = ['Alex', 'Sam', 'Milo'];
function generateMockFriends() {
  return MOCK_NAMES.map((name, i) => ({
    name,
    level: Math.floor(Math.random() * 10) + 1,
    streak: Math.floor(Math.random() * 20) + 1,
    hasMeditatedToday: Math.random() > 0.5,
    ...getRandomFriendProps(),
  }));
}

const FriendDen = () => {
  const friends = useGameStore((s) => s.friends);
  const hasRealFriends = friends && friends.length > 0;
  const mockFriends = generateMockFriends();

  return (
    <View style={styles.denRowBg}>
      <View style={styles.denRow}>
        {(hasRealFriends ? friends : mockFriends).map((f, i) => (
          <View key={f.name} style={styles.friendCol}>
            <View style={styles.avatarCircle}>
              <MiniZenni
                outfitId={f.outfitId}
                headgearId={f.headgearId}
                auraId={f.auraId}
                faceId={f.faceId}
                accessoryId={f.accessoryId}
                companionId={f.companionId}
                size="small"
                style={{ opacity: 0.95, transform: [{ scale: 0.7 }] }}
              />
            </View>
            <Text style={styles.friendName}>{f.name}</Text>
            <View style={styles.levelStreakRow}>
              <Text style={styles.levelText}>Lvl {f.level}</Text>
              <Ionicons name="flame" size={13} color={f.hasMeditatedToday ? '#FFB300' : '#A0A0A0'} style={{ marginLeft: 10, marginRight: 2 }} />
              <Text style={[styles.streakNum, { color: f.hasMeditatedToday ? '#232014' : '#A0A0A0' }]}>{f.streak}</Text>
            </View>
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
    marginTop: 20,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  friendCol: {
    alignItems: 'center',
    marginRight: 18,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  mockAvatarCircle: {
    backgroundColor: '#232014',
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  friendInitial: {
    color: '#cd8500',
    fontSize: 28,
    fontWeight: 'bold',
  },
  friendName: {
    color: '#cd8500',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
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
    borderRadius: 30,
    marginHorizontal: 4,
    marginBottom: 15,
    marginTop: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  levelStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  levelText: {
    color: '#232014',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 2,
  },
  streakNum: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FriendDen; 