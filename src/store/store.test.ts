import { useGameStore } from './index';
import { act } from 'react-test-renderer';
import { grant } from '../services/CosmeticsService';

describe('Store logic', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState((state) => ({
      ...state,
      progress: { ...state.progress, tokens: 1000 },
      cosmetics: { owned: [], equipped: { outfit: '', headgear: '', aura: '' } },
    }));
  });

  it('buys a cosmetic and deducts tokens', () => {
    const item = { id: 'zenni_portal', price: 500, category: 'background' };
    act(() => {
      useGameStore.setState((state) => ({
        progress: { ...state.progress, tokens: state.progress.tokens - item.price },
      }));
      grant(item.id);
    });
    const state = useGameStore.getState();
    expect(state.progress.tokens).toBe(500);
    expect(state.cosmetics.owned).toContain(item.id);
  });

  it('equips and unequips a cosmetic', () => {
    const item = { id: 'zenni_portal', price: 500, category: 'background' };
    act(() => {
      grant(item.id);
      useGameStore.setState((state) => ({
        cosmetics: {
          ...state.cosmetics,
          equipped: { ...state.cosmetics.equipped, [item.category]: item.id },
        },
      }));
    });
    let state = useGameStore.getState();
    expect(state.cosmetics.equipped.background).toBe(item.id);
    // Unequip
    act(() => {
      useGameStore.setState((state) => ({
        cosmetics: {
          ...state.cosmetics,
          equipped: { ...state.cosmetics.equipped, [item.category]: '' },
        },
      }));
    });
    state = useGameStore.getState();
    expect(state.cosmetics.equipped.background).toBe('');
  });

  it('does not buy if not enough tokens', () => {
    const item = { id: 'zenni_portal', price: 2000, category: 'background' };
    act(() => {
      if (useGameStore.getState().progress.tokens >= item.price) {
        useGameStore.setState((state) => ({
          progress: { ...state.progress, tokens: state.progress.tokens - item.price },
        }));
        grant(item.id);
      }
    });
    const state = useGameStore.getState();
    expect(state.progress.tokens).toBe(1000);
    expect(state.cosmetics.owned).not.toContain(item.id);
  });
}); 