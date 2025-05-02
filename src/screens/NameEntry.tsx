import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  SafeAreaView,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your stack param list if needed
// type RootStackParamList = { ... NameEntry: undefined; AuthScreen: undefined; ... };
// type NameEntryNavigationProp = StackNavigationProp<RootStackParamList, 'NameEntry'>;
type NameEntryNavigationProp = StackNavigationProp<any, 'NameEntry'>; // Generic fallback

const MINI_ZENNI_IMAGE = require('../../assets/images/minizenni.png');

const NameEntry = () => {
  const navigation = useNavigation<NameEntryNavigationProp>();
  const [userName, setUserName] = useState('');
  const [zenniName, setZenniName] = useState('');
  const nameplateOpacity = useRef(new Animated.Value(0)).current;

  const showNameplate = () => {
    Animated.timing(nameplateOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const hideNameplate = () => {
    Animated.timing(nameplateOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const handleContinue = () => {
    // TODO: Persist names (e.g., update user state/context)
    console.log('User Name:', userName || '(skipped)');
    console.log('Zenni Name:', zenniName || '(skipped)');
    navigation.navigate('AuthScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>Welcome!</Text>

          <View style={styles.previewContainer}>
            <Image source={MINI_ZENNI_IMAGE} style={styles.zenniImage} resizeMode="contain" />
            <Animated.View style={[styles.nameplateContainer, { opacity: nameplateOpacity }]}>
              <Text style={styles.nameplateText}>{zenniName || 'Mini Zenni'}</Text>
            </Animated.View>
          </View>

          <Text style={styles.label}>Your Name (Optional)</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#888"
            onFocus={hideNameplate} // Hide nameplate when focusing other fields
          />

          <Text style={styles.label}>Name your Mini Zenni (Optional)</Text>
          <TextInput
            style={styles.input}
            value={zenniName}
            onChangeText={setZenniName}
            placeholder="Give your companion a name"
            placeholderTextColor="#888"
            onFocus={showNameplate}
            onBlur={hideNameplate}
          />

          <View style={styles.buttonContainer}>
            <Button title="Continue" onPress={handleContinue} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  zenniImage: {
    width: 120,
    height: 120,
  },
  nameplateContainer: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  nameplateText: {
    color: '#fff',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    color: '#555',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});

export default NameEntry; 