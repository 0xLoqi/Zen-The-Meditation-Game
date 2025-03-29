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
  animation: 'float-left' | 'float-right' | 'float-up' | 'float-down';
  duration: number;
  delay: number;
}

// Define floating animations with more dramatic movements
Animatable.initializeRegistryWithDefinitions({
  'float-left': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: -200 },  // More horizontal movement
        { translateY: 50 },    // More vertical movement
        { rotate: '-30deg' }   // More rotation
      ]
    },
  },
  'float-right': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: 200 },   // More horizontal movement
        { translateY: 70 },    // More vertical movement
        { rotate: '30deg' }    // More rotation
      ]
    },
  },
  'float-up': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: 40 },    // More horizontal movement
        { translateY: -200 },  // More vertical movement
        { rotate: '25deg' }    // More rotation
      ]
    },
  },
  'float-down': {
    from: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      transform: [
        { translateX: -40 },   // More horizontal movement
        { translateY: 200 },   // More vertical movement
        { rotate: '-25deg' }   // More rotation
      ]
    },
  },
});

interface FloatingLeavesProps {
  count?: number;
  style?: any;
}

const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ count = 15, style }) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate random leaves
    const newLeaves: Leaf[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomLeafIndex = Math.floor(Math.random() * leafImages.length);
      
      // Define animations
      const animations = ['float-left', 'float-right', 'float-up', 'float-down'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)] as Leaf['animation'];
      
      newLeaves.push({
        id: i,
        image: leafImages[randomLeafIndex],
        startX: Math.random() * width,
        startY: Math.random() * height,
        size: 60 + Math.random() * 60, // Size between 60-120 (much larger)
        animation: randomAnimation,
        duration: 10000 + Math.random() * 8000, // Duration between 10-18 seconds (faster)
        delay: Math.random() * 3000, // Random delay up to 3 seconds (less waiting)
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
          direction="alternate"
          easing="ease-in-out"
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