import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const lootBagImg = require('../../assets/images/loot_bag.png');
const coinIcon = require('../../assets/images/coin.png');

export default function LootBagCard({ price, onBuy }: { price: number; onBuy: () => void }) {
  return (
    <View style={styles.container}>
      <Image source={lootBagImg} style={styles.image} />
      <View style={styles.infoRow}>
        <Image source={coinIcon} style={styles.coin} />
        <Text style={styles.price}>{price}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onBuy} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Buy Loot Bag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    padding: 18,
    marginVertical: 16,
    alignSelf: 'center',
    width: 220,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  coin: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
}); 