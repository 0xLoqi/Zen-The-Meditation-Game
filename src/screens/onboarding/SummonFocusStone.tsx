import React, { useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import PulseStone from '../../components/PulseStone'; // Updated path
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message'; // Import toast
// Import animation and confetti
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon'; // Assuming this is installed

// Define your stack param list if needed
// type RootStackParamList = { ... SummonFocusStone: undefined; GlowcardReward: undefined; ... };
// type SummonFocusStoneNavigationProp = StackNavigationProp<RootStackParamList, 'SummonFocusStone'>;
type SummonFocusStoneNavigationProp = StackNavigationProp<any, 'SummonFocusStone'>; // Generic fallback

// Define image paths
const bgImage = require('../../../assets/images/backgrounds/tablet_bg.png'); // Keep tablet_bg
const successImage = require('../../../assets/images/UI/focus_tablet_success.png'); // Unchanged

const SummonFocusStone = () => {
  const navigation = useNavigation<SummonFocusStoneNavigationProp>();
  const [isSuccessState, setIsSuccessState] = useState(false); // State for success view
  const confettiRef = useRef<ConfettiCannon>(null); // Ref for confetti

  // Animation values
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.7); // Start smaller

  // Animated style for the success image
  const successImageStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
      transform: [{ scale: successScale.value }],
    };
  });

  const handleSuccess = () => {
    console.log('Hold successful!');
    setIsSuccessState(true); // Show success view elements

    // Trigger animations
    successOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
    successScale.value = withTiming(1, { duration: 800, easing: Easing.elastic(1) }); // Add a bounce

    // Start confetti
    confettiRef.current?.start();

    // Navigate after a delay
    setTimeout(() => {
      navigation.navigate('GlowcardReward'); // CORRECT TARGET
    }, 2500);
  };

  const handleRetry = () => {
    console.log('Hold released too early.');
    // Show soft "retry" prompt using a toast message
    Toast.show({
      type: 'info', // Or a custom type
      text1: 'The tablet shatters...',
      text2: 'But Zenni gives you another chance. Hold it longer this time!',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  return (
    <ImageBackground
      source={bgImage} // Use defined variable
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {!isSuccessState ? (
          // Show pulsing stone
          <PulseStone onSuccess={handleSuccess} onRetry={handleRetry} />
        ) : (
           // Show success image with animation
           <Animated.View style={[styles.successImageContainer, successImageStyle]}>
             <Image source={successImage} style={styles.successImage} resizeMode="contain" />
           </Animated.View>
        )}
      </View>
      {/* Confetti Cannon - positioned absolutely */}
      <ConfettiCannon
        ref={confettiRef}
        count={200} // Number of confetti pieces
        origin={{ x: -10, y: 0 }} // Start from top left
        fadeOut={true}
        autoStart={false} // Don't start automatically
        explosionSpeed={400}
        fallSpeed={3000}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successImageContainer: {
     // Styles for the animated container if needed
  },
  successImage: {
    width: 250, // Example size, adjust as needed
    height: 250, // Example size, adjust as needed
  },
});

export default SummonFocusStone; 