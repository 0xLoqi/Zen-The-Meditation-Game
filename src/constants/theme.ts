// Theme constants for the Zen Meditation app

export const COLORS = {
  // Primary colors
  primary: '#6B5CE7', // Main purple for primary actions
  primaryLight: '#8B7FF7', // Lighter purple for secondary elements
  primaryDark: '#4A3CB2', // Darker purple for accents
  
  // Secondary colors
  secondary: '#FF8E6E', // Orange for contrast and energy
  secondaryLight: '#FFA98F', // Lighter orange
  secondaryDark: '#E06E52', // Darker orange
  
  // Neutral colors
  white: '#FFFFFF',
  offWhite: '#F8F8F8',
  neutralLight: '#F0F0F0',
  lighterGrey: '#F0F0F0',
  lightGrey: '#E0E0E0',
  neutralMedium: '#A0A0A0',
  grey: '#A0A0A0',
  darkGrey: '#606060',
  neutralDark: '#505050',
  black: '#303030',
  
  // Semantic colors
  success: '#4CAF50', // Green
  warning: '#FFCC00', // Yellow
  error: '#F44336', // Red
  info: '#2196F3', // Blue
  
  // Background colors
  background: '#FFFFFF',
  surface: '#FAFAFA',
  card: '#FFFFFF',
  
  // Transparent colors for overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparentPrimary: 'rgba(107, 92, 231, 0.2)',
};

export const FONTS = {
  heading: {
    extraLarge: {
      fontFamily: 'System',
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    large: {
      fontFamily: 'System',
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
    },
    medium: {
      fontFamily: 'System',
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    small: {
      fontFamily: 'System',
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    // Aliases for easier reference
    h1: {
      fontFamily: 'System',
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontFamily: 'System',
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
    },
    h3: {
      fontFamily: 'System',
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
  },
  subheading: {
    large: {
      fontFamily: 'System',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    medium: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    small: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
  },
  body: {
    large: {
      fontFamily: 'System',
      fontSize: 18,
      fontWeight: 'normal',
      lineHeight: 26,
    },
    regular: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    small: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    xsmall: {
      fontFamily: 'System',
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 18,
    },
    tiny: {
      fontFamily: 'System',
      fontSize: 10,
      fontWeight: 'normal',
      lineHeight: 14,
    },
  },
  button: {
    large: {
      fontFamily: 'System',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    regular: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    small: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
  },
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const SIZES = {
  inputHeight: 56,
  buttonHeight: {
    small: 36,
    medium: 48,
    large: 56,
  },
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    full: 999, // Large value for rounded components
    round: 999, // Large value for circular elements
  },
  maxWidth: 768, // Max content width for larger screens
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};