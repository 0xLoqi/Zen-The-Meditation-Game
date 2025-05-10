import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SummonMiniZenniScreen from '../screens/onboarding/SummonMiniZenniScreen';
import NameSelectionScreen from '../screens/onboarding/NameSelectionScreen';
import GoalsScreen from '../screens/onboarding/.old_GoalsScreen';
import CommitmentScreen from '../screens/onboarding/.old_CommitmentScreen';
import SoundPrefScreen from '../screens/onboarding/.old_SoundPrefScreen';
import ReminderPrompt from '../screens/onboarding/ReminderPrompt';
import AccountScreen from '../screens/onboarding/AccountScreen';
import FirstSessionIntroScreen from '../screens/onboarding/.old_FirstSessionIntroScreen';
import NameEntryScreen from '../screens/onboarding/NameEntryScreen';
import GlowbagOfferScreen from '../screens/onboarding/.old_GlowbagOfferScreen';
import GlowbagOpeningScreen from '../screens/onboarding/.old_GlowbagOpeningScreen';
// TODO: Import all other onboarding screens as implemented

const OnboardingStackNav = createStackNavigator();

const ONBOARDING_SCREENS = [
  { name: 'NameEntry', component: NameEntryScreen },
  { name: 'Welcome', component: WelcomeScreen },
  { name: 'SummonMiniZenni', component: SummonMiniZenniScreen },
  { name: 'NameMini', component: NameSelectionScreen },
  { name: 'Goals', component: GoalsScreen },
  { name: 'Commitment', component: CommitmentScreen },
  { name: 'SoundPref', component: SoundPrefScreen },
  { name: 'Reminder', component: ReminderPrompt },
  { name: 'GlowbagOffer', component: GlowbagOfferScreen },
  { name: 'GlowbagOpening', component: GlowbagOpeningScreen },
  { name: 'FirstSessionIntro', component: FirstSessionIntroScreen },
  // { name: 'Motivation', component: MotivationScreen },
  // { name: 'Reminder', component: ReminderPrompt },
  // { name: 'Account', component: AccountScreen },
  // { name: 'FirstSessionIntro', component: FirstSessionIntroScreen },
];

const OnboardingStack = () => (
  <OnboardingStackNav.Navigator screenOptions={{ headerShown: false }}>
    {ONBOARDING_SCREENS.map((screen, idx) => (
      <OnboardingStackNav.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
        initialParams={{ step: idx + 1, total: ONBOARDING_SCREENS.length }}
      />
    ))}
  </OnboardingStackNav.Navigator>
);

export default OnboardingStack; 