import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { triggerHapticFeedback } from '../utils/haptics';

interface MoodScaleProps {
  onRatingSelected: (rating: number) => void;
  initialRating?: number;
  style?: ViewStyle;
  labelStyle?: any;
  iconStyle?: any;
}

const MoodScale = ({ onRatingSelected, initialRating, style, labelStyle, iconStyle }: MoodScaleProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating || null);
  
  // Emoji and color for each mood level
  const moodConfig = [
    { emoji: 'sad', label: 'Sad', color: COLORS.error },
    { emoji: 'sad-outline', label: 'Down', color: '#FB8C00' }, // Orange
    { emoji: 'happy-outline', label: 'Neutral', color: COLORS.warning },
    { emoji: 'happy', label: 'Good', color: '#43A047' }, // Green
    { emoji: 'heart', label: 'Great', color: COLORS.primary },
  ];
  
  const handleRatingSelect = (rating: number) => {
    triggerHapticFeedback('selection');
    setSelectedRating(rating);
    onRatingSelected(rating);
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.scaleContainer}>
        {moodConfig.map((mood, index) => {
          const rating = index + 1;
          const isSelected = selectedRating === rating;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodOption,
                isSelected && { backgroundColor: mood.color + '20' }, // 20% opacity
              ]}
              onPress={() => handleRatingSelect(rating)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mood.emoji as any}
                size={28}
                color={isSelected ? mood.color : COLORS.text}
                style={[styles.moodIcon, iconStyle]}
              />
              <Text
                style={[
                  styles.moodLabel,
                  labelStyle,
                  isSelected && { color: mood.color, fontWeight: 'bold' },
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodOption: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: SPACING.s,
    borderRadius: 14,
    minWidth: 32,
    backgroundColor: COLORS.white,
    marginHorizontal: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodIcon: {
    marginBottom: SPACING.xxs,
  },
  moodLabel: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.neutralMedium,
    textAlign: 'center',
  },
});

export default MoodScale;