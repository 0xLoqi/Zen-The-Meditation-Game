import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, SIZES, SHADOWS, SPACING } from '../constants/theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'flat';
  shadowLevel?: 'light' | 'medium' | 'dark' | 'none';
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  shadowLevel = 'medium',
  style,
  onPress,
  ...rest
}) => {
  // Get card style based on variant
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.borderRadius.medium,
      padding: SPACING.l,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.neutralMedium,
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default: // default
        return {
          ...baseStyle,
          backgroundColor: COLORS.white,
        };
    }
  };

  // Get shadow style based on shadow level
  const getShadowStyle = (): ViewStyle => {
    switch (shadowLevel) {
      case 'light':
        return SHADOWS.light;
      case 'medium':
        return SHADOWS.medium;
      case 'dark':
        return SHADOWS.dark;
      default: // none
        return {};
    }
  };

  // If onPress is provided, use TouchableOpacity, otherwise use View
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          getCardStyle(),
          shadowLevel !== 'none' && getShadowStyle(),
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        getCardStyle(),
        shadowLevel !== 'none' && getShadowStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Card;
