import { Dimensions } from 'react-native';

export const COLORS = {
  // Primary colors
  primary: '#6A5ACD', // Medium Slate Blue
  secondary: '#F0E68C', // Khaki
  accent: '#FFD700', // Gold
  
  // Neutral colors
  neutralLight: '#F5F5F5', // White Smoke
  neutralMedium: '#A9A9A9', // Dark Gray
  neutralDark: '#2F4F4F', // Dark Slate Gray
  
  // Functional colors
  success: '#90EE90', // Light Green
  warning: '#FFA07A', // Light Salmon
  white: '#FFFFFF',
  black: '#000000',
};

export const FONTS = {
  heading: {
    h1: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 24,
      lineHeight: 32,
    },
    h2: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 20,
      lineHeight: 28,
    },
    h3: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 18,
      lineHeight: 24,
    },
    h4: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 16,
      lineHeight: 22,
    },
  },
  body: {
    regular: {
      fontFamily: 'Lato_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    small: {
      fontFamily: 'Lato_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    tiny: {
      fontFamily: 'Lato_400Regular',
      fontSize: 12,
      lineHeight: 16,
    },
  },
  button: {
    primary: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 16,
      lineHeight: 24,
    },
    secondary: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const SIZES = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    circle: 999,
  },
  button: {
    height: 48,
    minWidth: 120,
  },
  input: {
    height: 56,
  },
  icon: {
    small: 16,
    medium: 24,
    large: 32,
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};
