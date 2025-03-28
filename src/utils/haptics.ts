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
    // Silently fail if haptics not available
    console.log('Haptic feedback not available');
  }
};

/**
 * Trigger a sequence of haptic feedback
 * @param types - Array of haptic types to trigger in sequence
 * @param interval - Time between haptic feedback in milliseconds
 */
export const triggerHapticSequence = async (types: HapticType[], interval: number = 150): Promise<void> => {
  for (const type of types) {
    await triggerHapticFeedback(type);
    
    if (types.indexOf(type) < types.length - 1) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

/**
 * Trigger breath guidance haptic feedback
 * @param isInhaling - Whether the user is inhaling
 */
export const triggerBreathHaptic = (isInhaling: boolean): void => {
  if (isInhaling) {
    // Increasing intensity for inhale
    triggerHapticFeedback('light');
  } else {
    // Decreasing intensity for exhale
    triggerHapticFeedback('light');
  }
};

/**
 * Trigger level up celebration haptic feedback
 */
export const triggerLevelUpHaptic = async (): Promise<void> => {
  await triggerHapticSequence(['medium', 'medium', 'success']);
};

/**
 * Check if haptic feedback is available on the device
 * @returns Promise that resolves to true if haptic feedback is available
 */
export const isHapticAvailable = async (): Promise<boolean> => {
  try {
    // Try to trigger a light impact
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    return true;
  } catch (error) {
    return false;
  }
};