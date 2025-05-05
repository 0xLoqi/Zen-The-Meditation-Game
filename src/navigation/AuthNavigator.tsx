import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import NameSelectionScreen from '../screens/onboarding/NameSelectionScreen';
import ColorSelectionScreen from '../screens/onboarding/.old_ColorSelectionScreen';
import TraitSelectionScreen from '../screens/onboarding/TraitSelectionScreen';
import GlowbagOfferScreen from '../screens/onboarding/.old_GlowbagOfferScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import GlowbagOpeningScreen from '../screens/onboarding/.old_GlowbagOpeningScreen';
import { useMiniZenniStore } from '../store/miniZenniStore';
import ScreenTimeQScreen from '../screens/onboarding/.old_ScreenTimeQScreen';
import TikTokQScreen from '../screens/onboarding/.old_TikTokQScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  NameSelection: undefined;
  ScreenTimeQ: undefined;
  TikTokQ: undefined;
  ColorSelection: undefined;
  TraitSelection: undefined;
  GlowbagOffer: undefined;
  Login: undefined;
  GlowbagOpening: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { isInitialized } = useMiniZenniStore();

  useEffect(() => {
    console.log('AuthNavigator - Mini Zenni initialized:', isInitialized);
  }, [isInitialized]);

  return (
    <AuthStack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // Add some safety options
        animationEnabled: true,
        gestureEnabled: false, // Disable swipe back to prevent navigation issues
      }}
    >
      <AuthStack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          // Prevent going back to welcome screen
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen 
        name="NameSelection" 
        component={NameSelectionScreen}
        options={{
          // Prevent going back to name selection
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen 
        name="ScreenTimeQ" 
        component={ScreenTimeQScreen}
        options={{ gestureEnabled: false }}
      />
      <AuthStack.Screen 
        name="TikTokQ" 
        component={TikTokQScreen}
        options={{ gestureEnabled: false }}
      />
      <AuthStack.Screen 
        name="ColorSelection" 
        component={ColorSelectionScreen}
        options={{
          // Prevent going back to color selection
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen 
        name="TraitSelection" 
        component={TraitSelectionScreen}
        options={{
          // Prevent going back to trait selection
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen 
        name="GlowbagOffer" 
        component={GlowbagOfferScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          // Allow going back to welcome screen from login
          gestureEnabled: true,
        }}
      />
      <AuthStack.Screen 
        name="GlowbagOpening" 
        component={GlowbagOpeningScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;