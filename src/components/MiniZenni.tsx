import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { getOutfitById } from '../constants/outfits';
import { OutfitId } from '../types';

interface MiniZenniProps {
  outfitId: OutfitId;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  animationState?: 'idle' | 'meditating' | 'levelUp';
  autoPlay?: boolean;
  loop?: boolean;
}

const MiniZenni = ({
  outfitId,
  size = 'medium',
  style,
  animationState = 'idle',
  autoPlay = true,
  loop = true,
}: MiniZenniProps) => {
  const lottieRef = useRef<LottieView>(null);
  const outfit = getOutfitById(outfitId);
  
  // This would be the path to the actual animation file for this outfit & animation state
  // For now, we'll use placeholder paths - these will need to be created and added to the assets folder
  const getAnimationSource = () => {
    // In a real implementation, we would return different animations based on outfit and state
    // For now, we'll use placeholder animation paths
    switch (animationState) {
      case 'meditating':
        return require('../../assets/animations/zenni_meditating.json');
      case 'levelUp':
        return require('../../assets/animations/zenni_level_up.json');
      case 'idle':
      default:
        return require('../../assets/animations/zenni_idle.json');
    }
  };
  
  // Will need actual animation files in the assets/animations folder
  // Currently using placeholders that should be replaced with real animations

  useEffect(() => {
    if (lottieRef.current && autoPlay) {
      lottieRef.current.play();
    }
  }, [autoPlay, animationState, outfitId]);

  const getDimensions = (): number => {
    switch (size) {
      case 'small':
        return 80;
      case 'large':
        return 200;
      case 'medium':
      default:
        return 140;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: getDimensions(), height: getDimensions() },
        style,
      ]}
    >
      <LottieView
        ref={lottieRef}
        source={getAnimationSource()}
        style={styles.animation}
        autoPlay={autoPlay}
        loop={loop}
        speed={animationState === 'levelUp' ? 1.2 : 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default MiniZenni;