// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  tokens: number;
  streak: number;
  lastMeditationDate: Date | null;
  equippedOutfit: OutfitId;
  unlockedOutfits: OutfitId[];
  referralCode: string;
  createdAt: Date;
}

// Daily Check-in
export interface DailyCheckIn {
  id: string;
  userId: string;
  rating: number;
  reflection: string;
  timestamp: Date;
}

// Meditation Types
export type MeditationType = 'Calm' | 'Focus' | 'Sleep';
export type MeditationDuration = 5 | 10;

// Meditation Session
export interface MeditationSession {
  id: string;
  userId: string;
  type: MeditationType;
  duration: MeditationDuration;
  breathScore: number;
  didUseBreathTracking: boolean;
  timestamp: Date;
}

// Outfits
export type OutfitId = 
  'default' | 
  'zen_master' | 
  'lotus' | 
  'cosmic' | 
  'nature_spirit' | 
  'meditation_guru';

export interface Outfit {
  id: OutfitId;
  name: string;
  description: string;
  requiredLevel: number;
  tokenCost: number | null; // null means not purchasable, only unlockable through level-up
  imagePath: string; // Path to the outfit's image asset
}

// Firebase Auth User
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}