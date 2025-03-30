import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View,
  Platform
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { getShadowStyle } from '../utils/styles';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  isLoading = false,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.text} />
      ) : (
        <View style={styles.buttonContent}>
          <AntDesign name="google" size={18} color="#4285F4" style={styles.icon} />
          <Text style={[styles.buttonText, textStyle]}>
            Continue with Google
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: SIZES.borderRadius.medium,
    padding: SPACING.m,
    marginVertical: SPACING.s,
    ...getShadowStyle({
      offset: { width: 0, height: 2 },
      opacity: 0.1,
      radius: 4,
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.medium as '500',
    textAlign: 'center',
  },
  icon: {
    marginRight: SPACING.small,
  }
});

export default GoogleSignInButton;