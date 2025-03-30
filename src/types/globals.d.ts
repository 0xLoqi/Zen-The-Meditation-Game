// Global NodeJS type definitions
declare namespace NodeJS {
  interface Global {
    HermesInternal: null | {};
  }
  
  interface Process {
    env: {
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: string | undefined;
    };
  }
  
  interface Timeout {
    ref(): Timeout;
    unref(): Timeout;
    refresh(): Timeout;
    hasRef(): boolean;
  }
}

// Augment existing React Native modules
declare module 'react-native' {
  // Add any missing React Native types here
  interface ViewStyle {
    shadowColor?: string;
    shadowOffset?: {
      width: number;
      height: number;
    };
    shadowOpacity?: number;
    shadowRadius?: number;
  }
}

// Avoid TypeScript error with style props spreading
interface CustomStyleAttrInterface extends React.CSSProperties {
  [key: string]: any;
} 