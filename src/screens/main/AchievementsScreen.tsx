import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useGameStore } from '../../store';
import achievementsData from '../../../assets/data/achievements.json';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

// Static mapping for badge images
const badgeImages = {
  first_meditation_colored: require('../../../assets/images/badges/first_meditation_colored.png'),
  first_meditation_locked: require('../../../assets/images/badges/first_meditation_locked.png'),
  seven_day_streak_colored: require('../../../assets/images/badges/seven_day_streak_colored.png'),
  seven_day_streak_locked: require('../../../assets/images/badges/seven_day_streak_locked.png'),
  first_legendary_colored: require('../../../assets/images/badges/first_legendary_colored.png'),
  first_legendary_locked: require('../../../assets/images/badges/first_legendary_locked.png'),
  early_bird_colored: require('../../../assets/images/badges/early_bird_colored.png'),
  early_bird_locked: require('../../../assets/images/badges/early_bird_locked.png'),
  night_owl_colored: require('../../../assets/images/badges/night_owl_colored.png'),
  night_owl_locked: require('../../../assets/images/badges/night_owl_locked.png'),
  quest_master_colored: require('../../../assets/images/badges/quest_master_colored.png'),
  quest_master_locked: require('../../../assets/images/badges/quest_master_locked.png'),
};

const AchievementsScreen = () => {
  const unlocked = useGameStore((s) => s.achievements.unlocked);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setAchievements(achievementsData);
  }, []);

  const renderItem = ({ item }) => {
    const isUnlocked = unlocked.includes(item.id);
    const iconKey = isUnlocked ? item.icon.replace('.png', '') : item.lockedIcon.replace('.png', '');
    return (
      <View style={styles.badgeContainer}>
        <Image
          source={badgeImages[iconKey]}
          style={[styles.badgeImage, !isUnlocked && styles.lockedBadge]}
        />
        <Text style={styles.badgeName}>{item.name}</Text>
        <Text style={styles.badgeDesc}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  title: {
    ...FONTS.heading.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  grid: {
    alignItems: 'center',
  },
  badgeContainer: {
    flex: 1,
    alignItems: 'center',
    margin: SPACING.m,
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
    ...FONTS.heading.h4,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  badgeDesc: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
});

export default AchievementsScreen; 