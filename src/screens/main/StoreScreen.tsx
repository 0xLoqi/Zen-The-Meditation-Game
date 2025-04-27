import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import cosmetics from '../../../assets/data/cosmetics.json';
import { COLORS } from '../../constants/theme';
import MiniZenni from '../../components/MiniZenni';
import { cosmeticImages } from '../../components/Store/cosmeticImages';

const MODULAR_CATEGORIES = ['outfit', 'headgear', 'aura', 'face', 'accessory', 'companion'];
const storeBg = require('../../../assets/images/backgrounds/store_background.png');
const paneBg = require('../../../assets/images/backgrounds/pane_background.png');
const CARD_SIZE = Math.floor((Dimensions.get('window').width - 48) / 2);

function getPreviewProps(item) {
  if (!item) return {};
  const category = (item.category || '').toLowerCase();
  const id = item.id;
  switch (category) {
    case 'outfit': return { outfitId: id };
    case 'headgear': return { headgearId: id };
    case 'aura': return { auraId: id };
    case 'face': return { faceId: id };
    case 'accessory': return { accessoryId: id };
    case 'companion': return { companionId: id };
    default: return {};
  }
}

const StoreScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [preview, setPreview] = useState({});

  return (
    <ImageBackground source={storeBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.previewContainer}>
            <MiniZenni size="large" {...preview} />
          </View>
          <FlatList
            data={cosmetics}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const imgKey = item.image?.replace(/^.*[\\/]/, '');
              const imgSrc = cosmeticImages[imgKey];
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setPreview(getPreviewProps(item))}
                  activeOpacity={0.8}
                >
                  <ImageBackground source={paneBg} style={styles.cardPaneBg} imageStyle={styles.cardPaneImg} resizeMode="stretch">
                    {imgSrc && (
                      <Image source={imgSrc} style={styles.cardImage} resizeMode="contain" />
                    )}
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{item.price} 💰</Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  previewContainer: { alignItems: 'center', marginBottom: 8 },
  list: { paddingBottom: 32 },
  card: {
    borderRadius: 16,
    alignItems: 'center',
    margin: 8,
    width: CARD_SIZE,
    padding: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  cardPaneBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardPaneImg: {
    borderRadius: 16,
    opacity: 0.85,
  },
  cardImage: { width: CARD_SIZE - 32, height: CARD_SIZE - 32, marginBottom: 8 },
  cardName: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginBottom: 2, textAlign: 'center' },
  cardPrice: { color: COLORS.accent, fontSize: 12 },
});

export default StoreScreen; 