import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as RNIap from 'react-native-iap';
import { useUserStore } from '../store/userStore';

const productIds = ['zen_premium_monthly', 'zen_premium_annual'];
const ANNUAL_SKU = 'zen_premium_annual'; // Assuming trial converts to annual
const ORANGE = '#FFA726'; // App's primary orange

const PaywallScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const isPremium = useUserStore((s) => s.isPremium);
  const setPremium = useUserStore((s) => s.setPremium);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPremium) {
      navigation.navigate('MainApp', { screen: 'Home' });
      return;
    }
    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        const items = await RNIap.getProducts({ skus: productIds });
        if (items && items.length > 0) {
           setProducts(items);
        } else {
            Alert.alert('IAP Error', 'Failed to load product details.');
        }
      } catch (e) {
        console.error("IAP Init/Fetch Error: ", e);
        Alert.alert('IAP Error', 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    initIAP();

    // Start floating animation
    Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -5, // Float up
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 5, // Float down
            duration: 1500,
            useNativeDriver: true,
          }),
           Animated.timing(floatAnim, {
            toValue: 0, // Back to center
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

    return () => {
      RNIap.endConnection();
      floatAnim.stopAnimation(); // Stop animation on unmount
    };
  }, [isPremium, navigation, floatAnim]);

  const handlePurchase = async (sku: string) => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      console.log(`Attempting purchase for SKU: ${sku}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPremium(true);
      Alert.alert('Success!', 'Zen Premium Trial Started!');
      navigation.navigate('MainApp', { screen: 'Home' });
    } catch (e: any) {
       console.error("Purchase Error: ", e);
       if (e && e.code === 'E_USER_CANCELLED') {
         Alert.alert('Purchase Cancelled', 'You cancelled the purchase.');
       } else {
         const message = typeof e === 'object' && e && 'message' in e ? e.message : String(e);
         Alert.alert('Purchase failed', message || 'Please try again.');
       }
    } finally {
      setPurchasing(false);
    }
  };

  const handleMaybeLater = () => {
    if (purchasing) return;
    console.log('[Analytics] Event: paywall_maybe_later');
    navigation.navigate('MainApp', { screen: 'Home' });
  };

  const annualProduct = products.find(p => p.productId === ANNUAL_SKU);

  if (loading && products.length === 0) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color={ORANGE} />;
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/images/backgrounds/animated_darkmode_bg.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
      <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Unlock Zenni's Wisdom</Text>
            <Text style={styles.subtitle}>Start your Zen Premium free trial:</Text>
            <View style={styles.features}>
              <Text style={styles.feature}>🚫 Ad-free experience</Text>
              <Text style={styles.feature}>🎵 Premium profile soundscapes</Text>
              <Text style={styles.feature}>📽️ Animated backgrounds</Text>
              <Text style={styles.feature}>🌈 Legendary cosmetics</Text>
              <Text style={styles.feature}>✨ (coming soon) Get personalized guidance from Zenni</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.trialButton]}
              onPress={() => annualProduct ? handlePurchase(annualProduct.productId) : Alert.alert('Error', 'Pricing info not available yet.')}
              disabled={purchasing || !annualProduct}
            >
              <Text style={styles.buttonText}>{purchasing ? 'Processing...' : 'Start 7-Day Free Trial'}</Text>
            </TouchableOpacity>
            {annualProduct && (
               <Text style={styles.priceInfo}>
                 Then {annualProduct.localizedPrice}/year. Cancel anytime.
               </Text>
            )}
             {!annualProduct && !loading && (
                <Text style={styles.priceInfo}>Price information loading...</Text>
            )}

            <TouchableOpacity
              style={styles.maybeLater}
              onPress={handleMaybeLater}
              disabled={purchasing}
            >
              <Text style={styles.maybeLaterText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
      </View>
       <Animated.View style={[styles.mascotContainer, { transform: [{ translateY: floatAnim }] }]}>
          <Image
            source={require('../../assets/images/UI/premium_zenni.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
       </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
  },
   contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    maxWidth: 360,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 8,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#F0F0F0',
    textAlign: 'center',
  },
  features: {
      marginBottom: 24,
      alignItems: 'flex-start',
      width: '100%',
   },
  feature: {
      fontSize: 16,
      marginBottom: 10,
      color: '#F0F0F0',
  },
  trialButton: {
      backgroundColor: ORANGE,
      shadowColor: ORANGE,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
      paddingVertical: 16,
      marginBottom: 8,
  },
   priceInfo: {
      fontSize: 14,
      color: '#D0D0D0',
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 25,
  },
  button: {
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 30,
      marginTop: 12,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
  },
  maybeLater: {
      marginTop: 10,
  },
  maybeLaterText: {
      color: '#B0B0B0',
      fontWeight: '500',
      fontSize: 16,
      opacity: 0.9,
  },
   mascotContainer: {
     position: 'absolute',
     bottom: 20,
     alignSelf: 'center',
     width: 150,
     height: 150,
   },
    mascotImage: {
     width: '100%',
     height: '100%',
   },
});

export default PaywallScreen; 