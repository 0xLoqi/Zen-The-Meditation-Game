jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-haptic-feedback', () => ({ trigger: jest.fn() }));
jest.mock('react-native-confetti-cannon', () => 'ConfettiCannon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), notificationAsync: jest.fn() }));
