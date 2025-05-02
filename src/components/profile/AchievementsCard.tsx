import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const badgeImages = {
  first_meditation: require('../../../assets/images/badges/first_meditation.png'),
  seven_day_streak: require('../../../assets/images/badges/seven_day_streak.png'),
  first_legendary: require('../../../assets/images/badges/first_legendary.png'),
  early_bird: require('../../../assets/images/badges/early_bird.png'),
  night_owl: require('../../../assets/images/badges/night_owl.png'),
  quest_master: require('../../../assets/images/badges/quest_master.png'),
};
const lockedBadge = require('../../../assets/images/badges/locked_achievement.png');
const achievementsData = require('../../../assets/data/achievements.json');

const AchievementsCard = ({ achievements = [], darkMode }) => {
  const navigation = useNavigation();
  const unlocked = Array.isArray(achievements) ? achievements : [];
  // Show up to 3 unlocked, fallback to 3 locked
  const unlockedData = achievementsData.filter(a => unlocked.includes(a.id)).slice(-3);
  const lockedData = achievementsData.filter(a => !unlocked.includes(a.id)).slice(0, 3 - unlockedData.length);
  const display = [...unlockedData, ...lockedData];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Achievements')}
      style={{width: '100%'}}
    >
      <View style={[styles.achievementsContainer, darkMode && styles.achievementsContainerDark]}>
        <View style={styles.achievementsRow}>
          {display.map((ach, i) => (
            <View key={ach.id} style={[styles.achievementCard, darkMode && styles.achievementCardDark]}>
              <Image
                source={unlocked.includes(ach.id) ? badgeImages[ach.id] : lockedBadge}
                style={[styles.achievementIcon, !unlocked.includes(ach.id) && { opacity: 0.4 }]}
              />
              <View style={styles.achievementTextStack}>
                <Text style={[styles.achievementName, darkMode && styles.achievementNameDark]}>{ach.name}</Text>
                <Text style={[styles.achievementDescription, darkMode && styles.achievementDescriptionDark]}>{ach.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  achievementsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  achievementsContainerDark: {
    backgroundColor: 'rgba(35,32,20,0.95)',
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    marginBottom: 4,
  },
  achievementCard: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'column',
    width: 90,
    marginHorizontal: 6,
  },
  achievementCardDark: {
    backgroundColor: '#232014',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  achievementTextStack: {
    alignItems: 'center',
  },
  achievementName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#232014',
    marginBottom: 2,
    textAlign: 'center',
  },
  achievementNameDark: {
    color: '#fff',
  },
  achievementDescription: {
    fontWeight: 'normal',
    fontSize: 11,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  achievementDescriptionDark: {
    color: '#FFD580',
  },
});

export default AchievementsCard; 