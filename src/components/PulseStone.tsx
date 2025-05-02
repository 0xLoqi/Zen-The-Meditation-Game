import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Image } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PulseStoneProps {
  onPressIn?: () => void;
  onPressOut?: () => void;
  onSuccess: () => void;
  onRetry: () => void;
}

const HOLD_DURATION_MS = 3000;
const BROKEN_STATE_DURATION_MS = 1500;
const FADE_DURATION_MS = 150; // Faster transition duration

// Define image sources
const idleImage = require('../../assets/images/UI/focus_tablet.png');
const activeImage = require('../../assets/images/UI/focus_tablet_active.png');
const brokenImage = require('../../assets/images/UI/focus_tablet_broken.png');

const PulseStone: React.FC<PulseStoneProps> = ({ onSuccess, onRetry }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const brokenTimer = useRef<NodeJS.Timeout | null>(null);
  const isHeld = useRef(false);
  const [tabletState, setTabletState] = useState<'idle' | 'active' | 'broken'>('idle');

  // Animated Opacities for crossfade
  const idleOpacity = useRef(new Animated.Value(1)).current;
  const activeOpacity = useRef(new Animated.Value(0)).current;
  const brokenOpacity = useRef(new Animated.Value(0)).current;

  // Effect to handle opacity animations when tabletState changes
  useEffect(() => {
    let targetIdle = 0, targetActive = 0, targetBroken = 0;

    if (tabletState === 'idle') {
      targetIdle = 1;
    } else if (tabletState === 'active') {
      targetActive = 1;
    } else if (tabletState === 'broken') {
      targetBroken = 1;
    }

    Animated.parallel([
      Animated.timing(idleOpacity, {
        toValue: targetIdle,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(activeOpacity, {
        toValue: targetActive,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(brokenOpacity, {
        toValue: targetBroken,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }),
    ]).start();

  }, [tabletState]); // Re-run animation when state changes


  // Breathing Animation (Separate from Opacity)
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    animation.start();
    const hapticInterval = setInterval(() => {
      if (!isHeld.current) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
    }, 3000);
    return () => {
      animation.stop();
      clearInterval(hapticInterval);
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (brokenTimer.current) clearTimeout(brokenTimer.current);
    };
  }, [scaleAnim]);

  const handlePressIn = () => {
    isHeld.current = true;
    setTabletState('active'); // Trigger animation via useEffect
    if (brokenTimer.current) clearTimeout(brokenTimer.current); 
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    holdTimer.current = setTimeout(() => {
      if (isHeld.current) {
        onSuccess();
        setTabletState('idle'); // Trigger animation via useEffect
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      holdTimer.current = null;
    }, HOLD_DURATION_MS);
  };

  const handlePressOut = () => {
    isHeld.current = false;
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      setTabletState('broken'); // Trigger animation via useEffect
      onRetry();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      brokenTimer.current = setTimeout(() => {
          setTabletState('idle'); // Trigger animation via useEffect
          brokenTimer.current = null;
      }, BROKEN_STATE_DURATION_MS);
    } else {
        // If pressOut happens after success or when already idle, ensure idle state animation
        if (tabletState !== 'idle') {
             setTabletState('idle');
        }
    }
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {/* Outer container handles breathing scale animation */}
      <Animated.View style={[styles.stoneContainer, { transform: [{ scale: scaleAnim }] }]}>
        {/* Stack images and control opacity */}
        <Animated.Image
          source={idleImage}
          style={[styles.stoneImage, { opacity: idleOpacity }]}
          resizeMode="contain"
          fadeDuration={0} // Prevent Android default fade
        />
        <Animated.Image
          source={activeImage}
          style={[styles.stoneImage, { opacity: activeOpacity }]}
          resizeMode="contain"
          fadeDuration={0}
        />
        <Animated.Image
          source={brokenImage}
          style={[styles.stoneImage, { opacity: brokenOpacity }]}
          resizeMode="contain"
          fadeDuration={0}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  stoneContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Needed for absolute positioning of children
  },
  stoneImage: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Stack images
    top: 0,
    left: 0,
  },
});

export default PulseStone; 