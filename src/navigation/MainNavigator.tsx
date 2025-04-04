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
  Settings: undefined;
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
    </MainStack.Navigator>
  );
};

export default MainNavigator;