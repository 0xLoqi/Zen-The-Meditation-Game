declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

declare module '@expo/vector-icons' {
  import { Component } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle | ViewStyle>;
  }

  export class Ionicons extends Component<IconProps> {}
  export class MaterialCommunityIcons extends Component<IconProps> {}
  // Add other icon sets as needed
}

declare module 'react-native-reanimated' {
  export * from 'react-native-reanimated/lib/types';
}

declare module 'zustand' {
  export * from 'zustand/vanilla';
  export * from 'zustand/react';
} 