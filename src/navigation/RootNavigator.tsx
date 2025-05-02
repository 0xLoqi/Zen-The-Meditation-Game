import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLoadingScreen from '../screens/AuthLoadingScreen'; // We'll create this next
import NewOnboardingNavigator from './NewOnboardingNavigator';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  AuthLoading: undefined;
  Onboarding: undefined; // Will render NewOnboardingNavigator
  MainApp: undefined;    // Will render MainNavigator
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Start with the loading screen */}
      <RootStack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      {/* Screens for the main flows */}
      <RootStack.Screen name="Onboarding" component={NewOnboardingNavigator} options={{ gestureEnabled: false }}/>
      <RootStack.Screen name="MainApp" component={MainNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator; 