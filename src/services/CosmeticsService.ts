import cosmetics from '../../assets/data/cosmetics.json';
import { useGameStore } from '../store/index';
import { getGlowbagConfig } from '../lib/remoteConfig';

export function getItem(id: string) {
  return (cosmetics as any[]).find((item) => item.id === id) || null;
}

export function grant(id: string) {
  const { cosmetics: ownedCosmetics } = useGameStore.getState();
  if (!ownedCosmetics.owned.includes(id)) {
    useGameStore.setState((state) => ({
      cosmetics: {
        ...state.cosmetics,
        owned: [...state.cosmetics.owned, id],
      },
    }));
  }
}

export async function maybeDropGlowbag() {
  const config = await getGlowbagConfig();
  const odds = config.odds || { common: 0.6, rare: 0.25, epic: 0.12, legendary: 0.03 };
  const vaulted = config.vaulted || [];
  const roll = Math.random();
  let rarity = 'common';
  if (roll < odds.legendary) rarity = 'legendary';
  else if (roll < odds.legendary + odds.epic) rarity = 'epic';
  else if (roll < odds.legendary + odds.epic + odds.rare) rarity = 'rare';
  // else common
  const pool = (cosmetics as any[]).filter((item) => item.rarity === rarity && !vaulted.includes(item.id));
  if (pool.length === 0) return null;
  const drop = pool[Math.floor(Math.random() * pool.length)];
  grant(drop.id);
  // Quest: open_glowbag
  if (!useGameStore.getState().quests.progress['open_glowbag']) {
    useGameStore.getState().completeQuest('open_glowbag');
  }
  if (rarity === 'legendary') {
    useGameStore.getState().unlockAchievement('first_legendary');
  }
  return drop;
}

// New function specifically for the guaranteed onboarding reward
export async function grantOnboardingReward(): Promise<{ id: string; name: string; category: string; image: string; } | null> {
  const config = await getGlowbagConfig();
  // Use default odds or fetched odds, but prioritize common/rare for guarantee
  const odds = config.odds || { common: 0.75, rare: 0.25, epic: 0.0, legendary: 0.0 }; // Prioritize common/rare for onboarding
  const vaulted = config.vaulted || [];
  
  let rarity = 'common'; // Default to common
  const roll = Math.random();

  // Determine rarity based on roll (simplified odds for onboarding)
  if (roll < odds.rare) { // Check rare first based on cumulative probability thinking
      rarity = 'rare';
  } // Otherwise stays common

  let pool = (cosmetics as any[]).filter((item) => 
    item.rarity === rarity && !vaulted.includes(item.id)
  );

  // If the chosen rarity pool is empty, default to common pool
  if (pool.length === 0) {
    console.log(`Onboarding reward: ${rarity} pool empty, defaulting to common.`);
    rarity = 'common';
    pool = (cosmetics as any[]).filter((item) => 
      item.rarity === rarity && !vaulted.includes(item.id)
    );
  }

  // If common pool is also empty (shouldn't happen with default data), return null
  if (pool.length === 0) {
    console.error('Onboarding reward: Common pool is empty! Cannot grant reward.');
    return null; 
  }

  // Select a random item from the chosen pool
  const drop = pool[Math.floor(Math.random() * pool.length)];
  
  // Grant the item using the existing grant function
  grant(drop.id); 

  console.log(`Onboarding reward granted: ${drop.name} (ID: ${drop.id}, Rarity: ${rarity})`);

  // Return the details of the granted cosmetic
  return {
    id: drop.id,
    name: drop.name,
    category: drop.category, 
    image: drop.image, // Return filename
  };
} 