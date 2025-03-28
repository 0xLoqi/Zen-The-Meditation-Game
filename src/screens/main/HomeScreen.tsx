import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { triggerHapticFeedback } from '../../utils/haptics';
import { formatStreak } from '../../utils/formatters';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { signOut } = useAuthStore();
  const { userData, isLoadingUser, userError, getUserData, todayCheckIn, getTodayCheckIn } = useUserStore();
  
  useEffect(() => {
    getUserData();
    getTodayCheckIn();
  }, []);

  const handleMeditatePress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('MeditationSelection');
  };
  
  const handleDailyCheckInPress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('DailyCheckIn');
  };
  
  const handleWardrobePress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('Wardrobe');
  };
  
  const handleGuruModePress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('GuruMode');
  };
  
  const handleReferralPress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('Referral');
  };
  
  const handleSignOut = async () => {
    triggerHapticFeedback('selection');
    await signOut();
  };

  if (isLoadingUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (userError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{userError}</Text>
          <Button title="Retry" onPress={getUserData} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with User Info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              Hi, {userData?.username || 'Zen User'}
            </Text>
            <Text style={styles.userStats}>
              Level {userData?.level || 1} · {userData?.streak || 0} Day Streak
            </Text>
          </View>
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.neutralDark} />
          </TouchableOpacity>
        </View>
        
        {/* Daily Check-In Card */}
        <Card
          variant={todayCheckIn ? 'flat' : 'default'}
          style={styles.dailyCheckInCard}
          onPress={handleDailyCheckInPress}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="sunny-outline" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>
                {todayCheckIn ? 'Daily Check-In Complete!' : 'Daily Check-In'}
              </Text>
              <Text style={styles.cardDescription}>
                {todayCheckIn
                  ? 'You\'ve completed your check-in for today.'
                  : 'How are you feeling today? Record your mood.'}
              </Text>
            </View>
            <Ionicons
              name={todayCheckIn ? 'checkmark-circle' : 'chevron-forward'}
              size={24}
              color={todayCheckIn ? COLORS.success : COLORS.neutralMedium}
            />
          </View>
        </Card>
        
        {/* Main Action Button */}
        <Button
          title="Meditate Now"
          onPress={handleMeditatePress}
          variant="primary"
          size="large"
          style={styles.meditateButton}
          leftIcon={<Ionicons name="flower-outline" size={24} color={COLORS.white} style={{marginRight: SPACING.s}} />}
        />
        
        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {/* Wardrobe Card */}
          <Card style={styles.featureCard} onPress={handleWardrobePress}>
            <View style={styles.featureCardContent}>
              <Ionicons name="shirt-outline" size={32} color={COLORS.primary} />
              <Text style={styles.featureCardTitle}>Wardrobe</Text>
              <Text style={styles.featureCardDescription}>
                Customize your Zenni companion
              </Text>
            </View>
          </Card>
          
          {/* Guru Mode Card */}
          <Card style={styles.featureCard} onPress={handleGuruModePress}>
            <View style={styles.featureCardContent}>
              <Ionicons name="bulb-outline" size={32} color={COLORS.primary} />
              <Text style={styles.featureCardTitle}>Guru Mode</Text>
              <Text style={styles.featureCardDescription}>
                AI guidance for your meditation
              </Text>
            </View>
          </Card>
          
          {/* Referral Card */}
          <Card style={styles.featureCard} onPress={handleReferralPress}>
            <View style={styles.featureCardContent}>
              <Ionicons name="share-outline" size={32} color={COLORS.primary} />
              <Text style={styles.featureCardTitle}>Invite Friends</Text>
              <Text style={styles.featureCardDescription}>
                Share Zen and earn rewards
              </Text>
            </View>
          </Card>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Your Zen Journey</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData?.xp || 0}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData?.tokens || 0}</Text>
              <Text style={styles.statLabel}>Tokens</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData?.streak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    ...FONTS.heading.h2,
    color: COLORS.neutralDark,
    fontWeight: 'bold' as const,
  },
  userStats: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
  },
  signOutButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  errorText: {
    ...FONTS.body.regular,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  dailyCheckInCard: {
    marginBottom: SPACING.m,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    marginRight: SPACING.m,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...FONTS.body.regular,
    fontWeight: 'bold' as const,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
  },
  meditateButton: {
    marginBottom: SPACING.l,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  featureCard: {
    width: '48%',
    marginBottom: SPACING.m,
  },
  featureCardContent: {
    alignItems: 'center',
    padding: SPACING.s,
  },
  featureCardTitle: {
    ...FONTS.body.regular,
    fontWeight: 'bold' as const,
    color: COLORS.neutralDark,
    marginTop: SPACING.s,
    marginBottom: SPACING.xs,
  },
  featureCardDescription: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.medium,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  statsSectionTitle: {
    ...FONTS.body.regular,
    fontWeight: 'bold' as const,
    color: COLORS.neutralDark,
    marginBottom: SPACING.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.heading.h3,
    color: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  statLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
  },
});

export default HomeScreen;