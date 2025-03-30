import { Platform } from 'react-native';

interface ShadowProps {
  color?: string;
  offset?: { width: number; height: number };
  opacity?: number;
  radius?: number;
}

export const getShadowStyle = (props: ShadowProps = {}) => {
  const {
    color = '#000',
    offset = { width: 0, height: 2 },
    opacity = 0.1,
    radius = 4,
  } = props;

  if (Platform.OS === 'web') {
    const { width, height } = offset;
    return {
      boxShadow: `${width}px ${height}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    };
  }

  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}; 