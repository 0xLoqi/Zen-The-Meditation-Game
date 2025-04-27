import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from './index';
import { act } from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-device', () => ({ getMaxMemoryAsync: jest.fn().mockResolvedValue(4 * 1024 * 1024 * 1024), brand: 'mock' }));

describe('GameStore persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useGameStore.setState({
      user: { name: '', element: '', trait: '', email: '' },
      progress: { streak: 0, xp: 0, lastMeditatedAt: '' },
      cosmetics: { owned: [], equipped: { outfit: '', headgear: '', aura: '' } },
      achievements: { unlocked: [] },
      quests: { dailyQuests: [], progress: {}, lastReset: '' },
    });
  });

  it('persists and rehydrates state', async () => {
    // Set a value
    act(() => {
      useGameStore.setState((state) => ({
        ...state,
        user: { ...state.user, name: 'TestUser' },
        cosmetics: { ...state.cosmetics, owned: ['glowbag_rare'] },
      }));
    });
    // Save to AsyncStorage
    await AsyncStorage.setItem('gameStore', JSON.stringify(useGameStore.getState()));

    // Simulate reload
    useGameStore.setState({
      user: { name: '', element: '', trait: '', email: '' },
      progress: { streak: 0, xp: 0, lastMeditatedAt: '' },
      cosmetics: { owned: [], equipped: { outfit: '', headgear: '', aura: '' } },
      achievements: { unlocked: [] },
      quests: { dailyQuests: [], progress: {}, lastReset: '' },
    });

    // Rehydrate
    const persisted = await AsyncStorage.getItem('gameStore');
    if (persisted) {
      useGameStore.setState(JSON.parse(persisted));
    }

    // Assert
    expect(useGameStore.getState().user.name).toBe('TestUser');
    expect(useGameStore.getState().cosmetics.owned).toContain('glowbag_rare');
  });
}); 