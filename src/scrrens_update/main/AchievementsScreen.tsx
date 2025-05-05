import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
const bgImg = require('../../../assets/images/backgrounds/Achievements_bg.png');

const AchievementsScreen = () => {
  const unlocked = useGameStore((s) => s.achievements.unlocked);
  const [achievements, setAchievements] = useState<{ id: string; name: string; description: string; icon: string; lockedIcon: string; }[]>([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    <ImageBackground source={bgImg} style={{flex:1}} resizeMode="cover">
      <SafeAreaView style={{flex:1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 18, left: insets.left + 18 }]} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFD580" />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text style={styles.title}>Achievements</Text>
        </View>
        <FlatList
          data={achievements}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  titlePill: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B68900',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingBottom: 32,
  },
  badgeContainer: {
    flexBasis: '45%',
    maxWidth: '45%',
    margin: '2.5%',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: '#fff',
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