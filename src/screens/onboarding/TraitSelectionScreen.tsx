import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import FloatingLeaves from '../../components/FloatingLeaves';
import { TRAITS } from '../../constants/miniZenni';
import { useMiniZenniStore } from '../../store/miniZenniStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PatternBackground from '../../components/PatternBackground';
import { analytics } from '../../firebase';

const getTraitIcon = (traitId: string) => {
  switch (traitId) {
    case 'curious':
      return { name: 'lightbulb-on', color: '#FF8C42' }; // Curious orange
    case 'sleepy':
      return { name: 'moon-waning-crescent', color: '#6B8E23' }; // Calm green
    case 'playful':
      return { name: 'emoticon-excited', color: '#FFB347' }; // Playful yellow
    case 'wise':
      return { name: 'book-open-variant', color: '#4682B4' }; // Wise blue
    case 'energetic':
      return { name: 'lightning-bolt', color: '#FF6B6B' }; // Energetic red
    default:
      return { name: 'meditation', color: COLORS.primary };
  }
};

const TraitSelectionScreen = () => {
  const navigation = useNavigation();
  const { setTrait, element } = useMiniZenniStore();
  const [selectedTrait, setSelectedTrait] = useState(TRAITS[0]);

  const handleTraitSelect = (trait: typeof TRAITS[0]) => {
    setSelectedTrait(trait);
  };

  const handleNext = () => {
    setTrait(selectedTrait);
    if (analytics && typeof analytics.logEvent === 'function') {
      analytics.logEvent('onboarding_complete');
      if (element) {
        analytics.setUserProperties({ element });
      }
      analytics.setUserProperties({ trait: selectedTrait.id });
    }
    navigation.navigate('GlowbagOffer');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const currentIcon = getTraitIcon(selectedTrait.id);

  return (
    <PatternBackground>
      <SafeAreaView style={styles.container}>
        <FloatingLeaves count={30} style={styles.leavesBackground} />
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons 
            name="chevron-back" 
            size={28} 
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={[styles.iconContainer, { backgroundColor: currentIcon.color }]}>
            <MaterialCommunityIcons
              name={currentIcon.name}
              size={48}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.title}>Choose a Trait</Text>
          <Text style={styles.description}>
            Select a personality trait that will shape your Mini Zenni's behavior.
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.traitGrid}>
            {TRAITS.map((trait) => (
              <TouchableOpacity
                key={trait.id}
                style={[
                  styles.traitOption,
                  selectedTrait.id === trait.id && styles.selectedTraitOption,
                ]}
                onPress={() => handleTraitSelect(trait)}
              >
                <Text style={styles.traitName}>{trait.name}</Text>
                <Text style={styles.traitDescription}>
                  {trait.description}
                </Text>
                <Text style={styles.traitEffect}>
                  {trait.behaviorEffect}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleNext}
            size="large"
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxlarge + 40,
    paddingHorizontal: SPACING.medium,
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingBottom: SPACING.medium,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.medium,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  description: {
    fontSize: 16,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    flexGrow: 1,
  },
  traitGrid: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    gap: SPACING.medium,
    paddingBottom: SPACING.large,
  },
  traitOption: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.large,
    ...SHADOWS.medium,
  },
  selectedTraitOption: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  traitName: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  traitDescription: {
    fontSize: 16,
    color: COLORS.neutralDark,
    marginBottom: SPACING.medium,
  },
  traitEffect: {
    fontSize: 14,
    color: COLORS.neutralMedium,
    fontStyle: 'italic',
  },
  footer: {
    width: '100%',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});

export default TraitSelectionScreen; 