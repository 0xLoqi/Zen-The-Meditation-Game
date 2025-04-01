import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FloatingLeaves from '../../components/FloatingLeaves';
import { useMiniZenniStore } from '../../store/miniZenniStore';
import { Ionicons } from '@expo/vector-icons';
import MiniZenni from '../../components/MiniZenni';
import PatternBackground from '../../components/PatternBackground';

const NameSelectionScreen = () => {
  const navigation = useNavigation();
  const { setMiniZenniName } = useMiniZenniStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateName = (value: string) => {
    if (value.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (value.length > 20) {
      return 'Name must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
      return 'Name can only contain letters, numbers, spaces, and hyphens';
    }
    return '';
  };

  const handleNext = () => {
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setMiniZenniName(name);
    navigation.navigate('ColorSelection');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setError('');
  };

  return (
    <PatternBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundContainer}>
          <FloatingLeaves count={30} />
        </View>
        
        <View style={styles.contentWrapper}>
          {/* Back Button */}
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

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                <View style={styles.headerContainer}>
                  <Image
                    source={require('../../../assets/images/minizenni.png')}
                    style={[styles.miniZenniImage, { tintColor: '#000000' }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.title}>Name Your Mini Zenni</Text>
                  <Text style={styles.description}>
                    Choose a name that resonates with your spiritual companion's essence.
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Input
                    label=""
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="Enter a name"
                    error={error}
                    autoCapitalize="words"
                    maxLength={20}
                    containerStyle={styles.input}
                    textStyle={styles.inputText}
                  />
                </View>

                <Button
                  title="Continue"
                  onPress={handleNext}
                  disabled={!name || !!error}
                  size="large"
                  style={styles.button}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xxlarge + 40, // Account for back button
    paddingBottom: SPACING.xxlarge,
    paddingHorizontal: SPACING.medium,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
    width: '100%',
    maxWidth: 300,
  },
  miniZenniImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.medium,
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.small,
    fontSize: 24,
  },
  description: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: SPACING.medium,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: SPACING.xxlarge,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: SPACING.medium,
    ...SHADOWS.medium,
  },
  inputText: {
    ...FONTS.body.large,
    color: COLORS.neutralDark,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    width: '100%',
    maxWidth: 250,
  },
});

export default NameSelectionScreen; 