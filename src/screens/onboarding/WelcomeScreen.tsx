import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import FloatingLeaves from '../../components/FloatingLeaves';
import MiniZenni from '../../components/MiniZenni';
import PatternBackground from '../../components/PatternBackground';
import ProgressDots from '../../components/ProgressDots';

const WelcomeScreen = ({ navigation, route }: any) => {
  const { step = 1, total = 9 } = route.params || {};
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const floatAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  
  // Animation styles
  const zenniStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        { scale: scaleAnim.value },
        { translateY: floatAnim.value },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowAnim.value,
      transform: [{ scale: 1 + glowAnim.value * 0.1 }],
    };
  });
  
  useEffect(() => {
    // Initial animations
    fadeAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    scaleAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
    
    // Continuous floating animation
    const startFloatingAnimation = () => {
      floatAnim.value = withSequence(
        withTiming(-10, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        withTiming(0, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      );
      
      setTimeout(startFloatingAnimation, 3000);
    };
    
    // Glow animation
    const startGlowAnimation = () => {
      glowAnim.value = withSequence(
        withTiming(1, {
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        withTiming(0, {
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      );
      
      setTimeout(startGlowAnimation, 4000);
    };
    
    startFloatingAnimation();
    startGlowAnimation();
  }, []);
  
  const handleStart = () => {
    navigation.navigate('NameSelection');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <>
      <ProgressDots step={step} total={total} />
      <PatternBackground>
        <SafeAreaView style={styles.container}>
          <FloatingLeaves count={30} style={styles.leavesBackground} />
          
          <View style={styles.content}>
            <Animated.View style={[styles.zenniContainer, zenniStyle]}>
              <Animated.View style={[styles.glowContainer, glowStyle]}>
                <MiniZenni
                  outfitId="default"
                  size="large"
                  animationState="idle"
                  autoPlay
                  loop
                />
              </Animated.View>
            </Animated.View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome to Zen</Text>
              <Text style={styles.message}>
                "Let's create your companion of the path..."
              </Text>
              <Text style={styles.description}>
                Together, we'll summon your Mini Zenni - a spiritual guide for your mindfulness journey.
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Begin Journey"
                onPress={handleStart}
                size="large"
                style={styles.button}
              />
              
              <TouchableOpacity 
                onPress={handleLogin}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </PatternBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xxlarge,
    paddingHorizontal: SPACING.large,
  },
  zenniContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  glowContainer: {
    padding: SPACING.large,
    borderRadius: SPACING.large,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xxlarge,
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  message: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.large,
    fontStyle: 'italic',
  },
  description: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
  loginButton: {
    marginTop: SPACING.large,
    padding: SPACING.medium,
  },
  loginText: {
    ...FONTS.body.regular,
    color: COLORS.neutralMedium,
    textAlign: 'center',
  },
});

export default WelcomeScreen; 