import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import PatternBackground from '../../components/PatternBackground';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const GlowbagOfferScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  // Portal rotation animation
  const portalStyle = useAnimatedStyle(() => ({
    transform: [{
      rotate: withRepeat(
        withTiming('360deg', {
          duration: 20000,
          easing: Easing.linear,
        }),
        -1
      ),
    }],
  }));

  // Glowbag floating and glowing animation
  const glowbagStyle = useAnimatedStyle(() => {
    const scale = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const translateY = withRepeat(
      withSequence(
        withSpring(-10, { damping: 6, stiffness: 40 }),
        withSpring(0, { damping: 6, stiffness: 40 })
      ),
      -1,
      true
    );

    return {
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(text === '' || isValidEmail(text));
  };

  const handleSubmit = () => {
    if (email && !isValidEmail(email)) {
      setIsEmailValid(false);
      return;
    }
    navigation.navigate('Main');
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  return (
    <PatternBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.portalContainer}>
              <Animated.Image
                source={require('../../../assets/images/zenni_summoning_portal.png')}
                style={[styles.portalImage, portalStyle]}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              ✨ A rare Glowbag shimmers...
            </Text>

            <View style={styles.glowbagContainer}>
              <Animated.Image
                source={require('../../../assets/images/glowbags/Glowbag_legendary.png')}
                style={[styles.glowbagImage, glowbagStyle]}
                resizeMode="contain"
              />
              <MaterialCommunityIcons
                name="star-four-points"
                size={24}
                color="#FFD700"
                style={[styles.sparkle, styles.sparkle1]}
              />
              <MaterialCommunityIcons
                name="star-four-points"
                size={16}
                color="#FFD700"
                style={[styles.sparkle, styles.sparkle2]}
              />
              <MaterialCommunityIcons
                name="star-four-points"
                size={20}
                color="#FFD700"
                style={[styles.sparkle, styles.sparkle3]}
              />
            </View>

            <Text style={styles.description}>
              Share your email to save your progress
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !isEmailValid && styles.inputError]}
                placeholder="Your email (optional)"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.neutralMedium}
              />
              {!isEmailValid && (
                <Text style={styles.errorText}>
                  Please enter a valid email address
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              title={email ? "Claim Reward" : "Continue"}
              onPress={handleSubmit}
              size="large"
              style={styles.button}
            />
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.large,
    paddingBottom: SPACING.xxlarge,
  },
  portalContainer: {
    width: '60%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  portalImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  glowbagContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  glowbagImage: {
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    opacity: 0.8,
  },
  sparkle1: {
    top: '10%',
    right: '10%',
  },
  sparkle2: {
    bottom: '20%',
    left: '10%',
  },
  sparkle3: {
    top: '40%',
    right: '5%',
  },
  description: {
    fontSize: 18,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.medium,
    fontSize: 16,
    color: COLORS.neutralDark,
    ...SHADOWS.medium,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: SPACING.small,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
    paddingBottom: Platform.OS === 'ios' ? SPACING.medium : SPACING.large,
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginTop: SPACING.medium,
    padding: SPACING.small,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.neutralMedium,
    textAlign: 'center',
  },
});

export default GlowbagOfferScreen; 