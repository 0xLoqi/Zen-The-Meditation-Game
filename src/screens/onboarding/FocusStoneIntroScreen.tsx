import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Tablet graphic
const tabletImage = require('../../../assets/images/UI/focus_tablet_success.png');

// Define navigation prop type
type FocusStoneIntroNavigationProp = StackNavigationProp<any, 'FocusStoneIntro'>;

const FocusStoneIntroScreen = () => {
  const navigation = useNavigation<FocusStoneIntroNavigationProp>();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleTap = () => {
    navigation.navigate('SummonFocusStone'); // Navigate to SummonFocusStone
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/temple_bg.png')} // Use temple_bg
        style={[styles.background, { transform: [{ scale: 1.14 }, { translateX: -15 }] }]} // Reduced zoom & nudge left
        resizeMode="contain" // Use contain mode
      >
          {/* Content that stays within the background bounds */}
      </ImageBackground>

      {/* Floating Tablet - Rendered outside the transformed ImageBackground */}
      <Animated.Image 
        source={tabletImage}
        style={[
          styles.floatingTablet,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 10], // Float range
                }),
              },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* Safe Area for tappable area & prompt - Rendered above everything */}
      <SafeAreaView style={[styles.safeArea, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }]}> 
        <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
          {/* Simple tap prompt */}
          <Text style={styles.promptText}>Tap to continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  floatingTablet: { // New style for the tablet
    position: 'absolute',
    width: 150,
    height: 200,
    alignSelf: 'center',
    top: '35%', // Adjust vertical position
    zIndex: 1, // Ensure it's above background but below prompt container
  },
  promptText: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 80, // Moved up 30px
    textAlign: 'center',
    overflow: 'hidden', 
  },
});

export default FocusStoneIntroScreen; 