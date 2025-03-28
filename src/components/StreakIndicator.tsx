import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../constants/theme';

interface StreakIndicatorProps {
  streakCount: number;
  style?: ViewStyle;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  streakCount,
  style,
  showLabel = true,
  size = 'medium',
}) => {
  // Get icon size based on component size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default: // medium
        return 24;
    }
  };
  
  // Get text style based on component size
  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return { ...FONTS.body.small };
      case 'large':
        return { ...FONTS.heading.h3 };
      default: // medium
        return { ...FONTS.body.regular };
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.iconContainer, 
        size === 'small' && styles.smallIconContainer,
        size === 'large' && styles.largeIconContainer,
      ]}>
        <MaterialCommunityIcons
          name="fire"
          size={getIconSize()}
          color={COLORS.white}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.streakCount, getTextStyle()]}>
          {streakCount}
        </Text>
        {showLabel && (
          <Text style={[
            styles.streakLabel,
            size === 'small' && styles.smallStreakLabel,
          ]}>
            {streakCount === 1 ? 'Day' : 'Days'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: COLORS.warning,
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  smallIconContainer: {
    width: 28,
    height: 28,
  },
  largeIconContainer: {
    width: 56,
    height: 56,
  },
  textContainer: {
    marginLeft: SPACING.s,
  },
  streakCount: {
    color: COLORS.neutralDark,
    fontWeight: 'bold',
  },
  streakLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
  },
  smallStreakLabel: {
    ...FONTS.body.tiny,
  },
});

export default StreakIndicator;
