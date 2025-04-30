import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Modal, Pressable, SectionList, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import cosmetics from '../../../assets/data/cosmetics.json';
import { COLORS } from '../../constants/theme';
import MiniZenni from '../../components/MiniZenni';
import { cosmeticImages } from '../../components/Store/cosmeticImages';
import TokenBalanceBar from '../../components/TokenBalanceBar';
import LootBagCard from '../../components/LootBagCard';
import { setUserData } from '../../firebase/user';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { Audio } from 'expo-av';

const MODULAR_CATEGORIES = ['outfit', 'headgear', 'aura', 'face', 'accessory', 'companion'];
const storeBg = require('../../../assets/images/backgrounds/store_background.png');
const paneBg = require('../../../assets/images/backgrounds/pane_background.png');
const lootBagImg = require('../../../assets/images/loot_bag.png');
const baseSilhouette = require('../../../assets/images/cosmetics/base/default_sillouhette.png');
const coinImg = require('../../../assets/images/coin.png');
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

// Helper to chunk an array into rows of n
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function mapPreviewToEquipped(preview) {
  return {
    outfit: preview.outfitId || '',
    headgear: preview.headgearId || '',
    aura: preview.auraId || '',
    face: preview.faceId || '',
    accessory: Array.isArray(preview.accessoryId)
      ? preview.accessoryId.join(',')
      : preview.accessoryId || '',
    companion: preview.companionId || '',
  };
}

async function equipCosmetics(preview) {
  try {
    const { user } = useAuthStore.getState();
    if (!user || !user.uid) throw new Error('Not signed in');
    const equipped = mapPreviewToEquipped(preview);
    await setUserData(user.uid, { cosmetics: { equipped } });
    useUserStore.getState().getUserData();
    // No UI logic here
  } catch (e) {
    Alert.alert('Error', e.message || 'Failed to equip cosmetics');
  }
}

const StoreScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userData = useUserStore((s) => s.userData);
  const equipped = userData?.cosmetics?.equipped || {};
  const [showToast, setShowToast] = useState(false);
  const [justEquipped, setJustEquipped] = useState(false);

  // Map equipped cosmetics to preview state
  function equippedToPreview(equipped) {
    return {
      outfitId: equipped.outfit || undefined,
      headgearId: equipped.headgear || undefined,
      auraId: equipped.aura || undefined,
      faceId: equipped.face || undefined,
      accessoryId: equipped.accessory ? equipped.accessory.split(',').filter(Boolean) : undefined,
      companionId: equipped.companion || undefined,
    };
  }

  const [preview, setPreview] = useState<PreviewProps>(() => equippedToPreview(equipped));
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
  const sections = CATEGORY_ORDER.map(cat => ({
    title: CATEGORY_LABELS[cat],
    // chunk into rows of 2 for grid
    data: chunkArray(grouped[cat] || [], 2),
    key: cat,
  })).filter(section => section.data.length > 0);

  // Helper: is the preview different from equipped?
  function isPreviewUnequipped() {
    if (!preview || Object.keys(preview).length === 0) return false;
    // Check each category
    return (
      (preview.outfitId && preview.outfitId !== equipped.outfit) ||
      (preview.headgearId && preview.headgearId !== equipped.headgear) ||
      (preview.auraId && preview.auraId !== equipped.aura) ||
      (preview.faceId && preview.faceId !== equipped.face) ||
      (preview.accessoryId && (
        Array.isArray(preview.accessoryId)
          ? preview.accessoryId.join(',') !== (equipped.accessory || '')
          : preview.accessoryId !== equipped.accessory
      )) ||
      (preview.companionId && preview.companionId !== equipped.companion)
    );
  }

  // --- Animation for shake and confetti ---
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiColors = ['#FFD580', '#FF8C42', '#7A5C00', '#fff', '#FF3B30', '#34C759'];
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 100, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 100, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
      ]).start();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const shakeAnimInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <ImageBackground source={storeBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.overlay, { paddingTop: insets.top, flex: 1 }]}>
          <View style={styles.topRightRow} pointerEvents="box-none">
            {/* Animated Loot Bag with Red Dot and Confetti */}
            <Animated.View style={{ position: 'relative', transform: [{ rotate: shakeAnimInterpolate }] }}>
              <Image source={lootBagImg} style={styles.lootBagIconLarge} />
              {/* Red Dot */}
              <View style={styles.redDot} />
              {/* Confetti (placeholder) */}
              {showConfetti && (
                <View style={styles.confettiContainer} pointerEvents="none">
                  {/* Simple confetti dots, can be replaced with Lottie or a confetti lib */}
                  {[...Array(12)].map((_, i) => (
                    <View key={i} style={[styles.confettiDot, { left: Math.random()*40+10, top: Math.random()*30, backgroundColor: confettiColors[i%confettiColors.length] }]} />
                  ))}
                </View>
              )}
            </Animated.View>
            <TokenBalanceBar tokens={tokens} />
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          {/* Main vertical layout: preview+equip, then scrollable list */}
          <View style={{ flex: 1 }}>
            <View style={styles.previewContainerFixed}>
              <MiniZenni size="large" {...preview} />
              {isPreviewUnequipped() && (
                <TouchableOpacity
                  style={[styles.equipButton, justEquipped && styles.equipButtonEquipped]}
                  onPress={async () => {
                    await equipCosmetics(preview);
                    // Play sound effect (swap silence.mp3 for your own sound file)
                    const { sound } = await Audio.Sound.createAsync(
                      require('../../../assets/audio/ambient/silence.mp3')
                    );
                    await sound.playAsync();
                    sound.setOnPlaybackStatusUpdate((status) => {
                      if (status.isLoaded && status.didJustFinish) {
                        sound.unloadAsync();
                      }
                    });
                    setJustEquipped(true);
                    setTimeout(() => setJustEquipped(false), 1500);
                  }}
                  activeOpacity={0.8}
                  disabled={justEquipped}
                >
                  {justEquipped ? (
                    <Text style={styles.equipButtonCheck}>✓</Text>
                  ) : (
                    <Text style={styles.equipButtonText}>Equip</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flex: 1, maxHeight: Dimensions.get('window').height / 2, marginTop: 8 }}>
              <SectionList
                sections={sections}
                keyExtractor={(_, idx) => String(idx)}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.sectionHeaderPill}>
                    <Text style={styles.sectionHeader}>{title}</Text>
                  </View>
                )}
                renderItem={({ item: row }) => (
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {row.map((item, colIdx) => {
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
                          key={item.id}
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
                                <View style={styles.cardImageContainer}>
                                  {/* Aura image at the very back */}
                                  {imgSrc && (
                                    <Image source={imgSrc} style={[styles.cardImageAbsolute, { zIndex: 0 }]} resizeMode="contain" />
                                  )}
                                  {/* Silhouette always in front of aura */}
                                  <Image source={baseSilhouette} style={[styles.cardImageAbsolute, { opacity: 0.18, zIndex: 1 }]} resizeMode="contain" />
                                </View>
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={styles.cardPrice}>{item.price}</Text>
                              <Image source={coinImg} style={{ width: 18, height: 18, marginLeft: 4 }} resizeMode="contain" />
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    })}
                    {/* If odd number of items, add a spacer to keep grid alignment */}
                    {row.length === 1 && <View style={[styles.card, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />}
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 32 }}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              />
            </View>
          </View>
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
  previewContainerFixed: {
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
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
    opacity: 1,
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
  cardPrice: { color: COLORS.accent, marginBottom: 20,fontSize: 14 },
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
    marginBottom: 0,
    marginLeft: 0,
    letterSpacing: 0.5,
  },
  sectionHeaderPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
    marginLeft: 8,
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
  equipButton: {
    marginTop: 16,
    backgroundColor: '#FF8C42',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    elevation: 2,
  },
  equipButtonDisabled: {
    backgroundColor: '#ccc',
  },
  equipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  equipButtonEquipped: {
    backgroundColor: '#3CB371', // green
  },
  equipButtonCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  lootBagIconLarge: {
    width: 48,
    height: 48,
    marginRight: 6,
  },
  redDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  confettiContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 60,
    height: 40,
    zIndex: 3,
    pointerEvents: 'none',
  },
  confettiDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.85,
  },
});

export default StoreScreen; 