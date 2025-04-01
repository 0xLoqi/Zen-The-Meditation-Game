import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface SparkleProps {
  color?: string;
  style?: ViewStyle;
  size?: number;
}

const Sparkle = ({ color = '#FFD700', style, size = 24 }: SparkleProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z"
        fill={color}
      />
      <Path
        d="M12 4L12.9 8.1L17 9L12.9 9.9L12 14L11.1 9.9L7 9L11.1 8.1L12 4Z"
        fill="#FFFFFF"
        opacity={0.8}
      />
    </Svg>
  );
};

export default Sparkle; 