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
export type GameStore = UserSlice & ProgressSlice & CosmeticSlice;

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
};

export const useGameStore = create<GameStore>(() => ({ ...initialState }));

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
