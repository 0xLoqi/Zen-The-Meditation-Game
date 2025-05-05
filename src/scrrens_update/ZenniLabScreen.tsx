import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

// Placeholder image path - replace with actual path
// const labImage = require('../../assets/images/zenni_lab.png');
const labImage = require('../../assets/images/backgrounds/zenni_lab.png');

type ZenniLabNavProp = StackNavigationProp<RootStackParamList, 'ZenniLabScreen'>;

const ZenniLabScreen: React.FC = () => {
  const navigation = useNavigation<ZenniLabNavProp>();

  useEffect(() => {
    // Track that the user has seen this screen/fact
    console.log('[Analytics] Event: lab_fact_viewed');
    // TODO: Potentially add fact details as properties
  }, []);

  const handleContinue = () => {
    // Navigate to the next screen in the flow
    console.log('Navigating to StoneScarcityScreen...');
    navigation.navigate('StoneScarcity'); 
  };

  return (
    <View style={styles.container}>
      <Image source={labImage} style={styles.image} />
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "Just 10 minutes of focused breathing can reduce stress by 44%."
        </Text>
        <Text style={styles.citationText}>
          (Placeholder citation - verification needed)
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Interesting!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9', // Light Green background
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  quoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    width: '95%',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 26,
    color: '#333',
    // fontFamily: 'YourAppName-Italic', // TODO: Font
  },
  citationText: {
    fontSize: 12,
    color: '#666',
    // fontFamily: 'YourAppName-Regular', // TODO: Font
  },
  button: {
    backgroundColor: '#009688', // Teal
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'YourAppName-Bold', // TODO: Font
  },
});

export default ZenniLabScreen; 