import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useMeditationStore } from '../../store/meditationStore';
import { MeditationType, MeditationDuration } from '../../types';
import FloatingLeaves from '../../components/FloatingLeaves';
import { useUserStore } from '../../store/userStore';
import * as Animatable from 'react-native-animatable';
import MoodScale from '../../components/MoodScale';

const MeditationSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectMeditationSettings } = useMeditationStore();
  const username = useUserStore((s) => s.userData?.username);
  const insets = useSafeAreaInsets();
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [encouragement, setEncouragement] = useState('');
  
  // Meditation durations
  const durations = [
    { value: 5, xp: 50, tokens: 0, spin: true },
    { value: 10, xp: 120, tokens: 5, spin: true },
    { value: 15, xp: 200, tokens: 10, spin: true },
    { value: 20, xp: 300, tokens: 15, spin: true },
  ];
  
  // Start meditation session
  const startMeditation = () => {
    if (selectedDuration) {
      selectMeditationSettings(null, selectedDuration);
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { top: insets.top + 10 }]}>
        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
      </TouchableOpacity>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Value Statement */}
        <View style={{ alignItems: 'center', marginBottom: 18, marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center', backgroundColor: 'rgba(35,32,20,0.7)', borderRadius: 12, padding: 8 }}>
            Earn XP, tokens, and a free spin for your first meditation each day!
          </Text>
        </View>
        {/* MoodScale and Reflection Input (copy from DailyCheckInScreen, minus MiniZenni) */}
        <View style={{ marginBottom: 18 }}>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>How are you feeling?</Text>
            <MoodScale
              onRatingSelected={() => {}}
              iconStyle={{ textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
              labelStyle={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <TextInput
              style={{ height: 80, borderWidth: 1, borderColor: '#B68900', borderRadius: 16, padding: 12, color: '#fff', backgroundColor: 'rgba(35,32,20,0.5)', fontSize: 16, minHeight: 80, maxHeight: 200 }}
              placeholder="What's on your mind? (Optional)"
              placeholderTextColor="#FFD580"
              multiline
              maxLength={1000}
              textAlignVertical="top"
              // value/onChangeText to be wired up
            />
          </View>
        </View>
        {/* Duration Selection */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBg}><Text style={styles.sectionTitle}>Duration</Text></View>
          <View style={styles.durationsContainer}>
            {durations.map((d) => (
              <Animatable.View
                key={d.value}
                animation={selectedDuration === d.value ? 'pulse' : undefined}
                duration={300}
                useNativeDriver
                style={{ flex: 1 }}
              >
                <TouchableOpacity
                  style={[
                    styles.durationCard,
                    selectedDuration === d.value && styles.selectedDurationCard,
                  ]}
                  onPress={() => setSelectedDuration(d.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === d.value && styles.selectedDurationText,
                    ]}
                  >
                    {d.value}
                  </Text>
                  <Text
                    style={[
                      styles.durationLabel,
                      selectedDuration === d.value && styles.selectedDurationText,
                    ]}
                  >
                    min
                  </Text>
                  {/* XP Reward */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <MaterialCommunityIcons name="star-circle" size={18} color="#FFD700" style={{ marginRight: 2 }} />
                    <Text style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{d.xp} XP</Text>
                  </View>
                  {/* Token Bonus */}
                  {d.tokens > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <MaterialCommunityIcons name="coin" size={16} color="#FFD580" style={{ marginRight: 2 }} />
                      <Text style={{ color: '#FFD580', fontWeight: 'bold', fontSize: 12 }}>+{d.tokens} Tokens</Text>
                    </View>
                  )}
                  {/* Spin Reward */}
                  {d.spin && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <MaterialCommunityIcons name="sync" size={15} color="#B68900" style={{ marginRight: 2 }} />
                      <Text style={{ color: '#B68900', fontSize: 11 }}>1st/day: +1 Spin</Text>
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
          title={selectedDuration ? `Begin ${selectedDuration} min Meditation` : 'Begin Meditation'}
          onPress={startMeditation}
          disabled={!selectedDuration}
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
    marginBottom: 0,
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
    top: 18,
    left: 18,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  headerBg: {
    backgroundColor: 'rgba(35,32,20,0.7)',
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
    marginTop: 16,
    alignSelf: 'stretch',
  },
  sectionTitleBg: {
    backgroundColor: 'rgba(35,32,20,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
});

export default MeditationSelectionScreen;
