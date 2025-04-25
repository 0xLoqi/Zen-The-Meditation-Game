import { create } from "zustand";

// User slice interface
interface UserSlice {
  user: {
    name: string;
    element: string;
    trait: string;
    email?: string;
  };
}

// Progress slice interface
interface ProgressSlice {
  progress: {
    streak: number;
    xp: number;
    lastMeditatedAt: string;
  };
}

// Cosmetics slice interface
interface CosmeticSlice {
  cosmetics: {
    owned: string[];
    equipped: {
      outfit: string;
      headgear: string;
      aura: string;
    };
  };
}

// Combined store type
export type GameStore = UserSlice & ProgressSlice & CosmeticSlice;

export const useGameStore = create<GameStore>(() => ({
  user: {
    name: "",
    element: "",
    trait: "",
    email: "",
  },
  progress: {
    streak: 0,
    xp: 0,
    lastMeditatedAt: "",
  },
  cosmetics: {
    owned: [],
    equipped: {
      outfit: "",
      headgear: "",
      aura: "",
    },
  },
}));
