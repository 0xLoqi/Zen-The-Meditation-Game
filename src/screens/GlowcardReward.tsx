import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable'; // For simple animations
import { grantOnboardingReward } from '../services/CosmeticsService'; // Use the new onboarding reward function
import { showToast } from '../components/Toasts'; // Use existing toast system
import { NewOnboardingStackParamList } from '../navigation/NewOnboardingNavigator'; // Correct ParamList

// Navigation Type
type GlowcardRewardScreenNavigationProp = StackNavigationProp<
  NewOnboardingStackParamList, // Use the correct stack param list
  'GlowcardReward'
>;

// Assets (Using placeholders, replace with actual card assets if available)
const cardBack = require('../../assets/images/UI/card_back.png'); // Assuming you have a card back image

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  navigation: GlowcardRewardScreenNavigationProp;
}

// Define a type for the revealed cosmetic state
interface RevealedCosmetic {
  id: string;
  name: string;
  category: string;
  imageFilename: string; // Store the filename
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
    return require('../../assets/images/UI/card_back.png'); // Fallback image
  }

  // Construct the path - IMPORTANT: Handle potential errors if file doesn't exist
  // This dynamic require is problematic. Let's create a static map instead.
  // We'll need to list potential onboarding rewards and their requires.

  // --- Alternative Approach: Static Mapping (More Robust) ---
  // This requires knowing the potential pool of onboarding rewards beforehand.
  // Let's assume for now common/rare outfits, headgear, faces might drop.
  const imageMap: Record<string, ReturnType<typeof require>> = {
    // Outfits (Common/Rare)
    'nap_hoodie.png': require('../../assets/images/cosmetics/outfits/nap_hoodie.png'),
    // Add other potential common/rare outfits here
    
    // Headgear (Common/Rare)
    'warm_beanie.png': require('../../assets/images/cosmetics/headgear/warm_beanie.png'),
    'leaf_crown.png': require('../../assets/images/cosmetics/headgear/Leaf Crown.png'), // Watch out for case sensitivity/spaces
    // Add others...

    // Faces (Common/Rare)
    'angry.png': require('../../assets/images/cosmetics/faces/angry.png'),
    'worried.png': require('../../assets/images/cosmetics/faces/worried.png'),
    'sad.png': require('../../assets/images/cosmetics/faces/sad.png'),
    'shook.png': require('../../assets/images/cosmetics/faces/shook.png'),
    'wink.png': require('../../assets/images/cosmetics/faces/wink.png'),
    // Add others...

    // *** ADD COMPANIONS HERE ***
    'cozy_owl.png': require('../../assets/images/cosmetics/companions/cozy_owl.png'),
    // Add other potential common/rare companions if they can drop
    // e.g., 'baby_echo.png': require('../../assets/images/cosmetics/companions/baby_echo.png'),

    // *** ADD ACCESSORIES HERE *** (Corrected folder name based on your attachment)
    'whorled_staff.png': require('../../assets/images/cosmetics/accesories/whorled_staff.png'), // Note the 'accesories' typo folder
    'satchel_of_stillness.png': require('../../assets/images/cosmetics/accesories/satchel_of_stillness.png'),
    // Add others...

    // *** ADD AURAS HERE ***
    'auric_bloom.png': require('../../assets/images/cosmetics/auras/auric_bloom.png'),
    'verdant_halo.png': require('../../assets/images/cosmetics/auras/verdant_halo.png'),
     // Add others...
  };

  const imageSource = imageMap[cosmetic.imageFilename];
  if (!imageSource) {
      console.warn(`Image source not found in map for: ${cosmetic.imageFilename}`);
      return require('../../assets/images/UI/card_back.png'); // Fallback image
  }
  return imageSource;

  // --- Original Dynamic Path (Less Recommended) ---
  // const imagePath = `../../assets/images/cosmetics/${folder}/${cosmetic.imageFilename}`;
  // try {
  //   return require(imagePath); // This line won't work reliably due to Metro bundler limitations
  // } catch (error) {
  //   console.error(`Failed to require dynamic image path: ${imagePath}`, error);
  //   return require('../../assets/images/UI/card_back.png'); // Fallback
  // }
};

