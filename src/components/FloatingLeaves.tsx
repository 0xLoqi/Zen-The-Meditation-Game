import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType, Platform } from 'react-native';
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
    0: {
      opacity: 0,
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    0.1: {
      opacity: 1,
    },
    0.9: {
      opacity: 1,
    },
    1: {
      opacity: 0,
      transform: [
        { translateX: -40 },
        { translateY: 300 },
        { rotate: '-5deg' }
      ]
    },
  },
  'float-down-right': {
    0: {
      opacity: 0,
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    0.1: {
      opacity: 1,
    },
    0.9: {
      opacity: 1,
    },
    1: {
      opacity: 0,
      transform: [
        { translateX: 40 },
        { translateY: 280 },
        { rotate: '5deg' }
      ]
    },
  },
  'float-down-center': {
    0: {
      opacity: 0,
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    0.1: {
      opacity: 1,
    },
    0.9: {
      opacity: 1,
    },
    1: {
      opacity: 0,
      transform: [
        { translateX: 0 },
        { translateY: 320 },
        { rotate: '0deg' }
      ]
    },
  },
  'float-down-zigzag': {
    0: {
      opacity: 0,
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    0.1: {
      opacity: 1,
    },
    0.9: {
      opacity: 1,
    },
    1: {
      opacity: 0,
      transform: [
        { translateX: 30 },
        { translateY: 300 },
        { rotate: '10deg' }
      ]
    },
  },
});

interface FloatingLeavesProps {
  count?: number;
  style?: any;
}

const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ count = 30, style }) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate random leaves
    const newLeaves: Leaf[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomLeafIndex = Math.floor(Math.random() * leafImages.length);
      
      // Define animations - all downward flowing
      const animations = ['float-down-left', 'float-down-right', 'float-down-center', 'float-down-zigzag'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)] as any;
      
      // Distribute initial positions throughout the screen height
      const initialY = -100 - (Math.random() * height * 1.5);
      
      newLeaves.push({
        id: i,
        image: leafImages[randomLeafIndex],
        startX: Math.random() * width, 
        startY: initialY, // Distribute leaves throughout screen height initially
        size: 20 + Math.random() * 20, // Size between 20-40 (smaller)
        animation: randomAnimation,
        duration: 15000 + Math.random() * 10000, // Duration between 15-25 seconds
        delay: Math.random() * 5000, // Shorter initial delay, max 5 seconds
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
          useNativeDriver={Platform.OS !== 'web'}
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
              opacity: 0.4,
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
    height: '200%', // Make container taller to ensure leaves have room to animate
    top: -height * 0.5, // Position container higher up
    zIndex: -1,
    pointerEvents: 'none',
  },
  leafContainer: {
    position: 'absolute',
  },
});

export default FloatingLeaves;