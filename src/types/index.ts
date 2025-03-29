// User Types
export type OutfitId = string;

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface User {
  uid: string;
  username: string;
  email: string | null;
  xp: number;
  level: number;
  tokens: number;
  streak: number;
  lastMeditationDate: string | null;
  outfits: OutfitId[];
  equippedOutfit: OutfitId;
  createdAt: string;
}

// Meditation Types
export type MeditationType = 'focus' | 'calm' | 'loving-kindness' | 'gratitude' | 'energizing';
export type MeditationDuration = 1 | 3 | 5 | 10 | 15 | 20 | 30;

export interface MeditationResult {
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
}

// Check-in Types
export interface DailyCheckIn {
  date: string;
  rating: number;
  reflection?: string;
}

// Outfit System
export interface Outfit {
  id: OutfitId;
  name: string;
  description: string;
  category: 'basic' | 'premium' | 'seasonal' | 'achievement';
  price: number;
  requiredLevel: number;
  color: string;
  imageUrl?: string;
}