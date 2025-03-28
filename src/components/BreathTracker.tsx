import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  Text,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { triggerBreathHaptic } from '../utils/haptics';

interface BreathTrackerProps {
  onBreathTracked: (inhaling: boolean) => void;
  onBreathScoreUpdate: (score: number) => void;
  isActive: boolean;
  style?: ViewStyle;
}

const BREATH_CYCLE_DURATION = 8000; // 8 seconds for a full breath cycle
const INHALE_DURATION = 4000; // 4 seconds for inhale
const EXHALE_DURATION = 4000; // 4 seconds for exhale

const BreathTracker = ({
  onBreathTracked,
  onBreathScoreUpdate,
  isActive,
  style,
}: BreathTrackerProps) => {
  const [isInhaling, setIsInhaling] = useState(true);
  const [breathCount, setBreathCount] = useState(0);
  const [breathScore, setBreathScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('Follow the circle');
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const cycleRef = useRef<number>(0);
  const userBreathPatternRef = useRef<Array<{ time: number; isInhaling: boolean }>>([]);
  
  // Start or reset the breathing animation
  useEffect(() => {
    if (isActive) {
      startBreathAnimation();
    } else {
      // Reset the animation when becoming inactive
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }).stop();
      userBreathPatternRef.current = [];
      setBreathCount(0);
      setBreathScore(0);
    }
    
    return () => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }).stop();
    };
  }, [isActive]);
  
  // Calculate breath score effect
  useEffect(() => {
    onBreathScoreUpdate(breathScore);
  }, [breathScore, onBreathScoreUpdate]);
  
  // Update the feedback message based on breath count
  useEffect(() => {
    if (breathCount <= 3) {
      setFeedbackMessage('Follow the circle');
    } else if (breathScore < 30) {
      setFeedbackMessage('Try to match the rhythm');
    } else if (breathScore < 70) {
      setFeedbackMessage('Good breathing!');
    } else {
      setFeedbackMessage('Perfect breathing rhythm!');
    }
  }, [breathCount, breathScore]);
  
  // Start the breathing animation sequence
  const startBreathAnimation = () => {
    cycleRef.current = 0;
    runBreathCycle();
  };
  
  // Run a single breath cycle (inhale + exhale)
  const runBreathCycle = () => {
    // Inhale animation
    setIsInhaling(true);
    onBreathTracked(true);
    triggerBreathHaptic(true);
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: INHALE_DURATION,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && isActive) {
        // Exhale animation
        setIsInhaling(false);
        onBreathTracked(false);
        triggerBreathHaptic(false);
        
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: EXHALE_DURATION,
          easing: Easing.cubic,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && isActive) {
            cycleRef.current += 1;
            setBreathCount(cycleRef.current);
            
            // Calculate breath score after a few cycles
            if (cycleRef.current >= 3) {
              calculateBreathScore();
            }
            
            // Continue with the next cycle
            runBreathCycle();
          }
        });
      }
    });
  };
  
  // Calculate a score based on how well the user followed the breathing pattern
  const calculateBreathScore = () => {
    // For now, use a simple scoring mechanism
    // In a real app, you'd analyze user's breath pattern data in userBreathPatternRef.current
    const baseScore = Math.min(40 + cycleRef.current * 5, 80);
    const randomVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10 variation
    const newScore = Math.max(0, Math.min(100, baseScore + randomVariation));
    
    setBreathScore(newScore);
  };
  
  // Animation interpolations
  const circleScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              transform: [{ scale: circleScale }],
              backgroundColor: isInhaling ? COLORS.primaryLight : COLORS.primary,
            },
          ]}
        />
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{isInhaling ? 'Inhale' : 'Exhale'}</Text>
        </View>
      </View>
      
      {isActive && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
  instructionContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    ...FONTS.body.regular,
    color: COLORS.white,
    fontWeight: 'bold' as const,
  },
  feedbackContainer: {
    marginTop: SPACING.m,
    padding: SPACING.s,
    backgroundColor: COLORS.primaryLight + '20', // 20% opacity
    borderRadius: 8,
  },
  feedbackText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default BreathTracker;