import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Outfit } from '../types';
import { COLORS, FONTS, SHADOWS, SIZES, SPACING } from '../constants/theme';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from '../utils/formatters';

interface OutfitItemProps {
  outfit: Outfit;
  isUnlocked: boolean;
  isEquipped: boolean;
  onPress: () => void;
}

const OutfitItem = ({
  outfit,
  isUnlocked,
  isEquipped,
  onPress,
}: OutfitItemProps) => {
  // Determine whether the outfit is purchasable or level-locked
  const isPurchasable = isUnlocked && outfit.tokenCost !== null;
  const isLevelLocked = !isUnlocked && outfit.tokenCost === null;
  
  // Define status badge color and text
  const getBadgeConfig = () => {
    if (isEquipped) {
      return {
        color: COLORS.primary,
        text: 'Equipped',
        icon: 'checkmark-circle',
      };
    }
    
    if (isUnlocked) {
      return {
        color: COLORS.success,
        text: 'Unlocked',
        icon: 'unlock',
      };
    }
    
    if (isPurchasable) {
      return {
        color: COLORS.secondary,
        text: `${formatNumber(outfit.tokenCost!)} tokens`,
        icon: 'cash',
      };
    }
    
    return {
      color: COLORS.neutralMedium,
      text: `Level ${outfit.requiredLevel}`,
      icon: 'lock-closed',
    };
  };
  
  const badgeConfig = getBadgeConfig();
  
  return (
    <Card
      style={styles.container}
      shadowLevel="light"
      onPress={isUnlocked || isPurchasable ? onPress : undefined}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: outfit.imagePath }}
            style={[
              styles.image,
              (!isUnlocked && !isPurchasable) && styles.imageLocked,
            ]}
          />
          {isEquipped && (
            <View style={styles.equippedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.outfitName}>
            {outfit.name}
          </Text>
          
          <Text style={styles.description} numberOfLines={2}>
            {outfit.description}
          </Text>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: badgeConfig.color + '20' } // 20% opacity
          ]}>
            <Ionicons name={badgeConfig.icon as any} size={16} color={badgeConfig.color} />
            <Text style={[styles.statusText, { color: badgeConfig.color }]}>
              {badgeConfig.text}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius.small,
    overflow: 'hidden',
    marginRight: SPACING.m,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLocked: {
    opacity: 0.5,
  },
  equippedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.full,
    padding: 2,
    ...SHADOWS.light,
  },
  detailsContainer: {
    flex: 1,
  },
  outfitName: {
    ...FONTS.body.regular,
    fontWeight: 'bold' as const,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xxs,
  },
  description: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    marginBottom: SPACING.s,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    borderRadius: SIZES.borderRadius.full,
  },
  statusText: {
    ...FONTS.body.tiny,
    fontWeight: 'bold' as const,
    marginLeft: 4,
  },
});

export default OutfitItem;