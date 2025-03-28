import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'flat';
  shadowLevel?: 'light' | 'medium' | 'dark' | 'none';
  style?: ViewStyle;
  onPress?: () => void;
}

const Card = ({
  children,
  variant = 'default',
  shadowLevel = 'medium',
  style,
  onPress,
  ...rest
}: CardProps) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.borderRadius.medium,
      overflow: 'hidden',
      backgroundColor: COLORS.white,
      padding: 16,
    };

    // Variant styling
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'outlined':
        variantStyle = {
          borderWidth: 1,
          borderColor: COLORS.neutralLight,
          backgroundColor: 'transparent',
        };
        break;
      case 'flat':
        variantStyle = {
          backgroundColor: COLORS.neutralLight,
        };
        break;
      case 'default':
      default:
        variantStyle = {
          backgroundColor: COLORS.white,
        };
        break;
    }

    return { ...baseStyle, ...variantStyle };
  };

  const getShadowStyle = (): ViewStyle => {
    if (shadowLevel === 'none' || variant === 'flat') {
      return {};
    }

    return SHADOWS[shadowLevel];
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[getCardStyle(), getShadowStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
      {...rest}
    >
      {children}
    </CardComponent>
  );
};

export default Card;