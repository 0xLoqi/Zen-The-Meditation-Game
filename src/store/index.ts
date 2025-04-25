import { create } from "zustand";
import { save, load } from "../lib/persist";

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
export type GameStore = UserSlice & ProgressSlice & CosmeticSlice & {
  addXP: (amount: number) => void;
  incrementStreak: () => void;
};

const initialState: GameStore = {
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
  addXP: () => {},
  incrementStreak: () => {},
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  addXP: (amount: number) => {
    set((state) => ({
      progress: {
        ...state.progress,
        xp: state.progress.xp + amount,
        lastMeditatedAt: new Date().toISOString(),
      },
    }));
  },
  incrementStreak: () => {
    set((state) => ({
      progress: {
        ...state.progress,
        streak: state.progress.streak + 1,
        lastMeditatedAt: new Date().toISOString(),
      },
    }));
  },
}));

// Hydrate store on app launch
(async () => {
  const persisted = await load<GameStore>("gameStore");
  if (persisted) {
    useGameStore.setState(persisted);
  }
})();

// Debounced autosave
let timeout: NodeJS.Timeout | null = null;
useGameStore.subscribe((state) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    save("gameStore", state);
  }, 500);
});
