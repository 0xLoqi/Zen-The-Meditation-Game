import { create } from "zustand";
import { save, load } from "../lib/persist";
import * as Device from 'expo-device';
import { syncUserDoc } from '../firebase';
import { auth, db } from '../firebase';
import questsData from '../../assets/data/quests.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';

// Friend type
export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  xp?: number;
  streak?: number;
  level?: number;
  cosmetics?: any;
}

// User slice interface
interface UserSlice {
  user: {
    name: string;
    element: string;
    trait: string;
    email?: string;
    motivation?: string;
  };
  friends: Friend[];
}

// Progress slice interface
interface ProgressSlice {
  progress: {
    streak: number;
    xp: number;
    lastMeditatedAt: string;
    tokens: number;
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
      face: string;
      accessory: string;
      companion: string;
    };
  };
}

// Achievements slice interface
interface AchievementsSlice {
  achievements: {
    unlocked: string[];
  };
}

// Quests slice interface
interface QuestsSlice {
  quests: {
    dailyQuests: { id: string; name: string; description: string; icon: string }[];
    progress: { [id: string]: boolean };
    lastReset: string; // ISO date string
  };
  resetQuests: () => void;
  completeQuest: (id: string) => void;
}

// Combined store type
export type GameStore = UserSlice & ProgressSlice & CosmeticSlice & AchievementsSlice & QuestsSlice & {
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  lowPowerMode: boolean;
  detectLowPowerMode: () => Promise<void>;
  unlockAchievement: (id: string) => void;
  firstMeditationRewarded: boolean;
  setFirstMeditationRewarded: (rewarded: boolean) => void;
};

const initialState: GameStore = {
  user: {
    name: "",
    element: "",
    trait: "",
    email: "",
    motivation: "",
  },
  friends: [
    { id: '1', name: 'Alex', xp: 1200, streak: 7 },
    { id: '2', name: 'Sam', xp: 900, streak: 3 },
  ],
  progress: {
    streak: 0,
    xp: 0,
    lastMeditatedAt: "",
    tokens: 0,
  },
  cosmetics: {
    owned: [],
    equipped: {
      outfit: "",
      headgear: "",
      aura: "",
      face: "",
      accessory: "",
      companion: "",
    },
  },
  achievements: {
    unlocked: [
      'first_meditation',
      'seven_day_streak',
      'first_legendary',
    ],
  },
  quests: {
    dailyQuests: [],
    progress: {},
    lastReset: '',
  },
  addXP: () => {},
  incrementStreak: () => {},
  lowPowerMode: false,
  detectLowPowerMode: async () => {},
  unlockAchievement: () => {},
  resetQuests: () => {},
  completeQuest: () => {},
  firstMeditationRewarded: false,
  setFirstMeditationRewarded: () => {},
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  addXP: (amount: number) => {
    set((state) => {
      const newXP = state.progress.xp + amount;
      const newLastMeditatedAt = new Date().toISOString();
      // Quest: meditate_5
      let newQuests = state.quests;
      if (amount >= 300 && !state.quests.progress['meditate_5']) {
        newQuests = {
          ...state.quests,
          progress: {
            ...state.quests.progress,
            meditate_5: true,
          },
        };
      }
      return {
      progress: {
        ...state.progress,
          xp: newXP,
          lastMeditatedAt: newLastMeditatedAt,
      },
        quests: newQuests,
      };
    });
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
  unlockAchievement: (id: string) => {
    set((state) => {
      if (state.achievements.unlocked.includes(id)) return state;
      return {
        achievements: {
          ...state.achievements,
          unlocked: [...state.achievements.unlocked, id],
        },
      };
    });
  },
  resetQuests: () => {
    console.log('[resetQuests] Called. Resetting daily quests.');
    // Set new dailyQuests, reset progress, update lastReset
    set({
      quests: {
        dailyQuests: questsData,
        progress: {},
        lastReset: new Date().toISOString(),
      },
    });
  },
  completeQuest: (id: string) => {
    set((state) => {
      const newProgress = {
        ...state.quests.progress,
        [id]: true,
      };
      let bonusXP = 0;
      let bonusGlowbag = false;
      // If all quests complete, grant bonus
      const allComplete = Object.keys(state.quests.dailyQuests).length > 0 &&
        state.quests.dailyQuests.every((q) => newProgress[q.id]);
      if (allComplete) {
        bonusXP = 50;
        bonusGlowbag = true;
      }
      return {
        quests: {
          ...state.quests,
          progress: newProgress,
        },
        progress: {
          ...state.progress,
          xp: state.progress.xp + bonusXP,
        },
        cosmetics: bonusGlowbag
          ? {
              ...state.cosmetics,
              owned: state.cosmetics.owned.includes('glowbag_rare')
                ? state.cosmetics.owned
                : [...state.cosmetics.owned, 'glowbag_rare'],
            }
          : state.cosmetics,
      };
    });
  },
  firstMeditationRewarded: false,
  setFirstMeditationRewarded: (rewarded: boolean) => set({ firstMeditationRewarded: rewarded }),
}));

// Utility: Only keep serializable data for Firestore
function getSerializableGameStore(state) {
  return {
    user: state.user,
    friends: state.friends,
    progress: state.progress,
    cosmetics: state.cosmetics,
    achievements: state.achievements,
    quests: state.quests,
    firstMeditationRewarded: state.firstMeditationRewarded,
    lowPowerMode: state.lowPowerMode,
    // Add any other fields here, but DO NOT include functions
  };
}

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
        await syncUserDoc(auth.currentUser.uid, getSerializableGameStore(state));
      } catch (e) {
        // Ignore Firestore errors for now
      }
    }
  }, 5000);
});

// Fetch friends from Firestore by ID, including cosmetics
export async function fetchAndSetFriendsFromFirestore(friendIds: string[]) {
  const fetchedFriends: Friend[] = [];
  for (const id of friendIds) {
    try {
      const docRef = doc(db, 'users', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        fetchedFriends.push({
          id,
          name: data.name,
          xp: data.xp,
          level: data.level,
          streak: data.streak || 0,
          cosmetics: data.cosmetics,
        });
      }
    } catch (err) {
      // Ignore Firestore errors for now
    }
  }
  useGameStore.setState({ friends: fetchedFriends });
}

export const resetGameStore = () => {
  useGameStore.setState({ ...initialState });
};
