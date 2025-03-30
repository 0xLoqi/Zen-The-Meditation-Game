declare module 'react-native-reanimated' {
  import { ComponentClass, ComponentType, Component } from 'react';
  import { ViewStyle, TextStyle, ImageStyle, View, Text, Image, ViewProps, TextProps, ImageProps, StyleProp } from 'react-native';

  // Core types
  export function useSharedValue<T>(initialValue: T): { value: T };
  export function useAnimatedStyle(updater: () => ViewStyle | ImageStyle | TextStyle): object;
  export function withTiming(toValue: number, config?: { duration?: number; easing?: any }): any;
  export function withSpring(toValue: number, config?: any): any;
  export function runOnJS<A extends any[], R>(fn: (...args: A) => R): (...args: A) => void;
  
  export namespace Easing {
    export function linear(t: number): number;
    export function ease(t: number): number;
    export function quad(t: number): number;
    export function cubic(t: number): number;
    export function poly(n: number): (t: number) => number;
    export function sin(t: number): number;
    export function circle(t: number): number;
    export function exp(t: number): number;
    export function elastic(bounciness?: number): (t: number) => number;
    export function back(s?: number): (t: number) => number;
    export function bounce(t: number): number;
    export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number;
    export function inFunction(easing: (t: number) => number): (t: number) => number;
    export function out(easing: (t: number) => number): (t: number) => number;
    export function inOut(easing: (t: number) => number): (t: number) => number;
  }

  // Animated components
  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Image: ComponentType<ImageProps>;
  export const ScrollView: ComponentType<any>;
  export const FlatList: ComponentType<any>;

  // Default export
  const Animated: {
    View: ComponentType<ViewProps>;
    Text: ComponentType<TextProps>;
    Image: ComponentType<ImageProps>;
    ScrollView: ComponentType<any>;
    FlatList: ComponentType<any>;
  };
  
  export default Animated;
} 