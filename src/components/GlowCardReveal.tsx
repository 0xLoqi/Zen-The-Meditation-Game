import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, AccessibilityInfo, Platform, ImageBackground, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Haptic from 'react-native-haptic-feedback';
import ConfettiCannon from 'react-native-confetti-cannon';

// Placeholder asset imports (replace with actual assets)
const CARD_BACK = require('../../assets/images/glowcard_back.png');
const TOKEN_ICON = require('../../assets/images/coin.png');
const GLOWBAG_COMMON_ICON = require('../../assets/images/glowbags/Glowbag_common.png');
const GLOWBAG_RARE_ICON = require('../../assets//images/glowbags/Glowbag_rare.png');
const STREAK_SAVER_ICON = require('../../assets/images/streak_saver_icon.png');
const BACKGROUND_IMAGE = require('../../assets/images/backgrounds/pick_a_card_bg.png');
const PANE_BACKGROUND = require('../../assets/images/backgrounds/pane_background.png');

// Types for rewards
export type RewardType =
  | { type: 'tokens'; amount: number }
  | { type: 'glowbag_common' }
  | { type: 'glowbag_rare' }
  | { type: 'streak_saver' }
  | { type: 'extra_pick' };

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

function getRandomReward(): RewardType {
  const rand = Math.random();
  if (rand < 0.45) {
    // Tokens: 45%
    const tokenOptions = [25, 35, 50];
    const amount = tokenOptions[Math.floor(Math.random() * tokenOptions.length)];
    return { type: 'tokens', amount };
  } else if (rand < 0.65) {
    // Common Glowbag: 20%
    return { type: 'glowbag_common' };
  } else if (rand < 0.75) {
    // Rare Glowbag: 10%
    return { type: 'glowbag_rare' };
  } else if (rand < 0.85) {
    // Streak Saver: 10%
    return { type: 'streak_saver' };
  } else if (rand < 0.95) {
    // Extra Free Pick: 10%
    return { type: 'extra_pick' };
  } else {
    // Ultra Rare Cosmetic: 5%
    return { type: 'glowbag_rare' }; // You'll need to add cosmetic types to RewardType
  }
}

const rewardIcon = (reward: RewardType) => {
  switch (reward.type) {
    case 'tokens':
      return TOKEN_ICON;
    case 'glowbag_common':
      return GLOWBAG_COMMON_ICON;
    case 'glowbag_rare':
      return GLOWBAG_RARE_ICON;
    case 'streak_saver':
      return STREAK_SAVER_ICON;
    default:
      return TOKEN_ICON;
  }
};

