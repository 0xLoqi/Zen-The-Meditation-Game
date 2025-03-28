import { Outfit } from '../types';

// Collection of outfits for Mini Zenni
export const OUTFITS: Outfit[] = [
  {
    id: 'default',
    name: 'Classic Zenni',
    description: 'The timeless look of a meditation master in training.',
    requiredLevel: 1,
    tokenCost: null, // Default outfit, not purchasable
    imagePath: 'mini_zenni_default'
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Traditional robes worn by enlightened meditation teachers.',
    requiredLevel: 5,
    tokenCost: 100,
    imagePath: 'mini_zenni_zen_master'
  },
  {
    id: 'lotus',
    name: 'Lotus Bloom',
    description: 'Adorned with lotus flowers, symbolizing purity of mind.',
    requiredLevel: 10,
    tokenCost: 200,
    imagePath: 'mini_zenni_lotus'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Explorer',
    description: 'Journey through the universe of consciousness with this stellar outfit.',
    requiredLevel: 15,
    tokenCost: 300,
    imagePath: 'mini_zenni_cosmic'
  },
  {
    id: 'nature_spirit',
    name: 'Nature Spirit',
    description: 'Connect with the natural world in this earthy ensemble.',
    requiredLevel: 20,
    tokenCost: 400,
    imagePath: 'mini_zenni_nature_spirit'
  },
  {
    id: 'meditation_guru',
    name: 'Ultimate Guru',
    description: 'The pinnacle of meditation mastery, radiating wisdom and serenity.',
    requiredLevel: 25,
    tokenCost: 500,
    imagePath: 'mini_zenni_meditation_guru'
  },
];

// Get available outfits based on user level
export const getAvailableOutfits = (userLevel: number): Outfit[] => {
  return OUTFITS.filter(outfit => outfit.requiredLevel <= userLevel);
};

// Get outfit by ID
export const getOutfitById = (outfitId: string): Outfit | undefined => {
  return OUTFITS.find(outfit => outfit.id === outfitId);
};
