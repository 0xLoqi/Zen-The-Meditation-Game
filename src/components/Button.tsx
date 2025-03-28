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
    };
    
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          height: SIZES.buttonSmallHeight,
          paddingHorizontal: SPACING.medium,
        };
        break;
      case 'large':
        sizeStyle = {
          height: SIZES.buttonLargeHeight,
          paddingHorizontal: SPACING.large,
        };
        break;
      default:
        sizeStyle = {
          height: SIZES.buttonMediumHeight,
          paddingHorizontal: SPACING.medium,
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
    };
    
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          fontSize: FONTS.small,
        };
        break;
      case 'large':
        sizeStyle = {
          fontSize: FONTS.large,
        };
        break;
      default:
        sizeStyle = {
          fontSize: FONTS.regular,
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