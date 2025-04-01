import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Input = ({
  label,
  error,
  containerStyle,
  style,
  textStyle,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          style,
          textStyle && { color: textStyle.color },
          error && styles.inputError,
        ]}
        placeholderTextColor={COLORS.neutralMedium}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.small,
  },
  label: {
    ...FONTS.body.medium,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xsmall,
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.medium,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: COLORS.neutralDark,
    fontSize: 16,
    ...FONTS.body.regular,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.error,
    marginTop: SPACING.xsmall,
    fontSize: 12,
  },
});

export default Input;