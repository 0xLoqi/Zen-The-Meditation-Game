import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store';
import { COLORS } from '../../constants/theme';
import { cosmeticImages, defaultImage } from './cosmeticImages';

interface ItemCardProps {
  item: any;
  onPress: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  const tokens = useGameStore((s) => s.progress.tokens);
  const owned = false; // TODO: check if owned
  const disabled = owned || tokens < item.price;

  // Try to resolve the cosmetic image path
  let cosmeticImage;
  try {
    cosmeticImage = cosmeticImages[item.image] || defaultImage;
  } catch {
    cosmeticImage = null;
  }

  return (
    <TouchableOpacity style={[styles.card, disabled && styles.cardDisabled]} onPress={onPress} disabled={disabled}>
      <View style={styles.imageStack}>
        <Image source={defaultImage} style={styles.baseImage} />
        {cosmeticImage && <Image source={cosmeticImage} style={styles.cosmeticImage} />}
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.rarity}>{item.rarity}</Text>
      <Text style={styles.price}>{item.price} 💰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    margin: 8,
    width: 120,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  imageStack: {
    width: 64,
    height: 64,
    marginBottom: 8,
    position: 'relative',
  },
  baseImage: {
    width: 64,
    height: 64,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cosmeticImage: {
    width: 64,
    height: 64,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  name: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginBottom: 2 },
  rarity: { color: COLORS.accent, fontSize: 12, marginBottom: 2 },
  price: { color: COLORS.neutralMedium, fontSize: 12 },
});

export default ItemCard; 