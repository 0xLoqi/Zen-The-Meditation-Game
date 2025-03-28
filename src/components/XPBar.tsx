import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { formatPercentage } from '../utils/formatters';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  style?: ViewStyle;
  showLevel?: boolean;
  showXPCount?: boolean;
}

const XPBar = ({
  currentXP,
  requiredXP,
  level,
  style,
  showLevel = true,
  showXPCount = true,
}: XPBarProps) => {
  // Calculate percentage of XP progress
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);
  
  return (
    <View style={[styles.container, style]}>
      {showLevel && (
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      )}
      
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View 
            style={[
              styles.barFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        
        {showXPCount && (
          <Text style={styles.xpText}>
            {currentXP} / {requiredXP} XP ({formatPercentage(progressPercentage)})
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
    width: '100%',
  },
  levelContainer: {
    width: 32,
    height: 32,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  levelText: {
    ...FONTS.body.small,
    color: COLORS.white,
    fontWeight: 'bold' as const,
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 12,
    backgroundColor: COLORS.neutralLight,
    borderRadius: SIZES.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.full,
  },
  xpText: {
    ...FONTS.body.tiny,
    color: COLORS.neutralMedium,
    marginTop: SPACING.xxs,
    textAlign: 'right',
  },
});

export default XPBar;