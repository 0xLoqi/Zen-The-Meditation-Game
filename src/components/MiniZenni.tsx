import React, { useEffect } from 'react';
import {
  StyleSheet as RNStyleSheet,
  View as RNView,
  Image as RNImage,
  ViewStyle,
} from 'react-native';
import { OutfitId } from '../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Sparkle from './Sparkle';

interface MiniZenniProps {
  outfitId: OutfitId;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  animationState?: 'idle' | 'meditating' | 'levelUp' | 'bouncing' | 'success';
  autoPlay?: boolean;
  loop?: boolean;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const MiniZenni = ({
  outfitId = 'default',
  size = 'medium',
  style,
  animationState = 'idle',
  autoPlay = true,
  loop = true,
  colorScheme,
}: MiniZenniProps) => {
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    if (animationState === 'success') {
      // Success animation sequence
      scale.value = withSpring(1.2, { damping: 2 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 4 });
      }, 300);

      rotate.value = withTiming(-0.1, { duration: 200 });
      setTimeout(() => {
        rotate.value = withTiming(0.1, { duration: 400 });
      }, 200);
      setTimeout(() => {
        rotate.value = withTiming(0, { duration: 200 });
      }, 600);

      sparkleOpacity.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        sparkleOpacity.value = withTiming(0, { duration: 300 });
      }, 800);
    } else if (animationState === 'bouncing') {
      // Bouncing animation
      scale.value = withSpring(1.1, { damping: 4 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 4 });
      }, 300);
    } else {
      // Reset to default
      scale.value = withSpring(1);
      rotate.value = withSpring(0);
      sparkleOpacity.value = withSpring(0);
    }
  }, [animationState]);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}rad` }
      ],
      opacity: opacity.value,
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: sparkleOpacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Determine dimensions based on size (increased by 30%)
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 104, height: 104 }; // 80 * 1.3
      case 'large':
        return { width: 260, height: 260 }; // 200 * 1.3
      case 'medium':
      default:
        return { width: 156, height: 156 }; // 120 * 1.3
    }
  };

  const dimensions = getDimensions();
  const sparkleSize = dimensions.width * 1.5;

  // Get the appropriate image based on state
  const getImage = () => {
    if (animationState === 'success') {
      return require('../../assets/images/zenni_success.png');
    }
    return require('../../assets/images/zenni_summoning.png');
  };

  return (
    <RNView style={[styles.container, dimensions, style]}>
      <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
        <Sparkle 
          size={sparkleSize} 
          color={colorScheme?.accent || '#FFD700'} 
          style={styles.sparkle}
        />
      </Animated.View>
      <Animated.View style={animatedStyle}>
        <RNImage
          source={getImage()}
          style={[
            styles.image,
            dimensions,
            colorScheme && {
              tintColor: colorScheme.primary,
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </RNView>
  );
};

const styles = RNStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sparkleContainer: {
    ...RNStyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
});

export default MiniZenni;