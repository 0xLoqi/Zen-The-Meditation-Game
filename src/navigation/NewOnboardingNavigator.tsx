import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the new onboarding screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import IntroComic from '../screens/onboarding/IntroComic';
// Import new comic screens
import IntroComic2 from '../screens/onboarding/IntroComic2';
import IntroComic3 from '../screens/onboarding/IntroComic3';
import IntroComic4 from '../screens/onboarding/IntroComic4';
import IntroComic5 from '../screens/onboarding/IntroComic5';
import FocusStoneIntroScreen from '../screens/onboarding/FocusStoneIntroScreen';
import SummonFocusStone from '../screens/onboarding/SummonFocusStone';
import FocusStoneTutorialScreen from '../screens/onboarding/FocusStoneTutorialScreen';
import GlowcardReward from '../screens/onboarding/GlowcardReward';
import NameEntryScreen from '../screens/onboarding/NameEntryScreen';
import OnboardingChoiceScreen from '../screens/onboarding/OnboardingChoiceScreen';
import ReminderPrompt from '../screens/onboarding/ReminderPrompt';
import PaywallScreen from '../screens/PaywallScreen';
import AuthScreen from '../screens/AuthScreen';
// Import Auth screens
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Define ParamList
export type NewOnboardingStackParamList = {
  Splash: undefined;
  OnboardingChoice: undefined;
  Welcome: undefined;
  IntroComic: undefined;
  IntroComic2: undefined;
  IntroComic3: undefined;
  IntroComic4: undefined;
  IntroComic5: undefined;
  FocusStoneIntro: undefined;
  SummonFocusStone: undefined;
  FocusStoneTutorial: undefined;
  GlowcardReward: undefined;
  NameEntry: undefined;
  ReminderPrompt: undefined;
  Paywall: undefined;
  Auth: undefined;
  // Add Auth routes
  Signup: undefined;
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
      <OnboardingStack.Screen name="IntroComic2" component={IntroComic2} />
      <OnboardingStack.Screen name="IntroComic3" component={IntroComic3} />
      <OnboardingStack.Screen name="IntroComic4" component={IntroComic4} />
      <OnboardingStack.Screen name="IntroComic5" component={IntroComic5} />
      <OnboardingStack.Screen name="FocusStoneIntro" component={FocusStoneIntroScreen} />
      <OnboardingStack.Screen name="SummonFocusStone" component={SummonFocusStone} />
      <OnboardingStack.Screen name="GlowcardReward" component={GlowcardReward} />
      <OnboardingStack.Screen name="FocusStoneTutorial" component={FocusStoneTutorialScreen} />
      <OnboardingStack.Screen name="NameEntry" component={NameEntryScreen} />
      <OnboardingStack.Screen name="ReminderPrompt" component={ReminderPrompt} />
      <OnboardingStack.Screen name="Signup" component={SignupScreen} />
      <OnboardingStack.Screen name="Login" component={LoginScreen} />
      <OnboardingStack.Screen name="Paywall" component={PaywallScreen} />
      <OnboardingStack.Screen name="Auth" component={AuthScreen} />
    </OnboardingStack.Navigator>
  );
};

export default NewOnboardingNavigator; 