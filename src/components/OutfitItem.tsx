import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { Outfit } from '../types';

interface OutfitItemProps {
  outfit: Outfit;
  isUnlocked: boolean;
  isEquipped: boolean;
  onPress: () => void;
}

const OutfitItem: React.FC<OutfitItemProps> = ({
  outfit,
  isUnlocked,
  isEquipped,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isEquipped && styles.equippedContainer,
      ]}
      onPress={onPress}
      disabled={!isUnlocked}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {/* Use SVG placeholder for image */}
        <View style={styles.imagePlaceholder}>
          <MaterialCommunityIcons
            name="hanger"
            size={SIZES.icon.large}
            color={isUnlocked ? COLORS.primary : COLORS.neutralMedium}
          />
        </View>
        
        {/* Lock overlay if not unlocked */}
        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <MaterialCommunityIcons
              name="lock"
              size={SIZES.icon.medium}
              color={COLORS.white}
            />
          </View>
        )}
        
        {/* Equipped indicator */}
        {isEquipped && (
          <View style={styles.equippedIndicator}>
            <MaterialCommunityIcons
              name="check-circle"
              size={SIZES.icon.medium}
              color={COLORS.success}
            />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.outfitName,
            !isUnlocked && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {outfit.name}
        </Text>
        
        {outfit.tokenCost !== null && !isUnlocked && (
          <View style={styles.costContainer}>
            <MaterialCommunityIcons
              name="coin"
              size={16}
              color={COLORS.accent}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.costText}>{outfit.tokenCost}</Text>
          </View>
        )}
        
        {!isUnlocked && outfit.tokenCost === null && (
          <Text style={styles.levelRequiredText}>
            Level {outfit.requiredLevel}
          </Text>
        )}
        
        {isEquipped && (
          <Text style={styles.equippedText}>Equipped</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.medium,
    overflow: 'hidden',
    marginHorizontal: SPACING.s,
    marginBottom: SPACING.l,
    ...SHADOWS.light,
  },
  equippedContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    backgroundColor: COLORS.neutralLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equippedIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  infoContainer: {
    padding: SPACING.s,
  },
  outfitName: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  disabledText: {
    color: COLORS.neutralMedium,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    ...FONTS.body.small,
    color: COLORS.accent,
    fontWeight: '500',
  },
  levelRequiredText: {
    ...FONTS.body.tiny,
    color: COLORS.neutralMedium,
  },
  equippedText: {
    ...FONTS.body.tiny,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default OutfitItem;
