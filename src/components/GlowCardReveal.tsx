import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, AccessibilityInfo, Platform, ImageBackground, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Haptic from 'react-native-haptic-feedback';
import ConfettiCannon from 'react-native-confetti-cannon';

// Asset imports
const CARD_BACK = require('../../assets/images/glowcard_back.png');
const TOKEN_ICON = require('../../assets/images/coin.png');
const GLOWBAG_COMMON_ICON = require('../../assets/images/glowbags/Glowbag_common.png');
const GLOWBAG_RARE_ICON = require('../../assets/images/glowbags/Glowbag_rare.png');
const STREAK_SAVER_ICON = require('../../assets/images/streak_saver_icon.png');
const EXTRA_PICK_ICON = require('../../assets/images/extra_pick_icon.png'); // Assuming you have an icon for extra pick
const BACKGROUND_IMAGE = require('../../assets/images/backgrounds/pick_a_card_bg.png');
const CHOOSE_WISELY_IMAGE = require('../../assets/images/Choose_wisely.png');
const PANE_BACKGROUND = require('../../assets/images/backgrounds/pane_background.png'); // Import pane background

// Load Cosmetics Data
import cosmeticsData from '../../assets/data/cosmetics.json';

interface Cosmetic {
  id: string;
  name: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string; // Assuming image name corresponds to file in assets
  price: number;
}

// Filter high-tier cosmetics
const highTierCosmetics = cosmeticsData.filter(c => c.rarity === 'epic' || c.rarity === 'legendary') as Cosmetic[];

// Types for rewards
export type RewardType =
  | { type: 'tokens'; amount: number }
  | { type: 'glowbag_common' }
  | { type: 'glowbag_rare' }
  | { type: 'streak_saver' }
  | { type: 'extra_pick' }
  | { type: 'cosmetic'; item: Cosmetic }; // Updated cosmetic type

export interface GlowCardRevealProps {
  onRewardClaimed: (reward: RewardType) => void;
  userTokens: number;
  isPlusUser: boolean;
  streakSavers: number;
  onUpdateTokens: (tokens: number) => void;
  onUpdateStreakSavers: (count: number) => void;
  onShareReward?: (reward: RewardType) => void;
  picksLeft?: number; // Defaults to 1
  onClose?: () => void;
  localization?: (key: string) => string;
}

const CARD_COUNT = 6;
const STREAK_SAVER_CAP = 3;
const PAID_PICK_COST = 50;
const AUTO_CLAIM_DELAY = 2500; // ms

// Adjusted Probabilities (example, ensure they sum to 1 or handle default)
function getRandomReward(): RewardType {
  const rand = Math.random();
  if (rand < 0.40) { // Tokens: 40%
    const tokenOptions = [25, 35, 50];
    const amount = tokenOptions[Math.floor(Math.random() * tokenOptions.length)];
    return { type: 'tokens', amount };
  } else if (rand < 0.60) { // Common Glowbag: 20%
    return { type: 'glowbag_common' };
  } else if (rand < 0.70) { // Rare Glowbag: 10%
    return { type: 'glowbag_rare' };
  } else if (rand < 0.80) { // Streak Saver: 10%
    return { type: 'streak_saver' };
  } else if (rand < 0.90) { // Extra Free Pick: 10%
    return { type: 'extra_pick' };
  } else { // Cosmetic: 10% (example)
    const availableCosmetics = cosmeticsData as Cosmetic[]; // Use all for actual reward for now
    if (availableCosmetics.length > 0) {
        const randomCosmetic = availableCosmetics[Math.floor(Math.random() * availableCosmetics.length)];
        return { type: 'cosmetic', item: randomCosmetic };
    } else {
        // Fallback if cosmetics.json is empty
        return { type: 'tokens', amount: 25 };
    }
  }
}

