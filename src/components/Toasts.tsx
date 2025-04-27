import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastVariants = {
  nerdFact: {
    text1: 'Nerd Fact',
    text2: 'Meditation increases gray matter in your brain! 🧠',
  },
  spiritualQuote: {
    text1: 'Spiritual Quote',
    text2: '“Quiet the mind, and the soul will speak.” – Ma Jaya Sati Bhagavati',
  },
  storyLore: {
    text1: 'Zen Lore',
    text2: 'Long ago, the Mini Zenni learned to calm the monkey mind…',
  },
};

export function showToast(variant: keyof typeof toastVariants) {
  Toast.show({
    type: 'info',
    ...toastVariants[variant],
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
  });
}

export const ToastProvider = () => <Toast config={{}} />; 