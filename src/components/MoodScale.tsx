import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';

interface MoodScaleProps {
  onRatingSelected: (rating: number) => void;
  initialRating?: number;
  style?: ViewStyle;
}

const MoodScale: React.FC<MoodScaleProps> = ({
  onRatingSelected,
  initialRating = 0,
  style,
}) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  
  const handleRatingPress = (rating: number) => {
    setSelectedRating(rating);
    onRatingSelected(rating);
  };
  
  const getMoodIcon = (rating: number, isSelected: boolean) => {
    let iconName: string;
    let iconColor: string;
    
    if (isSelected) {
      iconColor = COLORS.primary;
    } else {
      iconColor = COLORS.neutralMedium;
    }
    
    switch (rating) {
      case 1:
        iconName = 'emoticon-sad-outline';
        break;
      case 2:
        iconName = 'emoticon-neutral-outline';
        break;
      case 3:
        iconName = 'emoticon-outline';
        break;
      case 4:
        iconName = 'emoticon-happy-outline';
        break;
      case 5:
        iconName = 'emoticon-excited-outline';
        break;
      default:
        iconName = 'emoticon-outline';
    }
    
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={SIZES.icon.large}
        color={iconColor}
      />
    );
  };
  
  const getMoodLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Not zen';
      case 2:
        return 'Slightly zen';
      case 3:
        return 'Moderately zen';
      case 4:
        return 'Very zen';
      case 5:
        return 'Extremely zen';
      default:
        return '';
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.scaleContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingItem,
              selectedRating === rating && styles.selectedRatingItem,
            ]}
            onPress={() => handleRatingPress(rating)}
            activeOpacity={0.7}
          >
            {getMoodIcon(rating, selectedRating === rating)}
            <Text
              style={[
                styles.ratingLabel,
                selectedRating === rating && styles.selectedRatingLabel,
              ]}
            >
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedRating > 0 && (
        <Text style={styles.moodLabel}>
          {getMoodLabel(selectedRating)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.m,
  },
  ratingItem: {
    alignItems: 'center',
    padding: SPACING.s,
    borderRadius: SIZES.borderRadius.small,
  },
  selectedRatingItem: {
    backgroundColor: COLORS.neutralLight,
  },
  ratingLabel: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    marginTop: SPACING.xs,
  },
  selectedRatingLabel: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  moodLabel: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    marginTop: SPACING.s,
  },
});

export default MoodScale;
