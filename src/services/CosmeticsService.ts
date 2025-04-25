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
  if (rarity === 'legendary') {
    useGameStore.getState().unlockAchievement('first_legendary');
  }
  return drop;
} 