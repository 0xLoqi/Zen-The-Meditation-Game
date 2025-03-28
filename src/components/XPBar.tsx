import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  style?: ViewStyle;
  showLevel?: boolean;
  showXPCount?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  requiredXP,
  level,
  style,
  showLevel = true,
  showXPCount = true,
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);
  
  return (
    <View style={[styles.container, style]}>
      {showLevel && (
        <Text style={styles.levelText}>Level {level}</Text>
      )}
      
      <View style={styles.barContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%` },
          ]}
        />
      </View>
      
      {showXPCount && (
        <Text style={styles.xpText}>
          {currentXP} / {requiredXP} XP
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  levelText: {
    ...FONTS.heading.h4,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  barContainer: {
    height: 12,
    backgroundColor: COLORS.neutralLight,
    borderRadius: SIZES.borderRadius.small,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius.small,
  },
  xpText: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
});

export default XPBar;
