import React, { useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { Animated, Easing } from 'react-native';
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
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Define animation intensities
  const getIntensityValue = () => {
    switch(intensity) {
      case 'gentle': return 5;
      case 'medium': return 10;
      case 'strong': return 15;
      default: return 5;
    }
  };

  useEffect(() => {
    const intensity = getIntensityValue();
    
    // Wait for delay, then fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      delay,
      easing: Easing.out(Easing.cubic)
    }).start();
    
    // Set up the appropriate animation based on type
    let floatAnimation;
    
    switch(animation) {
      case 'float':
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -intensity,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        );
        break;
      
      case 'pulse':
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1 + (intensity * 0.01),
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        );
        break;
      
      case 'float-rotate':
        // Combined animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -intensity,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        ).start();
        
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(rotate, {
              toValue: 1,
              duration: duration * 1.5,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(rotate, {
              toValue: 0,
              duration: duration * 1.5,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        );
        break;
      
      case 'fade-float':
        // Combined animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -intensity,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        ).start();
        
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: duration / 2,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        );
        break;
      
      case 'bounce-float':
        // Combined animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -intensity,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        ).start();
        
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1 + (intensity * 0.02),
              duration: duration / 2,
              useNativeDriver: true,
              easing: Easing.out(Easing.bounce)
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
              easing: Easing.in(Easing.bounce)
            })
          ])
        );
        break;
        
      default:
        floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -intensity,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin)
            })
          ])
        );
    }
    
    // Start the animation after delay
    setTimeout(() => {
      floatAnimation.start();
    }, delay);
    
    return () => {
      floatAnimation.stop();
    };
  }, []);
  
  // Map rotation to degrees
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  
  // Create transform array based on animation type
  const getTransform = () => {
    const baseTransform = [];
    
    if (animation === 'float' || animation === 'fade-float' || animation === 'float-rotate' || animation === 'bounce-float') {
      baseTransform.push({ translateY });
    }
    
    if (animation === 'pulse' || animation === 'bounce-float') {
      baseTransform.push({ scale });
    }
    
    if (animation === 'float-rotate') {
      baseTransform.push({ rotate: rotateInterpolate });
    }
    
    return baseTransform;
  };

  return (
    <Animated.View
      style={[
        style,
        { 
          opacity,
          transform: getTransform()
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FloatyAnimation;