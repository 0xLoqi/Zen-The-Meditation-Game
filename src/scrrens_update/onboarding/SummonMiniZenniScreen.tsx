import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import LottieView from 'lottie-react-native'; // Import Lottie
import { useMiniZenniStore } from '../../store/miniZenniStore';

// Placeholder paths - replace with actual paths
// const BASE_ZENNI_SPRITE = require('../../../assets/images/zenni_base_sprite.png'); // Assuming a base sprite exists
const BASE_ZENNI_SPRITE = require('../../../assets/images/minizenni.png'); // Use minizenni.png
// const SUMMON_ANIMATION = require('../../../assets/lottie/mini_summon.json'); // Incorrect path
const SUMMON_ANIMATION = require('../../../assets/animations/mini_summon.json'); // Correct path

type SummonMiniZenniNavProp = StackNavigationProp<
  RootStackParamList,
  'MiniZenniSetup' // Assuming this screen maps to MiniZenniSetup route name
>;

const SummonMiniZenniScreen: React.FC = () => {
  const navigation = useNavigation<SummonMiniZenniNavProp>();
  const [showContent, setShowContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current; // For fading in content
  const lottieRef = useRef<LottieView>(null);
  const { name: miniZenniName } = useMiniZenniStore((state) => state); // Get name if set

  useEffect(() => {
    // Play Lottie animation then show content
    const timer = setTimeout(() => {
      setAnimationFinished(true);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500, // Fade in duration for content
        useNativeDriver: true,
      }).start(() => setShowContent(true));
    }, 800); // Show content after 800ms

    return () => clearTimeout(timer);
  }, [opacityAnim]);

  useEffect(() => {
    // Ensure Lottie plays when the component mounts
    // Note: AutoPlay might be enough depending on LottieView props/defaults
    if (lottieRef.current && !animationFinished) {
      lottieRef.current.play();
    }
  }, [animationFinished]);


  const handleContinue = () => {
    // Navigate to the next screen in the flow (NotificationPermission)
    navigation.navigate('NotificationPermission');
  };

  return (
    <View style={styles.container}>
      {!animationFinished && (
        <LottieView
          ref={lottieRef}
          source={SUMMON_ANIMATION}
          autoPlay
          loop={false} // Play only once
          style={styles.lottieView}
          onAnimationFinish={() => console.log('Summon animation finished')}
        />
      )}

      {animationFinished && (
        <Animated.View style={[styles.contentContainer, { opacity: opacityAnim }]}>
          <Text style={styles.title}>It's {miniZenniName || 'your Mini-Zenni'}!</Text>
          <Image source={BASE_ZENNI_SPRITE} style={styles.zenniImage} />
          <Text style={styles.subtitle}>
            Keep focusing to help it grow.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1C4E9', // Light Purple background
  },
  lottieView: {
    width: 300,
    height: 300,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#311B92', // Deep Purple
    marginBottom: 20,
    textAlign: 'center',
  },
  zenniImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#4527A0', // Lighter Deep Purple
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#7E57C2', // Medium Purple
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SummonMiniZenniScreen;