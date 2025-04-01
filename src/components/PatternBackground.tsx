import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface PatternBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={require('../../assets/pattern_bg.png')}
      resizeMode="repeat"
      style={[styles.backgroundImage, style]}
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 225, 0.95)', // Same overlay color as signup screen
  },
});

export default PatternBackground; 