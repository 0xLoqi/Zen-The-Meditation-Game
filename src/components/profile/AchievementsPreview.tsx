import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

const AchievementsPreview = ({ achievements, darkMode }) => {
  const navigation = useNavigation();
  const unlocked = Array.isArray(achievements) ? achievements : [];
  // Show up to 3 unlocked, fallback to 3 locked
  const unlockedData = achievementsData.filter(a => unlocked.includes(a.id)).slice(-3);
  const lockedData = achievementsData.filter(a => !unlocked.includes(a.id)).slice(0, 3 - unlockedData.length);
  const display = [...unlockedData, ...lockedData];
  return (
    <View style={[styles.achievementsContainer, darkMode && { backgroundColor: 'rgba(35,32,20,0.95)' }] }>
      {display.map((ach, i) => (
        <View key={ach.id} style={styles.achievementCard}>
          <Image
            source={unlocked.includes(ach.id) ? badgeImages[ach.id] : lockedBadge}
            style={[styles.achievementIcon, !unlocked.includes(ach.id) && { opacity: 0.4 }]}
          />
          <View style={styles.achievementTextStack}>
            <Text style={[styles.achievementName, darkMode && { color: '#fff' }]}>{ach.name}</Text>
            <Text style={[styles.achievementDescription, darkMode && { color: '#FFD580' }]}>{ach.description}</Text>
          </View>
        </View>
      ))}
      <Text style={[styles.viewAllText, darkMode && { color: '#FFD580' }]} onPress={()=>navigation.navigate('Achievements')}>View All</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  achievementsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'column',
    minWidth: 90,
    maxWidth: 110,
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
  achievementDescription: {
    fontWeight: 'normal',
    fontSize: 11,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  viewAllText: {
    color: '#FF8C42',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 13,
  },
});

export default AchievementsPreview; 