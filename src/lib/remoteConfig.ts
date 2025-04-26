import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_URL = 'https://zen-the-meditation-game.web.app/glowbag-config.json';
const CACHE_KEY = 'glowbagConfig';
const CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds

export async function getGlowbagConfig(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() / 1000 - timestamp < CACHE_TTL) {
        return data;
      }
    }
  }
  // Fetch from remote
  const res = await fetch(CONFIG_URL);
  if (!res.ok) throw new Error('Failed to fetch glowbag config');
  const data = await res.json();
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() / 1000 }));
  return data;
} 