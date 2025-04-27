import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useUserStore } from '../store/userStore';

const productIds = ['zen_premium_monthly', 'zen_premium_annual'];

const PaywallScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const isPremium = useUserStore((s) => s.isPremium);
  const setPremium = useUserStore((s) => s.setPremium);

  useEffect(() => {
    if (isPremium) {
      navigation.replace('Home');
      return;
    }
    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        const items = await RNIap.getProducts({ skus: productIds });
        setProducts(items);
      } catch (e) {
        Alert.alert('IAP Error', 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    initIAP();
    return () => {
      RNIap.endConnection();
    };
  }, [isPremium]);

  const handlePurchase = async (sku: string) => {
    setPurchasing(true);
    try {
      const purchase = await RNIap.requestPurchase({ sku });
      // TODO: Validate receipt, unlock premium, persist premium flag
      setPremium(true);
      Alert.alert('Success', 'Zen Premium unlocked!');
      navigation.replace('Home');
    } catch (e) {
      const message = typeof e === 'object' && e && 'message' in e ? (e as any).message : String(e);
      Alert.alert('Purchase failed', message || 'Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const purchases = await RNIap.getAvailablePurchases();
      const hasPremium = purchases.some((p) => productIds.includes(p.productId));
      if (hasPremium) {
        setPremium(true);
        Alert.alert('Restored', 'Zen Premium restored!');
        navigation.replace('Home');
      } else {
        Alert.alert('No purchases found', 'No premium purchases to restore.');
      }
    } catch (e) {
      const message = typeof e === 'object' && e && 'message' in e ? (e as any).message : String(e);
      Alert.alert('Restore failed', message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMaybeLater = () => {
    // TODO: Log event, set paywallDeferred, continue to Home
    navigation.replace('Home');
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#6C63FF" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Zenni's Wisdom</Text>
      <Text style={styles.subtitle}>Upgrade to Zen Premium for:</Text>
      <View style={styles.features}>
        <Text style={styles.feature}>✨ Guru Mode</Text>
        <Text style={styles.feature}>🎵 Premium sound packs</Text>
        <Text style={styles.feature}>🌈 Legendary cosmetics</Text>
        <Text style={styles.feature}>🚫 Ad-free (future)</Text>
      </View>
      {products.map((p) => (
        <TouchableOpacity
          key={p.productId}
          style={styles.button}
          onPress={() => handlePurchase(p.productId)}
          disabled={purchasing}
        >
          <Text style={styles.buttonText}>{p.title} - {p.localizedPrice}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRestore} disabled={purchasing}>
        <Text style={styles.buttonText}>Restore Purchases</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.maybeLater} onPress={handleMaybeLater} disabled={purchasing}>
        <Text style={styles.maybeLaterText}>Maybe later</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 26, marginBottom: 12 },
  subtitle: { fontSize: 18, marginBottom: 16 },
  features: { marginBottom: 24 },
  feature: { fontSize: 16, marginBottom: 6 },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 40, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  maybeLater: { marginTop: 24 },
  maybeLaterText: { color: '#6C63FF', fontWeight: 'bold', fontSize: 16 },
});

export default PaywallScreen; 