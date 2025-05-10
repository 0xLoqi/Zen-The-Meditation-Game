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
  Button,
  Animated,
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
import { LinearGradient } from 'expo-linear-gradient';
import Sparkle from '../../components/Sparkle';
import FloatyAnimation from '../../components/FloatyAnimation';
import { playSoundById } from '../../services/audio';

// Register custom animations
Animatable.initializeRegistryWithDefinitions({
  float: {
    0: { translateY: 0 },
    0.5: { translateY: -8 },
    1: { translateY: 0 },
  },
});

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

// Helper to get streak badge color and animation based on streak value
function getStreakBadgeProps(streak) {
  if (streak <= 0) {
    return { bg: '#FFF', color: '#A0A0A0', border: '#FFD580', animation: null };
  } else if (streak < 4) {
    return { bg: '#FFF', color: '#FFD580', border: '#FFD580', animation: null };
  } else if (streak < 8) {
    return { bg: '#FFB300', color: '#FFF', border: '#FF8C42', animation: 'pulse', duration: 2200, intensity: 0.8 };
  } else if (streak < 14) {
    return { bg: '#FFE0E0', color: '#FF5722', border: '#FF8C42', animation: 'pulse', duration: 1400, intensity: 1.0 };
  } else {
    // Super streak: more intense pulse
    return { bg: '#FFF8E1', color: '#FF3B30', border: '#FF8C42', animation: 'pulse', duration: 900, intensity: 1.2 };
  }
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { signOut } = useAuthStore();
  const { userData, isLoadingUser, userError, getUserData, todayCheckIn, getTodayCheckIn } = useUserStore();
  const [friendCode, setFriendCodeState] = useState('');
  const insets = useSafeAreaInsets();
  
  // Animated glow for Train Your Brain button
  const [glowAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 700, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 700, useNativeDriver: false }),
      ]).start(() => pulse());
    };
    pulse();
    return () => { glowAnim.stopAnimation(); };
  }, []);
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD580', '#FF8C42']
  });

  useEffect(() => {
    getUserData();
    getTodayCheckIn();
    console.log('HomeScreen MOUNT: userData:', userData, 'isLoadingUser:', isLoadingUser, 'userError:', userError);
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

  useEffect(() => {
    // Log changes to userData, isLoadingUser, userError
    console.log('HomeScreen UPDATE: userData:', userData, 'isLoadingUser:', isLoadingUser, 'userError:', userError);
  }, [userData, isLoadingUser, userError]);

  if (!userData && !isLoadingUser && userError) {
    // If loading is done but userData is missing, show error
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load user data: {userError}</Text>
          <TouchableOpacity onPress={getUserData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleQuestPress = (quest) => {
    triggerHapticFeedback('selection');
    if (quest.id === 'daily_checkin_start' || quest.id === 'daily_checkin_end') {
      navigation.navigate('DailyCheckIn', undefined);
    } else if (quest.id === 'first_meditation') {
      navigation.navigate('MeditationSelection');
    }
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

  try {
    const scrollContentTopMargin = PROFILE_CARD_HEIGHT + insets.top + SPACING.m;
    const homeBg = require('../../../assets/images/backgrounds/home_screen_bg_2.png');
    // cast to any to access Firestore cosmetics shape
    const equipped = (userData as any)?.cosmetics?.equipped || {};
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
                <TouchableOpacity style={styles.iconButton} onPress={() => { playSoundById('select_3'); navigation.navigate('Store'); }} accessibilityLabel="Store" accessible>
                  <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="store" size={31} color={COLORS.primary} />
                    {/* Notification Dot */}
                    <View style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#FF3B30',
                      borderWidth: 2,
                      borderColor: '#fff',
                      zIndex: 2,
                    }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => { playSoundById('settings_open'); playSoundById('select_3'); navigation.navigate('Settings'); }} accessibilityLabel="Settings" accessible>
                  <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.profileCardTouchable} onPress={() => navigation.navigate('Profile', {})} activeOpacity={0.8} accessibilityLabel="View profile" accessible>
                <View style={styles.profileHeader} pointerEvents="box-none">
                  <MiniZenni
                    size="small"
                    outfitId={equipped.outfit}
                    headgearId={equipped.headgear}
                    auraId={equipped.aura}
                    faceId={equipped.face}
                    accessoryId={equipped.accessory}
                    companionId={equipped.companion}
                    style={{ marginLeft: -15 }}
                  />
                  <View style={styles.profileInfo}>
                    <View style={styles.usernameRow}>
                      <Text style={styles.username}>{userData?.username || 'ZenUser'}</Text>
                      {(() => {
                        const streak = userData?.streak ?? 0;
                        const { bg, color, border, animation, duration, intensity } = getStreakBadgeProps(streak);
                        const Badge = (
                          <View style={[styles.streakBadge, { backgroundColor: bg, borderColor: border, borderWidth: 1 }]}> 
                            <Ionicons name="flame" size={16} color={color} style={{ marginRight: 2 }} />
                            <Text style={[styles.streakBadgeText, { color }]}>{streak}</Text>
                          </View>
                        );
                        if (animation) {
                          return (
                            <Animatable.View
                              animation={animation}
                              iterationCount="infinite"
                              duration={duration}
                              easing="ease-in-out"
                              style={{ transform: [{ scale: intensity }] }}
                            >
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
            {/* Start Meditation Button */}
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2200}
              easing="ease-in-out"
              style={styles.meditateButtonPulse}
            >
              <Animated.View
                style={[
                  styles.meditateButton,
                  {
                    borderWidth: 2,
                    borderRadius: 20,
                    borderColor: glowColor,
                    shadowColor: '#FF8C42',
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 0 },
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ borderRadius: 20, overflow: 'hidden' }}
                  onPress={() => { playSoundById('select_3'); handleMeditatePress(); }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#FFD580", "#FFB300", "#FF8C42"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.meditateButtonGradient}
                  >
                    {/* Sparkles */}
                    <FloatyAnimation style={styles.sparkle1} duration={3200} intensity="gentle">
                      <Animatable.View
                        animation={{
                          0: { scale: 1, opacity: 0.7 },
                          0.5: { scale: 1.4, opacity: 1 },
                          1: { scale: 1, opacity: 0.7 }
                        }}
                        iterationCount="infinite"
                        duration={1800}
                        easing="ease-in-out"
                      >
                        <Sparkle size={18} color="#fff8e1" />
                      </Animatable.View>
                    </FloatyAnimation>
                    <FloatyAnimation style={styles.sparkle2} duration={2600} intensity="medium">
                      <Animatable.View
                        animation={{
                          0: { scale: 1, opacity: 0.7 },
                          0.5: { scale: 1.5, opacity: 1 },
                          1: { scale: 1, opacity: 0.7 }
                        }}
                        iterationCount="infinite"
                        duration={2100}
                        easing="ease-in-out"
                      >
                        <Sparkle size={14} color="#fffde7" />
                      </Animatable.View>
                    </FloatyAnimation>
                    <FloatyAnimation style={styles.sparkle3} duration={4000} intensity="strong">
                      <Animatable.View
                        animation={{
                          0: { scale: 1, opacity: 0.7 },
                          0.5: { scale: 1.6, opacity: 1 },
                          1: { scale: 1, opacity: 0.7 }
                        }}
                        iterationCount="infinite"
                        duration={2500}
                        easing="ease-in-out"
                      >
                        <Sparkle size={22} color="#fff" />
                      </Animatable.View>
                    </FloatyAnimation>
                    <View style={styles.meditateButtonContent}>
                      <FloatyAnimation animation="float" duration={2200} intensity="gentle">
                        <View style={styles.meditateIconContainer}>
                          <MaterialCommunityIcons name="brain" size={44} color={COLORS.white} />
                        </View>
                      </FloatyAnimation>
                      <View style={styles.meditateTextContainer}>
                        <Text style={styles.meditateButtonTitle}>Train Your Brain</Text>
                        <Text style={styles.meditateButtonSubtitle}>Choose type and duration</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={28} color={COLORS.white} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animatable.View>
            <View style={{ marginTop: 0, marginBottom: 16 }}>
              <View style={styles.sectionTitlePill}><Text style={styles.sectionTitlePillText}>Friend Den</Text></View>
              <FriendDen />
            </View>
            {/* Quests Section */}
            <View style={styles.sectionTitlePill}><Text style={styles.sectionTitlePillText}>Today's Quests</Text></View>
            <View style={styles.questsContainer}>
              {useGameStore.getState().quests.dailyQuests.map((quest) => {
                const complete = useGameStore.getState().quests.progress[quest.id];
                // Emoji prefix for each quest
                const emoji = quest.id === 'daily_checkin_start' ? '📝'
                  : quest.id === 'first_meditation' ? '✨'
                  : quest.id === 'daily_checkin_end' ? '💭' : '';
                return (
                  <TouchableOpacity key={quest.id} onPress={() => handleQuestPress(quest)} activeOpacity={0.8}>
                    <View style={[styles.questRow, complete && styles.questRowComplete]}>
                      <View style={styles.questTextStack}>
                        <Text style={[styles.questName, complete && styles.questNameComplete]}>{emoji} {quest.name} {complete ? '✔️' : ''}</Text>
                        <Text style={styles.questDescription}>{quest.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* Achievements Section */}
            <View style={styles.sectionTitlePill}><Text style={styles.sectionTitlePillText}>Achievements</Text></View>
            <TouchableOpacity activeOpacity={0.85} onPress={handleAchievementsPress} style={{flex:1}}>
              <View style={styles.achievementsContainer}>
                {(() => {
                  const unlocked = useGameStore.getState().achievements.unlocked || [];
                  const achievementsData = require('../../../assets/data/achievements.json');
                  const locked = achievementsData.filter((a) => !unlocked.includes(a.id));
                  return locked.slice(0, 3).map((ach) => (
                    <TouchableOpacity key={ach.id} activeOpacity={0.85} onPress={handleAchievementsPress} style={{flex:1}}>
                      <View style={styles.achievementCard}>
                        {badgeImages[ach.id] && (
                          <Image 
                            source={badgeImages[ach.id]} 
                            style={[styles.achievementIcon, !unlocked.includes(ach.id) && { opacity: 0.4 }]} 
                          />
                        )}
                        <View style={styles.achievementTextStack}>
                          <Text style={styles.achievementName}>{ach.name}</Text>
                          <Text style={styles.achievementDescription}>{ach.description}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ));
                })()}
              </View>
            </TouchableOpacity>
            <View style={styles.sectionTitlePill}><Text style={styles.sectionTitlePillText}>🌍 Global Leaderboard</Text></View>
            <View style={styles.leaderboardContainer}>
              <Leaderboard />
            </View>
          </ScrollView>
          <FloatingLeaves count={12} style={styles.leavesOverlay} />
          {__DEV__ && (
            <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', zIndex: 100 }}>
              <Button
                title="Test GlowCard Reveal"
                onPress={() => navigation.navigate('GlowCardTest')}
              />
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    );
  } catch (e: any) {
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
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginVertical: SPACING.m,
    marginTop: 60,
  },
  meditateButtonGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 6,
    backgroundColor: 'linear-gradient(90deg, #FFD580 0%, #FF8C42 100%)', // fallback for web, will be overridden below
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  meditateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 18,
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
    fontSize: 22,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  sectionTitlePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(35,32,20,0.7)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionTitlePillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  leaderboardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  meditateButtonPulse: {
    shadowColor: '#FFD580',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 16,
    borderRadius: 24,
  },
  sparkle1: {
    position: 'absolute',
    top: 8,
    left: 32,
    zIndex: 2,
  },
  sparkle2: {
    position: 'absolute',
    top: 18,
    right: 32,
    zIndex: 2,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 12,
    left: 60,
    zIndex: 2,
  },
});

export default HomeScreen;