import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { OutfitId } from '../types';

interface MiniZenniProps {
  outfitId: OutfitId;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  animationState?: 'idle' | 'meditating' | 'levelUp';
  autoPlay?: boolean;
  loop?: boolean;
}

const MiniZenni: React.FC<MiniZenniProps> = ({
  outfitId = 'default',
  size = 'medium',
  style,
  animationState = 'idle',
  autoPlay = true,
  loop = true,
}) => {
  const animationRef = useRef<LottieView>(null);
  
  // Animation values for subtle movements
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Setup subtle breathing animation for idle state
  useEffect(() => {
    if (animationState === 'idle') {
      // Subtle up and down movement with scaling
      const breathingAnimation = () => {
        translateY.value = withSequence(
          withSpring(-5, { damping: 10, stiffness: 40 }),
          withDelay(
            1000,
            withSpring(0, { damping: 10, stiffness: 40 })
          )
        );
        
        scale.value = withSequence(
          withSpring(1.03, { damping: 10, stiffness: 40 }),
          withDelay(
            1000,
            withSpring(1, { damping: 10, stiffness: 40 })
          )
        );
        
        // Repeat the animation after a delay
        setTimeout(breathingAnimation, 3000);
      };
      
      breathingAnimation();
    }
    
    if (animationState === 'levelUp') {
      // More dramatic animation for level up
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 40 }),
        withDelay(
          500,
          withSpring(1, { damping: 10, stiffness: 40 })
        )
      );
    }
  }, [animationState]);
  
  // Apply animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });
  
  // Get animation source based on state and outfit
  const getAnimationSource = () => {
    // For now, use the animation state directly
    // In a real app, you would have different animations for different outfits
    switch (animationState) {
      case 'meditating':
        return require('../assets/animations/mini_zenni_meditating.json');
      case 'levelUp':
        return require('../assets/animations/mini_zenni_level_up.json');
      default: // idle
        return require('../assets/animations/mini_zenni_default.json');
    }
  };
  
  // Get size dimensions
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 100 };
      case 'large':
        return { width: 240, height: 240 };
      default: // medium
        return { width: 160, height: 160 };
    }
  };
  
  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <LottieView
        ref={animationRef}
        source={getAnimationSource()}
        style={[getDimensions()]}
        autoPlay={autoPlay}
        loop={loop}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MiniZenni;
