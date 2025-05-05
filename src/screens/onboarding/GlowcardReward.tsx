import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { grantOnboardingReward } from '../../services/CosmeticsService';
import { showToast } from '../../components/Toasts';
import { NewOnboardingStackParamList } from '../../navigation/NewOnboardingNavigator';
import Haptic from 'react-native-haptic-feedback';

// Navigation Type
type GlowcardRewardScreenNavigationProp = StackNavigationProp<
  NewOnboardingStackParamList,
  'GlowcardReward'
>;

// Assets
const cardBack = require('../../../assets/images/UI/card_back.png');
const paneBackground = require('../../../assets/images/backgrounds/pane_background.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_COUNT = 4; // We have 4 cards

interface Props {
  navigation: GlowcardRewardScreenNavigationProp;
}

interface RevealedCosmetic {
  id: string;
  name: string;
  category: string;
  imageFilename: string;
}

// Helper to get image source based on cosmetic details
// NOTE: This requires knowing the structure of your assets folder
// Adjust paths as necessary
const getCosmeticImageSource = (cosmetic: RevealedCosmetic | null) => {
  if (!cosmetic) return null; // Or return a placeholder

  // Map category to subfolder
  const categoryFolderMap: Record<string, string> = {
    outfit: 'outfits',
    headgear: 'headgear',
    face: 'faces',
    companion: 'companions',
    aura: 'auras',
    accessory: 'accessories', // Corrected typo from folder structure? Check assets/images/cosmetics
    // Add other categories as needed
  };

  const folder = categoryFolderMap[cosmetic.category];
  if (!folder) {
    console.warn(`Unknown cosmetic category: ${cosmetic.category} for image ${cosmetic.imageFilename}`);
    return require('../../../assets/images/UI/card_back.png'); // Updated fallback image path
  }

  // Construct the path - IMPORTANT: Handle potential errors if file doesn't exist
  // This dynamic require is problematic. Let's create a static map instead.
  // We'll need to list potential onboarding rewards and their requires.

  // --- Alternative Approach: Static Mapping (More Robust) ---
  // This requires knowing the potential pool of onboarding rewards beforehand.
  // Let's assume for now common/rare outfits, headgear, faces might drop.
  const imageMap: Record<string, ReturnType<typeof require>> = {
    // Outfits (Common/Rare)
    'nap_hoodie.png': require('../../../assets/images/cosmetics/outfits/nap_hoodie.png'), // Updated path
    // Add other potential common/rare outfits here
    
    // Headgear (Common/Rare)
    'warm_beanie.png': require('../../../assets/images/cosmetics/headgear/warm_beanie.png'), // Updated path
    'leaf_crown.png': require('../../../assets/images/cosmetics/headgear/Leaf Crown.png'), // Updated path
    // Add others...

    // Faces (Common/Rare)
    'angry.png': require('../../../assets/images/cosmetics/faces/angry.png'), // Updated path
    'worried.png': require('../../../assets/images/cosmetics/faces/worried.png'), // Updated path
    'sad.png': require('../../../assets/images/cosmetics/faces/sad.png'), // Updated path
    'shook.png': require('../../../assets/images/cosmetics/faces/shook.png'), // Updated path
    'wink.png': require('../../../assets/images/cosmetics/faces/wink.png'), // Updated path
    // Add others...

    // *** ADD COMPANIONS HERE ***
    'cozy_owl.png': require('../../../assets/images/cosmetics/companions/cozy_owl.png'), // Updated path
    // Add other potential common/rare companions if they can drop
    // e.g., 'baby_echo.png': require('../../../assets/images/cosmetics/companions/baby_echo.png'),

    // *** ADD ACCESSORIES HERE *** (Corrected folder name based on your attachment)
    'whorled_staff.png': require('../../../assets/images/cosmetics/accesories/whorled_staff.png'), // Updated path
    'satchel_of_stillness.png': require('../../../assets/images/cosmetics/accesories/satchel_of_stillness.png'), // Updated path
    // Add others...

    // *** ADD AURAS HERE ***
    'auric_bloom.png': require('../../../assets/images/cosmetics/auras/auric_bloom.png'), // Updated path
    'verdant_halo.png': require('../../../assets/images/cosmetics/auras/verdant_halo.png'), // Updated path
     // Add others...
  };

  const imageSource = imageMap[cosmetic.imageFilename];
  if (!imageSource) {
      console.warn(`Image source not found in map for: ${cosmetic.imageFilename}`);
      return require('../../../assets/images/UI/card_back.png'); // Updated fallback image path
  }
  return imageSource;
};

const GlowcardReward: React.FC<Props> = ({ navigation }) => {
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  const [revealedCosmetic, setRevealedCosmetic] = useState<RevealedCosmetic | null>(null);
  const [isGranting, setIsGranting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false); // Track if reward is claimed

  // --- Animation Refs ---
  const flipAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const idleAnimation = useRef(new Animated.Value(0)).current;
  const idleLoop = useRef<Animated.CompositeAnimation | null>(null);
  // --- End Animation Refs ---

  // --- Idle Animation Effect ---
  useEffect(() => {
    idleLoop.current?.stop();
    idleLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnimation, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(idleAnimation, { toValue: 0, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    );
    idleLoop.current.start();
    return () => idleLoop.current?.stop();
  }, [idleAnimation]);
  // --- End Idle Animation Effect ---

  const handleCardPress = async (index: number) => {
    if (revealedCardIndex !== null || isGranting || isClaimed) return; // Prevent clicks after reveal/claim

    setIsGranting(true);
    setRevealedCardIndex(index);
    Haptic.trigger('impactLight'); // Add haptic feedback

    // Trigger flip animation
    Animated.timing(flipAnimations[index], {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    try {
      const cosmetic = await grantOnboardingReward();
      if (cosmetic) {
        setRevealedCosmetic({
          id: cosmetic.id,
          name: cosmetic.name,
          category: cosmetic.category,
          imageFilename: cosmetic.image,
        });
        setIsClaimed(true); // Mark as claimed
      } else {
        showToast('error', {
          text1: 'Uh oh!',
          text2: 'Something went wrong fetching your reward.',
        });
        // Optionally flip back on error?
        setRevealedCardIndex(null);
        Animated.timing(flipAnimations[index], { toValue: 0, duration: 300, useNativeDriver: true }).start();
      }
    } catch (error) {
      console.error('Error granting onboarding cosmetic:', error);
      showToast('error', {
        text1: 'Reward Error',
        text2: 'Could not grant reward.',
      });
      setRevealedCardIndex(null);
      Animated.timing(flipAnimations[index], { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } finally {
      setIsGranting(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate('FocusStoneTutorial');
  };

  // --- Card Render Logic ---
  const renderCard = (index: number) => {
    const flipInterpolate = flipAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    const backFlipInterpolate = flipAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    });

    const idleTranslateY = idleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -6]
    });

    const isRevealed = revealedCardIndex === index;
    const cardContent = revealedCosmetic; // The revealed cosmetic

    return (
      <TouchableOpacity
        key={index}
        style={styles.cardTouchable}
        onPress={() => handleCardPress(index)}
        disabled={revealedCardIndex !== null || isGranting || isClaimed}
        activeOpacity={0.8}
      >
          <Animated.View style={[styles.card, { transform: [{ translateY: isRevealed ? 0 : idleTranslateY }] }]}>
            {/* Card Back - Rotates from 0 to 180 */}
            <Animated.View
              style={[
                styles.cardFaceBase, styles.cardBackView,
                { transform: [{ rotateY: flipInterpolate }] },
              ]}
            >
              <Image source={cardBack} style={styles.cardBackImage} resizeMode="cover" />
            </Animated.View>

            {/* Card Front - Rotates from 180 to 360 */}
            <Animated.View
              style={[
                styles.cardFaceBase, styles.cardFrontView,
                { transform: [{ rotateY: backFlipInterpolate }] },
              ]}
            >
              {isRevealed && cardContent ? (
                <ImageBackground
                  source={paneBackground}
                  style={styles.pane}
                  resizeMode="cover"
                >
                  <View style={styles.rewardContainer}>
                    <Image
                      source={getCosmeticImageSource(cardContent)}
                      style={styles.rewardIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.rewardText} numberOfLines={2}>{cardContent.name}</Text>
                  </View>
                </ImageBackground>
              ) : (
                // Optional: Placeholder while loading/error, or keep empty
                <View style={styles.pane} /> // Empty pane if not revealed yet
              )}
            </Animated.View>
          </Animated.View>
      </TouchableOpacity>
    );
  }
  // --- End Card Render Logic ---

  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/pick_a_card_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
        <View style={styles.container}>
          <View style={styles.textPanel}>
            <Text style={styles.title}>Focus Stone Summoned!</Text>
            <Text style={styles.subtitle}>The stone reveals hidden potential... Choose wisely!</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardRow}>
                {renderCard(0)}
                {renderCard(1)}
            </View>
            <View style={styles.cardRow}>
                {renderCard(2)}
                {renderCard(3)}
            </View>
          </View>

          {isClaimed && (
            <Animated.View style={{ opacity: idleAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }}>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  textPanel: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 30,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  cardContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  cardTouchable: {
    // No specific style needed here now, handled by card style
  },
  card: {
    width: SCREEN_WIDTH * 0.38,
    height: (SCREEN_WIDTH * 0.38) * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFaceBase: { // Common style for front and back
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: 10,
      overflow: 'hidden',
  },
  cardBackView: {
      // Back is visible initially (rotateY 0)
  },
  cardFrontView: {
      // Front is hidden initially (rotateY 180)
  },
  cardBackImage: {
      width: '100%',
      height: '100%',
  },
  pane: { // Style for the ImageBackground pane
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden', // Clip content
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardContainer: { // Wrapper for revealed content
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: '100%',
    height: '100%',
  },
  rewardIcon: { // Renamed from rewardImage
    width: '70%',
    height: '60%',
  },
  rewardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    // Add text shadow for outline effect
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Black shadow
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
    // Add more shadows for a thicker outline if needed
    // textShadowOffset: { width: 1, height: -1 },
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowOffset: { width: 1, height: 1 },
  },
  rewardTextError: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 40,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GlowcardReward; 