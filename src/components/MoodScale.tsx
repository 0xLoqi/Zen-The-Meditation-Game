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
}

const MoodScale = ({ onRatingSelected, initialRating, style }: MoodScaleProps) => {
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
                size={36}
                color={isSelected ? mood.color : COLORS.neutralMedium}
                style={styles.moodIcon}
              />
              <Text
                style={[
                  styles.moodLabel,
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
    padding: SPACING.xs,
    borderRadius: 12,
    minWidth: 60,
  },
  moodIcon: {
    marginBottom: SPACING.xxs,
  },
  moodLabel: {
    ...FONTS.body.tiny,
    color: COLORS.neutralMedium,
    textAlign: 'center',
  },
});

export default MoodScale;