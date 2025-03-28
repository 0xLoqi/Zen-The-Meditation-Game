import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/theme';
import HomeScreen from '../screens/main/HomeScreen';
import { MeditationType, MeditationDuration } from '../types';

// Add placeholder components for screens not yet implemented
const PlaceholderScreen = ({ route }: any) => {
  // Basic implementation to avoid errors
  return null;
};

export type MainStackParamList = {
  Home: undefined;
  MeditationSelection: undefined;
  MeditationSession: {
    type: MeditationType;
    duration: MeditationDuration;
  };
  PostSessionSummary: undefined;
  DailyCheckIn: undefined;
  Wardrobe: undefined;
  GuruMode: undefined;
  Referral: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.neutralLight },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MeditationSelection" component={PlaceholderScreen} />
      <Stack.Screen name="MeditationSession" component={PlaceholderScreen} />
      <Stack.Screen name="PostSessionSummary" component={PlaceholderScreen} />
      <Stack.Screen name="DailyCheckIn" component={PlaceholderScreen} />
      <Stack.Screen name="Wardrobe" component={PlaceholderScreen} />
      <Stack.Screen name="GuruMode" component={PlaceholderScreen} />
      <Stack.Screen name="Referral" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;