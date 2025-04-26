import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useMeditationStore } from '../../store/meditationStore';
import { MeditationType, MeditationDuration } from '../../types';
import PatternBackground from '../../components/PatternBackground';
import FloatingLeaves from '../../components/FloatingLeaves';

const MeditationSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectMeditationSettings } = useMeditationStore();
  
  const [selectedType, setSelectedType] = useState<MeditationType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MeditationDuration | null>(null);
  
  // Meditation types with icons and descriptions
  const meditationTypes: {
    type: MeditationType;
    icon: string;
    title: string;
    description: string;
  }[] = [
    {
      type: 'Calm',
      icon: 'weather-sunset',
      title: 'Calm',
      description: 'Relax your mind and find peace in the present moment.',
    },
    {
      type: 'Focus',
      icon: 'target',
      title: 'Focus',
      description: 'Sharpen your concentration and mental clarity.',
    },
    {
      type: 'Sleep',
      icon: 'moon-waning-crescent',
      title: 'Sleep',
      description: 'Prepare your body and mind for restful sleep.',
    },
  ];
  
  // Meditation durations
  const durations: MeditationDuration[] = [5, 10];
  
  // Handle type selection
  const handleTypeSelect = (type: MeditationType) => {
    setSelectedType(type);
  };
  
  // Handle duration selection
  const handleDurationSelect = (duration: MeditationDuration) => {
    setSelectedDuration(duration);
  };
  
  // Start meditation session
  const startMeditation = () => {
    if (selectedType && selectedDuration) {
      selectMeditationSettings(selectedType, selectedDuration);
      navigation.navigate('MeditationSession');
    }
  };
  
  return (
    <PatternBackground>
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Meditation</Text>
          <Text style={styles.subtitle}>
            Select a practice that suits your current needs
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typesContainer}>
            {meditationTypes.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.typeCard,
                  selectedType === item.type && styles.selectedTypeCard,
                ]}
                onPress={() => handleTypeSelect(item.type)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={32}
                  color={selectedType === item.type ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.typeTitle,
                    selectedType === item.type && styles.selectedTypeText,
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.typeDescription,
                    selectedType === item.type && styles.selectedTypeText,
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationsContainer}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationCard,
                  selectedDuration === duration && styles.selectedDurationCard,
                ]}
                onPress={() => handleDurationSelect(duration)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === duration && styles.selectedDurationText,
                  ]}
                >
                  {duration}
                </Text>
                <Text
                  style={[
                    styles.durationLabel,
                    selectedDuration === duration && styles.selectedDurationText,
                  ]}
                >
                  min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.startButtonContainer}>
          <Button
            title="Begin Meditation"
            onPress={startMeditation}
            disabled={!selectedType || !selectedDuration}
            style={styles.startButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    marginBottom: SPACING.l,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  typeCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.medium,
    padding: SPACING.l,
    alignItems: 'center',
    ...SHADOWS.light,
    marginBottom: SPACING.m,
  },
  selectedTypeCard: {
    backgroundColor: COLORS.primary,
  },
  typeTitle: {
    ...FONTS.heading.h4,
    color: COLORS.neutralDark,
    marginTop: SPACING.s,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  typeDescription: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: COLORS.white,
  },
  durationsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  durationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.medium,
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.l,
    width: 100,
    height: 100,
    ...SHADOWS.light,
  },
  selectedDurationCard: {
    backgroundColor: COLORS.primary,
  },
  durationText: {
    ...FONTS.heading.h1,
    color: COLORS.neutralDark,
  },
  durationLabel: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  selectedDurationText: {
    color: COLORS.white,
  },
  startButtonContainer: {
    marginTop: 'auto',
    paddingTop: SPACING.l,
  },
  startButton: {
    width: '100%',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
});

export default MeditationSelectionScreen;
