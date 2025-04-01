import { MainStackParamList } from './MainNavigator';
import { AuthStackParamList } from './AuthNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: { screen: keyof MainStackParamList };
} & AuthStackParamList; 