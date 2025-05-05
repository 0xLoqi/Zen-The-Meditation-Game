import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming types are defined here
// TODO: Import premium modal logic/hook when available
// import { usePremiumModal } from '../hooks/usePremiumModal';

type PremiumUpsellNavProp = StackNavigationProp<
  RootStackParamList,
  'PremiumUpsell' // Assuming 'PremiumUpsell' is the route name
>;

const PremiumUpsellScreen: React.FC = () => {
  const navigation = useNavigation<PremiumUpsellNavProp>();
  // const { openPremiumModal } = usePremiumModal(); // TODO: Uncomment when hook is ready

  const handleStartTrial = () => {
    console.log('Attempting to start premium trial...');
    // TODO: Integrate with actual payment/premium modal flow
    // openPremiumModal();
    // On success/completion, navigate to HomeScreen or relevant next step
    console.log('[Analytics] Event: premium_trial_start'); // Add placeholder event
    // TODO: Pass relevant properties like trial_length: '7-day'
    navigation.navigate('Main', { screen: 'Home'}); // Navigate to Home within Main stack
  };

  const handleMaybeLater = () => {
    navigation.navigate('Main', { screen: 'Home'}); // Navigate to HomeScreen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Unlock Zenni+</Text>
      <Text style={styles.subtitle}>Enhance your focus journey.</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerTextFeature}>Feature</Text>
          <Text style={styles.headerTextTier}>Free</Text>
          <Text style={styles.headerTextTier}>Zenni+</Text>
        </View>

        {/* Row 1: Daily Stones */}
        <View style={styles.tableRow}>
          <Text style={styles.featureText}>Daily Focus Stones</Text>
          <Text style={styles.tierText}>2</Text>
          <Text style={[styles.tierText, styles.premiumTier]}>4</Text>
        </View>

        {/* Row 2: Ads */}
        <View style={styles.tableRow}>
          <Text style={styles.featureText}>Ad-Free Experience</Text>
          <Text style={styles.tierText}>✕</Text>
          <Text style={[styles.tierText, styles.premiumTier]}>✓</Text>
        </View>

        {/* Row 3: Extra Glow Pull */}
        <View style={styles.tableRow}>
          <Text style={styles.featureText}>Extra Daily Glow Pull</Text>
          <Text style={styles.tierText}>✕</Text>
          <Text style={[styles.tierText, styles.premiumTier]}>✓</Text>
        </View>
        {/* Add more feature rows as needed */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.trialButton]} onPress={handleStartTrial}>
          <Text style={styles.buttonText}>Start 7-Day Free Trial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.laterButton]} onPress={handleMaybeLater}>
          <Text style={[styles.buttonText, styles.laterButtonText]}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF', // White background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#AF7AC5', // Premium Purple
    marginBottom: 10,
    // fontFamily: 'YourAppName-Bold', // TODO: Font
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
    // fontFamily: 'YourAppName-Regular', // TODO: Font
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 40,
    backgroundColor: '#FAFAFA',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  headerTextFeature: {
    flex: 2, // Feature column wider
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    // fontFamily: 'YourAppName-Semibold', // TODO: Font
  },
  headerTextTier: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    // fontFamily: 'YourAppName-Semibold', // TODO: Font
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  featureText: {
    flex: 2,
    fontSize: 15,
    paddingLeft: 15,
    color: '#444',
    // fontFamily: 'YourAppName-Regular', // TODO: Font
  },
  tierText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    // fontFamily: 'YourAppName-Regular', // TODO: Font
  },
  premiumTier: {
    color: '#AF7AC5', // Premium Purple
    fontWeight: 'bold',
    // fontFamily: 'YourAppName-Bold', // TODO: Font
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialButton: {
    backgroundColor: '#AF7AC5', // Premium Purple
  },
  laterButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#AAA',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'YourAppName-Bold', // TODO: Font
  },
  laterButtonText: {
    color: '#555',
    fontWeight: 'normal',
    // fontFamily: 'YourAppName-Regular', // TODO: Font
  },
});

export default PremiumUpsellScreen; 