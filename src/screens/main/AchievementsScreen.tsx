import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store';
import achievementsData from '../../../assets/data/achievements.json';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

// Static mapping for badge images
const badgeImages = {
  first_meditation: require('../../../assets/images/badges/first_meditation.png'),
  seven_day_streak: require('../../../assets/images/badges/seven_day_streak.png'),
  first_legendary: require('../../../assets/images/badges/first_legendary.png'),
  early_bird: require('../../../assets/images/badges/early_bird.png'),
  night_owl: require('../../../assets/images/badges/night_owl.png'),
  quest_master: require('../../../assets/images/badges/quest_master.png'),
};
const lockedBadge = require('../../../assets/images/badges/locked_achievement.png');

const AchievementsScreen = () => {
  const unlocked = useGameStore((s) => s.achievements.unlocked);
  const [achievements, setAchievements] = useState<{ id: string; name: string; description: string; icon: string; lockedIcon: string; }[]>([]);

  useEffect(() => {
    setAchievements(achievementsData);
  }, []);

  const renderItem = ({ item }) => {
    const isUnlocked = unlocked.includes(item.id);
    const iconKey = item.icon.replace('.png', '').replace('_colored', '');
    return (
      <View style={styles.badgeContainer}>
        <Image
          source={isUnlocked ? badgeImages[iconKey] : lockedBadge}
          style={[styles.badgeImage, !isUnlocked && styles.lockedBadge]}
        />
        <Text style={styles.badgeName}>{item.name}</Text>
        <Text style={styles.badgeDesc}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: SPACING.l,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    flexBasis: '45%',
    maxWidth: '45%',
    margin: '2.5%',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 2,
  },
  badgeImage: {
    width: 80,
    height: 80,
    marginBottom: SPACING.s,
  },
  lockedBadge: {
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  badgeDesc: {
    fontSize: 14,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
});

export default AchievementsScreen; 