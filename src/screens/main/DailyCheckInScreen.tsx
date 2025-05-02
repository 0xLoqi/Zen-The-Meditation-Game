import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import MoodScale from '../../components/MoodScale';
import Button from '../../components/Button';
import { useUserStore } from '../../store/userStore';
import MiniZenni from '../../components/MiniZenni';
import { Ionicons } from '@expo/vector-icons';
import FloatingLeaves from '../../components/FloatingLeaves';
import { useGameStore } from '../../store';

const DailyCheckInScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { submitDailyCheckIn, isLoadingCheckIn, checkInError, userData } = useUserStore();
  
  const [moodRating, setMoodRating] = useState(0);
  const [reflection, setReflection] = useState('');
  
  const equipped = (userData as any)?.cosmetics?.equipped || {};
  
  // Map to MiniZenni props
  const equippedProps = {
    outfitId: equipped.outfit,
    headgearId: equipped.headgear,
    auraId: equipped.aura,
    faceId: equipped.face,
    accessoryId: equipped.accessory,
    companionId: equipped.companion,
  };
  
  // Handle rating selection
  const handleRatingSelected = (rating: number) => {
    setMoodRating(rating);
  };
  
  // Handle submit check-in
  const handleSubmit = async () => {
    if (moodRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating for your current mood');
      return;
    }
    
    try {
      await submitDailyCheckIn(moodRating, reflection);
      // mark quest complete based on questId
      const questId = route.params?.questId;
      if (questId) {
        useGameStore.getState().completeQuest(questId);
      }
      Alert.alert('Check-In Complete', 'Your daily reflection has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/home_screen_bg_2.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FloatingLeaves count={12} style={styles.leavesBackground} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent', paddingTop: SPACING.screenVertical, paddingBottom: SPACING.screenVertical, paddingHorizontal: SPACING.screenHorizontal }]}>
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.zenniContainer}>
            <MiniZenni size="large" {...equippedProps} />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerBg}>
                <Text style={styles.title}>How are you feeling today?</Text>
                <Text style={styles.subtitle}>Zenni is here to listen. Take a moment for yourself.</Text>
              </View>
              <View style={styles.moodContainer}>
                <MoodScale
                  onRatingSelected={handleRatingSelected}
                  iconStyle={{ textShadowColor: COLORS.backgroundDark, textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                  labelStyle={{ color: COLORS.text, fontSize: FONTS.base, fontWeight: 'bold', textAlign: 'center', textShadowColor: COLORS.backgroundDark, textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                />
              </View>
              <View style={styles.reflectionContainerBg}>
                <TextInput
                  style={styles.reflectionInput}
                  placeholder="What's on your mind? (Optional)"
                  placeholderTextColor={COLORS.neutralMedium}
                  value={reflection}
                  onChangeText={setReflection}
                  multiline
                  maxLength={1000}
                  textAlignVertical="top"
                />
              </View>
              {checkInError && (
                <Text style={styles.errorText}>{checkInError}</Text>
              )}
              <View style={styles.buttonsContainer}>
                <Button
                  title="Submit"
                  onPress={handleSubmit}
                  isLoading={isLoadingCheckIn}
                  style={styles.submitButton}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  zenniContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  headerBg: {
    backgroundColor: 'rgba(35,32,20,0.7)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading1,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    color: '#fff',
    textAlign: 'center',
  },
  moodContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  reflectionContainerBg: {
    marginBottom: SPACING.m,
  },
  reflectionInput: {
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SPACING.l,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    fontSize: FONTS.base,
    marginBottom: 4,
    minHeight: 80,
    maxHeight: 200,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.warning,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButton: {
    width: '80%',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 50,
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

export default DailyCheckInScreen;
