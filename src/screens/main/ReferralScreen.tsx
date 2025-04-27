import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useUserStore } from '../../store/userStore';
import { generateLink } from '../../services/referral';

const ReferralScreen = () => {
  const { referralCode, getReferralCode } = useUserStore();
  const [copied, setCopied] = useState(false);
  
  // Get referral code on component mount
  useEffect(() => {
    loadReferralCode();
  }, []);
  
  // Load referral code
  const loadReferralCode = async () => {
    await getReferralCode();
  };
  
  // Handle copy referral code
  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    
    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  // Handle share referral code
  const handleShareCode = async () => {
    try {
      const link = await generateLink(referralCode);
      await Share.share({
        message: `Join me on Zen Meditation App! Use my link: ${link} to get started on your mindfulness journey.`,
      });
    } catch (error: any) {
      Alert.alert('Error', 'Could not share the referral link');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share Zen</Text>
        <Text style={styles.subtitle}>
          Invite friends to join your meditation journey
        </Text>
      </View>
      
      <Card style={styles.referralCard}>
        <Text style={styles.referralTitle}>Your Referral Code</Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyCode}
          >
            <MaterialCommunityIcons
              name={copied ? "check" : "content-copy"}
              size={SIZES.icon.medium}
              color={copied ? COLORS.success : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Share with Friends"
          onPress={handleShareCode}
          leftIcon={
            <MaterialCommunityIcons
              name="share-variant"
              size={SIZES.icon.medium}
              color={COLORS.white}
              style={{ marginRight: SPACING.s }}
            />
          }
          style={styles.shareButton}
        />
      </Card>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Benefits of Sharing</Text>
        
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons
            name="meditation"
            size={SIZES.icon.medium}
            color={COLORS.primary}
          />
          <Text style={styles.benefitText}>
            Spread mindfulness to your friends and family
          </Text>
        </View>
        
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons
            name="account-group"
            size={SIZES.icon.medium}
            color={COLORS.primary}
          />
          <Text style={styles.benefitText}>
            Build a community of mindful practitioners
          </Text>
        </View>
        
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons
            name="gift-outline"
            size={SIZES.icon.medium}
            color={COLORS.primary}
          />
          <Text style={styles.benefitText}>
            Coming soon: Earn rewards when friends join using your code
          </Text>
        </View>
      </View>
      
      <Card style={styles.comingSoonCard} variant="outlined">
        <View style={styles.comingSoonHeader}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={SIZES.icon.medium}
            color={COLORS.primary}
          />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        </View>
        <Text style={styles.comingSoonText}>
          Soon you'll be able to track which friends have used your referral code and earn special rewards!
        </Text>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
    padding: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  referralCard: {
    marginBottom: SPACING.xl,
  },
  referralTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutralLight,
    borderRadius: SIZES.borderRadius.small,
    padding: SPACING.l,
    marginBottom: SPACING.l,
  },
  codeText: {
    ...FONTS.heading.h3,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  copyButton: {
    marginLeft: SPACING.m,
    padding: SPACING.xs,
  },
  shareButton: {
    width: '100%',
  },
  benefitsContainer: {
    marginBottom: SPACING.xl,
  },
  benefitsTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    marginBottom: SPACING.l,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  benefitText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    marginLeft: SPACING.m,
    flex: 1,
  },
  comingSoonCard: {
    backgroundColor: COLORS.neutralLight,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  comingSoonTitle: {
    ...FONTS.heading.h4,
    color: COLORS.primary,
    marginLeft: SPACING.s,
  },
  comingSoonText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
});

export default ReferralScreen;
