import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useGameStore, fetchAndSetFriendsFromFirestore } from '../store';
import { useUserStore } from '../store/userStore';
import { COLORS } from '../constants/theme';
import MiniZenni from './MiniZenni';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const trophyImages = [
  require('../../assets/images/leaderboard_trophy/first_place.png'),
  require('../../assets/images/leaderboard_trophy/second_place.png'),
  require('../../assets/images/leaderboard_trophy/third_place.png'),
];

// Trophy sizes for 1st, 2nd, 3rd
const trophySizes = [48, 40, 32];

// AnimatedTrophy component for top 3
const AnimatedTrophy = ({ idx, source }) => {
  const scale = useSharedValue(0);
  React.useEffect(() => {
    scale.value = withDelay(idx * 200, withSpring(1, { damping: 6 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={style}>
      <Image
        source={source}
        style={{ width: trophySizes[idx], height: trophySizes[idx], marginRight: 8, resizeMode: 'contain' }}
      />
    </Animated.View>
  );
};

const FRIEND_IDS = ['jimmy-leaderboard', 'sean-leaderboard'];

// Shared utility to map equipped cosmetics to MiniZenni props
function equippedToMiniZenniProps(equipped) {
  if (!equipped) return {};
  return {
    outfitId: equipped.outfit || undefined,
    headgearId: equipped.headgear || undefined,
    auraId: equipped.aura || undefined,
    faceId: equipped.face || undefined,
    accessoryId: equipped.accessory ? equipped.accessory.split(',').filter(Boolean) : undefined,
    companionId: equipped.companion || undefined,
  };
}

const Leaderboard = () => {
  const navigation = useNavigation();
  const friends = useGameStore((s) => s.friends);
  const userData = useUserStore((s) => s.userData);
  const equipped = userData?.cosmetics?.equipped || {};

  React.useEffect(() => {
    fetchAndSetFriendsFromFirestore(FRIEND_IDS);
  }, []);

  // Add self to leaderboard
  const leaderboard = [
    ...friends.map(f => ({
      ...f,
      ...equippedToMiniZenniProps((f.cosmetics && f.cosmetics.equipped) || f),
    })),
    {
      id: userData?.uid || 'me',
      name: userData?.username || 'You',
      xp: userData?.xp || 0,
      level: userData?.level || 1,
      ...equippedToMiniZenniProps(equipped),
      isSelf: true,
    },
  ].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <View style={styles.container}>
      {leaderboard.map((entry, idx) => {
        const isTop3 = idx < 3;
        const isSelf = entry.isSelf;
        return (
          <TouchableOpacity
            key={entry.id}
            onPress={() => {
              if (isSelf) {
                navigation.navigate('Profile');
              } else {
                navigation.navigate('Profile', { friend: entry });
              }
            }}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.row,
                isTop3 && styles.topRow,
                isSelf && styles.selfRow,
              ]}
            >
              {/* Trophy for top 3 */}
              {isTop3 && (
                <AnimatedTrophy idx={idx} source={trophyImages[idx]} />
              )}
              <Text style={styles.rank}>{idx + 1}.</Text>
              <MiniZenni
                outfitId={entry.outfitId}
                headgearId={entry.headgearId}
                auraId={entry.auraId}
                faceId={entry.faceId}
                accessoryId={entry.accessoryId}
                companionId={entry.companionId}
                size="small"
                animationState={isTop3 ? 'success' : 'idle'}
                style={{ marginLeft: 6, marginRight: 10 }}
              />
              <Text style={[styles.name, isSelf && styles.selfName]}>{entry.name}</Text>
              <Text style={styles.xp}>Level {entry.level || 1}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      {/* Dividers between rows */}
      {leaderboard.length > 1 && leaderboard.map((_, idx) =>
        idx < leaderboard.length - 1 ? (
          <View key={idx + '-divider'} style={styles.divider} />
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 12,
    padding: 0,
    overflow: 'hidden',
    ...(
      // @ts-ignore
      COLORS.shadow ? { shadowColor: COLORS.shadow } : {}
    ),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  topRow: {
    backgroundColor: '#FFF8E1',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  selfRow: {
    borderWidth: 1,
    borderColor: '#B3E5FC',
    backgroundColor: '#F7FBFD',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 16,
  },
  rank: {
    fontWeight: 'bold',
    color: COLORS.accent,
    fontSize: 18,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.neutralDark,
    fontSize: 16,
    marginLeft: 8,
  },
  xp: {
    fontWeight: 'normal',
    color: COLORS.neutralMedium,
    fontSize: 15,
    marginLeft: 8,
  },
  selfName: {
    color: '#90A4AE',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
});

export default Leaderboard; 