const rewardText = (reward: RewardType, localization?: (key: string) => string): string => {
  switch (reward.type) {
    case 'tokens':
      return `${reward.amount} ${localization ? localization('Tokens') : 'Tokens'}`;
    case 'glowbag_common':
      return localization ? localization('Common Glowbag') : 'Common Glowbag';
    case 'glowbag_rare':
      return localization ? localization('Rare Glowbag') : 'Rare Glowbag';
    case 'streak_saver':
      return localization ? localization('Streak Saver') : 'Streak Saver';
    case 'extra_pick':
      return localization ? localization('Extra Free Pick') : 'Extra Free Pick';
    default:
      return '';
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
  const [cards, setCards] = useState(Array(CARD_COUNT).fill(null));
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
  const [showPostClaimUI, setShowPostClaimUI] = useState(false);
  const idleAnimation = useRef(new Animated.Value(0)).current;
  const idleLoop = useRef(null); // Store the idle animation loop
  const entranceAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const [paidPickUsed, setPaidPickUsed] = useState(false);
  const shakeAnimations = useRef(Array(CARD_COUNT).fill(0).map(() => new Animated.Value(0))).current;
  const shakeLoops = useRef([]); // Store shake animation loops
  const [otherRewards, setOtherRewards] = useState<(RewardType | null)[]>(Array(CARD_COUNT).fill(null));

  // Accessibility: Announce reward
  React.useEffect(() => {
    if (reward && selectedIndex !== null) {
      const msg = rewardText(reward, localization);
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        AccessibilityInfo.announceForAccessibility(msg);
      }
    }
  }, [reward]);

  // Entrance Animation
  useEffect(() => {
    const animations = entranceAnimations.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, []);

  // Idle Floating Animation
  useEffect(() => {
    idleLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(idleAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    idleLoop.current.start();
  }, []);

  const handleCardPress = (i: number) => {
    if (animating || selectedIndex !== null) return;
    setAnimating(true);
    setSelectedIndex(i);

    // Generate rewards for all cards
    const allRewards = Array(CARD_COUNT).fill(null).map(() => getRandomReward());
    const assignedReward = allRewards[i];
    setOtherRewards(allRewards);

    // Trigger flip animation
    Animated.timing(flipAnimations[i], {
      toValue: 1,
      duration: 600,
      useNativeDriver: true, // Use native driver for performance
    }).start(() => {
      setReward(assignedReward); // Set reward after animation starts for smoother reveal
      const updatedFlipped = [...flipped];
      updatedFlipped[i] = true;
      setFlipped(updatedFlipped); // Mark as logically flipped
      setAnimating(false);

      // Start reward appear animation
      Animated.timing(rewardAppearAnimation, {
        toValue: 1,
        duration: 400, // Faster than flip
        delay: 100, // Small delay after flip starts revealing back
        useNativeDriver: true,
      }).start();

      if (assignedReward.type === 'glowbag_rare' || assignedReward.type === 'glowbag_common') {
        setConfetti(true);
        Haptic.trigger('impactHeavy');
      } else if (assignedReward.type === 'extra_pick') {
        Haptic.trigger('notificationSuccess');
      }
    });

    // Haptic feedback
    Haptic.trigger('impactLight');
  };

  const handleClaim = () => {
    if (!reward) return;
    setIsClaimed(true);

    // Flip all other cards with a slight delay for each
    const newFlipped = [...flipped];
    otherRewards.forEach((_, index) => {
      if (index !== selectedIndex) {
        setTimeout(() => {
          setFlipped(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          // Trigger flip animation for this card
          Animated.timing(flipAnimations[index], {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }, index * 100); // Stagger the reveals
      }
    });

    // Handle the reward
    if (reward.type === 'tokens') {
      onUpdateTokens(userTokens + reward.amount);
    } else if (reward.type === 'glowbag_common' || reward.type === 'glowbag_rare') {
      onRewardClaimed(reward);
    } else if (reward.type === 'streak_saver') {
      if (streakSavers < STREAK_SAVER_CAP) {
        onUpdateStreakSavers(streakSavers + 1);
      } else {
        onUpdateTokens(userTokens + 25); // Overflow
      }
    } else if (reward.type === 'extra_pick') {
      setPicks(prev => prev + 1);
      // Show feedback that you got an extra pick
      setTimeout(() => {
        setShowPostClaimUI(true);
        Alert.alert(
          localization ? localization('Extra Pick!') : 'Extra Pick!',
          localization ? localization('You got an extra pick! Claim this reward first, then pick again!') : 'You got an extra pick! Claim this reward first, then pick again!'
        );
      }, 1000);
      return; // Don't show post-claim UI yet for extra pick
    }

    // Show confetti for rare items
    if (reward.type === 'glowbag_rare' || reward.type === 'glowbag_common') {
      setConfetti(true);
      Haptic.trigger('impactHeavy');
    } else if (reward.type === 'extra_pick') {
      Haptic.trigger('notificationSuccess');
    }

    setTimeout(() => {
      setShowPostClaimUI(true);
    }, 1000);
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
    if (onClose) {
      if (shakeLoops.current) shakeLoops.current.forEach(loop => loop.stop && loop.stop());
      shakeAnimations.forEach(anim => anim.setValue(0));
      onClose();
    }
  };

  // Render
  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.cardArea}>
        <View style={[styles.cardRow, { perspective: 1000 } as any]}>
          {cards.map((_, i) => {
            const rotateY = flipAnimations[i].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            const frontAnimatedStyle = {
              transform: [{ rotateY }],
            };

            const backAnimatedStyle = {
              transform: [{ 
                rotateY: flipAnimations[i].interpolate({ 
                  inputRange: [0, 1], 
                  outputRange: ['180deg', '360deg'] 
                }) 
              }], // Rotate backface based on original animation value
            };

            // Idle animation transformation
            const idleTranslateY = idleAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10], // Float up by 10 units
            });

            // Entrance animation transformation
            const entranceTranslateY = entranceAnimations[i].interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0], // Slide up from 100 units below
            });
            const entranceOpacity = entranceAnimations[i].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.5, 1], // Fade in
            });

            // Shake animation transformation
            const shakeTranslateX = shakeAnimations[i].interpolate({
              inputRange: [-1, 1],
              outputRange: [-2, 2], // Less intense shake
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.cardContainer,
                  ((selectedIndex !== null && selectedIndex !== i) || isClaimed) && styles.disabledCardVisuals,
                  selectedIndex === i && styles.selectedCardContainer,
                  {
                    opacity: entranceOpacity,
                    transform: [
                      { translateY: entranceTranslateY },
                      ...(selectedIndex === null && !isClaimed ? [{ translateY: idleTranslateY }] : []),
                      { translateX: shakeTranslateX },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => handleCardPress(i)}
                  disabled={animating || selectedIndex !== null || isClaimed}
                  accessibilityLabel={`Card ${i + 1}, tap to reveal reward`}
                  accessibilityRole="button"
                >
                  {/* Front Side */}
                  <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
                    <Image source={CARD_BACK} style={styles.cardImage} resizeMode="cover" />
                  </Animated.View>

                  {/* Back Side (Reward) */}
                  <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                    <ImageBackground source={PANE_BACKGROUND} style={styles.paneBackground} resizeMode='cover'>
                      <LinearGradient
                        colors={reward && i === selectedIndex && reward.type === 'glowbag_rare' ? ['#FFD700', '#FFA500', '#FF8C00'] : ['transparent', 'transparent']}
                        style={styles.cardGradientOverlay}
                      >
                        {((reward && i === selectedIndex) || (flipped[i] && otherRewards[i])) && (
                          <Animated.View style={[
                            styles.rewardContentContainer,
                            {
                              transform: [{
                                scale: flipAnimations[i].interpolate({
                                  inputRange: [0, 0.5, 1],
                                  outputRange: [0.8, 0.8, 1],
                                })
                              }]
                            }
                          ]}>
                            <Image 
                              source={rewardIcon(i === selectedIndex ? reward : otherRewards[i])} 
                              style={[
                                styles.rewardIcon,
                                i !== selectedIndex && { opacity: 0.6 } // Dim other rewards
                              ]} 
                            />
                            <Text style={[
                              styles.rewardText,
                              i !== selectedIndex && { opacity: 0.6 } // Dim other rewards
                            ]}>
                              {rewardText(i === selectedIndex ? reward : otherRewards[i], localization)}
                            </Text>
                          </Animated.View>
                        )}
                      </LinearGradient>
                    </ImageBackground>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonArea}>
        {confetti && reward && (
          <ConfettiCannon
            count={reward.type === 'glowbag_rare' || reward.type === 'glowbag_common' ? 250 : 100}
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
            explosionSpeed={400}
            fallSpeed={3000}
          />
        )}

        {selectedIndex !== null && reward && !isClaimed && (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim} accessibilityRole="button">
            <Text style={styles.claimText}>{localization ? localization('Claim') : 'Claim'}</Text>
          </TouchableOpacity>
        )}

        {showPostClaimUI && (
          <View style={styles.postClaimButtonContainer}>
            {/* Done Button - Now first */}
            <TouchableOpacity style={styles.doneButton} onPress={handleClose} accessibilityRole="button">
              <Text style={styles.doneButtonText}>{localization ? localization('Done') : 'Done'}</Text>
            </TouchableOpacity>

            {/* Pick Again Section */}
            {(isPlusUser && !paidPickUsed) ? (
              // Active Button Section
              <View style={styles.pickAgainSection}>
                <TouchableOpacity style={styles.paidPickButton} onPress={handlePaidPick} accessibilityRole="button">
                  <Text style={styles.paidPickText}>{localization ? localization('One more?') : 'One more?'}</Text>
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                  <Image source={TOKEN_ICON} style={styles.priceIcon} />
                  <Text style={styles.priceText}>{PAID_PICK_COST}</Text>
                </View>
              </View>
            ) : (
              // Disabled Button Section - Only show if NOT already used
              !paidPickUsed && (
                <View style={styles.pickAgainSection}>
                  <TouchableOpacity style={styles.disabledPaidPickButton} disabled={true} accessibilityRole="button">
                    <Text style={styles.disabledPaidPickText}>
                      {localization ? localization('Plus users can pick again!') : 'Plus users can pick again!'}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.priceContainer, styles.disabledPriceContainer]}>
                    <Image source={TOKEN_ICON} style={[styles.priceIcon, styles.disabledPriceIcon]} />
                    <Text style={[styles.priceText, styles.disabledPriceText]}>{PAID_PICK_COST}</Text>
                  </View>
                </View>
              )
            )}
          </View>
        )}

        {reward && onShareReward && !isClaimed && (
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} accessibilityRole="button">
            <Text style={styles.shareText}>{localization ? localization('Share in Friend Den') : 'Share in Friend Den'}</Text>
          </TouchableOpacity>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 80,
  },
  cardArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContainer: {
    width: '30%',
    aspectRatio: 0.66,
    borderRadius: 12,
    marginHorizontal: '1.5%',
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#232946',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    // Front specific styles (if any needed)
  },
  cardBack: {
    // Back specific styles (if any needed)
  },
  selectedCardContainer: {
    transform: [{ scale: 1.12 }],
    shadowOpacity: 0.9,
    elevation: 15,
    zIndex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  rewardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '90%',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingHorizontal: 35,
    paddingVertical: 14,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  claimText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 18,
  },
  paidPickButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  paidPickText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabledPaidPickButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#888',
  },
  disabledPaidPickText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  shareButton: {
    backgroundColor: '#232946',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 6,
  },
  shareText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  rewardContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  doneButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingHorizontal: 35,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doneButtonText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 18,
  },
  paneBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGradientOverlay: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  postClaimButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  pickAgainSection: {
    alignItems: 'center',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
    tintColor: '#FFD700',
  },
  priceText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledPriceContainer: {
    // Specific styles if needed for disabled price container
  },
  disabledPriceIcon: {
    tintColor: '#888',
  },
  disabledPriceText: {
    color: '#888',
  },
  disabledCardVisuals: {
    opacity: 0.6,
  },
  buttonArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    alignItems: 'center',
  },
});

export default GlowCardReveal;
