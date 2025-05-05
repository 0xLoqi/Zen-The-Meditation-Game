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
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/onboarding/dimming.png')}
        style={[styles.background, { transform: [{ scale: 1.25 }] }]}
        resizeMode="contain"
      >
          <SafeAreaView style={styles.safeArea}> 
              <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
                  {/* Only prompt text is needed over the background */}
                  <Text style={styles.promptText}>Tap to continue</Text>
              </TouchableOpacity>
          </SafeAreaView>
      </ImageBackground>
    </View>
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
    fontSize: 14, // smaller for more fit
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 110, // even more bottom padding
    textAlign: 'center',
    overflow: 'hidden', 
  },
});

export default IntroComic; 