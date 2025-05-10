import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { playSoundById } from '../services/audio';

// Define a type for the variant config
interface ToastVariantConfig {
    type?: 'success' | 'error' | 'info'; // Optional type
    text1: string;
    text2: string;
}

const toastVariants: Record<string, ToastVariantConfig> = { // Add index signature
  nerdFact: {
    type: 'info', // Add default type
    text1: 'Nerd Fact',
    text2: 'Meditation increases gray matter in your brain! 🧠',
  },
  spiritualQuote: {
    type: 'info',
    text1: 'Spiritual Quote',
    text2: '“Quiet the mind, and the soul will speak.” – Ma Jaya Sati Bhagavati',
  },
  storyLore: {
    type: 'info',
    text1: 'Zen Lore',
    text2: 'Long ago, the Mini Zenni learned to calm the monkey mind…',
  },
  firstReward: {
      type: 'success', 
      text1: "First one's free!",
      text2: 'You received a Nap Hoodie! Try it on later.',
  },
};

export function showToast(
  variant: keyof typeof toastVariants, 
  overrides?: { text1?: string; text2?: string } // Optional overrides object
) {
  const variantConfig = toastVariants[variant];
  if (!variantConfig) return; // Handle case where variant doesn't exist

  let soundId = 'pop'; // Default sound
  if (variantConfig.type === 'error') {
    soundId = 'alert';
  } else if (variantConfig.type === 'success') {
    soundId = 'generic_win';
  }
  playSoundById(soundId);

  Toast.show({
    type: variantConfig.type ?? 'info', // Use nullish coalescing for default
    text1: overrides?.text1 ?? variantConfig.text1, // Use override or default
    text2: overrides?.text2 ?? variantConfig.text2, // Use override or default
    position: 'bottom', 
    visibilityTime: 4000,
    autoHide: true,
  });
}

export const ToastProvider = () => <Toast config={{}} />; 