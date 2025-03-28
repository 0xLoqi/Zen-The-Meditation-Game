import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface BreathTrackerProps {
  onBreathTracked: (inhaling: boolean) => void;
  onBreathScoreUpdate: (score: number) => void;
  isActive: boolean;
  style?: ViewStyle;
}

const BREATH_DURATION = 5000; // 5 seconds per full breath cycle
const INHALE_RATIO = 0.4; // 40% of cycle is inhale
const EXHALE_RATIO = 0.6; // 60% of cycle is exhale

const BreathTracker: React.FC<BreathTrackerProps> = ({
  onBreathTracked,
  onBreathScoreUpdate,
  isActive,
  style,
}) => {
  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Breath guide animation
  const breathGuideY = useRef(new Animated.Value(0)).current;
  
  // State for tracking breath
  const [isInhaling, setIsInhaling] = useState(true);
  const [breathScore, setBreathScore] = useState(100);
  const [breathCount, setBreathCount] = useState(0);
  const totalDeviation = useRef(0);
  const totalBreathPoints = useRef(0);
  const lastY = useRef(0);
  
  // Function to provide haptic feedback
  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Setup breath guide animation
  useEffect(() => {
    if (isActive) {
      const animateBreathGuide = () => {
        // Animate inhale (move up)
        Animated.timing(breathGuideY, {
          toValue: -100,
          duration: BREATH_DURATION * INHALE_RATIO,
          useNativeDriver: true,
        }).start(() => {
          setIsInhaling(false);
          onBreathTracked(false);
          
          // Animate exhale (move down)
          Animated.timing(breathGuideY, {
            toValue: 0,
            duration: BREATH_DURATION * EXHALE_RATIO,
            useNativeDriver: true,
          }).start(() => {
            setIsInhaling(true);
            onBreathTracked(true);
            setBreathCount(prev => prev + 1);
            animateBreathGuide();
          });
        });
      };
      
      setIsInhaling(true);
      onBreathTracked(true);
      breathGuideY.setValue(0);
      animateBreathGuide();
      
      // Reset tracking values
      totalDeviation.current = 0;
      totalBreathPoints.current = 0;
      lastY.current = 0;
      setBreathCount(0);
      setBreathScore(100);
    }
    
    return () => {
      breathGuideY.stopAnimation();
    };
  }, [isActive]);
  
  // Update breath score
  useEffect(() => {
    if (breathCount > 0) {
      const score = Math.max(0, Math.min(100, Math.round(
        (totalBreathPoints.current / (breathCount * 100)) * 100
      )));
      setBreathScore(score);
      onBreathScoreUpdate(score);
    }
  }, [breathCount]);
  
  // Configure pan responder for thumb tracking
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isActive,
      onMoveShouldSetPanResponder: () => isActive,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        lastY.current = pan.y._value;
      },
      onPanResponderMove: (_, gestureState) => {
        // Update position
        pan.setValue({ x: 0, y: gestureState.dy });
        
        // Calculate deviation from breath guide
        const guideY = breathGuideY._value;
        const thumbY = -gestureState.dy; // Invert for comparison (up is positive for guide)
        const deviation = Math.abs(guideY - thumbY);
        const deviationPercent = Math.min(100, (deviation / 100) * 100);
        
        // Provide haptic feedback if too far off
        if (deviationPercent > 50 && Math.abs(lastY.current - gestureState.dy) > 10) {
          triggerHapticFeedback();
        }
        
        // Track for scoring
        const pointsForThisUpdate = Math.max(0, 100 - deviationPercent);
        totalBreathPoints.current += pointsForThisUpdate;
        
        lastY.current = gestureState.dy;
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        
        // Animate back to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  
  // Animated values for the guide elements
  const inhaleBubbleStyle = {
    transform: [
      { translateY: breathGuideY },
      { scale: isInhaling ? 1.3 : 0.8 },
    ],
    opacity: isInhaling ? 1 : 0.5,
  };
  
  const exhaleBubbleStyle = {
    transform: [
      { translateY: Animated.add(breathGuideY, new Animated.Value(200)) },
      { scale: isInhaling ? 0.8 : 1.3 },
    ],
    opacity: isInhaling ? 0.5 : 1,
  };
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.instructionText}>
        {isInhaling ? 'Breathe In' : 'Breathe Out'}
      </Text>
      
      <View style={styles.breathGuideContainer}>
        {/* Inhale bubble */}
        <Animated.View style={[styles.breathBubble, styles.inhaleBubble, inhaleBubbleStyle]}>
          <MaterialCommunityIcons name="arrow-up" size={24} color={COLORS.white} />
        </Animated.View>
        
        {/* Vertical guide line */}
        <View style={styles.guideLine} />
        
        {/* Exhale bubble */}
        <Animated.View style={[styles.breathBubble, styles.exhaleBubble, exhaleBubbleStyle]}>
          <MaterialCommunityIcons name="arrow-down" size={24} color={COLORS.white} />
        </Animated.View>
      </View>
      
      <View style={styles.thumbArea} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <MaterialCommunityIcons name="hand-back-left" size={32} color={COLORS.primary} />
        </Animated.View>
      </View>
      
      <Text style={styles.scoreText}>Breath Score: {breathScore}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  instructionText: {
    ...FONTS.heading.h2,
    color: COLORS.primary,
    marginBottom: SPACING.l,
  },
  breathGuideContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  guideLine: {
    width: 2,
    height: 200,
    backgroundColor: COLORS.neutralMedium,
    position: 'absolute',
  },
  breathBubble: {
    width: 50,
    height: 50,
    borderRadius: SIZES.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  inhaleBubble: {
    backgroundColor: COLORS.primary,
    top: 0,
  },
  exhaleBubble: {
    backgroundColor: COLORS.secondary,
    bottom: 0,
  },
  thumbArea: {
    width: width * 0.8,
    height: 200,
    borderRadius: SIZES.borderRadius.medium,
    borderWidth: 2,
    borderColor: COLORS.neutralLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: SIZES.borderRadius.circle,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  scoreText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
});

export default BreathTracker;
