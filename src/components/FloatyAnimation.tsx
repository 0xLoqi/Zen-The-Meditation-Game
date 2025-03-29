import React from 'react';
import { ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface FloatyAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
  intensity?: 'gentle' | 'medium' | 'strong';
  animation?: 'float' | 'pulse' | 'float-rotate' | 'fade-float' | 'bounce-float';
}

const FloatyAnimation: React.FC<FloatyAnimationProps> = ({
  children,
  style,
  duration = 2500,
  delay = 0,
  intensity = 'gentle',
  animation = 'float',
}) => {
  // Define animation intensities
  const getIntensityValue = () => {
    switch(intensity) {
      case 'gentle': return 5;
      case 'medium': return 10;
      case 'strong': return 15;
      default: return 5;
    }
  };

  // Map animation types to Animatable animations
  const getAnimation = () => {
    switch(animation) {
      case 'float':
        return 'float';
      case 'pulse':
        return 'pulse';
      case 'float-rotate':
        return 'float-rotate';
      case 'fade-float':
        return 'fade-float';
      case 'bounce-float':
        return 'bounce-float';
      default:
        return 'float';
    }
  };

  return (
    <Animatable.View
      animation={getAnimation()}
      duration={duration}
      delay={delay}
      iterationCount="infinite"
      direction="alternate"
      easing="ease-in-out"
      style={style}
    >
      {children}
    </Animatable.View>
  );
};

export default FloatyAnimation;