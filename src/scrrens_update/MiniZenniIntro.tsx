import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Updated types

// Placeholder for background image - replace with actual path
const backgroundImage = require('../../assets/images/backgrounds/dojo_bg.png');

type MiniZenniIntroNavProp = StackNavigationProp<
  RootStackParamList,
  'MiniZenniIntro'
>;

const MiniZenniIntroScreen: React.FC = () => {
  const navigation = useNavigation<MiniZenniIntroNavProp>();

  useEffect(() => {
    // Track that the user has seen this screen
    console.log('[Analytics] Event: monkey_mind_intro_shown');
  }, []);

  const handleContinue = () => {
    navigation.navigate('MiniZenniSetup'); // Navigate to MiniZenniSetup screen
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.contentBox}> // Added a semi-transparent box for text
          <Text style={styles.text}>
            This is your Mini-Zenni — a reflection of your Monkey Mind. You'll calm it through Focus.
          </Text>
          {/* Optional: Add monkey silhouette animation here */}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Meet Your Mini-Zenni</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // Pushes content and button apart
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: '30%', // Push content down a bit
    paddingBottom: 60,
  },
  contentBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 22, // Slightly larger text
    color: 'white',
    textAlign: 'center',
    marginBottom: 20, // Space within the box
    lineHeight: 30,
    fontFamily: 'YourAppName-Regular', // TODO: Replace with your app's font
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: '#FF9800', // Example Orange
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'YourAppName-Bold', // TODO: Replace with your app's font
  },
});

export default MiniZenniIntroScreen; 