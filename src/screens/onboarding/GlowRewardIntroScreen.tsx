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
type GlowRewardIntroNavigationProp = StackNavigationProp<any, 'GlowRewardIntro'>; 

const GlowRewardIntroScreen = () => {
  const navigation = useNavigation<GlowRewardIntroNavigationProp>();

  const handleTap = () => {
    navigation.navigate('GlowcardReward'); // Navigate to GlowcardReward
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/tablet_bg.png')} // Use tablet_bg
        style={[styles.background, { transform: [{ scale: 1.3 }] }]} // Apply zoom
        resizeMode="contain" // Use contain mode
      >
          <SafeAreaView style={styles.safeArea}> 
              <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
                  {/* Simple tap prompt */}
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
    width: '100%', 
    height: '100%', 
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
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 110, 
    textAlign: 'center',
    overflow: 'hidden', 
  },
});

export default GlowRewardIntroScreen; 