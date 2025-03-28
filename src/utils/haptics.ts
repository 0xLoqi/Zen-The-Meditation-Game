import * as Haptics from 'expo-haptics';

/**
 * Available haptic feedback types
 */
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Trigger haptic feedback based on the specified type
 * @param type - Type of haptic feedback to trigger
 */
export const triggerHapticFeedback = async (type: HapticType = 'light'): Promise<void> => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Trigger a sequence of haptic feedback
 * @param types - Array of haptic types to trigger in sequence
 * @param interval - Time between haptic feedback in milliseconds
 */
export const triggerHapticSequence = async (types: HapticType[], interval: number = 150): Promise<void> => {
  try {
    for (let i = 0; i < types.length; i++) {
      await triggerHapticFeedback(types[i]);
      
      if (i < types.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }
  } catch (error) {
    console.log('Haptic sequence not available:', error);
  }
};

/**
 * Trigger breath guidance haptic feedback
 * @param isInhaling - Whether the user is inhaling
 */
export const triggerBreathHaptic = (isInhaling: boolean): void => {
  if (isInhaling) {
    // Light feedback for inhale start
    triggerHapticFeedback('light');
  } else {
    // Medium feedback for exhale start
    triggerHapticFeedback('medium');
  }
};

/**
 * Trigger level up celebration haptic feedback
 */
export const triggerLevelUpHaptic = async (): Promise<void> => {
  await triggerHapticSequence(['light', 'medium', 'heavy', 'success']);
};

/**
 * Check if haptic feedback is available on the device
 * @returns Promise that resolves to true if haptic feedback is available
 */
export const isHapticAvailable = async (): Promise<boolean> => {
  try {
    // Try to trigger a silent haptic to check availability
    await Haptics.selectionAsync();
    return true;
  } catch (error) {
    return false;
  }
};