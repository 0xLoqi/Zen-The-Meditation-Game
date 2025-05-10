import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import ProgressDots from '../../components/ProgressDots';
import { COLORS, SIZES, SPACING, FONTS, SHADOWS } from '../../constants/theme';
// import * as Notifications from 'expo-notifications'; // Uncomment if using expo-notifications

const ReminderPrompt = ({ navigation, route }: any) => {
  const { step = 7, total = 9 } = route.params || {};
  const username = route.params?.username || '';
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logic to request permissions (currently simulated)
  const requestPermissions = async () => {
    if (loading) return; // Prevent double taps
    setLoading(true);
    // --- Replace this timeout with actual permission request --- 
    // const { status } = await Notifications.requestPermissionsAsync();
    // if (status === 'granted') {
    //   setGranted(true);
    // } else {
    //   // Handle permission denied case if needed
    // }
    // --- End Placeholder ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async request
    setGranted(true); // Simulate success
    setLoading(false);
  };

  // Single handler for the button press
  const handlePress = () => {
    if (granted) {
      // If already granted, navigate
      navigation.navigate('Signup', { ...route.params, username: username });
    } else {
      // If not granted, request permissions
      requestPermissions();
    }
  };

  // Determine button text based on state
  const buttonText = loading ? 'Requesting...' : granted ? 'Continue' : 'Allow Reminders';

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/daily_reminders_bg.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <ProgressDots step={step} total={total} />
        <View style={styles.centeredOuter}>
            {/* Ensure no stray text/whitespace here */}
            <TouchableOpacity
              style={styles.button}
              onPress={handlePress}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
             {/* Ensure no stray text/whitespace here */}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    aspectRatio: 9 / 16,
    alignSelf: 'center',
  },
  centeredOuter: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 75,
    paddingHorizontal: SPACING.large,
  },
  button: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.radiusLarge,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.xl,
    width: '85%',
    alignItems: 'center',
    ...SHADOWS.medium,
    elevation: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.bold as '700',
    fontSize: FONTS.large,
  },
});

export default ReminderPrompt; 