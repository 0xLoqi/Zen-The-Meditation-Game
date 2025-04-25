import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import MiniZenni from '../../components/MiniZenni';
import BreathTracker from '../../components/BreathTracker';
import Button from '../../components/Button';
import { useMeditationStore } from '../../store/meditationStore';
import { useUserStore } from '../../store/userStore';
import { formatTime } from '../../utils/formatters';
import { triggerHapticFeedback } from '../../utils/haptics';
import { useGameStore } from '../../store/index';
import { maybeDropGlowbag } from '../../services/CosmeticsService';
import { analytics } from '../../firebase';
import { requestNotificationPermission, scheduleReminder, cancelAllReminders } from '../../lib/notifications';

const MeditationSessionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectedType, selectedDuration, submitMeditationSession } = useMeditationStore();
  const { userData } = useUserStore();
  const { addXP, incrementStreak } = useGameStore();
  
  // States
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathScore, setBreathScore] = useState(100);
  const [isInhaling, setIsInhaling] = useState(true);
  const [usingBreathTracking, setUsingBreathTracking] = useState(true);
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  
  // Animated values
  const fadeAnim = useSharedValue(0);
  const fadeAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });
  
  // Initialize timer with selected duration
  useEffect(() => {
    if (selectedDuration) {
      setTimeRemaining(selectedDuration * 60);
    } else {
      // If no duration selected, navigate back
      navigation.goBack();
    }
  }, [selectedDuration]);
  
  // Fade in animation
  useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    });
    
    // Start session after fade in
    const timer = setTimeout(() => {
      startSession();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Show confirmation dialog
        if (isActive) {
          confirmEndSession();
          return true; // Prevent default behavior
        }
        return false; // Let default behavior happen
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isActive])
  );
  
  // Clean up timer when unmounting
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Start meditation session
  const startSession = async () => {
    await cancelAllReminders();
    setIsActive(true);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          // Session complete
          clearInterval(intervalRef.current!);
          handleSessionComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Pause meditation session
  const pauseSession = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      pausedTimeRef.current = Date.now() - (startTimeRef.current || 0);
    }
  };
  
  // Resume meditation session
  const resumeSession = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          // Session complete
          clearInterval(intervalRef.current!);
          handleSessionComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Handle session complete
  const handleSessionComplete = async () => {
    triggerHapticFeedback('success');
    fadeAnim.value = withTiming(0, {
      duration: 500,
      easing: Easing.ease,
    });
    setTimeout(async () => {
      // MVP: XP = duration in seconds
      const xp = selectedDuration ? selectedDuration * 60 : 0;
      addXP(xp);
      incrementStreak();
      // Get streak after increment
      const streak = useGameStore.getState().progress.streak;
      if (streak === 1) {
        await requestNotificationPermission();
        await scheduleReminder(
          { seconds: 60 * 60 * 20 },
          { title: 'Mini Zenni misses you…', body: 'Come back for your next meditation!' }
        );
        // Schedule daily reminder at the same time for the next day if streak < 3
        await scheduleReminder(
          { seconds: 60 * 60 * 24, repeats: true },
          { title: 'Daily Meditation Reminder', body: 'Keep your streak going with a meditation today!' }
        );
      } else if (streak < 3) {
        // For streaks 2 and 3, keep scheduling daily reminders
        await scheduleReminder(
          { seconds: 60 * 60 * 24, repeats: true },
          { title: 'Daily Meditation Reminder', body: 'Keep your streak going with a meditation today!' }
        );
      }
      const drop = await maybeDropGlowbag();
      submitMeditationSession(breathScore, usingBreathTracking);
      if (analytics && typeof analytics.logEvent === 'function') {
        analytics.logEvent('session_complete', {
          duration: selectedDuration ? selectedDuration * 60 : 0,
          xp,
        });
      }
      navigation.replace('PostSessionSummary', { drop });
    }, 500);
  };
  
  // Handle "I Did It" button
  const handleManualComplete = () => {
    setUsingBreathTracking(false);
    
    // If time remaining is more than 5 seconds, ask for confirmation
    if (timeRemaining > 5) {
      Alert.alert(
        'Complete Meditation',
        'Are you sure you want to end this session early?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'End Session',
            onPress: handleSessionComplete,
          },
        ]
      );
    } else {
      handleSessionComplete();
    }
  };
  
  // Confirm end session dialog
  const confirmEndSession = () => {
    pauseSession();
    Alert.alert(
      'End Meditation',
      'Are you sure you want to end this session? Your progress will be lost.',
      [
        {
          text: 'Cancel',
          onPress: resumeSession,
          style: 'cancel',
        },
        {
          text: 'End Session',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Update breath score
  const handleBreathScoreUpdate = (score: number) => {
    setBreathScore(score);
  };
  
  // Handle breath tracked event
  const handleBreathTracked = (inhaling: boolean) => {
    setIsInhaling(inhaling);
  };
  
  // No meditation type selected
  if (!selectedType) {
    navigation.goBack();
    return null;
  }
  
  return (
    <Animated.View style={[styles.container, fadeAnimStyle]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <View style={styles.sessionInfoContainer}>
          <Text style={styles.sessionType}>{selectedType}</Text>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        </View>
        
        {isPaused ? (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={resumeSession}
          >
            <MaterialCommunityIcons
              name="play"
              size={SIZES.iconMedium}
              color={COLORS.white}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={pauseSession}
          >
            <MaterialCommunityIcons
              name="pause"
              size={SIZES.iconMedium}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.zenniContainer}>
        <MiniZenni
          outfitId={userData?.equippedOutfit || 'default'}
          animationState="meditating"
          size="medium"
        />
      </View>
      
      {!isPaused && (
        <View style={styles.breathTrackerContainer}>
          <BreathTracker
            isActive={isActive && !isPaused}
            onBreathTracked={handleBreathTracked}
            onBreathScoreUpdate={handleBreathScoreUpdate}
          />
        </View>
      )}
      
      {isPaused && (
        <View style={styles.pausedContainer}>
          <Text style={styles.pausedText}>Meditation Paused</Text>
          <Text style={styles.pausedSubtext}>
            Take a moment, then continue when you're ready
          </Text>
          <Button
            title="Resume"
            onPress={resumeSession}
            style={styles.resumeButton}
          />
        </View>
      )}
      
      <View style={styles.footer}>
        <Button
          title="I Did It"
          variant="outlined"
          onPress={handleManualComplete}
          style={styles.didItButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.l,
  },
  sessionInfoContainer: {
    flex: 1,
  },
  sessionType: {
    ...FONTS.heading.h3,
    color: COLORS.white,
  },
  timer: {
    ...FONTS.heading.h1,
    color: COLORS.white,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.borderRadius.circle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zenniContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  breathTrackerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  pausedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  pausedText: {
    ...FONTS.heading.h2,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  pausedSubtext: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  resumeButton: {
    width: 200,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    backgroundColor: 'transparent',
  },
  didItButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default MeditationSessionScreen;
