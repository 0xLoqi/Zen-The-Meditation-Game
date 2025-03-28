export const COLORS = {
  // Primary Colors - From Frontend Guidelines
  primary: '#6A5ACD', // Medium Slate Blue - Buttons, active states, main brand color
  primaryLight: '#8A7BEC', // Lighter version of primary
  primaryDark: '#5A4ABD', // Darker version of primary
  
  // Secondary Colors
  secondary: '#F0E68C', // Khaki - Background elements, cards, subtle highlights
  secondaryLight: '#FFF8A9', // Lighter version of secondary
  secondaryDark: '#D1C66E', // Darker version of secondary
  
  // Accent Colors
  accent: '#FFD700', // Gold - Rewards icons (Tokens), XP bar fill, important highlights
  accentLight: '#FFE44D', // Lighter version of accent
  accentDark: '#CCAC00', // Darker version of accent
  
  // Background and Text Colors
  background: '#F5F5F5', // White Smoke - Main screen backgrounds
  backgroundDark: '#E0E0E0', // Darker version of background
  backgroundLight: '#FFFFFF', // Lighter version of background
  
  // Text Colors
  text: '#2F4F4F', // Dark Slate Gray - Primary text color, dark UI elements
  textSecondary: '#A9A9A9', // Dark Gray - Placeholder text, disabled states, secondary text
  textLight: '#CCCCCC', // Light Gray - For low-emphasis text, subtitles
  textInverse: '#FFFFFF', // White - For text on dark backgrounds
  
  // Status Colors
  success: '#90EE90', // Light Green - Streak visual, success messages/feedback
  warning: '#FFA07A', // Light Salmon - Feedback for attention needed
  error: '#FF6347', // Tomato - Error states, important alerts
  info: '#ADD8E6', // Light Blue - Informational messages
  
  // UI Element Colors
  border: '#E0E0E0',
  borderDark: '#BDBDBD',
  disabled: '#D3D3D3',
  disabledText: '#A9A9A9',
  
  // Neutral Colors - From Frontend Guidelines
  neutralLight: '#F5F5F5', // White Smoke - Main screen backgrounds
  neutralMedium: '#A9A9A9', // Dark Gray - Placeholder text, disabled states
  neutralDark: '#2F4F4F', // Dark Slate Gray - Primary text color
  
  // Basic Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  semiTransparent: 'rgba(0, 0, 0, 0.3)',
  
  // Gradients - provide the start and end colors
  gradientPurple: ['#6A5ACD', '#5A4ABD'],
  gradientGold: ['#FFD700', '#CCAC00'],
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