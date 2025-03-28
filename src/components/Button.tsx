import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { triggerHapticFeedback } from '../utils/haptics';

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
      borderRadius: SIZES.borderRadius.medium,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };
    
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          height: SIZES.buttonHeight.small,
          paddingHorizontal: SPACING.m,
        };
        break;
      case 'large':
        sizeStyle = {
          height: SIZES.buttonHeight.large,
          paddingHorizontal: SPACING.xl,
        };
        break;
      case 'medium':
      default:
        sizeStyle = {
          height: SIZES.buttonHeight.medium,
          paddingHorizontal: SPACING.l,
        };
        break;
    }
    
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'secondary':
        variantStyle = {
          backgroundColor: COLORS.secondary,
        };
        break;
      case 'outlined':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primary,
        };
        break;
      case 'text':
        variantStyle = {
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
        };
        break;
      case 'primary':
      default:
        variantStyle = {
          backgroundColor: COLORS.primary,
        };
        break;
    }
    
    // Add disabled styles if necessary
    if (disabled || isLoading) {
      return {
        ...baseStyle,
        ...sizeStyle,
        ...variantStyle,
        opacity: 0.6,
      };
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };
  
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: 'center',
    };
    
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          ...FONTS.button.small,
        };
        break;
      case 'large':
        sizeStyle = {
          ...FONTS.button.large,
        };
        break;
      case 'medium':
      default:
        sizeStyle = {
          ...FONTS.button.regular,
        };
        break;
    }
    
    let variantStyle: TextStyle = {};
    switch (variant) {
      case 'outlined':
        variantStyle = {
          color: COLORS.primary,
        };
        break;
      case 'text':
        variantStyle = {
          color: COLORS.primary,
        };
        break;
      case 'primary':
      case 'secondary':
      default:
        variantStyle = {
          color: COLORS.white,
        };
        break;
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };

  const handlePress = () => {
    // Don't trigger press when disabled or loading
    if (disabled || isLoading) return;
    
    // Trigger haptic feedback
    triggerHapticFeedback('light');
    
    // Call the onPress handler
    onPress();
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outlined' || variant === 'text' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: SPACING.s,
  },
  iconRight: {
    marginLeft: SPACING.s,
  },
});

export default Button;