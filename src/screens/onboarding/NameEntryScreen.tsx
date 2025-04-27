import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const NameEntryScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    // Save name to user store or context here if needed
    navigation.navigate('GlowbagOffer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>What's your name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={text => { setName(text); setError(''); }}
          autoCapitalize="words"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Continue" onPress={handleContinue} style={styles.button} />
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
  },
});

export default NameEntryScreen; 