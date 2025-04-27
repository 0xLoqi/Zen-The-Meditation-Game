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
const PANE_SIZE = CARD_SIZE + 64;

// Define the shape of the preview state for cosmetics
type PreviewProps = {
  outfitId?: string;
  headgearId?: string;
  auraId?: string;
  faceId?: string;
  accessoryId?: string | string[];
  companionId?: string;
};

function getPreviewProps(item: any): PreviewProps {
  if (!item) return {};
  const category = (item.category || '').toLowerCase();
  // Use the image filename from data so it matches the mapping keys
  const imageKey = item.image;
  switch (category) {
    case 'outfit': return { outfitId: imageKey };
    case 'headgear': return { headgearId: imageKey };
    case 'aura': return { auraId: imageKey };
    case 'face': return { faceId: imageKey };
    case 'accessory': return { accessoryId: imageKey };
    case 'companion': return { companionId: imageKey };
    default: return {};
  }
}

const StoreScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  // Use typed state for preview so dynamic indexing is safe
  const [preview, setPreview] = useState<PreviewProps>({});

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
              const prop = getPreviewProps(item);
              // Cast key to the PreviewProps keys so TS recognizes it
              const key = Object.keys(prop)[0] as keyof PreviewProps;
              const value = prop[key]!;
              const isSelected = key === 'accessoryId'
                ? (Array.isArray(preview.accessoryId) 
                    ? preview.accessoryId.includes(value) 
                    : preview.accessoryId === value)
                : preview[key] === value;
              return (
                <TouchableOpacity
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => setPreview(prev => {
                    // Special handling for accessories: allow toggling up to 2
                    if (key === 'accessoryId') {
                      const curr = prev.accessoryId;
                      const arr = Array.isArray(curr) ? curr : curr ? [curr] : [];
                      if (arr.includes(value)) {
                        // remove
                        const newArr = arr.filter(v => v !== value);
                        return { ...prev, accessoryId: newArr.length > 1 ? newArr : newArr[0] };
                      } else if (arr.length < 2) {
                        // add
                        return { ...prev, accessoryId: [...arr, value] };
                      }
                      return prev;
                    }
                    // Default single-selection for other categories
                    if (prev[key] === value) {
                      const { [key]: _, ...rest } = prev;
                      return rest;
                    }
                    return { ...prev, [key]: value };
                  })}
                  activeOpacity={0.8}
                >
                  <ImageBackground
                    source={paneBg}
                    style={styles.cardPaneBg}
                    imageStyle={styles.cardPaneImg}
                    resizeMode="contain"
                  >
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
    width: PANE_SIZE,
    height: PANE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardPaneImg: {
    width: PANE_SIZE,
    height: PANE_SIZE,
    borderRadius: 16,
    opacity: 0.85,
  },
  cardImage: { width: CARD_SIZE - 32, height: CARD_SIZE - 32, marginBottom: 8 },
  cardName: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginBottom: 2, textAlign: 'center' },
  cardPrice: { color: COLORS.accent, fontSize: 12 },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export default StoreScreen; 