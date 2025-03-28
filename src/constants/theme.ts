export const COLORS = {
  // Brand Colors
  primary: '#8C6FF7',
  primaryLight: '#B9A2FF',
  primaryDark: '#6B4CD5',
  
  // Secondary Colors
  secondary: '#64DFDF',
  secondaryLight: '#9EEDF9',
  secondaryDark: '#28C2C2',
  
  // Accent Colors
  accent: '#FFA062',
  accentLight: '#FFD1A7',
  accentDark: '#FF7C30',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundDark: '#F2F2F2',
  backgroundLight: '#FAFAFA',
  
  // Text Colors
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textInverse: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // UI Element Colors
  border: '#E0E0E0',
  borderDark: '#BDBDBD',
  disabled: '#E9E9E9',
  disabledText: '#9E9E9E',
  
  // Transparent Colors
  transparent: 'transparent',
  semiTransparent: 'rgba(0, 0, 0, 0.3)',
  
  // Additional Colors needed for components
  white: '#FFFFFF',
  neutralDark: '#333333',
  neutralMedium: '#666666',
  neutralLight: '#EEEEEE',
  
  // Gradients - provide the start and end colors
  gradientPurple: ['#8C6FF7', '#6B4CD5'],
  gradientBlue: ['#64DFDF', '#28C2C2'],
  gradientOrange: ['#FFA062', '#FF7C30'],
};

export const FONTS = {
  // Font Families
  primary: 'System',
  
  // Font Weights as strings for React Native
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
  
  // Font Sizes
  tiny: 10,
  small: 12,
  medium_size: 14,
  regular_size: 16,
  large: 18,
  xlarge: 22,
  xxlarge: 28,
  huge: 36,
  
  // Font Styles
  body: 'System',
  heading: 'System',
};

export const SPACING = {
  // Spacing Scale
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  
  // Legacy Spacing (to avoid breaking existing code)
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
  
  // Common UI Spacing
  screenHorizontal: 16,
  screenVertical: 24,
  cardPadding: 16,
  buttonPadding: 12,
  inputPadding: 14,
  elementGap: 16,
};

export const SIZES = {
  // Border Radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  borderRadius: 8, // Default border radius
  
  // Icon Sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  
  // Button Sizes
  buttonSmallHeight: 32,
  buttonMediumHeight: 44,
  buttonLargeHeight: 56,
  
  // Input Sizes
  inputHeight: 48,
  
  // Header Sizes
  headerHeight: 56,
  
  // Avatar Sizes
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  // Intensity levels for shadow
  light: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dark: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
};