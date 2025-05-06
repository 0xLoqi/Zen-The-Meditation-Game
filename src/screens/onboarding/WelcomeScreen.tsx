import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Text,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { playSoundById, stopSound } from '../../services/audio';

// Define navigation prop type
type WelcomeScreenNavigationProp = StackNavigationProp<any, 'Welcome'>; // Use 'Welcome' or your screen name

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleTap = () => {
    navigation.navigate('IntroComic'); // Navigate to IntroComic
  };
  
  useEffect(() => {
    playSoundById('soothing', { isLooping: true });
    return () => { stopSound(); };
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/onboarding/welcome_im_zenni.png')} // Corrected relative path
      style={styles.background}
      resizeMode="cover" // Cover the whole screen
    >
      <SafeAreaView style={styles.safeArea}> 
        <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
            {/* Overlay Tap Prompt - REMOVED */}
             {/* <Text style={styles.promptText}>Tap to continue</Text> */}
              </TouchableOpacity>
        </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensure background fills the screen
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Make SafeArea transparent
  },
  touchable: {
    flex: 1,
    justifyContent: 'flex-end', // Position prompt at bottom
    alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for visibility on image
    backgroundColor: 'rgba(0,0,0,0.4)', // Slight dark background for prompt text
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 60, // Position above bottom edge
    textAlign: 'center',
    overflow: 'hidden', // Needed for borderRadius on Android
  },
});

export default WelcomeScreen; 