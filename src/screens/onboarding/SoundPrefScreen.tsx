import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { Audio } from 'expo-av'; // Uncomment if using expo-av
import { useGameStore } from '../../store';
import ProgressDots from '../../components/ProgressDots';

const SOUND_PACKS = [
  { id: 'nature', name: 'Nature', image: require('../../../assets/images/sound_nature.png') },
  { id: 'ocean', name: 'Ocean', image: require('../../../assets/images/sound_ocean.png') },
  { id: 'rain', name: 'Rain', image: require('../../../assets/images/sound_rain.png') },
];

const SoundPrefScreen = ({ navigation, route }: any) => {
  const { step = 6, total = 9 } = route.params || {};
  const [selected, setSelected] = useState('nature');
  const setSoundPack = useGameStore((s) => s.setSoundPackId || (() => {}));

  // const playPreview = async (id: string) => {
  //   // Implement audio preview logic with expo-av
  // };

  const handleContinue = () => {
    setSoundPack(selected);
    navigation.navigate('Reminder', { ...route.params });
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>Choose your soundscape</Text>
        <View style={styles.cardsRow}>
          {SOUND_PACKS.map((pack) => (
            <TouchableOpacity
              key={pack.id}
              style={[styles.card, selected === pack.id && styles.cardActive]}
              onPress={() => setSelected(pack.id)}
              // onLongPress={() => playPreview(pack.id)}
            >
              <Image source={pack.image} style={styles.cardImage} />
              <Text style={[styles.cardText, selected === pack.id && styles.cardTextActive]}>{pack.name}</Text>
              {/* <Text style={styles.previewText}>Long press to preview</Text> */}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 24 },
  cardsRow: { flexDirection: 'row', marginBottom: 32 },
  card: { backgroundColor: '#eee', borderRadius: 16, padding: 16, margin: 8, alignItems: 'center' },
  cardActive: { backgroundColor: '#6C63FF' },
  cardImage: { width: 60, height: 60, marginBottom: 8 },
  cardText: { color: '#6C63FF', fontWeight: 'bold' },
  cardTextActive: { color: '#fff' },
  previewText: { fontSize: 12, color: '#888' },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default SoundPrefScreen; 