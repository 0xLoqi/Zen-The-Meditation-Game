import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatStreak } from '../utils/formatters';

interface StreakIndicatorProps {
  streakCount: number;
  style?: ViewStyle;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StreakIndicator = ({
  streakCount,
  style,
  showLabel = true,
  size = 'medium',
}: StreakIndicatorProps) => {
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 40;
      case 'medium':
      default:
        return 32;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 16;
      case 'medium':
      default:
        return 14;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.iconContainer,
          { width: getSize(), height: getSize() }
        ]}
      >
        <Ionicons
          name="flame"
          size={getSize() * 0.6}
          color={COLORS.white}
        />
      </View>
      
      {showLabel && (
        <Text style={[styles.streakText, { fontSize: getFontSize() }]}>
          {formatStreak(streakCount)}
        </Text>
      )}
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
    borderRadius: SIZES.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    fontWeight: 'bold' as const,
    marginLeft: SPACING.xs,
  },
});

export default StreakIndicator;