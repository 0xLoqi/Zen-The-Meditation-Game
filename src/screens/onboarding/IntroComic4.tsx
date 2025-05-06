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
import ProgressDots from '../../components/ProgressDots';
import { NewOnboardingStackParamList } from '../../navigation/NewOnboardingNavigator';

// Define navigation prop type
type IntroComicNavigationProp = StackNavigationProp<NewOnboardingStackParamList, 'IntroComic4'>; 

// Define total steps for this sequence
const TOTAL_LORE_STEPS = 5; 

const IntroComic4 = () => { // <<< Renamed component
  const navigation = useNavigation<IntroComicNavigationProp>();
  const currentStep = 4; // <<< Updated step

  const handleTap = () => {
    navigation.navigate('IntroComic5'); // <<< Updated target
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
       <ProgressDots step={currentStep} total={TOTAL_LORE_STEPS} />
      <ImageBackground
        source={require('../../../assets/images/backgrounds/onboarding/lore4.png')} // <<< Updated image
        style={styles.backgroundImage} 
        resizeMode="contain"
      >
          <SafeAreaView style={styles.safeArea}> 
              <TouchableOpacity style={styles.touchable} onPress={handleTap} activeOpacity={1}>
                  <Text style={styles.promptText}>Tap to continue</Text>
              </TouchableOpacity>
          </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%', 
    aspectRatio: 9 / 16,
    alignSelf: 'center',
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
    marginBottom: 40,
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export default IntroComic4; // <<< Updated export 