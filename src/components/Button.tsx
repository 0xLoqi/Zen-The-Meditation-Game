import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

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

const Button: React.FC<ButtonProps> = ({
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
}) => {
  // Determine button styles based on variant and size
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.borderRadius.medium,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // Add height based on size
    switch (size) {
      case 'small':
        baseStyle.height = 40;
        baseStyle.paddingHorizontal = SPACING.l;
        break;
      case 'large':
        baseStyle.height = 56;
        baseStyle.paddingHorizontal = SPACING.xl;
        break;
      default: // medium
        baseStyle.height = SIZES.button.height;
        baseStyle.paddingHorizontal = SPACING.xl;
    }

    // Add style based on variant
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.secondary,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default: // primary
        return {
          ...baseStyle,
          backgroundColor: COLORS.primary,
        };
    }
  };

  // Determine text styles based on variant
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...FONTS.button.primary,
      textAlign: 'center',
    };

    // Adjust size based on button size
    if (size === 'small') {
      baseStyle.fontSize = 14;
    } else if (size === 'large') {
      baseStyle.fontSize = 18;
    }

    // Add color based on variant
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          color: COLORS.neutralDark,
        };
      case 'outlined':
        return {
          ...baseStyle,
          color: COLORS.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          color: COLORS.primary,
        };
      default: // primary
        return {
          ...baseStyle,
          color: COLORS.white,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              getTextStyle(),
              disabled && styles.disabledText,
              leftIcon && { marginLeft: SPACING.s },
              rightIcon && { marginRight: SPACING.s },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
