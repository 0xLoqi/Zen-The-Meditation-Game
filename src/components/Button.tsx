import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, SIZES, SPACING, FONTS } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.radiusMedium,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: SIZES.buttonMediumHeight,
    };
    
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          minHeight: SIZES.buttonSmallHeight,
          paddingHorizontal: SPACING.medium,
          paddingVertical: SPACING.small,
        };
        break;
      case 'large':
        sizeStyle = {
          minHeight: SIZES.buttonLargeHeight,
          paddingHorizontal: SPACING.large,
          paddingVertical: SPACING.medium,
        };
        break;
      default:
        sizeStyle = {
          minHeight: SIZES.buttonMediumHeight,
          paddingHorizontal: SPACING.medium,
          paddingVertical: SPACING.small,
        };
    }
    
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: disabled ? COLORS.disabled : COLORS.primary,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: disabled ? COLORS.disabled : COLORS.secondary,
        };
        break;
      case 'outlined':
        variantStyle = {
          backgroundColor: COLORS.transparent,
          borderWidth: 1,
          borderColor: disabled ? COLORS.disabled : COLORS.primary,
        };
        break;
      case 'text':
        variantStyle = {
          backgroundColor: COLORS.transparent,
        };
        break;
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };
  
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: FONTS.primary,
      fontWeight: FONTS.medium,
      lineHeight: 24,
      textAlignVertical: 'center',
    };
    
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          fontSize: FONTS.small,
          lineHeight: 20,
        };
        break;
      case 'large':
        sizeStyle = {
          fontSize: FONTS.large,
          lineHeight: 28,
        };
        break;
      default:
        sizeStyle = {
          fontSize: FONTS.regular,
          lineHeight: 24,
        };
    }
    
    let variantStyle: TextStyle = {};
    switch (variant) {
      case 'primary':
      case 'secondary':
        variantStyle = {
          color: disabled ? COLORS.disabledText : COLORS.textInverse,
        };
        break;
      case 'outlined':
      case 'text':
        variantStyle = {
          color: disabled ? COLORS.disabledText : COLORS.primary,
        };
        break;
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };
  
  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {leftIcon && !isLoading && leftIcon}
      
      {isLoading ? (
        <ActivityIndicator 
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? COLORS.textInverse : COLORS.primary}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
      
      {rightIcon && !isLoading && rightIcon}
    </TouchableOpacity>
  );
};

export default Button;