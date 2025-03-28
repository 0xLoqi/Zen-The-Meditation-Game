import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

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
  secureTextEntry,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  showPasswordToggle = false,
  ...rest
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isPasswordField = secureTextEntry || showPasswordToggle;
  const actualSecureTextEntry = isPasswordField ? !passwordVisible : false;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || isPasswordField) ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          secureTextEntry={actualSecureTextEntry}
          placeholderTextColor={COLORS.neutralMedium}
          {...rest}
        />
        
        {isPasswordField && showPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.neutralMedium}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...FONTS.body.regular,
    marginBottom: SPACING.xs,
    color: COLORS.neutralDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutralLight,
    borderRadius: SIZES.borderRadius.medium,
    backgroundColor: COLORS.white,
  },
  input: {
    ...FONTS.body.regular,
    flex: 1,
    color: COLORS.neutralDark,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    minHeight: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  iconContainer: {
    paddingHorizontal: SPACING.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;