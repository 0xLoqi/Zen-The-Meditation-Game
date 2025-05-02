// User Types
export type OutfitId = string;

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface User {
  uid: string;
  id?: string; // Adding for compatibility with existing code
  username: string;
  email: string | null;
  xp: number;
  level: number;
  tokens: number;
  streak: number;
  lastMeditationDate: string | Date | null;
  outfits: OutfitId[];
  equippedOutfit: OutfitId;
  createdAt: string | Date;
  referralCode?: string; // Adding for compatibility
  cosmetics?: {
    equipped: {
      outfit?: string;
      headgear?: string;
      aura?: string;
      face?: string;
      accessory?: string;
      companion?: string;
    };
  };
}

// Meditation Types
export type MeditationType = 'focus' | 'calm' | 'sleep' | 'loving-kindness' | 'gratitude' | 'energizing';
export type MeditationDuration = 1 | 3 | 5 | 10 | 15 | 20 | 30;

export interface MeditationResult {
  xpGained: number;
  tokensEarned: number;
  streakUpdated: number;
  leveledUp: boolean;
}

// Check-in Types
export interface DailyCheckIn {
  id?: string; // Adding for compatibility with existing code
  userId?: string; // Adding for compatibility
  date: string | Date;
  rating: number;
  reflection?: string;
  timestamp?: Date; // Adding for compatibility
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