import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import Button from '../../components/Button';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { playSoundById } from '../../services/audio';

type NameEntryScreenNavigationProp = NativeStackNavigationProp<any>;

const NameEntryScreen = () => {
  const navigation = useNavigation<NameEntryScreenNavigationProp>();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }

    setError('');

    console.log(`[NameEntryScreen] Navigating to ReminderPrompt with name: ${trimmedName}`);
    navigation.navigate('ReminderPrompt', { username: trimmedName });

    if (success) {
      playSoundById('generic_win');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/name_screen_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.inner}>
            <Text style={styles.title}>What should we call you?</Text>
            <Text style={styles.subtitle}>You can change this later.</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={text => { setName(text); setError(''); }}
              autoCapitalize="words"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button
              title={"Continue"}
              onPress={handleContinue}
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    width: '92%',
    maxWidth: 340,
    marginVertical: 18,
  },
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 18,
    color: '#222',
    marginBottom: SPACING.medium,
  },
  error: {
    color: '#fff',
    fontSize: 14,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: SPACING.small,
  },
});

export default NameEntryScreen; 