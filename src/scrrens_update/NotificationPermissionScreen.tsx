import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
// Import DateTimePicker
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// Import expo-notifications
import * as Notifications from 'expo-notifications';
import { useUserStore } from '../store/userStore'; // Correct relative path
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type NotificationPermissionNavProp = StackNavigationProp<
  RootStackParamList,
  'NotificationPermission'
>;

// Key for AsyncStorage
const FOCUS_TIME_KEY = '@preferredFocusTime';

// It's good practice to set the handler before asking for permissions
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Changed from false to true
    shouldSetBadge: true, // Changed from false to true
  }),
});

const NotificationPermissionScreen: React.FC = () => {
  const navigation = useNavigation<NotificationPermissionNavProp>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  // Default to null, only set when user picks a time
  const [chosenTime, setChosenTime] = useState<Date | null>(null);
  // Get current permission status on mount
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const { setHasNotificationPermission, setPreferredFocusTime: setTimeInStore } = useUserStore((state) => ({
      setHasNotificationPermission: state.setHasNotificationPermission,
      setPreferredFocusTime: state.setPreferredFocusTime,
  }));

  useEffect(() => {
    // Check initial permission status
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      if (status === 'granted') {
        setHasNotificationPermission(true);
      }

      // Load saved time
      const savedTimeString = await AsyncStorage.getItem(FOCUS_TIME_KEY);
      if (savedTimeString) {
        // Attempt to parse saved time - assumes HH:MM format for simplicity
        try {
          const [hours, minutes] = savedTimeString.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            const loadedTime = new Date();
            loadedTime.setHours(hours, minutes, 0, 0);
            setChosenTime(loadedTime);
            console.log('Loaded preferred focus time:', savedTimeString);
          }
        } catch (e) {
          console.error('Failed to parse saved focus time:', e);
        }
      }
    })();
  }, [setHasNotificationPermission]);

  const requestPermissions = async () => {
    console.log('Requesting notification permissions...');
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      console.log('Notification permissions granted.');
      console.log('[Analytics] Event: notification_permission_granted');
      setHasNotificationPermission(true);
    } else {
      console.log('Notification permissions denied.');
      setHasNotificationPermission(false);
      Alert.alert(
        'Permissions Denied',
        'You can enable notifications later in your device settings if you change your mind.'
      );
    }
  };

  const handleTimeChange = async (event: DateTimePickerEvent, selectedTime?: Date) => {
    // Always hide picker after selection/dismissal on Android
    if (Platform.OS === 'android') {
        setShowTimePicker(false);
    }
    // Check if a time was actually selected (vs dismissed)
    if (event.type === 'set' && selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChosenTime(selectedTime);
      console.log('Time chosen:', timeString);
      // Save preferred time to store AND AsyncStorage
      setTimeInStore(timeString); // Update Zustand store
      try {
        await AsyncStorage.setItem(FOCUS_TIME_KEY, timeString); // Save to AsyncStorage
        console.log('Saved preferred focus time to AsyncStorage.');
      } catch (e) {
        console.error('Failed to save focus time to AsyncStorage:', e);
      }
      console.log('[Analytics] Event: preferred_focus_time_set', { time: timeString });
      // Hide picker on iOS after selection
      if (Platform.OS === 'ios') {
          setShowTimePicker(false);
      }
    } else {
        // Handle dismissal (optional)
        console.log('Time picker dismissed');
        if (Platform.OS === 'ios') { // Need to hide manually on iOS dismissal
           setShowTimePicker(false);
        }
    }
  };

  const handleContinue = () => {
    if (permissionStatus !== Notifications.PermissionStatus.GRANTED) {
      Alert.alert(
        'Enable Notifications?',
        'Allowing notifications helps Zenni remind you to focus. You can skip this for now.',
        [
          { text: 'Skip', onPress: () => navigateNext(), style: 'cancel' },
          { text: 'Allow', onPress: requestPermissions },
        ]
      );
      return;
    }
    // If permission granted, time *must* be chosen to continue via this button
    if (!chosenTime) {
      Alert.alert('Time Required', 'Please select your preferred reminder time.');
      return;
    }
    // Time saving and analytics are now handled in handleTimeChange
    navigateNext();
  };

  // Helper function to navigate to the next screen
  const navigateNext = () => {
    console.log('Navigating to StoneScarcityScreen...');
    navigation.navigate('StoneScarcity');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Focus Reminder</Text>
      <Text style={styles.text}>
        Zenni can help you focus — just once a day.
        Allow notifications to receive a gentle reminder at your preferred time.
      </Text>

      {permissionStatus !== Notifications.PermissionStatus.GRANTED && (
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Allow Notifications</Text>
        </TouchableOpacity>
      )}

      {permissionStatus === Notifications.PermissionStatus.GRANTED && (
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerLabel}>Preferred Reminder Time:</Text>
          {/* Button to show Picker */}
          <Button
            onPress={() => setShowTimePicker(true)}
            title={chosenTime ? chosenTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
          />
          {/* Actual DateTimePicker Component */}
          {showTimePicker && (
            <DateTimePicker
              value={chosenTime || new Date()} // Use chosen time or default to now
              mode="time"
              is24Hour={true}
              display="spinner" // Or "default", "clock", "calendar"
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          permissionStatus === Notifications.PermissionStatus.GRANTED && !chosenTime
            ? styles.disabledButton
            : {},
        ]}
        onPress={handleContinue}
        disabled={permissionStatus === Notifications.PermissionStatus.GRANTED && !chosenTime}
      >
        <Text style={styles.buttonText}>
          {permissionStatus !== Notifications.PermissionStatus.GRANTED ? 'Skip / Continue' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F0F4F8', // Light blue-grey background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#555',
  },
  permissionButton: {
    backgroundColor: '#4CAF50', // Green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  timePickerContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  timePickerLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  continueButton: {
    backgroundColor: '#2196F3', // Blue
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD', // Grey out when disabled
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NotificationPermissionScreen;
