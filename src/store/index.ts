import { create } from "zustand";
import { save, load } from "../lib/persist";
import * as Device from 'expo-device';
import { syncUserDoc } from '../firebase';
import { auth } from '../firebase';

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
  lowPowerMode: boolean;
  detectLowPowerMode: () => Promise<void>;
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
  lowPowerMode: false,
  detectLowPowerMode: async () => {},
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
  detectLowPowerMode: async () => {
    try {
      const totalMemory = await Device.getMaxMemoryAsync();
      const brand = Device.brand?.toLowerCase() || '';
      // 3GB = 3 * 1024 * 1024 * 1024 bytes
      const isLowMemory = totalMemory && totalMemory < 3 * 1024 * 1024 * 1024;
      const isSlowBrand = ['alcatel', 'zte', 'tecno', 'infinix', 'itel'].some(b => brand.includes(b));
      if (isLowMemory || isSlowBrand) {
        set({ lowPowerMode: true });
      } else {
        set({ lowPowerMode: false });
      }
    } catch (e) {
      set({ lowPowerMode: false });
    }
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
  timeout = setTimeout(async () => {
    save("gameStore", state);
    // Cloud backup: push to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await syncUserDoc(auth.currentUser.uid, state);
      } catch (e) {
        // Ignore Firestore errors for now
      }
    }
  }, 5000);
});
