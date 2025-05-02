import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the new onboarding screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import IntroComic from '../screens/IntroComic';
import AuthScreen from '../screens/AuthScreen';
import SummonFocusStone from '../screens/SummonFocusStone';
import GlowcardReward from '../screens/GlowcardReward';
import NameEntryScreen from '../screens/onboarding/NameEntryScreen';

// Define ParamList
export type NewOnboardingStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  IntroComic: undefined;
  AuthScreen: undefined;
  SummonFocusStone: undefined;
  GlowcardReward: undefined;
  NameEntry: undefined;
};

const OnboardingStack = createStackNavigator<NewOnboardingStackParamList>();

const NewOnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator 
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <OnboardingStack.Screen name="Splash" component={SplashScreen} />
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="IntroComic" component={IntroComic} />
      <OnboardingStack.Screen name="AuthScreen" component={AuthScreen} />
      <OnboardingStack.Screen name="SummonFocusStone" component={SummonFocusStone} />
      <OnboardingStack.Screen name="GlowcardReward" component={GlowcardReward} />
      <OnboardingStack.Screen name="NameEntry" component={NameEntryScreen} />
    </OnboardingStack.Navigator>
  );
};

export default NewOnboardingNavigator; 