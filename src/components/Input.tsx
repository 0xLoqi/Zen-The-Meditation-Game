import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

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

const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  showPasswordToggle = false,
  ...rest
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null,
      ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={COLORS.grey}
          secureTextEntry={actualSecureTextEntry}
          {...rest}
        />
        
        {showPasswordToggle && secureTextEntry ? (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      
      {error ? (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    marginBottom: SPACING.xs,
    color: COLORS.neutralDark,
    ...FONTS.body.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.neutralDark,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    minHeight: 48,
    ...FONTS.body.regular,
  },
  leftIconContainer: {
    paddingLeft: SPACING.m,
  },
  rightIconContainer: {
    paddingRight: SPACING.m,
  },
  errorText: {
    color: COLORS.error,
    marginTop: SPACING.xs,
    ...FONTS.body.small,
  },
  passwordToggleText: {
    color: COLORS.primary,
    ...FONTS.body.small,
    fontWeight: '600' as const, // Make it bold-ish
  },
});

export default Input;