import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import MiniZenni from '../../components/MiniZenni';
import XPBar from '../../components/XPBar';
import StreakIndicator from '../../components/StreakIndicator';
import Button from '../../components/Button';
import { useUserStore } from '../../store/userStore';
import { useMeditationStore } from '../../store/meditationStore';
import { getXPForNextLevel } from '../../api/meditation';

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userData, todayCheckIn, getUserData, getTodayCheckIn, isLoadingUser } = useUserStore();
  const { resetMeditationSession } = useMeditationStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Load user data and today's check-in
  useEffect(() => {
    loadData();
  }, []);
  
  // Load data function for initial load and refresh
  const loadData = async () => {
    await getUserData();
    await getTodayCheckIn();
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Navigate to daily check-in
  const navigateToCheckIn = () => {
    navigation.navigate('DailyCheckIn');
  };
  
  // Navigate to meditation selection
  const navigateToMeditation = () => {
    resetMeditationSession();
    navigation.navigate('MeditationSelection');
  };
  
  // Navigate to referral screen
  const navigateToReferral = () => {
    navigation.navigate('Referral');
  };
  
  // Calculate XP required for next level
  const getRequiredXP = () => {
    if (!userData) return 100;
    return getXPForNextLevel(userData.level);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>
            Welcome, {userData?.username || 'Zen Friend'}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.tokenContainer}>
              <MaterialCommunityIcons
                name="coin"
                size={SIZES.icon.medium}
                color={COLORS.accent}
              />
              <Text style={styles.tokenText}>
                {userData?.tokens || 0}
              </Text>
            </View>
            <StreakIndicator
              streakCount={userData?.streak || 0}
              size="small"
            />
          </View>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Mini Zenni Section */}
        <View style={styles.zenniSection}>
          <MiniZenni
            outfitId={userData?.equippedOutfit || 'default'}
            size="large"
            animationState="idle"
          />
          
          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <XPBar
              currentXP={userData?.xp || 0}
              requiredXP={getRequiredXP()}
              level={userData?.level || 1}
            />
          </View>
        </View>
        
        {/* Daily Check-In Card */}
        {!todayCheckIn && (
          <Card style={styles.card} onPress={navigateToCheckIn}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                size={SIZES.icon.medium}
                color={COLORS.primary}
              />
              <Text style={styles.cardTitle}>Daily Check-in</Text>
            </View>
            <Text style={styles.cardDescription}>
              How zen have you felt lately? Take a moment to reflect.
            </Text>
            <Button
              title="Check In"
              onPress={navigateToCheckIn}
              variant="outlined"
              size="small"
              style={styles.cardButton}
            />
          </Card>
        )}
        
        {/* Start Meditation Card */}
        <Card style={styles.card} onPress={navigateToMeditation}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="meditation"
              size={SIZES.icon.medium}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Start Meditation</Text>
          </View>
          <Text style={styles.cardDescription}>
            Take a moment to breathe and nurture your Mini Zenni.
          </Text>
          <Button
            title="Begin Session"
            onPress={navigateToMeditation}
            variant="primary"
            size="small"
            style={styles.cardButton}
          />
        </Card>
        
        {/* Referral Card */}
        <Card style={styles.card} onPress={navigateToReferral}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="share-variant"
              size={SIZES.icon.medium}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Share Zen</Text>
          </View>
          <Text style={styles.cardDescription}>
            Invite friends to join your meditation journey.
          </Text>
          <Button
            title="Share"
            onPress={navigateToReferral}
            variant="secondary"
            size="small"
            style={styles.cardButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    ...FONTS.heading.h3,
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.l,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.borderRadius.small,
  },
  tokenText: {
    ...FONTS.body.regular,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  zenniSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  xpContainer: {
    width: '100%',
    marginTop: SPACING.l,
  },
  card: {
    marginBottom: SPACING.l,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  cardTitle: {
    ...FONTS.heading.h4,
    color: COLORS.neutralDark,
    marginLeft: SPACING.s,
  },
  cardDescription: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    marginBottom: SPACING.l,
  },
  cardButton: {
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
