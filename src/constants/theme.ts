export const COLORS = {
  // Earth Tones - Based on Zenni Character
  primary: '#CD8500', // Saffron - Main brand color, buttons, active states 
  primaryLight: '#E9A030', // Light Orange - Lighter version of primary
  primaryDark: '#A66A00', // Deep Amber - Darker version of primary
  
  // Secondary Colors - Earth Tones
  secondary: '#D2B48C', // Tan - Background elements, cards, subtle highlights
  secondaryLight: '#E8D0B0', // Light Tan - Lighter version of secondary
  secondaryDark: '#B69B7B', // Dark Tan - Darker version of secondary
  
  // Accent Colors
  accent: '#FF8C42', // Bright Orange - Highlights, accents (from Zenni's robe)
  accentLight: '#FFAB76', // Light Orange - Lighter version of accent
  accentDark: '#DA6B20', // Deep Orange - Darker version of accent
  
  // Tertiary Colors
  tertiary: '#8B4513', // SaddleBrown - For outlines and borders (from Zenni's outline)
  tertiaryLight: '#A86642', // Lighter Brown
  tertiaryDark: '#723A10', // Darker Brown
  
  // Background and Text Colors
  background: '#FFF8E1', // Very Light Cream - Main screen backgrounds (warm, gentle)
  backgroundDark: '#F5EBD1', // Cream - Darker version of background
  backgroundLight: '#FFFDF5', // Off-White - Lighter version of background
  
  // Text Colors
  text: '#5D4037', // Brown - Primary text color (warm brown like Zenni's outline)
  textSecondary: '#8D6E63', // Light Brown - Secondary text, disabled states
  textLight: '#A1887F', // Very Light Brown - For low-emphasis text
  textInverse: '#FFFFFF', // White - For text on dark backgrounds
  
  // Status Colors
  success: '#7CB342', // Olive Green - Success feedback (earth tone green)
  warning: '#FFB74D', // Light Orange - Feedback for attention needed
  error: '#E57373', // Light Red - Error states, important alerts
  info: '#90CAF9', // Light Blue - Informational messages
  
  // UI Element Colors
  border: '#D7CCC8', // Light Taupe - Borders
  borderDark: '#BCAAA4', // Taupe - Darker borders
  disabled: '#E0E0E0', // Light Gray - Disabled elements
  disabledText: '#9E9E9E', // Medium Gray - Disabled text
  
  // Neutral Colors - Earth Tone Variations
  neutralLight: '#FFF8E1', // Very Light Cream - Main screen backgrounds
  neutralMedium: '#D7CCC8', // Light Taupe - Placeholder text, disabled states
  neutralDark: '#5D4037', // Brown - Primary text color
  
  // Basic Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  semiTransparent: 'rgba(0, 0, 0, 0.2)',
  
  // Meditation-specific colors
  calmColor: '#A1C2BB', // Sage - For Calm meditation type
  focusColor: '#B48A76', // Mocha - For Focus meditation type
  sleepColor: '#8E7F97', // Lavender Gray - For Sleep meditation type
  
  // Gradients - provide the start and end colors (earth tones)
  gradientOrange: ['#FF8C42', '#FFAB76'],
  gradientBrown: ['#8B4513', '#A86642'],
};

export const FONTS = {
  // Font Families - From Frontend Guidelines
  primary: 'Poppins', // For Headings, button text, key UI elements
  secondary: 'Lato',  // For Body text, descriptions, input field text
  
  // Font Weights as strings for React Native - From Frontend Guidelines
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  
  // Font Sizes - Base Unit: 8px (Standard Spacing)
  tiny: 10,
  small: 12,
  base: 14,  // Renamed from medium to avoid confusion
  regular_size: 16, // Base font size
  large: 18,
  xlarge: 20,
  heading3: 22,
  heading2: 24,
  heading1: 28,
  huge: 36,
  
  // Additional font styles for component compatibility
  body: 'Lato',    // For backwards compatibility
  heading: 'Poppins', // For backwards compatibility
};

export const SPACING = {
  // Base Unit: 8px - From Frontend Guidelines
  // Standard Spacing Values
  baseUnit: 8,
  xxs: 2,
  xs: 4,
  s: 8,    // 1 * baseUnit
  m: 16,   // 2 * baseUnit
  l: 24,   // 3 * baseUnit
  xl: 32,  // 4 * baseUnit
  xxl: 48, // 6 * baseUnit
  
  // Common UI Spacing
  screenHorizontal: 16,  // Side padding for screens
  screenVertical: 24,    // Top/bottom padding for screens
  cardPadding: 16,       // Internal card padding
  buttonPadding: 16,     // As per guidelines (horizontal)
  inputPadding: 14,
  elementGap: 16,        // Space between components
  gutters: 16,           // Space between cards
  
  // Legacy support
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

export const SIZES = {
  // Border Radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  borderRadius: 8, // Default border radius
  
  // Full dimensions for layouts
  full: '100%' as const,
  fullWidth: '100%' as const,
  fullHeight: '100%' as const,
  
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
  
  // Other common sizes
  small: 8,
  medium: 16,
  large: 24,
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