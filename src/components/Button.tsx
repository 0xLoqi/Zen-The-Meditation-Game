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
import { COLORS, SIZES, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { playSoundById } from '../services/audio';

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
      ...SHADOWS.medium,
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
          ...SHADOWS.medium,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: disabled ? COLORS.disabled : COLORS.secondary,
          ...SHADOWS.small,
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
      fontWeight: FONTS.semiBold,
      lineHeight: 24,
      textAlignVertical: 'center',
      fontSize: 16,
    };
    
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          fontSize: 14,
          lineHeight: 20,
        };
        break;
      case 'large':
        sizeStyle = {
          fontSize: 18,
          lineHeight: 28,
        };
        break;
      default:
        sizeStyle = {
          fontSize: 16,
          lineHeight: 24,
        };
    }
    
    let variantStyle: TextStyle = {};
    switch (variant) {
      case 'primary':
      case 'secondary':
        variantStyle = {
          color: disabled ? COLORS.disabledText : COLORS.textInverse,
          fontWeight: FONTS.bold as '700',
        };
        break;
      case 'outlined':
      case 'text':
        variantStyle = {
          color: disabled ? COLORS.disabledText : COLORS.primary,
          fontWeight: FONTS.semiBold as '600',
        };
        break;
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };
  
  const handlePress = (e: any) => {
    playSoundById('select');
    if (onPress) onPress(e);
  };
  
  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]}
      onPress={handlePress}
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