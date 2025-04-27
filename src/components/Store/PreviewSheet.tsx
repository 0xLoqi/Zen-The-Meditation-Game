import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useGameStore } from '../../store';
import { grant } from '../../services/CosmeticsService';
import { cosmeticImages, defaultImage } from './cosmeticImages';

const BASE_IMAGE = require('../../../assets/images/cosmetics/base/default_base.png');

const PreviewSheet = ({ item, visible, onClose }: any) => {
  const tokens = useGameStore((s) => s.progress.tokens);
  const owned = useGameStore((s) => s.cosmetics.owned.includes(item?.id));
  // For demo, treat all as headgear if category is headgear, else outfit
  const equipped = useGameStore((s) => s.cosmetics.equipped[item?.category] === item?.id);
  const setTokens = useGameStore((s) => s => s.progress.tokens);
  const setEquipped = useGameStore((s) => s => s.cosmetics.equipped);

  if (!item) return null;
  let cosmeticImage;
  try {
    cosmeticImage = cosmeticImages[item.image] || defaultImage;
  } catch {
    cosmeticImage = null;
  }

  let buttonLabel = 'Buy';
  let buttonDisabled = false;
  if (owned) {
    if (equipped) {
      buttonLabel = 'Unequip';
    } else {
      buttonLabel = 'Equip';
    }
  } else if (tokens < item.price) {
    buttonLabel = `Need ${item.price - tokens}`;
    buttonDisabled = true;
  }

  const handleAction = () => {
    if (!owned && tokens >= item.price) {
      useGameStore.setState((state) => ({
        progress: { ...state.progress, tokens: state.progress.tokens - item.price },
      }));
      grant(item.id);
      ToastAndroid.show('Added to wardrobe!', ToastAndroid.SHORT);
      onClose();
    } else if (owned && !equipped) {
      useGameStore.setState((state) => ({
        cosmetics: {
          ...state.cosmetics,
          equipped: {
            ...state.cosmetics.equipped,
            [item.category]: item.id,
          },
        },
      }));
      ToastAndroid.show('Equipped!', ToastAndroid.SHORT);
      onClose();
    } else if (owned && equipped) {
      useGameStore.setState((state) => ({
        cosmetics: {
          ...state.cosmetics,
          equipped: {
            ...state.cosmetics.equipped,
            [item.category]: '',
          },
        },
      }));
      ToastAndroid.show('Unequipped!', ToastAndroid.SHORT);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.imageStack}>
            <Image source={BASE_IMAGE} style={styles.baseImage} />
            {cosmeticImage && <Image source={cosmeticImage} style={styles.cosmeticImage} />}
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rarity}>{item.rarity}</Text>
          <Text style={styles.price}>{item.price} 💰</Text>
          <TouchableOpacity style={[styles.button, buttonDisabled && { opacity: 0.5 }]} onPress={handleAction} disabled={buttonDisabled}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  sheet: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, alignItems: 'center', width: 300 },
  imageStack: { width: 96, height: 96, marginBottom: 12, position: 'relative' },
  baseImage: { width: 96, height: 96, position: 'absolute', top: 0, left: 0 },
  cosmeticImage: { width: 96, height: 96, position: 'absolute', top: 0, left: 0 },
  name: { fontWeight: 'bold', color: COLORS.primary, fontSize: 18, marginBottom: 4 },
  rarity: { color: COLORS.accent, fontSize: 14, marginBottom: 4 },
  price: { color: COLORS.neutralMedium, fontSize: 14, marginBottom: 12 },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 32, marginBottom: 8 },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  closeBtn: { marginTop: 8 },
  closeText: { color: COLORS.neutralMedium, fontSize: 14 },
});

export default PreviewSheet; 