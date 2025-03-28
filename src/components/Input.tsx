import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  showPasswordToggle = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null,
        (leftIcon || rightIcon) && { paddingHorizontal: SPACING.m },
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            inputStyle,
            leftIcon && { paddingLeft: SPACING.s },
            (rightIcon || showPasswordToggle) && { paddingRight: SPACING.s },
          ]}
          placeholderTextColor={COLORS.neutralMedium}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={SIZES.icon.medium}
              color={COLORS.neutralMedium}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.l,
  },
  label: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.input.height,
    borderWidth: 1,
    borderColor: COLORS.neutralMedium,
    borderRadius: SIZES.borderRadius.small,
    backgroundColor: COLORS.white,
  },
  inputContainerError: {
    borderColor: COLORS.warning,
  },
  input: {
    flex: 1,
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    height: '100%',
    paddingHorizontal: SPACING.l,
  },
  leftIconContainer: {
    paddingLeft: SPACING.s,
  },
  rightIconContainer: {
    paddingRight: SPACING.s,
  },
  error: {
    ...FONTS.body.small,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
});

export default Input;
