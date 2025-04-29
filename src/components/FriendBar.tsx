import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { useGameStore, fetchAndSetFriendsFromFirestore } from '../store';
import { ensureSignedIn } from '../firebase';
import { COLORS, SIZES } from '../constants/theme';
import { setFriendCode } from '../firebase/user';
import MiniZenni from './MiniZenni';
import cosmetics from '../../assets/data/cosmetics.json';
import { cosmeticImages } from './Store/cosmeticImages';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

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
    id: `mock-${i}`,
    level: Math.floor(Math.random() * 10) + 1,
    streak: Math.floor(Math.random() * 20) + 1,
    hasMeditatedToday: Math.random() > 0.5,
    ...getRandomFriendProps(),
  }));
}

const FRIEND_IDS = ['jimmy-leaderboard', 'sean-leaderboard'];

// Helper to get streak badge color and animation based on streak value
function getStreakBadgeProps(streak) {
  if (streak <= 0) {
    return { bg: '#FFF', color: '#A0A0A0', border: '#FFD580', animation: null };
  } else if (streak < 4) {
    return { bg: '#FFF', color: '#FFD580', border: '#FFD580', animation: null };
  } else if (streak < 8) {
    return { bg: '#FFB300', color: '#FFF', border: '#FF8C42', animation: 'pulse', duration: 2200, intensity: 0.8 };
  } else if (streak < 14) {
    return { bg: '#FFE0E0', color: '#FF5722', border: '#FF8C42', animation: 'pulse', duration: 1400, intensity: 1.0 };
  } else {
    // Super streak: more intense pulse
    return { bg: '#FFF8E1', color: '#FF3B30', border: '#FF8C42', animation: 'pulse', duration: 900, intensity: 1.2 };
  }
}

const FriendDen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Profile'>>();
  React.useEffect(() => {
    (async () => {
      try {
        await ensureSignedIn();
        fetchAndSetFriendsFromFirestore(FRIEND_IDS);
      } catch (err) {
        console.error('Auth or fetch failed:', err);
      }
    })();
  }, []);
  const friends = useGameStore((s) => s.friends);
  const hasRealFriends = friends && friends.length > 0;
  const [mockFriends] = useState(() => generateMockFriends());

  return (
    <View style={styles.denRowBg}>
      <View style={styles.denRow}>
        {(hasRealFriends ? friends : mockFriends).map((f) => (
          <TouchableOpacity
            key={f.id}
            style={styles.friendCol}
            onPress={() => navigation.navigate('Profile', { friend: f })}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <MiniZenni
                {...(f.cosmetics?.equipped || f)}
                size="small"
                style={{ opacity: 0.95, transform: [{ scale: 0.7 }] }}
              />
            </View>
            <Text style={styles.friendName}>{f.name}</Text>
            <View style={styles.levelStreakRow}>
              <Text style={styles.levelText}>Lvl {f.level}</Text>
              {(() => {
                const { bg, color, border, animation, duration, intensity } = getStreakBadgeProps(f.streak);
                const badge = (
                  <View style={[styles.streakBadge, { backgroundColor: bg, borderColor: border }]}> 
                    <Ionicons name="flame" size={15} color={color} style={{ marginRight: 2 }} />
                    <Text style={[styles.streakNum, { color }]}>{f.streak}</Text>
                  </View>
                );
                if (animation) {
                  return (
                    <Animatable.View
                      animation={animation}
                      iterationCount="infinite"
                      duration={duration}
                      easing="ease-in-out"
                      style={{ transform: [{ scale: intensity }] }}
                    >
                      {badge}
                    </Animatable.View>
                  );
                }
                return badge;
              })()}
            </View>
          </TouchableOpacity>
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
    borderRadius: SIZES.radiusLarge,
    marginHorizontal: 4,
    marginBottom: 15,
    marginTop: 0,
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
  streakBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8, borderWidth: 1 },
});

export default FriendDen; 