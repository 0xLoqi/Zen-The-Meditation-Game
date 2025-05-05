import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as IAP from 'expo-in-app-purchases';
import { ZENNI_PLUS_TIER1 } from '../../constants/iap';

const PaywallScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zenni Plus</Text>
      <Text style={styles.subtitle}>Unlock premium features:</Text>
      <View style={styles.perksList}>
        <Text>• Ad-free experience</Text>
        <Text>• Double XP</Text>
        <Text>• Exclusive cosmetics</Text>
      </View>
      <Button
        title="Purchase Zenni Plus"
        onPress={async () => {
          try {
            await IAP.purchaseItemAsync(ZENNI_PLUS_TIER1);
            Alert.alert('Success', 'Purchase initiated!');
          } catch (e) {
            Alert.alert('Error', 'Could not start purchase.');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  perksList: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
});

export default PaywallScreen; 