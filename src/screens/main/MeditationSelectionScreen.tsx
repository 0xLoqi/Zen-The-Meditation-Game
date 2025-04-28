import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
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
import FloatingLeaves from '../../components/FloatingLeaves';
import { useUserStore } from '../../store/userStore';
import * as Animatable from 'react-native-animatable';

const MeditationSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectMeditationSettings } = useMeditationStore();
  const username = useUserStore((s) => s.userData?.username);
  
  const [selectedType, setSelectedType] = useState<MeditationType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MeditationDuration | null>(null);
  const [encouragement, setEncouragement] = useState('');
  
  // Meditation types with icons and descriptions
  const meditationTypes: {
    type: MeditationType;
    icon: string;
    title: string;
    description: string;
    encouragement: string;
  }[] = [
    {
      type: 'calm',
      icon: 'weather-sunset',
      title: 'Calm',
      description: 'Relax your mind and find peace in the present moment.',
      encouragement: 'Ready to get calm?',
    },
    {
      type: 'focus',
      icon: 'target',
      title: 'Focus',
      description: 'Sharpen your concentration and mental clarity.',
      encouragement: "Let's focus together!",
    },
    {
      type: 'sleep',
      icon: 'moon-waning-crescent',
      title: 'Sleep',
      description: 'Prepare your body and mind for restful sleep.',
      encouragement: 'Drift into deep rest.',
    },
  ];
  
  // Meditation durations
  const durations: MeditationDuration[] = [5, 10, 15, 20];
  
  // Handle type selection
  const handleTypeSelect = (type: MeditationType) => {
    setSelectedType(type);
    const found = meditationTypes.find((t) => t.type === type);
    setEncouragement(found?.encouragement || '');
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
  
  // Bonus badge logic
  const showBonus = selectedDuration && selectedDuration >= 10;
  
  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/pre_meditation_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      {/* Back Button - absolutely positioned at the top left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#B68900" />
      </TouchableOpacity>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            How would you like to meditate today?
          </Text>
          <Text style={styles.subtitle}>
            {encouragement || 'Select a practice that suits your current needs'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 8 }}>
            <View style={styles.typesContainer}>
              {meditationTypes.map((item) => (
                <Animatable.View
                  key={item.type}
                  animation={selectedType === item.type ? 'pulse' : undefined}
                  duration={300}
                  useNativeDriver
                >
                  <TouchableOpacity
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
                      color={selectedType === item.type ? '#fff' : '#B68900'}
                    />
                    <Text
                      style={[
                        styles.typeTitle,
                        selectedType === item.type && styles.selectedTypeText,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationsContainer}>
            {durations.map((duration) => (
              <Animatable.View
                key={duration}
                animation={selectedDuration === duration ? 'pulse' : undefined}
                duration={300}
                useNativeDriver
                style={{ flex: 1 }}
              >
                <TouchableOpacity
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
                  {duration >= 10 && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusBadgeText}>+{duration} XP</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Sticky Start Button */}
      <View style={styles.stickyStartButtonContainer}>
        <Button
          title={selectedType && selectedDuration ? `Begin ${selectedDuration} min ${selectedType} Meditation` : 'Begin Meditation'}
          onPress={startMeditation}
          disabled={!selectedType || !selectedDuration}
          style={styles.startButton}
        />
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
    marginTop: 52,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF9E3',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF9E3',
    marginBottom: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeCard: {
    width: 130,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  selectedTypeCard: {
    backgroundColor: '#B68900',
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B68900',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: '#fff',
  },
  durationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  durationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 12,
    width: 80,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDurationCard: {
    backgroundColor: '#B68900',
  },
  durationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B68900',
  },
  durationLabel: {
    fontSize: 16,
    color: '#B68900',
  },
  selectedDurationText: {
    color: '#fff',
  },
  startButton: {
    width: '100%',
    paddingVertical: 12,
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
  bonusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFD580',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  bonusBadgeText: {
    color: '#B68900',
    fontWeight: 'bold',
    fontSize: 9,
  },
  stickyStartButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingTop: 8,
    paddingBottom: 48,
    paddingLeft: 16,
    paddingRight: 16,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 58,
    left: 8,
    zIndex: 20,
    padding: 8,
  },
});

export default MeditationSelectionScreen;
