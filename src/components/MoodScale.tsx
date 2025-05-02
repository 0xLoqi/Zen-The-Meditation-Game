import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Text,
  Animated,
} from 'react-native';
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
    { emoji: '😢', label: 'Sad', color: COLORS.error },
    { emoji: '😞', label: 'Down', color: '#FB8C00' }, // Orange
    { emoji: '😐', label: 'Neutral', color: COLORS.warning },
    { emoji: '🙂', label: 'Good', color: '#43A047' }, // Green
    { emoji: '❤️', label: 'Great', color: COLORS.primary },
  ];
  
  const handleRatingSelect = (rating: number) => {
    triggerHapticFeedback('selection');
    setSelectedRating(rating);
    onRatingSelected(rating);
  };
  
  // Animation refs for each mood
  const sadAnim = useRef(new Animated.Value(0)).current;
  const downAnim = useRef(new Animated.Value(0)).current;
  const neutralAnim = useRef(new Animated.Value(0)).current;
  const goodAnim = useRef(new Animated.Value(0)).current;
  const greatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selectedRating === 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sadAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(sadAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    } else { sadAnim.setValue(0); }
    if (selectedRating === 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(downAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(downAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    } else { downAnim.setValue(0); }
    if (selectedRating === 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(neutralAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(neutralAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(neutralAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ])
      ).start();
    } else { neutralAnim.setValue(0); }
    if (selectedRating === 4) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(goodAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(goodAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ])
      ).start();
    } else { goodAnim.setValue(0); }
    if (selectedRating === 5) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(greatAnim, { toValue: 1.15, duration: 250, useNativeDriver: true }),
          Animated.timing(greatAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ])
      ).start();
    } else { greatAnim.setValue(1); }
  }, [selectedRating]);
  
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
                {
                  backgroundColor: isSelected ? '#FF8C42' : '#fff',
                  borderColor: isSelected ? '#FF8C42' : 'transparent',
                  borderWidth: isSelected ? 2 : 1,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                },
              ]}
              onPress={() => handleRatingSelect(rating)}
              activeOpacity={0.7}
            >
              {index === 0 && isSelected ? (
                <Animated.Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    { fontSize: 32, color: '#fff', fontWeight: 'bold', transform: [{ translateY: sadAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) }] },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
              ) : index === 1 && isSelected ? (
                <Animated.Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    { fontSize: 32, color: '#fff', fontWeight: 'bold', transform: [{ rotate: downAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '18deg'] }) }] },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
              ) : index === 2 && isSelected ? (
                <Animated.Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    { fontSize: 32, color: '#000', transform: [{ translateX: neutralAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-6, 0, 6] }) }] },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
              ) : index === 3 && isSelected ? (
                <Animated.Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    { fontSize: 32, color: mood.color, transform: [{ translateY: goodAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
              ) : index === 4 && isSelected ? (
                <Animated.Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    {
                      fontSize: 32,
                      color: '#43D17A',
                      textShadowColor: '#43D17A',
                      textShadowRadius: 8,
                      textShadowOffset: { width: 0, height: 0 },
                      transform: [{ scale: greatAnim }],
                    },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
              ) : (
                <Text
                  style={[
                    styles.moodIcon,
                    iconStyle,
                    // Selected: white
                    isSelected
                      ? { fontSize: 32, color: '#fff', fontWeight: 'bold' }
                      // Unselected: cannon orange
                      : { fontSize: 32, color: '#FF8C42', fontWeight: 'bold' },
                  ]}
                >
                  {mood.emoji}
                </Text>
              )}
              <Text
                style={[
                  styles.moodLabel,
                  labelStyle,
                  isSelected
                    ? { color: '#fff', fontWeight: 'bold' }
                    : { color: '#FF8C42', fontWeight: 'bold' },
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
    alignItems: 'stretch',
    width: '100%',
  },
  moodOption: {
    flex: 1,
    minWidth: 0,
    maxWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 14,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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