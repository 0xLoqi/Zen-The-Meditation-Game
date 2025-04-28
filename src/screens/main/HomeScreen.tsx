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
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useGameStore } from '../../store';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { triggerHapticFeedback } from '../../utils/haptics';
import { formatStreak } from '../../utils/formatters';
import * as Clipboard from 'expo-clipboard';
import { getFriendCode, setFriendCode } from '../../firebase/user';
// import { generateReferralCode } from '../../firebase/auth';
import PatternBackground from '../../components/PatternBackground';
import FloatingLeaves from '../../components/FloatingLeaves';
import FriendDen from '../../components/FriendBar';
import Leaderboard from '../../components/Leaderboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniZenni from '../../components/MiniZenni';
import { getXPForNextLevel } from '../../firebase/meditation';
import * as Animatable from 'react-native-animatable';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const badgeImages = {
  first_meditation: require('../../../assets/images/badges/first_meditation.png'),
  seven_day_streak: require('../../../assets/images/badges/seven_day_streak.png'),
  first_legendary: require('../../../assets/images/badges/first_legendary.png'),
  early_bird: require('../../../assets/images/badges/early_bird.png'),
  night_owl: require('../../../assets/images/badges/night_owl.png'),
  quest_master: require('../../../assets/images/badges/quest_master.png'),
};

const PROFILE_CARD_HEIGHT = 110;
const PROFILE_CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.9);

