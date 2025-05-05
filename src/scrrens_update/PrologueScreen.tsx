import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming types are defined here

// Placeholder for background image - replace with actual path
// const backgroundImage = require('../../assets/images/temple_bg.png');
const backgroundImage = require('../../assets/images/backgrounds/temple_bg.png');

type PrologueScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Prologue' // Assuming 'Prologue' is the route name for this screen
>;

const PrologueScreen: React.FC = () => {
  const navigation = useNavigation<PrologueScreenNavigationProp>();

  const handleBegin = () => {
    // TODO: Navigate to the next screen in the onboarding flow (ZenniAppearance)
    console.log('Navigate to next screen');
    navigation.navigate('ZenniAppearance'); // Uncomment when ZenniAppearance exists
    console.log('[Analytics] Event: tutorial_start'); // Add analytics event
  };

  const handleSignIn = () => {
    navigation.navigate('Login'); // Navigate to Login/Auth screen
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>
          As distractions spread, only ancient Focus Stones still glow.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBegin}>
            <Text style={styles.buttonText}>Begin ▶︎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign-In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Position content towards the bottom
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80, // Adjust padding as needed
    backgroundColor: 'rgba(0,0,0,0.3)', // Optional: add a dark overlay for text readability
  },
  text: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40, // Space between text and buttons
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-around', // Distribute buttons
    width: '100%', // Ensure container takes full width
  },
  button: {
    backgroundColor: '#4CAF50', // Example Green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 140, // Ensure buttons have a minimum width
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#2196F3', // Example Blue
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrologueScreen; 