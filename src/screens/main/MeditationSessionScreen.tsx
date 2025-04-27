import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  StatusBar,
  AppState,
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
import { maybeDropGlowbag, grant } from '../../services/CosmeticsService';
import { analytics } from '../../firebase';
import { requestNotificationPermission, scheduleReminder, cancelAllReminders } from '../../lib/notifications';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { playAmbient, stopAmbient } from '../../services/audio';

const MeditationSessionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectedType, selectedDuration, submitMeditationSession } = useMeditationStore();
  const { userData, soundPackId, setSoundPackId } = useUserStore();
  const { addXP, incrementStreak, unlockAchievement, firstMeditationRewarded, setFirstMeditationRewarded } = useGameStore();
  
  // States
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathScore, setBreathScore] = useState(100);
  const [isInhaling, setIsInhaling] = useState(true);
  const [usingBreathTracking, setUsingBreathTracking] = useState(true);
  const [showCheatOverlay, setShowCheatOverlay] = useState(false);
  const appState = useRef(AppState.currentState);
  const backgroundTimer = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Calculate progress for circular timer
  const totalSeconds = selectedDuration ? selectedDuration * 60 : 1;
  const progress = 1 - timeRemaining / totalSeconds;
  // Circular progress constants
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
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
  
  // App switch guard (cheat-detection)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // App is backgrounded
        if (isActive && !isPaused) {
          backgroundTimer.current = setTimeout(() => {
            setShowCheatOverlay(true);
            setIsActive(false); // Invalidate run
            // Optionally log 'rejected'
            console.log('Meditation session rejected: app backgrounded');
          }, 5000);
        }
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App is foregrounded
        if (backgroundTimer.current) {
          clearTimeout(backgroundTimer.current);
          backgroundTimer.current = null;
        }
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (backgroundTimer.current) clearTimeout(backgroundTimer.current);
      sub.remove();
    };
  }, [isActive, isPaused]);
  
  // Play ambient sound on session start and when soundPackId changes
  useEffect(() => {
    if (isActive && !isPaused) {
      playAmbient(soundPackId);
    } else {
      stopAmbient();
    }
    return () => { stopAmbient(); };
  }, [isActive, isPaused, soundPackId]);
  
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
      unlockAchievement('first_meditation');
      // T07: Grant Glowbag on first meditation
      if (!firstMeditationRewarded) {
        grant('glowbag_rare');
        setFirstMeditationRewarded(true);
      }
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
      if (streak === 7) {
        unlockAchievement('seven_day_streak');
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
  
  // No meditation type or duration selected
  if (!selectedType || !selectedDuration) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbe6' }}>
        <Text style={{ color: '#B68900', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Oops!</Text>
        <Text style={{ color: '#6B4F1D', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
          Something went wrong starting your meditation session. Please go back and try again.
        </Text>
        <Button title="Back to Selection" onPress={() => navigation.navigate('MeditationSelection')} />
      </View>
    );
  }
  
  return (
    <LinearGradient
      colors={['#f8e7c9', '#e6e1f7', '#c9e7f8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.container, fadeAnimStyle, { backgroundColor: 'transparent' }]}> 
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        {/* Header: Session Type and Timer */}
        <View style={styles.header}>
          <Text style={styles.sessionType}>{selectedType}</Text>
        </View>
        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e0d7c6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#B68900"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference},${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2},${size / 2}`}
            />
          </Svg>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          {/* Floating Pause/Play Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={isPaused ? resumeSession : pauseSession}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={isPaused ? 'play' : 'pause'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {/* Mini Zenni with Glow */}
        <View style={styles.zenniGlowContainer}>
          <LinearGradient
            colors={["#fffbe6", "#f8e7c9", "#e6e1f7"]}
            style={styles.zenniGlow}
          />
          <MiniZenni
            outfitId={userData?.equippedOutfit || 'default'}
            animationState="meditating"
            size="medium"
          />
        </View>
        {/* Breath Tracker (if not paused) */}
        {!isPaused && (
          <View style={styles.breathTrackerContainer}>
            <BreathTracker
              isActive={isActive && !isPaused}
              onBreathTracked={handleBreathTracked}
              onBreathScoreUpdate={handleBreathScoreUpdate}
            />
          </View>
        )}
        {/* Paused Overlay */}
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
        {/* Floating 'I Did It' Button */}
        <View style={styles.footer}>
          <Button
            title="I Did It"
            variant="outlined"
            onPress={handleManualComplete}
            style={styles.didItButton}
          />
        </View>
        {/* Cheat Overlay */}
        {showCheatOverlay && (
          <View style={styles.cheatOverlay}>
            <Text style={styles.cheatText}>Mini Zenni is disappointed 😠{"\n"}Please stay focused during your session!</Text>
          </View>
        )}
        {/* Sound Selection Dropdown */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.primary, marginBottom: 4 }}>Background Sound</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['rain', 'waves', 'silence'].map((id) => (
              <TouchableOpacity
                key={id}
                style={{
                  backgroundColor: soundPackId === id ? COLORS.primary : COLORS.neutralLight,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  marginHorizontal: 4,
                }}
                onPress={() => setSoundPackId(id)}
              >
                <Text style={{ color: soundPackId === id ? '#fff' : COLORS.primary, fontWeight: 'bold' }}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B68900',
    letterSpacing: 1,
    textTransform: 'capitalize',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerText: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
    color: '#B68900',
    letterSpacing: 2,
  },
  fab: {
    position: 'absolute',
    bottom: -28,
    left: '50%',
    marginLeft: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#B68900',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  zenniGlowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  zenniGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 160,
    height: 80,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.5)',
    transform: [{ translateX: -80 }, { translateY: -40 }],
    zIndex: 0,
    opacity: 0.7,
  },
  breathTrackerContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    padding: 12,
  },
  pausedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    padding: 32,
  },
  pausedText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B68900',
    marginBottom: 8,
  },
  pausedSubtext: {
    fontSize: 16,
    color: '#6B4F1D',
    textAlign: 'center',
    marginBottom: 24,
  },
  resumeButton: {
    width: 200,
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 30,
  },
  didItButton: {
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  cheatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 32,
  },
  cheatText: {
    fontSize: 24,
    color: '#B68900',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MeditationSessionScreen;
