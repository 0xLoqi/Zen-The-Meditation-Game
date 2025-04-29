import { createStackNavigator } from '@react-navigation/stack';
import { MeditationType, MeditationDuration } from '../types';
import HomeScreen from '../screens/main/HomeScreen';
import MeditationSelectionScreen from '../screens/main/MeditationSelectionScreen';
import MeditationSessionScreen from '../screens/main/MeditationSessionScreen';
import PostSessionSummaryScreen from '../screens/main/PostSessionSummaryScreen';
import DailyCheckInScreen from '../screens/main/DailyCheckInScreen';
import WardrobeScreen from '../screens/main/WardrobeScreen';
import GuruModeScreen from '../screens/main/GuruModeScreen';
import ReferralScreen from '../screens/main/ReferralScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import AchievementsScreen from '../screens/main/AchievementsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import StoreScreen from '../screens/main/StoreScreen';
import PaywallScreen from '../screens/PaywallScreen';

export type MainStackParamList = {
  Home: undefined;
  MeditationSelection: undefined;
  MeditationSession: {
    type: MeditationType;
    duration: MeditationDuration;
  };
  PostSessionSummary: { drop: any } | undefined;
  DailyCheckIn: undefined;
  Wardrobe: undefined;
  GuruMode: undefined;
  Referral: undefined;
  Settings: undefined;
  Achievements: undefined;
  Profile: { friend?: any };
  Store: undefined;
  Paywall: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="MeditationSelection" component={MeditationSelectionScreen} />
      <MainStack.Screen name="MeditationSession" component={MeditationSessionScreen} />
      <MainStack.Screen name="PostSessionSummary" component={PostSessionSummaryScreen} />
      <MainStack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
      <MainStack.Screen name="Wardrobe" component={WardrobeScreen} />
      <MainStack.Screen name="GuruMode" component={GuruModeScreen} />
      <MainStack.Screen name="Referral" component={ReferralScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Achievements" component={AchievementsScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Store" component={StoreScreen} />
      <MainStack.Screen name="Paywall" component={PaywallScreen} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;