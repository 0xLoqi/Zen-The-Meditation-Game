import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useMeditationStore } from '../../store/meditationStore';
import { useGameStore } from '../../store';
import { MeditationType, MeditationDuration } from '../../types';
import FloatingLeaves from '../../components/FloatingLeaves';
import { useUserStore } from '../../store/userStore';
import * as Animatable from 'react-native-animatable';
import MoodScale from '../../components/MoodScale';
import MiniZenni from '../../components/MiniZenni';
import { Animated, Easing } from 'react-native';

// Strong, universal, curiosity-driven hooks
const PLACEHOLDER_MESSAGES = [
  "A single thought can change a day.",
  "What's unspoken often matters most.",
  "A pattern reveals itself in words.",
  "A question, a wish, a memory—let it land.",
  "The mind's weather, captured in a phrase.",
  "A secret, a hope, a spark—set it free.",
  "A moment of honesty, no audience.",
  "A feeling, named, loses its grip.",
  "A truth, once written, becomes lighter.",
  "A story, waiting for its first line.",
];

const MeditationSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectMeditationSettings } = useMeditationStore();
  const completeQuest = useGameStore((s) => s.completeQuest);
  const username = useUserStore((s) => s.userData?.username);
  const insets = useSafeAreaInsets();
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [encouragement, setEncouragement] = useState('');
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  
  // Meditation durations
  const durations = [
    { value: 5, xp: 50, tokens: 0, spin: true },
    { value: 10, xp: 120, tokens: 5, spin: true },
    { value: 15, xp: 200, tokens: 10, spin: true },
    { value: 20, xp: 300, tokens: 15, spin: true },
  ];
  
  // Get user's equipped cosmetics for MiniZenni
  const equipped = useGameStore((s) => s.cosmetics.equipped);
  
  // Animation for floating MiniZenni
  const [floatAnim] = useState(new Animated.Value(0));
  React.useEffect(() => {
    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      const duration = 3500 + Math.random() * 2500; // 3.5s to 6s
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration * 0.7,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
    return () => { isMounted = false; };
  }, [floatAnim]);
  
  // Interpolate for X and Y movement (float in/out)
  const floatX = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [120, -40] });
  const floatY = floatAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -18, 0] });
  
  // Animated glow for TextInput
  const [glowAnim] = useState(new Animated.Value(0));
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  useEffect(() => {
    let glowInterval: NodeJS.Timeout;
    let placeholderInterval: NodeJS.Timeout;
    if (!reflection) {
      // Pulse glow
      const pulse = () => {
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 700, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 700, useNativeDriver: false }),
        ]).start(() => pulse());
      };
      pulse();
      // Randomly rotate placeholder
      placeholderInterval = setInterval(() => {
        setPlaceholderIdx((idx) => {
          let next;
          do {
            next = Math.floor(Math.random() * PLACEHOLDER_MESSAGES.length);
          } while (next === idx && PLACEHOLDER_MESSAGES.length > 1);
          return next;
        });
      }, 7000);
    }
    return () => {
      glowAnim.stopAnimation();
      clearInterval(glowInterval);
      clearInterval(placeholderInterval);
    };
  }, [reflection]);
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD580', '#FF8C42']
  });
  
  // Start meditation session
  const startMeditation = () => {
    if (selectedDuration) {
      // Complete first reflection quest when beginning meditation
      completeQuest('daily_checkin_start');
      selectMeditationSettings(null, selectedDuration);
      navigation.navigate('MeditationSession');
    }
  };
  
  // Bonus badge logic
  const showBonus = selectedDuration && selectedDuration >= 10;
  
  // FlatList header for value statement, mood scale, and reflection input
  const renderHeader = useCallback(() => (
    <>
      <View style={{ paddingTop: insets.top, marginBottom: 18 }}>
        {/* Removed XP/tokens banner */}
      </View>
      <View style={{ marginBottom: 18 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Quick check-in?</Text>
          <MoodScale
            onRatingSelected={setMoodRating}
            selectedRating={moodRating}
            iconStyle={{}}
            labelStyle={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Animated.View style={{
            borderRadius: 16,
            borderWidth: 2,
            borderColor: reflection ? '#B68900' : glowColor,
            shadowColor: reflection ? 'transparent' : '#FF8C42',
            shadowOpacity: reflection ? 0 : 0.5,
            shadowRadius: reflection ? 0 : 12,
            shadowOffset: { width: 0, height: 0 },
          }}>
            <TextInput
              style={{ height: 80, borderRadius: 14, padding: 12, color: '#fff', backgroundColor: 'rgba(35,32,20,0.5)', fontSize: 16, minHeight: 80, maxHeight: 200 }}
              placeholder={PLACEHOLDER_MESSAGES[placeholderIdx]}
              placeholderTextColor="#FFD580"
              multiline
              maxLength={1000}
              textAlignVertical="top"
              value={reflection}
              onChangeText={setReflection}
            />
          </Animated.View>
        </View>
      </View>
    </>
  ), [insets.top, moodRating, reflection, placeholderIdx, glowColor]);

  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/pre_meditation_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      {/* Animated MiniZenni floating in/out top right */}
      <Animated.View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          right: 0,
          zIndex: 30,
          transform: [
            { translateX: floatX },
            { translateY: floatY },
          ],
        }}
        pointerEvents="none"
      >
        <MiniZenni
          outfitId={equipped.outfit}
          headgearId={equipped.headgear}
          auraId={equipped.aura}
          faceId={equipped.face}
          accessoryId={equipped.accessory}
          companionId={equipped.companion}
          size="small"
          animationState="idle"
        />
      </Animated.View>
      {/* Back Button - absolutely positioned at the top left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { top: insets.top + 18, left: insets.left + 18 }]}>
        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
      </TouchableOpacity>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <FlatList
          data={durations}
          numColumns={2}
          keyExtractor={(item) => item.value.toString()}
          contentContainerStyle={styles.durationsContainer}
          columnWrapperStyle={{ justifyContent: 'center' }}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.durationCardGrid,
                selectedDuration === item.value && styles.selectedDurationCard,
              ]}
              onPress={() => setSelectedDuration(item.value)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#232014',
                }}
              >
                {item.value}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#232014',
                  marginBottom: 2,
                }}
              >
                min
              </Text>
              {/* XP Reward */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <MaterialCommunityIcons name="star-circle" size={18} color="#E6B800" style={{ marginRight: 2 }} />
                <Text style={{ color: '#E6B800', fontWeight: 'bold', fontSize: 13 }}>{item.xp} XP</Text>
              </View>
              {/* Token Bonus */}
              {item.tokens > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <MaterialCommunityIcons name="currency-usd" size={16} color="#2CB67D" style={{ marginRight: 2 }} />
                  <Text style={{ color: '#2CB67D', fontWeight: 'bold', fontSize: 12 }}>+{item.tokens} Tokens</Text>
                </View>
              )}
              {/* Spin Reward */}
              {item.spin && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <MaterialCommunityIcons name="sync" size={15} color="#6B5E4E" style={{ marginRight: 2 }} />
                  <Text style={{ color: '#6B5E4E', fontSize: 11 }}>1st/day: +1 Spin</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
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
    alignItems: 'flex-start',
    maxWidth: 400,
    alignSelf: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  durationCardGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: '45%',
    maxWidth: '45%',
    margin: '2.5%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 10,
  },
  selectedDurationCard: {
    backgroundColor: '#FF8C42',
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
    paddingHorizontal: 24,
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
