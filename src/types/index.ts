// User profile definition
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

// Daily mood check-in
export interface DailyCheckIn {
  id: string;
  userId: string;
  rating: number;
  reflection: string;
  timestamp: Date;
}

// Meditation types and durations
export type MeditationType = 'Calm' | 'Focus' | 'Sleep';
export type MeditationDuration = 5 | 10;

// Meditation session record
export interface MeditationSession {
  id: string;
  userId: string;
  type: MeditationType;
  duration: MeditationDuration;
  breathScore: number;
  didUseBreathTracking: boolean;
  timestamp: Date;
}

// Available outfit types for the Zenni character
export type OutfitId = 
  'default' | 
  'zen_master' | 
  'lotus' | 
  'cosmic' | 
  'nature_spirit' | 
  'meditation_guru';

// Outfit definition
export interface Outfit {
  id: OutfitId;
  name: string;
  description: string;
  requiredLevel: number;
  tokenCost: number | null; // null means not purchasable, only unlockable through level-up
  imagePath: string; // Path to the outfit's image asset
}

// Firebase authentication user
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}