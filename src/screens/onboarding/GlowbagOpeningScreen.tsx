import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
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
  useSharedValue,
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
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const [canContinue, setCanContinue] = useState(false);

  // Animation values using Reanimated
  const bagScale = useSharedValue(1);
  const bagOpacity = useSharedValue(1);
  const bagRotate = useSharedValue(0);
  const bagTranslateY = useSharedValue(0);
  
  // Reward animation values
  const rewardScale = useSharedValue(0);
  const rewardOpacity = useSharedValue(0);
  const rewardTranslateY = useSharedValue(20);
  const rewardContainerOpacity = useSharedValue(0);

  useEffect(() => {
    // Bag animation sequence
    bagScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withTiming(1.2, { duration: 400 }),
      withTiming(1.5, { duration: 400 }),
      withTiming(0, { duration: 400 })
    );

    bagOpacity.value = withSequence(
      withTiming(1, { duration: 2000 }),
      withTiming(0, { duration: 400 })
    );

    bagRotate.value = withSequence(
      withTiming(0.1, { duration: 100 }),
      withTiming(-0.1, { duration: 100 }),
      withTiming(0.1, { duration: 100 }),
      withTiming(0, { duration: 100 }),
      withDelay(800, withTiming(0.15, { duration: 100 })),
      withTiming(-0.15, { duration: 100 }),
      withTiming(0.15, { duration: 100 }),
      withTiming(0, { duration: 100 }),
      withDelay(800, withTiming(0.2, { duration: 100 })),
      withTiming(-0.2, { duration: 100 }),
      withTiming(0.2, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    bagTranslateY.value = withSequence(
      withTiming(-20, { duration: 800 }),
      withTiming(0, { duration: 800 })
    );

    // Reward appears after bag disappears
    rewardContainerOpacity.value = withDelay(2800, 
      withTiming(1, { duration: 400 })
    );

    rewardScale.value = withDelay(2800, 
      withSequence(
        withSpring(0.5, { damping: 10 }),
        withSpring(1.2, { damping: 5 }),
        withSpring(1, { damping: 3 })
      )
    );

    rewardOpacity.value = withDelay(2800, 
      withTiming(1, { duration: 600 })
    );

    rewardTranslateY.value = withDelay(2800, 
      withTiming(0, { duration: 600 })
    );
  }, []);

  // Animation for the bag
  const bagStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: bagScale.value },
        { translateY: bagTranslateY.value },
        { rotate: `${bagRotate.value}rad` }
      ],
      opacity: bagOpacity.value,
    };
  });

  // Reward container style
  const rewardContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: rewardContainerOpacity.value,
    };
  });

  // Reward item animation
  const rewardStyle = useAnimatedStyle(() => {
    return {
      opacity: rewardOpacity.value,
      transform: [
        { scale: rewardScale.value },
        { translateY: rewardTranslateY.value }
      ],
    };
  });

  // Item details animation
  const itemDetailsStyle = useAnimatedStyle(() => ({
    opacity: withDelay(3200,
      withTiming(1, { duration: 500 })
    ),
    transform: [
      {
        translateY: withDelay(3200,
          withSpring(0, { 
            damping: 12,
            stiffness: 100,
          })
        )
      }
    ]
  }));

  // Shiny particles around reward
  const shinyParticleStyle = (index: number) => useAnimatedStyle(() => {
    const angle = (index / 8) * Math.PI * 2;
    const radius = 45;
    
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
                withSpring(Math.sin(angle) * radius - 80),
                withSpring(Math.sin(angle + Math.PI/4) * radius - 80)
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

  // Generate multiple sparkle positions
  const sparklePositions = Array.from({ length: 12 }, () => ({
    x: Math.random() * SCREEN_WIDTH - SCREEN_WIDTH/2,
    y: Math.random() * SCREEN_HEIGHT/2
  }));

  // Generate shiny particles
  const shinyParticles = Array.from({ length: 8 }, (_, i) => i);

  // Button animation style
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  // Start button animation after item details
  useEffect(() => {
    buttonOpacity.value = withDelay(3700, 
      withTiming(1, { duration: 500 })
    );
    buttonScale.value = withDelay(3700,
      withSpring(1, { damping: 8 })
    );
    // Enable the button after animations
    setTimeout(() => {
      setCanContinue(true);
    }, 3700);
  }, []);

  const handleContinue = () => {
    if (canContinue) {
      continueAsGuest();
    }
  };

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
              <Text style={styles.itemName}>"Got Mail" Totem</Text>
              <Text style={styles.itemType}>Rare Cosmetic Item</Text>
              <Text style={styles.itemDescription}>A mystical totem that shows your connection to Lumina.</Text>
            </Animated.View>
          </Animated.View>

          {/* Confirmation Button */}
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity
              style={[styles.button, !canContinue && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!canContinue}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    opacity: 0,
    paddingHorizontal: SPACING.xlarge,
  },
  button: {
    backgroundColor: '#FF5C00',
    paddingHorizontal: SPACING.xlarge * 2,
    paddingVertical: SPACING.medium,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0', // Light gray when disabled
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default GlowbagOpeningScreen; 