const COSMETIC_IMAGES: { [key: string]: any } = {
  // Outfits
  'ember_robe.png': require('../../assets/images/cosmetics/outfits/ember_robe.png'),
  'prism_cloak.png': require('../../assets/images/cosmetics/outfits/prism_cloak.png'),
  'nap_hoodie.png': require('../../assets/images/cosmetics/outfits/nap_hoodie.png'),
  // Headgear
  'warm_beanie.png': require('../../assets/images/cosmetics/headgear/warm_beanie.png'),
  'royal_crown.png': require('../../assets/images/cosmetics/headgear/royal_crown.png'),
  'Leaf Crown.png': require('../../assets/images/cosmetics/headgear/Leaf Crown.png'),
  // Auras
  'auric_bloom.png': require('../../assets/images/cosmetics/auras/auric_bloom.png'),
  'focus_spiral.png': require('../../assets/images/cosmetics/auras/focus_spiral.png'),
  'verdant_halo.png': require('../../assets/images/cosmetics/auras/verdant_halo.png'),
  // Accessories
  'whorled_staff.png': require('../../assets/images/cosmetics/accesories/whorled_staff.png'),
  'you_blink_first_mask.png': require('../../assets/images/cosmetics/accesories/you_blink_first_mask.png'),
  'true_stoic_mask.png': require('../../assets/images/cosmetics/accesories/true_stoic_mask.png'),
  'satchel_of_stillness.png': require('../../assets/images/cosmetics/accesories/satchel_of_stillness.png'),
  // Companions
  'cozy_owl.png': require('../../assets/images/cosmetics/companions/cozy_owl.png'),
  'busy_bee.png': require('../../assets/images/cosmetics/companions/busy_bee.png'),
  'baby_echo.png': require('../../assets/images/cosmetics/companions/baby_echo.png'),
  'messenger_sprite.png': require('../../assets/images/cosmetics/companions/messenger_sprite.png'),
  // Faces
  'angry.png': require('../../assets/images/cosmetics/faces/angry.png'),
  'shook.png': require('../../assets/images/cosmetics/faces/shook.png'),
  'wink.png': require('../../assets/images/cosmetics/faces/wink.png'),
  'worried.png': require('../../assets/images/cosmetics/faces/worried.png'),
  'sad.png': require('../../assets/images/cosmetics/faces/sad.png'),
};

const cosmeticImageRequire = (imageName: string) => {
  return COSMETIC_IMAGES[imageName] || GLOWBAG_RARE_ICON;
};

const rewardIcon = (reward: RewardType | null) => {
  if (!reward) return TOKEN_ICON;
  switch (reward.type) {
    case 'tokens': return TOKEN_ICON;
    case 'glowbag_common': return GLOWBAG_COMMON_ICON;
    case 'glowbag_rare': return GLOWBAG_RARE_ICON;
    case 'streak_saver': return STREAK_SAVER_ICON;
    case 'extra_pick': return EXTRA_PICK_ICON;
    case 'cosmetic': return cosmeticImageRequire(reward.item.image); // Use cosmetic image
    default: return TOKEN_ICON;
  }
};

const rewardText = (reward: RewardType | null, localization?: (key: string) => string): string => {
  if (!reward) return '';
  const loc = localization || ((key: string) => key); // Default localization
  switch (reward.type) {
    case 'tokens': return `${reward.amount} ${loc('Tokens')}`;
    case 'glowbag_common': return loc('Common Glowbag');
    case 'glowbag_rare': return loc('Rare Glowbag');
    case 'streak_saver': return loc('Streak Saver');
    case 'extra_pick': return loc('Extra Free Pick');
    case 'cosmetic': return reward.item.name; // Use cosmetic name
    default: return '';
  }
};