// Helper to get streak badge color
const getStreakColors = (streak: number) => {
  if (streak <= 0) {
    return { bg: '#E0E0E0', color: '#A0A0A0' };
  } else if (streak < 4) {
    return { bg: '#FFF3B0', color: '#FFD580' };
  } else if (streak < 8) {
    return { bg: '#FFE0B2', color: '#FFB300' };
  } else {
    return { bg: '#FFE0E0', color: '#FF5722' };
  }
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { signOut } = useAuthStore();
  const { userData, isLoadingUser, userError, getUserData, todayCheckIn, getTodayCheckIn } = useUserStore();
  const [friendCode, setFriendCodeState] = useState('');
  const insets = useSafeAreaInsets();
  
  // Debug logs
  // Only log once per mount for sanity
  useEffect(() => {
    console.log('Rendering HomeScreen', { userData, gameStore: useGameStore.getState() });
  }, []);

  useEffect(() => {
    getUserData();
    getTodayCheckIn();
    if (userData?.uid) {
      getFriendCode(userData.uid).then(code => {
        if (code) {
          setFriendCodeState(code);
        } else {
          // const newCode = generateReferralCode();
          // setFriendCode(userId, newCode).then(() => setFriendCodeState(newCode));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  try {
    const scrollContentTopMargin = PROFILE_CARD_HEIGHT + insets.top + SPACING.m;
    const homeBg = require('../../../assets/images/backgrounds/home_screen_bg_2.png');
    // Calculate XP progress
    const currentXP = userData.xp || 0;
    const currentLevel = userData.level || 1;
    const xpForNextLevel = getXPForNextLevel(currentLevel - 1); // Level is 1-based, formula expects 0-based
    const xpProgress = Math.min(currentXP / xpForNextLevel, 1);
    return (
      <ImageBackground source={homeBg} style={{ flex: 1 }} resizeMode="cover">
        <FloatingLeaves count={12} style={styles.leavesBackground} />
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}> 
          {/* Sticky Profile Card */}
          <View style={[styles.stickyProfileCardContainer, { paddingTop: insets.top }]}>
            <View style={styles.profileCard}>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Store')} accessibilityLabel="Store" accessible>
                  <MaterialCommunityIcons name="store" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')} accessibilityLabel="Settings" accessible>
                  <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.profileCardTouchable} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8} accessibilityLabel="View profile" accessible>
                <View style={styles.profileHeader} pointerEvents="box-none">
                  <MiniZenni
                    size="small"
                    outfitId={userData?.cosmetics?.equipped?.outfit}
                    headgearId={userData?.cosmetics?.equipped?.headgear}
                    auraId={userData?.cosmetics?.equipped?.aura}
                    faceId={userData?.cosmetics?.equipped?.face}
                    accessoryId={userData?.cosmetics?.equipped?.accessory}
                    companionId={userData?.cosmetics?.equipped?.companion}
                    style={{ marginLeft: -15 }}
                  />
                  <View style={styles.profileInfo}>
                    <View style={styles.usernameRow}>
                      <Text style={styles.username}>{userData?.username || 'ZenUser'}</Text>
                      {(() => {
                        // Simulate streak as 15 for demo
                        const streak = 15;
                        const { bg, color } = getStreakColors(streak);
                        const Badge = (
                          <View style={[styles.streakBadge, { backgroundColor: bg }]}> 
                            <Ionicons name="flame" size={16} color={color} style={{ marginRight: 2 }} />
                            <Text style={[styles.streakBadgeText, { color }]}>{streak}</Text>
                          </View>
                        );
                        if (streak >= 14) {
                          return (
                            <Animatable.View animation="pulse" iterationCount="infinite" duration={900} easing="ease-in-out">
                              {Badge}
                            </Animatable.View>
                          );
                        }
                        return Badge;
                      })()}
                    </View>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Level {userData?.level || 1}</Text>
                    </View>
                    <View style={styles.xpContainer}>
                      <View style={styles.xpBarContainer}>
                        <View style={[styles.xpBar, { width: `${xpProgress * 100}%` }]} />
                      </View>
                      <Text style={styles.xpText}>{currentXP}/{xpForNextLevel} XP</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={styles.mainContent} contentContainerStyle={styles.scrollContentWithStickyProfile}
          >
            <View style={{ marginTop: 50 }}>
              <FriendDen />
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
            {/* Quests Section */}
            <Text style={styles.sectionTitle}>Today's Quests</Text>
            <View style={styles.questsContainer}>
              {useGameStore.getState().quests.dailyQuests.map((quest) => {
                const complete = useGameStore.getState().quests.progress[quest.id];
                return (
                  <View key={quest.id} style={[styles.questRow, complete && styles.questRowComplete]}>
                    <View style={styles.questTextStack}>
                      <Text style={[styles.questName, complete && styles.questNameComplete]}>{quest.name} {complete ? '✔️' : ''}</Text>
                      <Text style={styles.questDescription}>{quest.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Achievements Section */}
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsContainer}>
              {(() => {
                const unlocked = useGameStore.getState().achievements.unlocked || [];
                const achievementsData = require('../../../assets/data/achievements.json');
                const locked = achievementsData.filter((a) => !unlocked.includes(a.id));
                return locked.slice(0, 3).map((ach) => (
                  <View key={ach.id} style={styles.achievementCard}>
                    {badgeImages[ach.id] && (
                      <Image source={badgeImages[ach.id]} style={styles.achievementIcon} />
                    )}
                    <View style={styles.achievementTextStack}>
                      <Text style={styles.achievementName}>{ach.name}</Text>
                      <Text style={styles.achievementDescription}>{ach.description}</Text>
                    </View>
                  </View>
                ));
              })()}
            </View>
            <Leaderboard />
          </ScrollView>
          <FloatingLeaves count={12} style={styles.leavesOverlay} />
        </SafeAreaView>
      </ImageBackground>
    );
  } catch (e) {
    console.log('Render error in HomeScreen:', e);
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>Render error: {e.message}</Text>
      </SafeAreaView>
    );
  }
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
    width: PROFILE_CARD_WIDTH,
    height: PROFILE_CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  profileCardTouchable: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    marginRight: SPACING.m,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  usernameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
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
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  streakBadgeText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },
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
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.neutralDark,
    marginBottom: SPACING.m,
  },
  questsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  questRowComplete: {
    backgroundColor: '#f0fff0',
  },
  questTextStack: {
    flex: 1,
  },
  questName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.neutralDark,
    marginBottom: 2,
  },
  questNameComplete: {
    color: COLORS.accent,
    textDecorationLine: 'line-through',
  },
  questDescription: {
    fontWeight: 'normal',
    fontSize: 12,
    color: COLORS.neutralMedium,
  },
  achievementsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'column',
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
    color: COLORS.neutralDark,
    marginBottom: 2,
  },
  achievementDescription: {
    fontWeight: 'normal',
    fontSize: 11,
    color: COLORS.neutralMedium,
    textAlign: 'center',
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
  leavesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    pointerEvents: 'none',
  },
  stickyProfileCardContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollContentWithStickyProfile: {
    padding: SPACING.m,
  },
  mainContent: {
    flex: 1,
    marginTop: PROFILE_CARD_HEIGHT + SPACING.m,
  },
});

export default HomeScreen;