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
  const [canContinue, setCanContinue] = useState(false);

  // All shared values defined together at the top
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const bagScale = useSharedValue(1);
  const bagOpacity = useSharedValue(1);
  const bagRotate = useSharedValue(0);
  const bagTranslateY = useSharedValue(0);
  const rewardScale = useSharedValue(0);
  const rewardOpacity = useSharedValue(0);
  const rewardTranslateY = useSharedValue(20);
  const rewardContainerOpacity = useSharedValue(0);

  // Background pattern animation values
  const bgScrollX = useSharedValue(0);
  const bgScrollY = useSharedValue(0);
  const bgRotate = useSharedValue(0);
  const bgScale = useSharedValue(1);

  // All animation styles defined together
  const bagStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bagScale.value },
      { translateY: bagTranslateY.value },
      { rotate: `${bagRotate.value}rad` }
    ],
    opacity: bagOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const rewardContainerStyle = useAnimatedStyle(() => ({
    opacity: rewardContainerOpacity.value,
  }));

  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rewardOpacity.value,
    transform: [
      { scale: rewardScale.value },
      { translateY: rewardTranslateY.value }
    ],
  }));

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

  // Background pattern animation style
  const backgroundPatternStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: bgScrollX.value },
      { translateY: bgScrollY.value },
      { rotate: `${bgRotate.value}deg` },
      { scale: bgScale.value }
    ],
  }));

  // Single useEffect for all animations
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

    // Button animation
    buttonOpacity.value = withDelay(3700, 
      withTiming(1, { duration: 500 })
    );
    buttonScale.value = withDelay(3700,
      withSpring(1, { damping: 8 })
    );

    // Enable button
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 3700);

    // Add infinite background pattern animations with faster speeds
    bgScrollX.value = withRepeat(
      withSequence(
        withTiming(-200, { duration: 8000 }),
        withTiming(0, { duration: 8000 })
      ),
      -1,
      true
    );

    bgScrollY.value = withRepeat(
      withSequence(
        withTiming(-200, { duration: 10000 }),
        withTiming(0, { duration: 10000 })
      ),
      -1,
      true
    );

    bgRotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 15000 }),
        withTiming(-2, { duration: 15000 })
      ),
      -1,
      true
    );

    bgScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 10000 }),
        withTiming(1, { duration: 10000 })
      ),
      -1,
      true
    );

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (canContinue) {
      continueAsGuest();
    }
  };

  // Generate sparkle positions
  const sparklePositions = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;
    const radius = 100;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius - 80
    };
  });

  // Generate shiny particles
  const shinyParticles = Array.from({ length: 8 }, (_, i) => i);

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
            withRepeat(
              withSequence(
                withSpring(startPosition.x + Math.random() * 100 - 50),
                withSpring(startPosition.x + Math.random() * 200 - 100),
                withSpring(startPosition.x)
              ),
              -1, // Infinite repeat
              true
            )
          ) 
        },
        { 
          translateY: withDelay(delay,
            withRepeat(
              withSequence(
                withSpring(startPosition.y - Math.random() * 50),
                withSpring(startPosition.y - Math.random() * 100),
                withSpring(startPosition.y)
              ),
              -1, // Infinite repeat
              true
            )
          ) 
        },
        {
          scale: withDelay(delay,
            withRepeat(
              withSequence(
                withSpring(1.5),
                withSpring(0.5),
                withSpring(1)
              ),
              -1, // Infinite repeat
              true
            )
          )
        }
      ],
      opacity: withDelay(delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 600 }),
            withTiming(0.8, { duration: 400 })
          ),
          -1, // Infinite repeat
          true
        )
      ),
    }));

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <Animated.View style={[styles.backgroundPattern, backgroundPatternStyle]}>
        <Image 
          source={require('../../../assets/images/backgrounds/Glowbag_background.png')}
          style={styles.patternImage}
          resizeMode="repeat"
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
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
                sparkleStyle(2500 + (index * 100), position) // Stagger the start times
              ]}
            >
              <MaterialCommunityIcons
                name={index % 2 === 0 ? "star-four-points" : "star"}
                size={index % 3 === 0 ? 24 : 16}
                color={index % 4 === 0 ? "#FFD700" : "#FFA500"}
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

            {/* Item Details with Background Box */}
            <Animated.View style={[styles.itemDetails, itemDetailsStyle]}>
              <View style={styles.textBackground}>
                <Text style={styles.itemName}>"Got Mail" Totem</Text>
                <Text style={styles.itemType}>Rare Cosmetic Item</Text>
                <Text style={styles.itemDescription}>A mystical totem that shows your connection to Lumina.</Text>
              </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  safeArea: {
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
    width: '100%',
  },
  textBackground: {
    backgroundColor: 'rgba(255, 248, 240, 0.85)', // Semi-transparent warm white
    borderRadius: 15,
    padding: SPACING.medium,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  itemType: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: SPACING.medium,
    textAlign: 'center',
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
  backgroundPattern: {
    position: 'absolute',
    top: -200,
    left: -200,
    right: -200,
    bottom: -200,
    opacity: 0.15,
  },
  patternImage: {
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default GlowbagOpeningScreen; 