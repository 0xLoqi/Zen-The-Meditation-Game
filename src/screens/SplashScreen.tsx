import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Assuming you have a stack navigator setup, adjust type if needed
import { StackNavigationProp } from '@react-navigation/stack';

// Define your stack param list if you have one, otherwise use a generic type
// type RootStackParamList = {
//   SplashScreen: undefined;
//   IntroComic: undefined;
//   // ... other screens
// };
// type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

// Using a more generic type if you don't have the param list defined yet
type SplashScreenNavigationProp = StackNavigationProp<any, 'SplashScreen'>;


const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3000, // 3 seconds fade-in
        useNativeDriver: true, // Use native driver for better performance
      }
    ).start(() => {
      // Animation completed, navigate to the next screen
      navigation.replace('OnboardingChoice'); // Navigate to OnboardingChoice screen now
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/zenni.png')} // Load the logo
        style={{
          ...styles.logo,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Assuming a black background for splash
  },
  logo: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
  },
});

export default SplashScreen; 