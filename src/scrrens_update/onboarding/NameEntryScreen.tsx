import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import Button from '../../components/Button';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setUserData } from '../../firebase/user';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { User } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NameEntryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NameEntryScreen = () => {
  const navigation = useNavigation<NameEntryScreenNavigationProp>();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();
  const { getUserData } = useUserStore();

  const handleContinue = async () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setIsSaving(true);
    setError('');
    let userIdToUse: string | undefined | null = null;
    let attempts = 0;

    try {
      if (user?.uid) {
        userIdToUse = user.uid;
      } else {
        console.log('[NameEntryScreen] No user.uid found in authStore, checking AsyncStorage...');
        const initialUserId = await AsyncStorage.getItem('@user_id');
        console.log(`[NameEntryScreen] Initial AsyncStorage check found @user_id: ${initialUserId}`);
        userIdToUse = initialUserId;
      }

      while (!userIdToUse && attempts < 3) {
        attempts++;
        console.log(`User ID not found, attempt ${attempts}. Retrying in 500ms...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        userIdToUse = await AsyncStorage.getItem('@user_id');
      }

      if (!userIdToUse) {
        console.error('User ID still not found after retries.');
        setError('Could not find user identifier. Please restart the app.');
        setIsSaving(false);
        return;
      }

      console.log(`[NameEntryScreen] User ID found: ${userIdToUse}. Setting username...`);
      const updateData: Partial<User> = { username: name.trim() };
      await setUserData(userIdToUse, updateData);
      console.log('[NameEntryScreen] Username saved, refreshing user data store...');
      console.log('[Analytics] Event: user_named', { name: name.trim() });
      await getUserData();
      console.log('[NameEntryScreen] User data refreshed, navigating to MainApp...');

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });

    } catch (err: any) {
      console.error("Failed to save username or get user ID:", err);
      setError(err.message || 'Failed to save name. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>You can change this later.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={text => { setName(text); setError(''); }}
          autoCapitalize="words"
          editable={!isSaving}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={isSaving ? "Saving..." : "Continue"}
          onPress={handleContinue}
          style={styles.button}
          disabled={isSaving}
        />
        {isSaving && <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.neutralLight,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.medium,
    fontSize: 18,
    color: COLORS.neutralDark,
    marginBottom: SPACING.medium,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: SPACING.small,
  },
  spinner: {
    marginTop: SPACING.medium,
  },
});

export default NameEntryScreen; 