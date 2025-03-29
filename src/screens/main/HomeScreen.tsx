import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
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
          <TouchableOpacity onPress={getUserData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={require('../../../assets/images/minizenni.png')} 
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{userData?.username || 'ZenUser'}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {userData?.level || 1}</Text>
              </View>
              <View style={styles.xpContainer}>
                <View style={styles.xpBarContainer}>
                  <View style={[styles.xpBar, { width: '87.5%' }]} />
                </View>
                <Text style={styles.xpText}>350/400 XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>{userData?.streak || 7}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="meditation" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{userData?.xp || 350}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <FontAwesome5 name="coins" size={20} color={COLORS.accent} />
            <Text style={styles.statValue}>{userData?.tokens || 120}</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
        </View>

        {/* Start Meditation Button */}
        <TouchableOpacity 
          style={styles.meditateButton}
          onPress={handleMeditatePress}
          activeOpacity={0.8}
        >
          <View style={styles.meditateButtonContent}>
            <View style={styles.meditateIconContainer}>
              <MaterialCommunityIcons name="meditation" size={32} color={COLORS.white} />
            </View>
            <View style={styles.meditateTextContainer}>
              <Text style={styles.meditateButtonTitle}>Start Meditation</Text>
              <Text style={styles.meditateButtonSubtitle}>Choose type and duration</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          <TouchableOpacity 
            style={styles.featureItem}
            onPress={handleDailyCheckInPress}
            activeOpacity={0.7}
          >
            <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="calendar" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.featureLabel}>Daily{'\n'}Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={handleWardrobePress}
            activeOpacity={0.7}
          >
            <View style={[styles.featureIcon, { backgroundColor: COLORS.accentLight }]}>
              <Ionicons name="shirt-outline" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.featureLabel}>Zenni{'\n'}Wardrobe</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={handleGuruModePress}
            activeOpacity={0.7}
          >
            <View style={[styles.featureIcon, { backgroundColor: COLORS.tertiaryLight }]}>
              <Ionicons name="sparkles" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.featureLabel}>Guru{'\n'}Mode</Text>
          </TouchableOpacity>
        </View>

        {/* Meditation Types */}
        <Text style={styles.sectionTitle}>Meditation Types</Text>

        <TouchableOpacity 
          style={[styles.meditationCard, { backgroundColor: COLORS.calmColor }]}
          onPress={handleMeditatePress}
          activeOpacity={0.8}
        >
          <View style={styles.meditationCardContent}>
            <View style={styles.meditationIconContainer}>
              <Ionicons name="water-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.meditationTextContainer}>
              <Text style={styles.meditationTitle}>Calm Meditation</Text>
              <Text style={styles.meditationDescription}>Relax anxiety and find inner peace</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.meditationCard, { backgroundColor: COLORS.focusColor }]}
          onPress={handleMeditatePress}
          activeOpacity={0.8}
        >
          <View style={styles.meditationCardContent}>
            <View style={styles.meditationIconContainer}>
              <Ionicons name="bulb-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.meditationTextContainer}>
              <Text style={styles.meditationTitle}>Focus Meditation</Text>
              <Text style={styles.meditationDescription}>Improve concentration and clarity</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.meditationCard, { backgroundColor: COLORS.sleepColor }]}
          onPress={handleMeditatePress}
          activeOpacity={0.8}
        >
          <View style={styles.meditationCardContent}>
            <View style={styles.meditationIconContainer}>
              <Ionicons name="moon-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.meditationTextContainer}>
              <Text style={styles.meditationTitle}>Sleep Meditation</Text>
              <Text style={styles.meditationDescription}>Improve sleep quality and relaxation</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color={COLORS.primary} />
          <Text style={[styles.tabLabel, { color: COLORS.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={handleMeditatePress}
        >
          <MaterialCommunityIcons name="meditation" size={24} color={COLORS.neutralMedium} />
          <Text style={styles.tabLabel}>Meditate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={handleWardrobePress}
        >
          <Ionicons name="person" size={24} color={COLORS.neutralMedium} />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.neutralMedium} />
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 80, // Space for tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
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
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: SIZES.radiusMedium,
  },
  retryButtonText: {
    ...FONTS.body.regular,
    color: COLORS.white,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    ...SHADOWS.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 80,
    height: 80,
    marginRight: SPACING.m,
  },
  profileInfo: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  username: {
    ...FONTS.heading.h2,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  levelBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusSmall,
    alignSelf: 'flex-start',
    marginBottom: SPACING.s,
  },
  levelText: {
    ...FONTS.body.small,
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
  xpContainer: {
    width: '100%',
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  xpBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  xpText: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    marginTop: SPACING.m,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...FONTS.heading.h2,
    color: COLORS.neutralDark,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  meditateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    marginVertical: SPACING.m,
    ...SHADOWS.medium,
  },
  meditateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  meditateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  meditateTextContainer: {
    flex: 1,
  },
  meditateButtonTitle: {
    ...FONTS.heading.h3,
    color: COLORS.white,
  },
  meditateButtonSubtitle: {
    ...FONTS.body.small,
    color: 'rgba(255,255,255,0.8)',
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  featureItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    alignItems: 'center',
    width: '30%',
    ...SHADOWS.small,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  featureLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  sectionTitle: {
    ...FONTS.heading.h2,
    color: COLORS.neutralDark,
    marginBottom: SPACING.m,
  },
  meditationCard: {
    borderRadius: SIZES.radiusMedium,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
  },
  meditationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  meditationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  meditationTextContainer: {
    flex: 1,
  },
  meditationTitle: {
    ...FONTS.heading.h3,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  meditationDescription: {
    ...FONTS.body.small,
    color: 'rgba(255,255,255,0.8)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.m,
    paddingTop: SPACING.s,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...SHADOWS.medium,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    marginTop: SPACING.xs,
  },
});

export default HomeScreen;