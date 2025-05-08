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
export async function playSoundById(id: string, options: { isLooping?: boolean, crossfade?: boolean, volume?: number } = {}) {
  const file = getAudioFileById(id);
  if (!file || !file.path) {
    console.warn(`Audio file not found in manifest for id: ${id}`);
    return;
  }
  if (currentId === id && options.isLooping && currentSound) return; // Already playing looping sound
  
  if (currentSound) {
    if (options.crossfade && currentId !== id) { // Crossfade only if different sound
      try {
        await currentSound.setStatusAsync({ volume: 0 });
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch (e) {
        console.warn('Error during crossfade unload:', e);
      }
    } else if (currentId !== id || !options.isLooping ) { // Stop if different sound or not looping this new one
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch (e) {
        console.warn('Error during stop/unload:', e);
      }
    }
    if (currentId !== id || !options.isLooping) {
        currentSound = null;
        currentId = null;
    }
  }

  if (id === 'silence') return;

  const source = audioImports[id];
  if (!source) {
    console.warn(`Audio source not found in imports for id: ${id}`);
    return;
  }

  let soundVolume = options.volume;
  if (soundVolume === undefined) { // Apply default volume logic if not specified
    if (id.startsWith('select')) {
      soundVolume = 0.25;
    } else {
      soundVolume = 1.0;
    }
  }

  try {
    const { sound } = await Audio.Sound.createAsync(source, { 
        isLooping: !!options.isLooping, 
        volume: soundVolume 
    });
    currentSound = sound;
    currentId = id;
    await sound.playAsync();
  } catch (e) {
    console.error(`Error playing sound ${id}:`, e);
  }
}

export async function stopSound() {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (e) {
        console.warn('Error stopping/unloading sound:', e);
    }
    currentSound = null;
    currentId = null;
  }
}

// For backwards compatibility, keep playAmbient as a wrapper
export async function playAmbient(id: string, crossfade = true) {
  return playSoundById(id, { isLooping: true, crossfade });
}

export async function stopAmbient() {
  return stopSound(); // Simply use the new stopSound
} 