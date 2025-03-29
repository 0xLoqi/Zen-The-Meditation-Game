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

// Define floating animations
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
        { translateX: -100 },
        { translateY: 20 },
        { rotate: '-15deg' }
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
        { translateX: 100 },
        { translateY: 30 },
        { rotate: '15deg' }
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
        { translateX: 20 },
        { translateY: -100 },
        { rotate: '10deg' }
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
        { translateX: -15 },
        { translateY: 100 },
        { rotate: '-10deg' }
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
      
      // Define animations
      const animations = ['float-left', 'float-right', 'float-up', 'float-down'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)] as Leaf['animation'];
      
      newLeaves.push({
        id: i,
        image: leafImages[randomLeafIndex],
        startX: Math.random() * width,
        startY: Math.random() * height,
        size: 30 + Math.random() * 40, // Size between 30-70
        animation: randomAnimation,
        duration: 15000 + Math.random() * 10000, // Duration between 15-25 seconds
        delay: Math.random() * 5000, // Random delay up to 5 seconds
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
              opacity: 0.7,
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
    zIndex: -1, // Behind other content
  },
  leafContainer: {
    position: 'absolute',
  },
});

export default FloatingLeaves;