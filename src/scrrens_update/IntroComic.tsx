import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation prop type
type IntroComicNavigationProp = StackNavigationProp<any, 'IntroComic'>; 

const IntroComic = () => {
  const navigation = useNavigation<IntroComicNavigationProp>();

  const handleTap = () => {
    navigation.navigate('SummonFocusStone'); // Navigate to SummonFocusStone
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/onboarding/dimming.png')}
      style={styles.background} // Use fullscreen style
      resizeMode="cover" 
    >
        <SafeAreaView style={styles.safeArea}> 
            <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
                {/* Only prompt text is needed over the background */}
                <Text style={styles.promptText}>Tap to continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%', // Ensure it covers width
    height: '100%', // Ensure it covers height
  },
  safeArea: {
      flex: 1,
      backgroundColor: 'transparent',
  },
  touchable: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 60, 
    textAlign: 'center',
    overflow: 'hidden', 
  },
});

export default IntroComic; 