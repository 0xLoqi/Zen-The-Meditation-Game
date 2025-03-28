import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import DailyCheckInScreen from '../screens/main/DailyCheckInScreen';
import MeditationSelectionScreen from '../screens/main/MeditationSelectionScreen';
import MeditationSessionScreen from '../screens/main/MeditationSessionScreen';
import PostSessionSummaryScreen from '../screens/main/PostSessionSummaryScreen';
import WardrobeScreen from '../screens/main/WardrobeScreen';
import GuruModeScreen from '../screens/main/GuruModeScreen';
import ReferralScreen from '../screens/main/ReferralScreen';
import { COLORS } from '../constants/theme';
import { useUserStore } from '../store/userStore';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack navigator
const HomeStack = () => {
  const { getUserData, getTodayCheckIn } = useUserStore();

  useEffect(() => {
    getUserData();
    getTodayCheckIn();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
        cardStyle: { backgroundColor: COLORS.neutralLight },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyCheckIn"
        component={DailyCheckInScreen}
        options={{ title: 'Daily Check-In' }}
      />
      <Stack.Screen
        name="MeditationSelection"
        component={MeditationSelectionScreen}
        options={{ title: 'Choose Meditation' }}
      />
      <Stack.Screen
        name="MeditationSession"
        component={MeditationSessionScreen}
        options={{ 
          title: 'Meditation Session',
          headerShown: false, // Hide header during meditation
        }}
      />
      <Stack.Screen
        name="PostSessionSummary"
        component={PostSessionSummaryScreen}
        options={{ 
          title: 'Session Complete',
          headerLeft: () => null, // Prevent going back to session
        }}
      />
      <Stack.Screen
        name="Referral"
        component={ReferralScreen}
        options={{ title: 'Share with Friends' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.neutralMedium,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          tabBarLabel: 'Wardrobe',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hanger" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GuruMode"
        component={GuruModeScreen}
        options={{
          tabBarLabel: 'Guru Mode',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
