import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { OutfitId } from '../types';

interface MiniZenniProps {
  outfitId: OutfitId;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  animationState?: 'idle' | 'meditating' | 'levelUp';
  autoPlay?: boolean;
  loop?: boolean;
}

// Simple placeholder for MiniZenni component
// In a real implementation, this would use animations and images for different outfits
const MiniZenni = ({
  outfitId = 'default',
  size = 'medium',
  style,
  animationState = 'idle',
  autoPlay = true,
  loop = true,
}: MiniZenniProps) => {
  // Determine dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 200, height: 200 };
      case 'medium':
      default:
        return { width: 120, height: 120 };
    }
  };

  const dimensions = getDimensions();

  // For now, just return a colored View as a placeholder
  return (
    <View
      style={[
        styles.container,
        dimensions,
        style,
        { backgroundColor: getOutfitColor(outfitId, animationState) }
      ]}
    />
  );
};

// Helper function to get a color based on outfit and animation state
const getOutfitColor = (outfitId: OutfitId, animationState: string): string => {
  const baseColors: {[key in OutfitId]: string} = {
    default: '#8C6FF7',
    zen_master: '#64DFDF',
    lotus: '#FFA062',
    cosmic: '#9D4EDD',
    nature_spirit: '#70E000',
    meditation_guru: '#FF7C30'
  };

  // For animation states, we could adjust the color
  if (animationState === 'meditating') {
    return baseColors[outfitId] + '88'; // Add transparency
  } else if (animationState === 'levelUp') {
    return '#FFD700'; // Gold for level up
  }

  return baseColors[outfitId];
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 60, // Half of the medium size for circle
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniZenni;