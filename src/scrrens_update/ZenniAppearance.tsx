import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming types are defined here

// Placeholder image paths - replace with actual paths
// const stoneImage = require('../../assets/images/stone_idle.png');
const stoneImage = require('../../assets/images/stone_grey.png'); // Use grey stone
// const zenniImage = require('../../assets/images/zenni_sprite.png');
const zenniImage = require('../../assets/images/zenni.png'); // Use zenni.png

type ZenniAppearanceNavProp = StackNavigationProp<
  RootStackParamList,
  'ZenniAppearance' // Assuming 'ZenniAppearance' is the route name
>;

const ZenniAppearanceScreen: React.FC = () => {
  const navigation = useNavigation<ZenniAppearanceNavProp>();
  const [showZenni, setShowZenni] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value for Zenni
  const [stoneOpacity] = useState(new Animated.Value(1)); // Initial opacity for stone

  useEffect(() => {
    // Sequence: Fade out stone, wait, fade in Zenni
    Animated.sequence([
      Animated.timing(stoneOpacity, {
        toValue: 0,
        duration: 500, // Fade out duration
        useNativeDriver: true,
        delay: 1000, // Wait a bit before fading stone
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Fade in duration
        useNativeDriver: true,
      }),
    ]).start(() => setShowZenni(true)); // Set state after animation completes if needed
  }, [fadeAnim, stoneOpacity]);

  const handleContinue = () => {
    // Navigate to the card reveal screen
    console.log('Navigate to GlowCardReveal');
    navigation.navigate('GlowCardReveal'); // Navigate to GlowCardReveal
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={stoneImage}
          style={[styles.image, { opacity: stoneOpacity }]}
        />
        {/* Render Zenni image absolutely positioned to appear in the same spot */}
        <Animated.Image
          source={zenniImage}
          style={[styles.image, styles.zenniImage, { opacity: fadeAnim }]}
        />
      </View>

      {showZenni && (
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogText}>
            Behold! Your Zenni companion.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2F7', // Light calming background color
  },
  imageContainer: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative', // Needed for absolute positioning of Zenni
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  zenniImage: {
    position: 'absolute', // Position Zenni over the stone
    top: 0,
    left: 0,
  },
  dialogContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50', // Example Green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ZenniAppearanceScreen; 