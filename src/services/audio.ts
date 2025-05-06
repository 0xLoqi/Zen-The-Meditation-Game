import { Audio } from 'expo-av';
import { audioManifest, AudioCategory, AudioFile } from '../constants/audioManifest';
import { audioImports } from '../constants/audioImports';

// Helper: get audio file by id
export function getAudioFileById(id: string): AudioFile | undefined {
  return audioManifest.find(f => f.id === id);
}

// Helper: get all audio files by category
export function getAudioFilesByCategory(category: AudioCategory): AudioFile[] {
  return audioManifest.filter(f => f.category === category);
}

let currentSound: Audio.Sound | null = null;
let currentId: string | null = null;

// Play any sound by id (ambient/music/UI)
export async function playSoundById(id: string, options: { isLooping?: boolean, crossfade?: boolean } = {}) {
  const file = getAudioFileById(id);
  if (!file || !file.path) return;
  if (currentId === id && options.isLooping) return; // Already playing
  if (currentSound) {
    if (options.crossfade) {
      await currentSound.setStatusAsync({ volume: 0 });
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } else {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    }
    currentSound = null;
    currentId = null;
  }
  // Silence is a special case
  if (id === 'silence') return;
  // Replace dynamic require with static lookup
  const source = audioImports[id];
  if (!source) return;
  const { sound } = await Audio.Sound.createAsync(source, { isLooping: !!options.isLooping, volume: 1 });
  currentSound = sound;
  currentId = id;
  await sound.playAsync();
}

export async function stopSound() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
    currentId = null;
  }
}

// For backwards compatibility, keep playAmbient as a wrapper
export async function playAmbient(id: string, crossfade = true) {
  return playSoundById(id, { isLooping: true, crossfade });
}

export async function stopAmbient() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
    currentId = null;
  }
} 