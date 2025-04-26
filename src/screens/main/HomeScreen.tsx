import React, { useEffect, useState } from 'react';
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
import * as Clipboard from 'expo-clipboard';
import { getFriendCode, setFriendCode } from '../../firebase/user';
import { generateReferralCode } from '../../firebase/auth';
import PatternBackground from '../../components/PatternBackground';
import FloatingLeaves from '../../components/FloatingLeaves';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { signOut } = useAuthStore();
  const { userData, isLoadingUser, userError, getUserData, todayCheckIn, getTodayCheckIn } = useUserStore();
  const [friendCode, setFriendCodeState] = useState('');
  
  useEffect(() => {
    getUserData();
    getTodayCheckIn();
    if (userData?.uid) {
      getFriendCode(userData.uid).then(code => {
        if (code) {
          setFriendCodeState(code);
        } else {
          // Auto-generate and set a code if missing
          const newCode = generateReferralCode();
          setFriendCode(userData.uid, newCode).then(() => setFriendCodeState(newCode));
        }
      });
    }
  }, [userData]);

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
  
  const handleAchievementsPress = () => {
    triggerHapticFeedback('selection');
    navigation.navigate('Achievements');
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
    <PatternBackground>
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')} accessibilityLabel="Settings" accessible>
              <Ionicons name="settings-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileCardTouchable} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8} accessibilityLabel="View profile" accessible>
              <View style={styles.profileHeader} pointerEvents="box-none">
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
            </TouchableOpacity>
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

            <TouchableOpacity 
              style={styles.featureItem}
              onPress={handleAchievementsPress}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: COLORS.neutralMedium }]}>
                <MaterialCommunityIcons name="trophy-award" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.featureLabel}>Achievements</Text>
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
      </SafeAreaView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontWeight: 'normal',
    color: COLORS.neutralMedium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  errorText: {
    fontWeight: 'normal',
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
    fontWeight: 'normal',
    color: COLORS.white,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    ...SHADOWS.medium,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 4,
  },
  profileCardTouchable: {
    zIndex: 1,
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
    fontWeight: 'bold',
    fontSize: 20,
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
    fontWeight: 'bold',
    color: COLORS.white,
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
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.neutralDark,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontWeight: 'normal',
    fontSize: 12,
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
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.white,
  },
  meditateButtonSubtitle: {
    fontWeight: 'normal',
    fontSize: 12,
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
    fontWeight: 'bold',
    fontSize: 18,
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
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  meditationDescription: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
});

export default HomeScreen;