export const GlowCardReveal: React.FC<GlowCardRevealProps> = ({
  onRewardClaimed,
  userTokens,
  isPlusUser,
  streakSavers,
  onUpdateTokens,
  onUpdateStreakSavers,
  onShareReward,
  picksLeft: initialPicksLeft = 1,
  onClose,
  localization,
}) => {
  const [cards, setCards] = useState<(RewardType | null)[]>(Array(CARD_COUNT).fill(null));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reward, setReward] = useState<RewardType | null>(null);
  const [flipped, setFlipped] = useState(Array(CARD_COUNT).fill(false));
  const flipAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const [animating, setAnimating] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [picks, setPicks] = useState(initialPicksLeft);
  const [showPaidPick, setShowPaidPick] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rewardAppearAnimation = useRef(new Animated.Value(0)).current;
  const [isClaimed, setIsClaimed] = useState(false);
  const [showPostClaimUI, setShowPostClaimUI] = useState(false); // To control when "Done" appears
  const idleAnimation = useRef(new Animated.Value(0)).current;
  const idleLoop = useRef<Animated.CompositeAnimation | null>(null); // Fix type
  const entranceAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const [paidPickUsed, setPaidPickUsed] = useState(false);
  const shakeAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const shakeLoops = useRef<Animated.CompositeAnimation[]>([]); // Fix type
  const [otherRewards, setOtherRewards] = useState<(RewardType | null)[]>(Array(CARD_COUNT).fill(null));
  const autoClaimTimer = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (autoClaimTimer.current) {
        clearTimeout(autoClaimTimer.current);
      }
      // Stop animations on unmount
      idleLoop.current?.stop();
      shakeLoops.current.forEach(loop => loop?.stop());
    };
  }, []);

  // Accessibility: Announce reward
  useEffect(() => {
    if (reward && selectedIndex !== null) {
      const msg = rewardText(reward, localization);
      if (msg) {
          AccessibilityInfo.announceForAccessibility(msg);
      }
    }
  }, [reward, selectedIndex, localization]);

  // Entrance Animation
  useEffect(() => {
    const animations = entranceAnimations.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }) // Faster
    );
    Animated.stagger(80, animations).start(); // Faster
  }, [entranceAnimations]);

  // Idle Floating Animation
  useEffect(() => {
      // Ensure previous loop is stopped before starting a new one
      idleLoop.current?.stop();
      idleLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(idleAnimation, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(idleAnimation, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      );
      idleLoop.current.start();
  }, [idleAnimation]); // Add idleAnimation dependency

  const claimReward = (rewardToClaim: RewardType) => {
      if (isClaimed) return; // Prevent double claim

      console.log('Claiming reward:', rewardToClaim);
      setIsClaimed(true);
      setShowPostClaimUI(true); // Show "Done" button etc.

      if (rewardToClaim.type === 'tokens') {
          onUpdateTokens(rewardToClaim.amount);
      } else if (rewardToClaim.type === 'streak_saver') {
          onUpdateStreakSavers(1);
      } // Add cosmetic handling if needed (e.g., add to inventory via store)

      // Trigger appropriate haptics & confetti
      const isRare = rewardToClaim.type === 'glowbag_rare' || (rewardToClaim.type === 'cosmetic' && (rewardToClaim.item.rarity === 'epic' || rewardToClaim.item.rarity === 'legendary'));
      if (isRare) {
          setConfetti(true);
          Haptic.trigger('impactHeavy');
      } else if (rewardToClaim.type !== 'extra_pick') { // No success haptic for extra pick itself
          Haptic.trigger('notificationSuccess');
      }

      onRewardClaimed(rewardToClaim); // Notify parent screen

      if (rewardToClaim.type === 'extra_pick') {
          setPicks(prev => prev + 1);
          // Optionally reset state to allow another pick immediately?
          // Or wait for user interaction? For now, just increments pick count.
          // Resetting might involve:
          // setSelectedIndex(null); setReward(null); setFlipped(f.map(() => false)); setIsClaimed(false); setShowPostClaimUI(false);
      }
  };


  const handleCardPress = (i: number) => {
    if (animating || selectedIndex !== null || picks <= 0) return;

    // Clear any pending auto-claim from previous potential picks if applicable
    if (autoClaimTimer.current) clearTimeout(autoClaimTimer.current);

    setAnimating(true);
    setSelectedIndex(i);
    setPicks(prev => prev - 1); // Decrement picks

    // Generate rewards for all cards
    let allRewards = Array(CARD_COUNT).fill(null).map(() => getRandomReward());
    const assignedReward = allRewards[i];

    // Ensure at least one "missed" reward is a high-tier cosmetic,
    // UNLESS the assigned reward is an extra pick.
    if (assignedReward?.type !== 'extra_pick' && highTierCosmetics.length > 0) {
        let dummyPlaced = false;
        while (!dummyPlaced) {
            const randomIndex = Math.floor(Math.random() * CARD_COUNT);
            if (randomIndex !== i) { // Don't replace the selected card
                const randomHighTierCosmetic = highTierCosmetics[Math.floor(Math.random() * highTierCosmetics.length)];
                allRewards[randomIndex] = { type: 'cosmetic', item: randomHighTierCosmetic };
                dummyPlaced = true;
            }
        }
    } else if (assignedReward?.type === 'extra_pick') {
        // Ensure no dummy cosmetic is shown if extra pick is selected
        allRewards = allRewards.map((r, index) => {
            if (index !== i && r?.type === 'cosmetic' && highTierCosmetics.some(htc => htc.id === r.item.id)) {
                // Replace dummy cosmetic with a standard reward if extra pick was chosen
                return getRandomReward(); // Or a specific fallback like tokens
            }
            return r;
        });
    }


    setOtherRewards(allRewards); // Set rewards *before* flip starts

    // Stop idle animation during flip
    idleLoop.current?.stop();

    // Trigger flip animation (Faster)
    Animated.timing(flipAnimations[i], {
      toValue: 1,
      duration: 400, // Faster flip
      useNativeDriver: true,
    }).start(() => {
      setReward(assignedReward); // Set reward *during* animation for reveal
      const updatedFlipped = [...flipped];
      updatedFlipped[i] = true;
      setFlipped(updatedFlipped);
      setAnimating(false);

      // Start reward appear animation (Faster)
      Animated.timing(rewardAppearAnimation, {
        toValue: 1,
        duration: 300, // Faster
        delay: 50, // Slight delay
        useNativeDriver: true,
      }).start(() => {
          // Start auto-claim timer ONLY if it's not an extra pick
          if (assignedReward && assignedReward.type !== 'extra_pick') {
              autoClaimTimer.current = setTimeout(() => {
                  claimReward(assignedReward);
              }, AUTO_CLAIM_DELAY);
          } else if (assignedReward?.type === 'extra_pick') {
              // Handle extra pick immediately (or after short delay?)
              claimReward(assignedReward); // Claim it to trigger +1 pick count
              // Consider UI update to indicate another pick is available
              console.log("Extra pick awarded!");
              setShowPostClaimUI(true); // Show 'Done' button after extra pick reveal
          }
      });

      // Haptic feedback for card flip itself
      Haptic.trigger('impactLight');

      // Reveal other cards slightly later
      setTimeout(() => {
        const otherFlipAnimations = otherRewards.map((_, index) => {
            if (index !== i) {
                return Animated.timing(flipAnimations[index], {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                });
            }
            return null;
        }).filter(Boolean); // Remove nulls

        if (otherFlipAnimations.length > 0) {
           Animated.stagger(50, otherFlipAnimations as Animated.CompositeAnimation[]).start(() => {
              const updatedFlipped = Array(CARD_COUNT).fill(true);
              setFlipped(updatedFlipped); // Mark all as flipped visually
              // Maybe restart idle anim here? Or wait for claim?
              // Show paid pick option if applicable
              setShowPostClaimUI(true); // Always show Done button once reveals are complete
              if (!paidPickUsed && assignedReward?.type !== 'extra_pick') {
                  // Clear auto-claim timer as user now has option to pick again
                  if (autoClaimTimer.current) {
                      clearTimeout(autoClaimTimer.current);
                      autoClaimTimer.current = null;
                  }
                  setShowPaidPick(true);
              }
           });
        }
      }, 600); // Delay revealing others after the main card flip starts
    });
  };

  const handlePaidPick = () => {
    if (!isPlusUser) {
      setError(localization ? localization('Paid picks are for Plus users only!') : 'Paid picks are for Plus users only!');
      return;
    }
    if (userTokens < PAID_PICK_COST) {
      setError(localization ? localization('Not enough Tokens!') : 'Not enough Tokens!');
      return;
    }
    if (paidPickUsed) {
      setError(localization ? localization('You can only pick again once!') : 'You can only pick again once!');
      return;
    }

    // Reset all states and animations
    onUpdateTokens(userTokens - PAID_PICK_COST);
    setPicks(1); // Grant one pick for the paid attempt
    setPaidPickUsed(true);
    setShowPaidPick(false);
    setShowPostClaimUI(false);
    
    // Reset flip states and animations
    setFlipped(Array(CARD_COUNT).fill(false));
    flipAnimations.forEach(anim => {
      anim.setValue(0); // Reset flip animation value
    });
    
    // Reset selection and rewards
    setSelectedIndex(null);
    setReward(null);
    setOtherRewards(Array(CARD_COUNT).fill(null));
    rewardAppearAnimation.setValue(0);
    setIsClaimed(false);
    
    // Stop shake and restart idle animation
    shakeLoops.current.forEach(loop => loop.stop && loop.stop());
    shakeAnimations.forEach(anim => anim.setValue(0));
    idleAnimation.setValue(0); // Reset animation value before restarting
    if (idleLoop.current) idleLoop.current.start();
    
    // Reset cards array
    setCards(Array(CARD_COUNT).fill(null));
    
    // Clear any errors
    setError(null);
  };

  const handleShare = () => {
    if (onShareReward && reward) {
      onShareReward(reward);
    }
  };

  const handleClose = () => {
    console.log('handleClose called');
    // Clear timer if it exists
    if (autoClaimTimer.current) {
      clearTimeout(autoClaimTimer.current);
      autoClaimTimer.current = null;
    }

    // Claim reward if not already claimed and a reward exists
    if (reward && !isClaimed) {
        claimReward(reward);
    }

    // Stop animations
    idleLoop.current?.stop();
    shakeLoops.current.forEach(loop => loop?.stop()); // Check if loop exists before stopping
    shakeAnimations.forEach(anim => anim.setValue(0));

    if (onClose) {
      onClose();
    }
  };

  const cardScale = idleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03], // Subtle scale effect
  });

  const cardTranslateY = idleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5], // Subtle float up effect
  });

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      {confetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />}

      {/* Choose Wisely Image (Absolute Positioned) */}
      <View style={styles.chooseWiselyContainer}>
        <Image
          source={CHOOSE_WISELY_IMAGE}
          style={styles.chooseWiselyImage}
          resizeMode="contain"
        />
      </View>

      {/* Card Area */}
      <View style={styles.cardArea}>
        <View style={[styles.cardRow, { perspective: 1000 } as any]}>
          {entranceAnimations.slice(0, 3).map((anim, i) => {
            const flip = flipAnimations[i].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });
            const backFlip = flipAnimations[i].interpolate({
                inputRange: [0, 1],
                outputRange: ['180deg', '360deg'],
            });
             const entranceScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
             const entranceOpacity = anim;

            return (
              <Animated.View key={i} style={{ opacity: entranceOpacity, transform: [{ scale: entranceScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(i)}
                  disabled={flipped[i] || animating || picks <= 0}
                  accessibilityLabel={flipped[i] ? rewardText(cards[i], localization) : `Card ${i + 1}, Choose a card`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: flipped[i] || animating || picks <= 0, selected: selectedIndex === i }}
                  >
                  <Animated.View style={[
                      styles.card,
                      { transform: [{ rotateY: flip }, { scale: cardScale }, { translateY: cardTranslateY }] },
                      selectedIndex === i && styles.selectedCard, // Optional: style for selected card
                      (flipped[i] || selectedIndex !== null) && styles.disabledCard, // Dim unflipped after selection
                    ]}>
                    <Image source={CARD_BACK} style={styles.cardFace} />
                  </Animated.View>
                  <Animated.View style={[
                      styles.card, styles.cardBack,
                      { transform: [{ rotateY: backFlip }, { scale: cardScale }, { translateY: cardTranslateY }] }
                    ]}>
                      <ImageBackground source={PANE_BACKGROUND} style={styles.cardFaceBackground} imageStyle={styles.cardBackgroundImageStyle}>
                      {/* Content Revealed on Flip */}
                      {(flipped[i] || selectedIndex === i) && otherRewards[i] && (
                           <Animated.View style={[styles.rewardContent, { opacity: rewardAppearAnimation, transform: [{ scale: rewardAppearAnimation }] }]}>
                            <Image
                                source={rewardIcon(otherRewards[i])} // Show reward from otherRewards
                                style={[
                                    styles.rewardIcon,
                                    // (i !== selectedIndex && selectedIndex !== null) && { opacity: 0.6 } // Dim other rewards?
                                ]}
                                resizeMode="contain"
                            />
                            <Text style={[
                                styles.rewardText,
                                // (i !== selectedIndex && selectedIndex !== null) && { opacity: 0.6 } // Dim other rewards?
                            ]}>
                                {rewardText(otherRewards[i], localization)}
                            </Text>
                        </Animated.View>
                      )}
                      </ImageBackground>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        {/* Repeat for second row */}
        <View style={[styles.cardRow, { perspective: 1000 } as any]}>
          {entranceAnimations.slice(3, 6).map((anim, i) => {
            const actualIndex = i + 3;
            const flip = flipAnimations[actualIndex].interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
            const backFlip = flipAnimations[actualIndex].interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
             const entranceScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
             const entranceOpacity = anim;
            return (
              <Animated.View key={actualIndex} style={{ opacity: entranceOpacity, transform: [{ scale: entranceScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(actualIndex)}
                  disabled={flipped[actualIndex] || animating || picks <= 0}
                  accessibilityLabel={flipped[actualIndex] ? rewardText(cards[actualIndex], localization) : `Card ${actualIndex + 1}, Choose a card`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: flipped[actualIndex] || animating || picks <= 0, selected: selectedIndex === actualIndex }}
                >
                   <Animated.View style={[
                      styles.card,
                      { transform: [{ rotateY: flip }, { scale: cardScale }, { translateY: cardTranslateY }] },
                       selectedIndex === actualIndex && styles.selectedCard,
                      (flipped[actualIndex] || selectedIndex !== null) && styles.disabledCard,
                    ]}>
                    <Image source={CARD_BACK} style={styles.cardFace} />
                  </Animated.View>
                  <Animated.View style={[
                      styles.card, styles.cardBack,
                      { transform: [{ rotateY: backFlip }, { scale: cardScale }, { translateY: cardTranslateY }] }
                    ]}>
                      <ImageBackground source={PANE_BACKGROUND} style={styles.cardFaceBackground} imageStyle={styles.cardBackgroundImageStyle}>
                      {/* Content Revealed on Flip */}
                      {(flipped[actualIndex] || selectedIndex === actualIndex) && otherRewards[actualIndex] && (
                        <Animated.View style={[styles.rewardContent, { opacity: rewardAppearAnimation, transform: [{ scale: rewardAppearAnimation }] }]}>
                             <Image
                                source={rewardIcon(otherRewards[actualIndex])} // Show reward from otherRewards
                                style={[
                                    styles.rewardIcon,
                                    // (actualIndex !== selectedIndex && selectedIndex !== null) && { opacity: 0.6 }
                                ]}
                                resizeMode="contain"
                            />
                            <Text style={[
                                styles.rewardText,
                                // (actualIndex !== selectedIndex && selectedIndex !== null) && { opacity: 0.6 }
                            ]}>
                                {rewardText(otherRewards[actualIndex], localization)}
                            </Text>
                        </Animated.View>
                      )}
                      </ImageBackground>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Bottom UI Area */}
      <View style={styles.bottomArea}>
        {showPostClaimUI && ( // Only show Done button after claim/reveal is complete
            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>{localization ? localization('Done') : 'Done'}</Text>
            </TouchableOpacity>
        )}
        {/* Show Paid Pick Button */} 
        {showPaidPick && ( // Show independently of the Done button
            <TouchableOpacity style={styles.paidPickButton} onPress={handlePaidPick}>
                <Text style={styles.paidPickButtonText}>
                    {localization ? localization('Pick Again?') : 'Pick Again?'} ({PAID_PICK_COST} {localization ? localization('Tokens') : 'Tokens'})
                </Text>
            </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

    </ImageBackground>
  );
};

// Add/Update Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Space between content and bottom button
    paddingBottom: 40, // Padding at the bottom
  },
  chooseWiselyContainer: {
    position: 'absolute',
    top: 20, // Adjust as needed
    left: 0,
    right: 0,
    height: 80, // Reverted size for now, was 240
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 10, // Make sure it's above cards if overlapping
  },
  chooseWiselyImage: {
    width: '60%', // Reverted size, was 180%
    height: '100%',
  },
  cardArea: {
     flex: 1, // Takes up available space
     justifyContent: 'center', // Center cards vertically
     alignItems: 'center',
     width: '100%',
     paddingTop: 120, // Space below the Choose Wisely image
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  card: {
    width: 100, // Adjust size as needed
    height: 140, // Adjust size as needed
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Card face is now transparent
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent', // Card back is now transparent
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  selectedCard: {
    // Optional: Add styles for the selected card (e.g., border)
    // elevation: 10,
    // shadowOpacity: 0.5,
  },
  disabledCard: {
      opacity: 0.7, // Dim unselected/unflipped cards after selection
  },
  rewardContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
  },
  rewardIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  bottomArea: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 20, // Padding for the button area
      // Removed height constraint to allow button to push content up if needed
  },
  doneButton: {
      backgroundColor: '#FFD700', // Gold color
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
  },
  doneButtonText: {
      color: '#4B3A00', // Darker text for contrast
      fontSize: 18,
      fontWeight: 'bold',
  },
  paidPickButton: { // Style for the paid pick button
      marginTop: 15,
      backgroundColor: '#E0B400', // Darker gold color
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
  },
  paidPickButtonText: {
      color: '#FFFFFF', // White text
      fontSize: 16,
      fontWeight: 'bold',
  },
  errorText: {
      color: 'red',
      marginTop: 10,
  },
  cardFaceBackground: { // Style for the ImageBackground wrapper
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensure content stays within rounded corners
    borderRadius: 10, // Match card border radius
  },
  cardBackgroundImageStyle: { // Style for the image itself if needed (e.g., resizeMode)
      borderRadius: 10, // Match card border radius for the image itself
  },
});

export default GlowCardReveal;
