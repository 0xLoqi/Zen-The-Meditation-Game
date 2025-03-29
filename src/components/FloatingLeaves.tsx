import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import * as Animatable from 'react-native-animatable';

// Get screen dimensions for positioning
const { width, height } = Dimensions.get('window');

// Import leaf images
const leaf1 = require('../../assets/images/leaves/leaf 1.png');
const leaf2 = require('../../assets/images/leaves/leaf 2.png');
const leaf3 = require('../../assets/images/leaves/leaf 3.png');
const leaf4 = require('../../assets/images/leaves/leaf 4.png');

// Array of leaf images to randomly select from
const leafImages: ImageSourcePropType[] = [leaf1, leaf2, leaf3, leaf4];

// Interface for leaf object
interface Leaf {
  id: number;
  image: ImageSourcePropType;
  startX: number;
  startY: number;
  size: number;
  animation: 'float-down-left' | 'float-down-right' | 'float-down-center' | 'float-down-zigzag';
  duration: number;
  delay: number;
}

// Define gentle flowing animations primarily downward
Animatable.initializeRegistryWithDefinitions({
  'float-down-left': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: -40 },    // Slight leftward drift
        { translateY: 300 },    // Long downward flow
        { rotate: '-5deg' }     // Subtle rotation
      ]
    },
  },
  'float-down-right': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: 40 },     // Slight rightward drift
        { translateY: 280 },    // Long downward flow
        { rotate: '5deg' }      // Subtle rotation
      ]
    },
  },
  'float-down-center': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: 0 },      // No horizontal movement
        { translateY: 320 },    // Long downward flow
        { rotate: '0deg' }      // No rotation
      ]
    },
  },
  'float-down-zigzag': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: 30 },     // Slight zigzag
        { translateY: 300 },    // Long downward flow
        { rotate: '10deg' }     // Slight rotation
      ]
    },
  },
});

interface FloatingLeavesProps {
  count?: number;
  style?: any;
}

const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ count = 8, style }) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate random leaves
    const newLeaves: Leaf[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomLeafIndex = Math.floor(Math.random() * leafImages.length);
      
      // Define animations - all downward flowing
      const animations = ['float-down-left', 'float-down-right', 'float-down-center', 'float-down-zigzag'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)] as any;
      
      newLeaves.push({
        id: i,
        image: leafImages[randomLeafIndex],
        startX: Math.random() * width, 
        startY: -100 - (Math.random() * 200), // Start above the screen
        size: 40 + Math.random() * 30, // Size between 40-70 (more moderate)
        animation: randomAnimation,
        duration: 15000 + Math.random() * 10000, // Duration between 15-25 seconds (slower, gentler)
        delay: Math.random() * 10000, // Random delay up to 10 seconds (more sparing appearance)
      });
    }
    
    setLeaves(newLeaves);
  }, [count]);

  return (
    <View style={[styles.container, style]}>
      {leaves.map((leaf) => (
        <Animatable.View
          key={leaf.id}
          animation={leaf.animation}
          iterationCount="infinite"
          direction="normal"
          easing="linear"
          duration={leaf.duration}
          delay={leaf.delay}
          style={[
            styles.leafContainer,
            {
              left: leaf.startX,
              top: leaf.startY,
            },
          ]}
        >
          <Image
            source={leaf.image}
            style={{
              width: leaf.size,
              height: leaf.size,
              opacity: 0.9, // Increased opacity for better visibility
            }}
            resizeMode="contain"
          />
        </Animatable.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1, // Changed to positive value to ensure visibility
    pointerEvents: 'none', // Makes sure clicks pass through to elements below
  },
  leafContainer: {
    position: 'absolute',
  },
});

export default FloatingLeaves;