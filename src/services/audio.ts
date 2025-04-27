import { Audio } from 'expo-av';

const SOUND_FILES = {
  rain: require('../../assets/audio/ambient/rain.mp3'),
  waves: require('../../assets/audio/ambient/waves.mp3'),
  silence: null, // Special case: no sound
};

let currentSound: Audio.Sound | null = null;
let currentId: string | null = null;

export async function playAmbient(id: 'rain' | 'waves' | 'silence', crossfade = true) {
  if (currentId === id) return; // Already playing
  if (currentSound) {
    if (crossfade) {
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
  if (id === 'silence') return;
  const { sound } = await Audio.Sound.createAsync(SOUND_FILES[id], { isLooping: true, volume: 1 });
  currentSound = sound;
  currentId = id;
  await sound.playAsync();
}

export async function stopAmbient() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
    currentId = null;
  }
} 