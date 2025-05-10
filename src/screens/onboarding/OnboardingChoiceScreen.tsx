import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Animated, Dimensions, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { NewOnboardingStackParamList } from '../../navigation/NewOnboardingNavigator';

// Type navigation prop specific to this screen within its navigator
type OnboardingChoiceNavigationProp = NativeStackNavigationProp<
  NewOnboardingStackParamList,
  'OnboardingChoice'
>;

// Mini Zenni images
const miniZennis = [
  require('../../../assets/images/cosmetics/base/default_base.png'),
  require('../../../assets/images/cosmetics/base/legendary_face_base_cosmic.png'),
  require('../../../assets/images/cosmetics/base/legendary_face_base_stained_glass.png'),
  require('../../../assets/images/cosmetics/base/legendary_face_base_robo.png'),
  require('../../../assets/images/cosmetics/base/default_sillouhette.png'),
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sparkle component
const Sparkle = ({ left, top, delay = 0 }) => {
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, { toValue: 1, duration: 1200, delay, useNativeDriver: true }),
        Animated.timing(sparkleAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  // Define size here for easier adjustment
  const sparkleSize = 18; // Adjusted size slightly, can be changed if needed

  return (
    <Animated.Image // Changed from Animated.View to Animated.Image
      source={require('../../../assets/images/UI/sparkle.png')} // Use the sparkle image
      style={{
        position: 'absolute',
        left,
        top,
        opacity: sparkleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
        transform: [
          { scale: sparkleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) },
        ],
        width: sparkleSize,  // Use defined size
        height: sparkleSize, // Use defined size
        // Removed backgroundColor, borderRadius, shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
      }}
      resizeMode="contain" // Ensure the image scales nicely
    />
  );
};

export default function OnboardingChoiceScreen() {
  const navigation = useNavigation<OnboardingChoiceNavigationProp>();
  const { continueAsGuest, isLoading: isAuthLoading } = useAuthStore();
  const { getUserData } = useUserStore();
  const [isProcessingGuest, setIsProcessingGuest] = React.useState(false);

  // Animation refs for each Zenni
  const anims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const rotAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    anims.forEach((anim, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: direction * 1,
            duration: 9000 + i * 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: direction * -1,
            duration: 9000 + i * 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
    rotAnims.forEach((rot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rot, {
            toValue: 1,
            duration: 4000 + i * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rot, {
            toValue: -1,
            duration: 4000 + i * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleContinueOnboarding = async () => {
    setIsProcessingGuest(true);
    try {
      await continueAsGuest();
      console.log('[OnboardingChoice] Guest session created, fetching user data...');
      await getUserData();
      console.log('[OnboardingChoice] State updated. Navigating to Welcome...');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error("Failed to start guest session or fetch user data:", error);
      setIsProcessingGuest(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/choice_screen_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Animated Mini Zennis */}
      {miniZennis.map((img, i) => {
        // Position and movement logic for each Zenni
        const size = 110;
        const top = [60, 120, SCREEN_HEIGHT - 220, SCREEN_HEIGHT - 140, 180][i];
        const left = [30, SCREEN_WIDTH - 130, 60, SCREEN_WIDTH - 120, SCREEN_WIDTH / 2 - 55][i];
        // Only move on one axis for each Zenni
        const translateX = anims[i].interpolate({ inputRange: [-1, 1], outputRange: [-30, 30] });
        const translateY = anims[i].interpolate({ inputRange: [-1, 1], outputRange: [20, -20] });
        const rotate = rotAnims[i].interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top,
              left,
              width: size,
              height: size,
              zIndex: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 10,
              opacity: 0.92,
              transform: [
                i % 2 === 0 ? { translateX } : { translateY },
                { rotate },
              ],
            }}
          >
            <Animated.Image
              source={img}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="contain"
            />
            {/* Sparkles around each Zenni */}
            <Sparkle left={size * 0.7} top={size * 0.2} delay={i * 300} />
            <Sparkle left={size * 0.2} top={size * 0.7} delay={i * 500 + 200} />
          </Animated.View>
        );
      })}
      <View style={styles.centeredOuter}>
        <View style={styles.card}>
      <Text style={styles.title}>Welcome to Zen!</Text>
      <Text style={styles.subtitle}>Would you like to continue onboarding or sign in now?</Text>

      {(isAuthLoading || isProcessingGuest) ? (
        <ActivityIndicator size="large" color="#4B9CD3" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinueOnboarding}
            disabled={isAuthLoading || isProcessingGuest}
          >
            <Text style={styles.buttonText}>Start Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              navigation.replace('Login');
            }}
            disabled={isAuthLoading || isProcessingGuest}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centeredOuter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 340,
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4B9CD3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 