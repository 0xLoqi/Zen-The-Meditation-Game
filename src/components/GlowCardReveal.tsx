import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, AccessibilityInfo, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Haptic from 'react-native-haptic-feedback';
import ConfettiCannon from 'react-native-confetti-cannon';

// Placeholder asset imports (replace with actual assets)
const CARD_BACK = require('../../assets/images/glowcard_back.png');
const TOKEN_ICON = require('../../assets/images/coin.png');
const GLOWBAG_COMMON_ICON = require('../../assets/images/glowbags/Glowbag_common.png');
const GLOWBAG_RARE_ICON = require('../../assets//images/glowbags/Glowbag_rare.png');
const STREAK_SAVER_ICON = require('../../assets/images/streak_saver_icon.png');

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
  localization?: (key: string) => string;
}

const CARD_COUNT = 5;
const STREAK_SAVER_CAP = 3;
const PAID_PICK_COST = 50;

function getRandomReward(): RewardType {
  const rand = Math.random();
  if (rand < 0.5) {
    // Tokens: 50% (split equally)
    const tokenOptions = [25, 35, 50];
    const amount = tokenOptions[Math.floor(Math.random() * tokenOptions.length)];
    return { type: 'tokens', amount };
  } else if (rand < 0.7) {
    // Common Glowbag: 20%
    return { type: 'glowbag_common' };
  } else if (rand < 0.8) {
    // Rare Glowbag: 10%
    return { type: 'glowbag_rare' };
  } else if (rand < 0.9) {
    // Streak Saver: 10%
    return { type: 'streak_saver' };
  } else {
    // Extra Free Pick: 10%
    return { type: 'extra_pick' };
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
  localization,
}) => {
  const [cards, setCards] = useState(Array(CARD_COUNT).fill(null));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reward, setReward] = useState<RewardType | null>(null);
  const [flipped, setFlipped] = useState(Array(CARD_COUNT).fill(false));
  const [animating, setAnimating] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [picks, setPicks] = useState(initialPicksLeft);
  const [showPaidPick, setShowPaidPick] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accessibility: Announce reward
  React.useEffect(() => {
    if (reward) {
      const msg = rewardText(reward, localization);
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        AccessibilityInfo.announceForAccessibility(msg);
      }
    }
  }, [reward]);

  const handleCardPress = (i: number) => {
    if (animating || selectedIndex !== null) return;
    setAnimating(true);
    setSelectedIndex(i);
    const assignedReward = getRandomReward();
    setReward(assignedReward);
    const updatedFlipped = [...flipped];
    updatedFlipped[i] = true;
    setFlipped(updatedFlipped);
    // Haptic feedback
    Haptic.trigger('impactLight');
    setTimeout(() => {
      setAnimating(false);
      if (assignedReward.type === 'glowbag_rare' || assignedReward.type === 'glowbag_common') {
        setConfetti(true);
        Haptic.trigger('impactHeavy');
      } else if (assignedReward.type === 'extra_pick') {
        Haptic.trigger('notificationSuccess');
      }
    }, 600); // Animation duration
  };

  const handleClaim = () => {
    if (!reward) return;
    // Handle reward
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
      setPicks(picks + 1);
    }
    setTimeout(() => {
      setConfetti(false);
      setFlipped(Array(CARD_COUNT).fill(false));
      setSelectedIndex(null);
      setReward(null);
      setPicks(picks - 1);
      setShowPaidPick(isPlusUser);
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
    onUpdateTokens(userTokens - PAID_PICK_COST);
    setFlipped(Array(CARD_COUNT).fill(false));
    setSelectedIndex(null);
    setReward(null);
    setPicks(picks + 1);
    setError(null);
    setShowPaidPick(false);
  };

  const handleShare = () => {
    if (onShareReward && reward) {
      onShareReward(reward);
    }
  };

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{localization ? localization('Zenni summons a GlowCard Reveal! Pick a card!') : 'Zenni summons a GlowCard Reveal! Pick a card!'}</Text>
      <View style={styles.cardRow}>
        {cards.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, selectedIndex === i && styles.selectedCard]}
            onPress={() => handleCardPress(i)}
            disabled={animating || selectedIndex !== null}
            accessibilityLabel={`Card ${i + 1}, tap to reveal reward`}
            accessibilityRole="button"
          >
            {!flipped[i] ? (
              <Image source={CARD_BACK} style={styles.cardImage} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={reward && reward.type === 'glowbag_rare' ? ['#FFD700', '#FF8C00'] : ['#22223B', '#4A4E69']}
                style={styles.cardImage}
              >
                <Image source={rewardIcon(reward!)} style={styles.rewardIcon} />
                <Text style={styles.rewardText}>{rewardText(reward!, localization)}</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {confetti && <ConfettiCannon count={200} origin={{ x: 200, y: 0 }} fadeOut={true} />}
      {selectedIndex !== null && reward && (
        <TouchableOpacity style={styles.claimButton} onPress={handleClaim} accessibilityRole="button">
          <Text style={styles.claimText}>{localization ? localization('Claim') : 'Claim'}</Text>
        </TouchableOpacity>
      )}
      {showPaidPick && (
        <TouchableOpacity style={styles.paidPickButton} onPress={handlePaidPick} accessibilityRole="button">
          <Text style={styles.paidPickText}>{localization ? localization('Pick Again (50 Tokens)?') : 'Pick Again (50 Tokens)?'}</Text>
        </TouchableOpacity>
      )}
      {reward && onShareReward && (
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} accessibilityRole="button">
          <Text style={styles.shareText}>{localization ? localization('Share in Friend Den') : 'Share in Friend Den'}</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232946',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  prompt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  card: {
    width: '17%',
    aspectRatio: 0.66,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: '1.5%',
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#232946',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    transform: [{ scale: 1.08 }],
    shadowOpacity: 0.7,
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
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    maxWidth: 80,
  },
  claimButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 12,
  },
  claimText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 18,
  },
  paidPickButton: {
    backgroundColor: '#4A4E69',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginTop: 16,
  },
  paidPickText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#232946',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 10,
  },
  shareText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default GlowCardReveal;
