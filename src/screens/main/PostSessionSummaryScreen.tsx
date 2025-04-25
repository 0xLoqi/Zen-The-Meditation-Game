import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import MiniZenni from '../../components/MiniZenni';
import { useMeditationStore } from '../../store/meditationStore';
import { useUserStore } from '../../store/userStore';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';

const PostSessionSummaryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<MainStackParamList, 'PostSessionSummary'>>();
  const drop = route.params?.drop;
  const { 
    selectedType,
    selectedDuration,
    breathScore,
    xpGained,
    tokensEarned,
    streakUpdated,
    leveledUp,
    microLesson,
    didUseBreathTracking,
    resetMeditationSession
  } = useMeditationStore();
  const { getUserData } = useUserStore();
  
  // Animated values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const fadeAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });
  
  // Prevent going back with hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleFinish();
        return true; // Prevent default behavior
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  
  // Load animations
  useEffect(() => {
    // Refresh user data
    getUserData();
    
    // Fade in animation
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.ease,
    });
    
    scaleAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.elastic(0.8),
    });
  }, []);
  
  useEffect(() => {
    if (!selectedType || !selectedDuration) {
      navigation.navigate('Home');
    }
  }, [selectedType, selectedDuration, navigation]);
  
  // Handle finish button press
  const handleFinish = () => {
    // Fade out animation
    fadeAnim.value = withTiming(0, {
      duration: 500,
      easing: Easing.ease,
    });
    
    setTimeout(() => {
      resetMeditationSession();
      navigation.navigate('Home');
    }, 500);
  };
  
  if (!selectedType || !selectedDuration) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, fadeAnimStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Great Job!</Text>
            <Text style={styles.subtitle}>
              {selectedDuration} minute {selectedType} meditation completed
            </Text>
            {drop && (
              <Text style={{ color: 'gold', fontWeight: 'bold', marginTop: 8 }}>
                🎁 You received a reward!
              </Text>
            )}
          </View>
          
          <View style={styles.zennieContainer}>
            <MiniZenni
              outfitId="default"
              size="large"
              animationState={leveledUp ? "levelUp" : "idle"}
              loop={false}
            />
            
            {leveledUp && (
              <View style={styles.levelUpBadge}>
                <MaterialCommunityIcons
                  name="star"
                  size={SIZES.iconMedium}
                  color={COLORS.white}
                />
                <Text style={styles.levelUpText}>Level Up!</Text>
              </View>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <MaterialCommunityIcons
                name="percent"
                size={SIZES.iconMedium}
                color={COLORS.primary}
              />
              <Text style={styles.statValue}>
                {didUseBreathTracking ? `${breathScore}%` : "N/A"}
              </Text>
              <Text style={styles.statLabel}>Breath Score</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={SIZES.iconMedium}
                color={COLORS.primary}
              />
              <Text style={styles.statValue}>+{xpGained}</Text>
              <Text style={styles.statLabel}>XP Gained</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={SIZES.iconMedium}
                color={COLORS.accent}
              />
              <Text style={styles.statValue}>+{tokensEarned}</Text>
              <Text style={styles.statLabel}>Tokens</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <MaterialCommunityIcons
                name="fire"
                size={SIZES.iconMedium}
                color={COLORS.warning}
              />
              <Text style={styles.statValue}>{streakUpdated}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Card>
          </View>
          
          <Card style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={SIZES.iconMedium}
                color={COLORS.primary}
              />
              <Text style={styles.lessonTitle}>Zen Wisdom</Text>
            </View>
            <Text style={styles.lessonText}>{microLesson}</Text>
          </Card>
          
          <Button
            title="Continue"
            onPress={handleFinish}
            style={styles.continueButton}
          />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  zennieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  levelUpBadge: {
    position: 'absolute',
    top: 20,
    right: '25%',
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius.small,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  levelUpText: {
    ...FONTS.body.small,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.l,
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
  lessonCard: {
    marginBottom: SPACING.xl,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  lessonTitle: {
    ...FONTS.heading.h4,
    color: COLORS.primary,
    marginLeft: SPACING.s,
  },
  lessonText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  continueButton: {
    marginTop: SPACING.l,
  },
});

export default PostSessionSummaryScreen;
