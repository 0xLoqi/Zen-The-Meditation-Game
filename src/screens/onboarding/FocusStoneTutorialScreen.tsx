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
type FocusStoneTutorialNavigationProp = StackNavigationProp<any, 'FocusStoneTutorial'>; 

const FocusStoneTutorialScreen = () => {
  const navigation = useNavigation<FocusStoneTutorialNavigationProp>();

  const handleTap = () => {
    navigation.navigate('NameEntry'); // Navigate to NameEntry
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/focusTutorial_bg.png')} // Use focusTutorial_bg
        style={[styles.background, { transform: [{ scale: 1.3 }] }]} // Apply zoom
        resizeMode="contain" // Use contain mode
      >
          <SafeAreaView style={styles.safeArea}> 
              <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
                  {/* Tutorial text */}
                  <Text style={styles.promptText}>
                    You can hold the your device however feels the most comfortable to you-- just be sure to stay still!
                  </Text>
              </TouchableOpacity>
          </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%', 
    height: '100%', 
  },
  safeArea: {
      flex: 1,
      backgroundColor: 'transparent',
  },
  touchable: {
      flex: 1,
      justifyContent: 'flex-end', // Back to bottom
      alignItems: 'center',
  },
  promptText: {
    fontSize: 18, // Slightly larger for readability
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.5)', 
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 110, // Add margin back for bottom positioning
    textAlign: 'center',
    overflow: 'hidden', 
    maxWidth: '80%',
  },
});

export default FocusStoneTutorialScreen; 