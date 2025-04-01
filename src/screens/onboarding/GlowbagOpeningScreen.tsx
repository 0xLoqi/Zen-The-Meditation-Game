import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
  withRepeat,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import PatternBackground from '../../components/PatternBackground';
import { useAuthStore } from '../../store/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GlowbagOpeningScreen = () => {
  const navigation = useNavigation();
  const { continueAsGuest } = useAuthStore();
  const hasAnimationFinished = useRef(false);

  // Animation for the bag floating and glowing
  const bagStyle = useAnimatedStyle(() => {
    const scale = withSequence(
      withTiming(1.1, { 
        duration: 1000,
        easing: Easing.inOut(Easing.ease)
      }),
      withTiming(1, { 
        duration: 1000,
        easing: Easing.inOut(Easing.ease)
      }),
      withTiming(1.3, { 
        duration: 500,
        easing: Easing.inOut(Easing.ease)
      }),
      withTiming(0, { 
        duration: 300,
        easing: Easing.inOut(Easing.ease)
      })
    );

    const translateY = withSequence(
      withSpring(-20, { damping: 4, stiffness: 30 }),
      withSpring(0, { damping: 4, stiffness: 30 }),
      withSpring(-50, { damping: 6, stiffness: 40 })
    );

    return {
      transform: [
        { scale },
        { translateY }
      ],
      opacity: withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 300 })
      ),
    };
  });

  // Sparkles animation
  const sparkleStyle = (delay: number, startPosition: { x: number, y: number }) => 
    useAnimatedStyle(() => ({
      transform: [
        { 
          translateX: withDelay(delay,
            withSequence(
              withSpring(startPosition.x + Math.random() * 100 - 50),
              withSpring(startPosition.x + Math.random() * 200 - 100)
            )
          ) 
        },
        { 
          translateY: withDelay(delay,
            withSequence(
              withSpring(startPosition.y - Math.random() * 50),
              withSpring(startPosition.y - Math.random() * 100)
            )
          ) 
        },
        {
          scale: withDelay(delay,
            withSequence(
              withSpring(1.5),
              withSpring(0)
            )
          )
        }
      ],
      opacity: withDelay(delay,
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 300 })
        )
      ),
    }));

  // Item details animation
  const itemDetailsStyle = useAnimatedStyle(() => ({
    opacity: withDelay(3200,
      withTiming(1, { 
        duration: 500,
        easing: Easing.out(Easing.ease)
      })
    ),
    transform: [
      {
        translateY: withDelay(3200,
          withSpring(0, { 
            from: 20,
            damping: 12,
            stiffness: 100,
          })
        )
      }
    ]
  }));

  // Reward item animation with delayed visibility
  const rewardContainerStyle = useAnimatedStyle(() => ({
    opacity: withDelay(2800,
      withTiming(1, { 
        duration: 1,
        easing: Easing.linear
      })
    ),
    display: withDelay(2800,
      withTiming(1, {
        duration: 1,
      }, (finished) => {
        if (finished) {
          runOnJS(handleAnimationComplete)();
        }
      })
    ),
  }));

  const rewardStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        scale: withDelay(2800,
          withSequence(
            withSpring(0.5, { damping: 10 }),
            withSpring(1.2, { damping: 5 }),
            withSpring(1, { damping: 3 })
          )
        ) 
      }
    ],
  }));

  // Shiny particles around reward
  const shinyParticleStyle = (index: number) => useAnimatedStyle(() => {
    const angle = (index / 8) * Math.PI * 2;
    const radius = 60;
    
    return {
      transform: [
        { 
          translateX: withDelay(3000,
            withRepeat(
              withSequence(
                withSpring(Math.cos(angle) * radius),
                withSpring(Math.cos(angle + Math.PI/4) * radius)
              ),
              -1,
              true
            )
          )
        },
        { 
          translateY: withDelay(3000,
            withRepeat(
              withSequence(
                withSpring(Math.sin(angle) * radius),
                withSpring(Math.sin(angle + Math.PI/4) * radius)
              ),
              -1,
              true
            )
          )
        },
        {
          scale: withDelay(3000,
            withRepeat(
              withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(0.8, { duration: 1000 })
              ),
              -1,
              true
            )
          )
        }
      ],
      opacity: withDelay(3000,
        withTiming(0.8, { duration: 500 })
      ),
    };
  });

  const handleAnimationComplete = () => {
    if (!hasAnimationFinished.current) {
      hasAnimationFinished.current = true;
      setTimeout(() => {
        continueAsGuest();
      }, 2000);
    }
  };

  // Generate multiple sparkle positions
  const sparklePositions = Array.from({ length: 12 }, () => ({
    x: Math.random() * SCREEN_WIDTH - SCREEN_WIDTH/2,
    y: Math.random() * SCREEN_HEIGHT/2
  }));

  // Generate shiny particles
  const shinyParticles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <PatternBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Bag Animation */}
          <Animated.Image
            source={require('../../../assets/images/glowbags/Glowbag_legendary.png')}
            style={[styles.glowbag, bagStyle]}
            resizeMode="contain"
          />

          {/* Sparkles */}
          {sparklePositions.map((position, index) => (
            <Animated.View
              key={index}
              style={[
                styles.sparkle,
                sparkleStyle(2500 + Math.random() * 500, position)
              ]}
            >
              <MaterialCommunityIcons
                name="star-four-points"
                size={24}
                color="#FFD700"
              />
            </Animated.View>
          ))}

          {/* Reward Container */}
          <Animated.View style={[styles.rewardContainer, rewardContainerStyle]}>
            {/* Shiny Particles */}
            {shinyParticles.map((index) => (
              <Animated.View
                key={`particle-${index}`}
                style={[styles.shinyParticle, shinyParticleStyle(index)]}
              >
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color="#FFD700"
                />
              </Animated.View>
            ))}

            {/* Reward Item */}
            <Animated.Image
              source={require('../../../assets/images/Cosmetic_totem_GotMail.png')}
              style={[styles.reward, rewardStyle]}
              resizeMode="contain"
            />

            {/* Item Details */}
            <Animated.View style={[styles.itemDetails, itemDetailsStyle]}>
              <Text style={styles.itemName}>Got Mail Totem</Text>
              <Text style={styles.itemType}>Rare Cosmetic Item</Text>
              <Text style={styles.itemDescription}>A mystical totem that shows your connection to Lumina.</Text>
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowbag: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  sparkle: {
    position: 'absolute',
    width: 24,
    height: 24,
    opacity: 0,
  },
  rewardContainer: {
    width: 200,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  reward: {
    width: 160,
    height: 160,
    opacity: 0,
  },
  shinyParticle: {
    position: 'absolute',
    width: 16,
    height: 16,
    opacity: 0,
  },
  itemDetails: {
    alignItems: 'center',
    marginTop: SPACING.large,
    opacity: 0,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  itemType: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: SPACING.medium,
  },
  itemDescription: {
    fontSize: 16,
    color: COLORS.neutralDark,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default GlowbagOpeningScreen; 