import { Outfit, OutfitId } from '../types';

// Collection of all available outfits for the MiniZenni character
export const OUTFITS: Outfit[] = [
  {
    id: 'default',
    name: 'Zen Novice',
    description: 'The default outfit for beginning your meditation journey.',
    requiredLevel: 1,
    tokenCost: null, // Not purchasable, automatically unlocked
    imagePath: '../../assets/outfits/default.png',
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Traditional robes worn by meditation masters.',
    requiredLevel: 5,
    tokenCost: 500,
    imagePath: '../../assets/outfits/zen_master.png',
  },
  {
    id: 'lotus',
    name: 'Lotus Bloom',
    description: 'Embody the serenity of a lotus flower.',
    requiredLevel: 10,
    tokenCost: 1000,
    imagePath: '../../assets/outfits/lotus.png',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Consciousness',
    description: 'Connect with the universe through this celestial outfit.',
    requiredLevel: 15,
    tokenCost: 2000,
    imagePath: '../../assets/outfits/cosmic.png',
  },
  {
    id: 'nature_spirit',
    name: 'Nature Spirit',
    description: 'Become one with nature and the elements.',
    requiredLevel: 20,
    tokenCost: 3000,
    imagePath: '../../assets/outfits/nature_spirit.png',
  },
  {
    id: 'meditation_guru',
    name: 'Meditation Guru',
    description: 'The ultimate outfit for those who have achieved meditation mastery.',
    requiredLevel: 25,
    tokenCost: null, // Not purchasable, automatically unlocked at level 25
    imagePath: '../../assets/outfits/meditation_guru.png',
  },
];

/**
 * Returns all outfits that should be visible to a user of the given level
 * This includes both unlocked outfits and outfits that can be purchased
 */
export const getAvailableOutfits = (userLevel: number): Outfit[] => {
  return OUTFITS.filter(outfit => outfit.requiredLevel <= userLevel);
};

/**
 * Find an outfit by its ID
 */
export const getOutfitById = (outfitId: string): Outfit | undefined => {
  return OUTFITS.find(outfit => outfit.id === outfitId);
};