import { StackNavigationProp } from '@react-navigation/stack';
import { MeditationType, MeditationDuration } from '../types';

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