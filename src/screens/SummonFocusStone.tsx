import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import PulseStone from '../components/PulseStone'; // Assuming path
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message'; // Import toast

// Define your stack param list if needed
// type RootStackParamList = { ... SummonFocusStone: undefined; GlowcardReward: undefined; ... };
// type SummonFocusStoneNavigationProp = StackNavigationProp<RootStackParamList, 'SummonFocusStone'>;
type SummonFocusStoneNavigationProp = StackNavigationProp<any, 'SummonFocusStone'>; // Generic fallback

const SummonFocusStone = () => {
  const navigation = useNavigation<SummonFocusStoneNavigationProp>();

  const handleSuccess = () => {
    // TODO: Trigger success animation/sound
    console.log('Hold successful!');
    // Consider adding a slight delay or waiting for an animation before navigating
    navigation.navigate('GlowcardReward');
  };

  const handleRetry = () => {
    console.log('Hold released too early.');
    // Show soft "retry" prompt using a toast message
    Toast.show({
      type: 'info', // Or a custom type
      text1: 'The tablet shatters...',
      text2: 'But Zenni gives you another chance. Hold it longer this time!',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/tablet_bg.png')} // Using meditation_bg as cave
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <PulseStone onSuccess={handleSuccess} onRetry={handleRetry} />
      </View>
      {/* Make sure Toast is rendered at the root of your app */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SummonFocusStone; 