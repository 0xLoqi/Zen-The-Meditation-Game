import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the new onboarding screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import IntroComic from '../screens/IntroComic';
import SummonFocusStone from '../screens/SummonFocusStone';
import GlowcardReward from '../screens/GlowcardReward';
import NameEntryScreen from '../screens/onboarding/NameEntryScreen';
import OnboardingChoiceScreen from '../screens/onboarding/OnboardingChoiceScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Define ParamList
export type NewOnboardingStackParamList = {
  Splash: undefined;
  OnboardingChoice: undefined;
  Welcome: undefined;
  IntroComic: undefined;
  SummonFocusStone: undefined;
  GlowcardReward: undefined;
  NameEntry: undefined;
  Login: undefined;
};

const OnboardingStack = createNativeStackNavigator<NewOnboardingStackParamList>();

const NewOnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator 
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <OnboardingStack.Screen name="Splash" component={SplashScreen} />
      <OnboardingStack.Screen name="OnboardingChoice" component={OnboardingChoiceScreen} />
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="IntroComic" component={IntroComic} />
      <OnboardingStack.Screen name="SummonFocusStone" component={SummonFocusStone} />
      <OnboardingStack.Screen name="GlowcardReward" component={GlowcardReward} />
      <OnboardingStack.Screen name="NameEntry" component={NameEntryScreen} />
      <OnboardingStack.Screen name="Login" component={LoginScreen} />
    </OnboardingStack.Navigator>
  );
};

export default NewOnboardingNavigator; 