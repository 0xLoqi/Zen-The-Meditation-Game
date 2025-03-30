// Declare Expo modules
declare module 'expo-haptics' {
  export enum ImpactFeedbackStyle {
    Light = 0,
    Medium = 1,
    Heavy = 2,
  }

  export enum NotificationFeedbackType {
    Success = 0,
    Warning = 1,
    Error = 2,
  }

  export function impactAsync(style: ImpactFeedbackStyle): Promise<void>;
  export function notificationAsync(type: NotificationFeedbackType): Promise<void>;
  export function selectionAsync(): Promise<void>;
}

// Declare @expo/vector-icons modules
declare module '@expo/vector-icons' {
  import { ComponentClass } from 'react';
  import { StyleProp, TextStyle } from 'react-native';
  
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }
  
  export class MaterialCommunityIcons extends ComponentClass<IconProps> {}
  export class Ionicons extends ComponentClass<IconProps> {}
  export class FontAwesome extends ComponentClass<IconProps> {}
  export class FontAwesome5 extends ComponentClass<IconProps> {}
  export class MaterialIcons extends ComponentClass<IconProps> {}
  export class AntDesign extends ComponentClass<IconProps> {}
  export class Feather extends ComponentClass<IconProps> {}
  export class Entypo extends ComponentClass<IconProps> {}
}

// Missing React Navigation types
declare module '@react-navigation/native' {
  export function useNavigation<T = any>(): T;
  export function useFocusEffect(effect: React.EffectCallback): void;
  
  // Add NavigationContainer component
  import { ComponentType } from 'react';
  export const NavigationContainer: ComponentType<any>;
}

declare module '@react-navigation/stack' {
  export interface StackNavigationProp<ParamList, RouteName extends keyof ParamList = string> {
    navigate<RouteName extends keyof ParamList>(
      ...args: RouteName extends unknown
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName]
    ): void;
    goBack(): void;
    replace<RouteName extends keyof ParamList>(
      ...args: RouteName extends unknown 
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName]
    ): void;
  }
}

// Add any other module declarations as needed 