import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import MiniZenni from '../../components/MiniZenni';
import { useUserStore } from '../../store/userStore';

const GuruModeScreen = () => {
  const { userData } = useUserStore();
  
  // Animated values for glowing effect
  const glowOpacity = useSharedValue(0.5);
  
  // Start animation on component mount
  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.ease }),
        withTiming(0.5, { duration: 1500, easing: Easing.ease })
      ),
      -1, // Infinite repeat
      true // Reverse animation each cycle
    );
  }, []);
  
  // Animated style for glowing effect
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Guru Mode</Text>
          <Text style={styles.subtitle}>
            Deep wisdom awaits in future updates
          </Text>
        </View>
        
        <View style={styles.zennieContainer}>
          <Animated.View style={[styles.glowEffect, glowAnimatedStyle]} />
          <MiniZenni
            outfitId={userData?.equippedOutfit || 'default'}
            size="large"
          />
        </View>
        
        <Card style={styles.comingSoonCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="meditation"
              size={SIZES.icon.large}
              color={COLORS.primary}
            />
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          </View>
          <Text style={styles.comingSoonText}>
            Your Mini Zenni is still developing their wisdom. Soon, they will channel the secrets of mindfulness and answer your deepest questions.
          </Text>
        </Card>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Future Features</Text>
          
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="chat-processing-outline"
              size={SIZES.icon.medium}
              color={COLORS.primary}
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureName}>Wisdom Chats</Text>
              <Text style={styles.featureDescription}>
                Ask questions and receive mindful guidance from your Mini Zenni
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={SIZES.icon.medium}
              color={COLORS.primary}
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureName}>Daily Insights</Text>
              <Text style={styles.featureDescription}>
                Receive personalized wisdom based on your meditation practice
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="puzzle-outline"
              size={SIZES.icon.medium}
              color={COLORS.primary}
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureName}>Mindfulness Challenges</Text>
              <Text style={styles.featureDescription}>
                Complete special tasks to deepen your practice
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.stayTunedText}>
          Stay tuned as Mini Zenni grows in wisdom with each meditation you complete!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
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
    textAlign: 'center',
  },
  zennieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.5,
  },
  comingSoonCard: {
    marginBottom: SPACING.xl,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  comingSoonTitle: {
    ...FONTS.heading.h2,
    color: COLORS.primary,
    marginTop: SPACING.s,
  },
  comingSoonText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    marginBottom: SPACING.l,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: SIZES.borderRadius.medium,
  },
  featureContent: {
    marginLeft: SPACING.m,
    flex: 1,
  },
  featureName: {
    ...FONTS.heading.h4,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  stayTunedText: {
    ...FONTS.body.regular,
    color: COLORS.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.xl,
  },
});

export default GuruModeScreen;
