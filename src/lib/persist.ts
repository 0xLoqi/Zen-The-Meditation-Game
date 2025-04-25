import AsyncStorage from "@react-native-async-storage/async-storage";

export async function save<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("AsyncStorage save error:", e);
    throw e;
  }
}

export async function load<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (e) {
    console.error("AsyncStorage load error:", e);
    throw e;
  }
}
