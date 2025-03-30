declare module 'theme' {
  export interface Colors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    tertiary: string;
    tertiaryLight: string;
    tertiaryDark: string;
    background: string;
    backgroundDark: string;
    backgroundLight: string;
    text: string;
    textSecondary: string;
    textLight: string;
    textInverse: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    borderDark: string;
    disabled: string;
    disabledText: string;
    neutralLight: string;
    neutralMedium: string;
    neutralDark: string;
    white: string;
    black: string;
    transparent: string;
    semiTransparent: string;
    calmColor: string;
    focusColor: string;
    sleepColor: string;
    gradientOrange: string[];
    gradientBrown: string[];
  }

  export interface Fonts {
    primary: string;
    secondary: string;
    regular: '400';
    medium: '500';
    semiBold: '600';
    bold: '700';
    tiny: number;
    small: number;
    base: number;
    regular_size: number;
    large: number;
    xlarge: number;
    heading3: number;
    heading2: number;
    heading1: number;
    huge: number;
    body: {
      regular: any;
      medium: any;
      semibold: any;
      bold: any;
    };
    heading: {
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
    };
  }

  export interface Spacing {
    baseUnit: number;
    xxs: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
    xxxl: number;
    screenHorizontal: number;
    screenVertical: number;
    cardPadding: number;
    buttonPadding: number;
    inputPadding: number;
    elementGap: number;
    gutters: number;
    tiny: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    xxlarge: number;
  }

  export interface Sizes {
    radiusSmall: number;
    radiusMedium: number;
    radiusLarge: number;
    borderRadius: {
      small: number;
      medium: number;
      large: number;
      circle: number;
    };
    full: '100%';
    fullWidth: '100%';
    fullHeight: '100%';
    iconSmall: number;
    iconMedium: number;
    iconLarge: number;
    buttonSmallHeight: number;
    buttonMediumHeight: number;
    buttonLargeHeight: number;
    inputHeight: number;
    headerHeight: number;
    avatarSmall: number;
    avatarMedium: number;
    avatarLarge: number;
    small: number;
    medium: number;
    large: number;
  }

  export interface Shadows {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    large: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    light: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    dark: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  }
} 