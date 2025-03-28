import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, FONTS } from '../constants/theme';

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
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null,
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || (secureTextEntry && showPasswordToggle)) ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
        
        {secureTextEntry && showPasswordToggle && (
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={SIZES.iconSmall} 
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.medium,
  },
  label: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.medium,
    fontSize: FONTS.small,
    color: COLORS.text,
    marginBottom: SPACING.tiny,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.background,
    minHeight: SIZES.inputHeight,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  iconContainer: {
    paddingHorizontal: SPACING.small,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.regular,
    fontSize: FONTS.regular,
    color: COLORS.text,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.small,
    minHeight: SIZES.inputHeight,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  errorText: {
    fontFamily: FONTS.primary,
    fontWeight: FONTS.regular,
    fontSize: FONTS.small,
    color: COLORS.error,
    marginTop: SPACING.tiny,
  },
});

export default Input;