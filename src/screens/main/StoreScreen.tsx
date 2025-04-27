import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import cosmetics from '../../../assets/data/cosmetics.json';
import { COLORS } from '../../constants/theme';
import MiniZenni from '../../components/MiniZenni';
import { cosmeticImages } from '../../components/Store/cosmeticImages';
import TokenBalanceBar from '../../components/TokenBalanceBar';
import LootBagCard from '../../components/LootBagCard';

const MODULAR_CATEGORIES = ['outfit', 'headgear', 'aura', 'face', 'accessory', 'companion'];
const storeBg = require('../../../assets/images/backgrounds/store_background.png');
const paneBg = require('../../../assets/images/backgrounds/pane_background.png');
const lootBagImg = require('../../../assets/images/loot_bag.png');
const baseSilhouette = require('../../../assets/images/cosmetics/base/default_sillouhette.png');
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

// Helper to group cosmetics by category
function groupByCategory(items) {
  return items.reduce((acc, item) => {
    const cat = (item.category || 'other').toLowerCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}

const StoreScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [preview, setPreview] = useState<PreviewProps>({});
  // TODO: Replace with real values from store/user
  const tokens = 1234;
  const lootBagPrice = 500;
  const [lootModalVisible, setLootModalVisible] = useState(false);

  const grouped = groupByCategory(cosmetics);
  const CATEGORY_ORDER = ['outfit', 'headgear', 'face', 'accessory', 'aura', 'companion'];
  const CATEGORY_LABELS = {
    outfit: 'Outfits',
    headgear: 'Headgear',
    face: 'Faces',
    accessory: 'Accessories',
    aura: 'Auras',
    companion: 'Companions',
  };

  return (
    <ImageBackground source={storeBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.overlay, { paddingTop: insets.top, flex: 1 }]}>
          <View style={styles.topRightRow} pointerEvents="box-none">
            <Image source={lootBagImg} style={styles.lootBagIcon} />
            <Pressable style={styles.buyLootSmallBtn} onPress={() => {/* TODO: implement buy */}}>
              <Text style={styles.buyLootSmallBtnText}>Buy</Text>
            </Pressable>
            <TokenBalanceBar tokens={tokens} />
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.previewContainer}>
              <MiniZenni size="large" {...preview} />
            </View>
            {/* Render each category section */}
            {CATEGORY_ORDER.map(cat => (
              grouped[cat]?.length ? (
                <View key={cat} style={styles.section}>
                  <Text style={styles.sectionHeader}>{CATEGORY_LABELS[cat]}</Text>
                  <FlatList
                    data={grouped[cat]}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                      const imgKey = item.image?.replace(/^.*[\\/]/, '');
                      const imgSrc = cosmeticImages[imgKey];
                      const prop = getPreviewProps(item);
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
                            {item.category === 'aura' ? (
                              <View style={styles.cardVerticalContent}>
                                {/* Aura image at the very back */}
                                {imgSrc && (
                                  <Image source={imgSrc} style={[styles.cardImageAbsolute, { zIndex: 0 }]} resizeMode="contain" />
                                )}
                                {/* Silhouette always in front of aura */}
                                <Image source={baseSilhouette} style={[styles.cardImageAbsolute, { opacity: 0.18, zIndex: 1 }]} resizeMode="contain" />
                              </View>
                            ) : (
                              <View style={styles.cardVerticalContent}>
                                <View style={styles.cardImageContainer}>
                                  <Image source={baseSilhouette} style={[styles.cardImageAbsolute, { opacity: 0.18 }]} resizeMode="contain" />
                                  {imgSrc && (
                                    <Image source={imgSrc} style={styles.cardImageAbsolute} resizeMode="contain" />
                                  )}
                                </View>
                              </View>
                            )}
                            <Text style={styles.cardName}>{item.name}</Text>
                            <Text style={styles.cardPrice}>{item.price} 💰</Text>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : null
            ))}
          </ScrollView>
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
    top: 18,
    left: 18,
    zIndex: 50,
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
  cardVerticalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardImageContainer: {
    width: CARD_SIZE - 32,
    height: CARD_SIZE - 32,
    position: 'relative',
    marginBottom: 8,
  },
  cardImageAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cardName: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginBottom: 2, textAlign: 'center' },
  cardPrice: { color: COLORS.accent, fontSize: 12 },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  tokenBarWrapper: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 20,
  },
  buyLootBtn: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 28,
    marginTop: 60,
    marginBottom: 8,
    elevation: 2,
  },
  buyLootBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  closeModalBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  closeModalBtnText: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  topRightRow: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lootBagIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  buyLootSmallBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  buyLootSmallBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default StoreScreen; 