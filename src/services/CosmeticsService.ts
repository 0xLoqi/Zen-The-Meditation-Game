import cosmetics from '../../assets/data/cosmetics.json';
import { useGameStore } from '../store/index';

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

export function maybeDropGlowbag() {
  // Drop odds: Common 60%, Rare 25%, Epic 12%, Legendary 3%
  const odds = {
    common: 0.6,
    rare: 0.25,
    epic: 0.12,
    legendary: 0.03,
  };
  const roll = Math.random();
  let rarity = 'common';
  if (roll < odds.legendary) rarity = 'legendary';
  else if (roll < odds.legendary + odds.epic) rarity = 'epic';
  else if (roll < odds.legendary + odds.epic + odds.rare) rarity = 'rare';
  // else common
  const pool = (cosmetics as any[]).filter((item) => item.rarity === rarity);
  if (pool.length === 0) return null;
  const drop = pool[Math.floor(Math.random() * pool.length)];
  grant(drop.id);
  return drop;
} 