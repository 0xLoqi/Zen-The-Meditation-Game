import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
// TODO: Import a DateTimePicker component if needed
// import DateTimePicker from '@react-native-community/datetimepicker';
// TODO: Import a permissions library if needed (e.g., expo-notifications or react-native-permissions)
// import * as Notifications from 'expo-notifications';

type NotificationPermissionNavProp = StackNavigationProp<
  RootStackParamList,
  'NotificationPermission'
>;

const NotificationPermissionScreen: React.FC = () => {
  const navigation = useNavigation<NotificationPermissionNavProp>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chosenTime, setChosenTime] = useState<Date | null>(new Date()); // Default to now
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');

  const requestPermissions = async () => {
    // Placeholder for actual permission request logic
    console.log('Requesting notification permissions...');
    // Example using expo-notifications:
    /*
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionStatus('granted');
      console.log('Notification permissions granted.');
    } else {
      setPermissionStatus('denied');
      Alert.alert('Permission Denied', 'You can enable notifications later in settings.');
      console.log('Notification permissions denied.');
    }
    */
    // For now, simulate granting permission
    setPermissionStatus('granted');
    Alert.alert('Permissions', '(Simulated) Notification permissions granted!');
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || chosenTime;
    setShowTimePicker(Platform.OS === 'ios'); // Keep open on iOS until dismissal
    setChosenTime(currentTime);
    console.log('Time chosen:', currentTime?.toLocaleTimeString());
    // TODO: Save preferred time to state/storage
  };

  const handleContinue = () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permissions Required', 'Please grant notification permissions to continue.');
      return;
    }
    if (!chosenTime) {
      Alert.alert('Time Required', 'Please select a preferred notification time.');
      return;
    }
    // TODO: Save permission status and time if not already done
    console.log('Navigating to StoneScarcityScreen...');
    navigation.navigate('StoneScarcity');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Focus Reminder</Text>
      <Text style={styles.text}>
        Zenni can help you focus — just once a day.
        Allow notifications to receive a gentle reminder at your preferred time.
      </Text>

      {permissionStatus !== 'granted' && (
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Allow Notifications</Text>
        </TouchableOpacity>
      )}

      {permissionStatus === 'granted' && (
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerLabel}>Preferred Reminder Time:</Text>
          {/* Basic Button to trigger TimePicker - Replace with actual Picker */}
          <Button
            onPress={() => setShowTimePicker(true)}
            title={chosenTime ? chosenTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
          />
          {/* TODO: Integrate actual DateTimePicker component here */}
          {/* Example placeholder logic for DateTimePicker visibility */}
          {/* {showTimePicker && (
            <DateTimePicker
              value={chosenTime || new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )} */}
        </View>
      )}

      <TouchableOpacity
        style={[styles.continueButton, permissionStatus !== 'granted' || !chosenTime ? styles.disabledButton : {}]}
        onPress={handleContinue}
        disabled={permissionStatus !== 'granted' || !chosenTime}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
    fontFamily: 'YourAppName-Bold', // TODO: Font
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#555',
    fontFamily: 'YourAppName-Regular', // TODO: Font
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
    fontFamily: 'YourAppName-Regular', // TODO: Font
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
    fontFamily: 'YourAppName-Bold', // TODO: Font
  },
});

export default NotificationPermissionScreen; 