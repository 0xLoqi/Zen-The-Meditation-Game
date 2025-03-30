import 'react-native-web';

declare module 'react-native-web' {
  interface ViewStyle {
    shadowColor?: string;
    shadowOffset?: {
      width: number;
      height: number;
    };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
  }

  interface TextStyle {
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  }

  interface ImageStyle {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  }
}

declare module 'react-native-animatable' {
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
  
  interface AnimatableProperties {
    animation?: string;
    duration?: number;
    delay?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    easing?: string;
    iterationCount?: number | 'infinite';
    useNativeDriver?: boolean;
    style?: ViewStyle | TextStyle | ImageStyle;
  }

  export interface AnimatableView extends React.ComponentClass<AnimatableProperties & { ref?: any }> {
    animate: (animation: any, duration?: number, easing?: string) => Promise<void>;
    stopAnimation: () => void;
  }

  export const View: AnimatableView;
  export const Text: AnimatableView;
  export const Image: AnimatableView;
} 