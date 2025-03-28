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
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import MoodScale from '../../components/MoodScale';
import Button from '../../components/Button';
import { useUserStore } from '../../store/userStore';

const DailyCheckInScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { submitDailyCheckIn, isLoadingCheckIn, checkInError } = useUserStore();
  
  const [moodRating, setMoodRating] = useState(0);
  const [reflection, setReflection] = useState('');
  
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
      Alert.alert('Check-In Complete', 'Your daily reflection has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Daily Check-In</Text>
              <Text style={styles.subtitle}>
                How zen have you felt lately?
              </Text>
            </View>
            
            <View style={styles.moodContainer}>
              <MoodScale onRatingSelected={handleRatingSelected} />
            </View>
            
            <View style={styles.reflectionContainer}>
              <Text style={styles.reflectionLabel}>
                Add a reflection (optional)
              </Text>
              <TextInput
                style={styles.reflectionInput}
                placeholder="What's on your mind today?"
                placeholderTextColor={COLORS.neutralMedium}
                value={reflection}
                onChangeText={setReflection}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {reflection.length}/200
              </Text>
            </View>
            
            {checkInError && (
              <Text style={styles.errorText}>{checkInError}</Text>
            )}
            
            <View style={styles.buttonsContainer}>
              <Button
                title="Skip"
                variant="outlined"
                onPress={() => navigation.goBack()}
                style={styles.skipButton}
              />
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
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  moodContainer: {
    marginBottom: SPACING.xl,
  },
  reflectionContainer: {
    marginBottom: SPACING.xl,
  },
  reflectionLabel: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    marginBottom: SPACING.s,
  },
  reflectionInput: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.neutralMedium,
    borderRadius: SIZES.borderRadius.small,
    padding: SPACING.l,
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    backgroundColor: COLORS.white,
  },
  characterCount: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.warning,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  skipButton: {
    flex: 1,
    marginRight: SPACING.m,
  },
  submitButton: {
    flex: 1,
    marginLeft: SPACING.m,
  },
});

export default DailyCheckInScreen;