const GlowcardReward: React.FC<Props> = ({ navigation }) => {
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  // State to hold the details of the revealed cosmetic
  const [revealedCosmetic, setRevealedCosmetic] = useState<RevealedCosmetic | null>(null);
  const [isGranting, setIsGranting] = useState(false); // Prevent double taps

  const handleCardPress = async (index: number) => {
    if (revealedCardIndex !== null || isGranting) return; // Prevent multiple reveals or clicks while granting

    setIsGranting(true);
    setRevealedCardIndex(index); // Show reveal animation on the pressed card

    try {
      // Grant the specific cosmetic item using the new service function
      const cosmetic = await grantOnboardingReward();
      
      if (cosmetic) {
        setRevealedCosmetic({ // Store the details
            id: cosmetic.id,
            name: cosmetic.name,
            category: cosmetic.category,
            imageFilename: cosmetic.image, 
        }); 
        // Show dynamic toast
        showToast('firstReward', { 
          text1: "You received a gift!", // Override title
          text2: `You got: ${cosmetic.name}! Equip it later.` // Override message
        });
      } else {
        // Handle case where granting failed (e.g., empty pool error)
        showToast('error', { 
            text1: 'Uh oh!',
            text2: 'Something went wrong fetching your reward. Please try again later.'
        });
        setRevealedCardIndex(null); // Reset reveal
      }

    } catch (error) {
      console.error('Error granting onboarding cosmetic:', error);
      showToast('error', { 
        text1: 'Reward Error',
        text2: 'Could not grant reward. Please check connection.'
      });
      setRevealedCardIndex(null); // Reset reveal on error
    } finally {
        setIsGranting(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate('NameEntry');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Focus Stone Summoned!</Text>
        <Text style={styles.subtitle}>The stone reveals hidden potential... Choose a card!</Text>

        {/* Card Container - Now holds rows */}
        <View style={styles.cardContainer}>
          {/* Row 1 */}
          <View style={styles.cardRow}>
            {[1, 2].map((index) => (
              <Animatable.View 
                  key={index} 
                  animation={revealedCardIndex === null ? floatingAnimation : undefined} 
                  iterationCount={revealedCardIndex === null ? 'infinite' : 1} 
                  duration={revealedCardIndex === null ? 2000 : 500} 
                  delay={index * 150} 
                  useNativeDriver={true}
                  style={{ transform: [{ translateY: 0 }] }}
              >
                  <TouchableOpacity 
                      style={styles.cardTouchable} // Removed marginHorizontal here, handled by row
                      onPress={() => handleCardPress(index)} 
                      disabled={revealedCardIndex !== null || isGranting}
                      activeOpacity={0.7}
                  >
                      <View style={styles.card}>
                        {revealedCardIndex === index && revealedCosmetic ? (
                            // Show Revealed Cosmetic
                            (() => { 
                              const imageSource = getCosmeticImageSource(revealedCosmetic);
                              if (!imageSource) {
                                return <Text style={styles.rewardText}>Error Loading Image</Text>; 
                              }
                              return (
                                <View style={styles.cardFace}>
                                  <Image 
                                    source={imageSource} 
                                    style={styles.rewardImage} 
                                    resizeMode="contain" 
                                  />
                                  <Text style={styles.rewardText}>{`${revealedCosmetic.name}`}</Text> 
                                </View>
                              );
                            })()
                        ) : (
                            <Image source={cardBack} style={styles.cardBack} resizeMode="cover" />
                        )}
                    </View>
                  </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>

          {/* Row 2 */}
           <View style={styles.cardRow}>
            {[3, 4].map((index) => (
              <Animatable.View 
                  key={index} 
                  animation={revealedCardIndex === null ? floatingAnimation : undefined} 
                  iterationCount={revealedCardIndex === null ? 'infinite' : 1} 
                  duration={revealedCardIndex === null ? 2000 : 500} 
                  delay={index * 150} // Adjust delay if needed
                  useNativeDriver={true}
                  style={{ transform: [{ translateY: 0 }] }}
              >
                  <TouchableOpacity 
                      style={styles.cardTouchable} // Removed marginHorizontal here
                      onPress={() => handleCardPress(index)} 
                      disabled={revealedCardIndex !== null || isGranting}
                      activeOpacity={0.7}
                  >
                      <View style={styles.card}>
                        {revealedCardIndex === index && revealedCosmetic ? (
                            // Show Revealed Cosmetic
                            (() => { 
                              const imageSource = getCosmeticImageSource(revealedCosmetic);
                              if (!imageSource) {
                                return <Text style={styles.rewardText}>Error Loading Image</Text>; 
                              }
                              return (
                                <View style={styles.cardFace}>
                                  <Image 
                                    source={imageSource} 
                                    style={styles.rewardImage} 
                                    resizeMode="contain" 
                                  />
                                  <Text style={styles.rewardText}>{`${revealedCosmetic.name}`}</Text> 
                                </View>
                              );
                            })()
                        ) : (
                            <Image source={cardBack} style={styles.cardBack} resizeMode="cover" />
                        )}
                    </View>
                  </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Continue Button - Appears after reveal is complete */}
        {revealedCosmetic && (
          <Animatable.View animation="fadeIn" delay={500} useNativeDriver={true}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Define the floating animation sequence
const floatingAnimation = {
  0: { transform: [{ translateY: 0 }] },
  0.5: { transform: [{ translateY: -6 }] }, // Move up slightly
  1: { transform: [{ translateY: 0 }] },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a0a2e', // Dark purple background
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // Space out elements
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  cardContainer: {
    alignItems: 'center', // Center rows horizontally
    width: '100%',
    paddingHorizontal: 20,
  },
  cardRow: { // New style for rows
    flexDirection: 'row',
    justifyContent: 'space-around', // Space cards evenly in the row
    width: '100%',
    marginBottom: 20, // Add space between rows
  },
  cardTouchable: {
  },
  card: {
    width: SCREEN_WIDTH * 0.38, // Increased width back for 2 cards per row
    height: (SCREEN_WIDTH * 0.38) * 1.5, // Adjust height proportionally
    borderRadius: 10, // Back to slightly larger radius
    backgroundColor: '#331a4d', 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#553a7d',
  },
  cardBack: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
  },
  rewardImage: {
      width: '80%',
      height: '60%',
      marginBottom: 10,
  },
  rewardText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
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