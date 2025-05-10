import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming types are defined here

// Placeholder image paths - replace with actual paths
const greyStoneImage = require('../../assets/images/stone_grey.png');
const goldStoneImage = require('../../assets/images/stone_gold.png');

type StoneScarcityNavProp = StackNavigationProp<
  RootStackParamList,
  'StoneScarcity' // Assuming 'StoneScarcity' is the route name
>;

const StoneScarcityScreen: React.FC = () => {
  const navigation = useNavigation<StoneScarcityNavProp>();

  // TODO: Replace with actual premium status from state
  const isPremium = false;

  const stoneCount = isPremium ? 4 : 2;
  const stoneImage = isPremium ? goldStoneImage : greyStoneImage;
  const stones = Array(stoneCount).fill(null);

  const handleContinue = () => {
    navigation.navigate('Login'); // Navigate to Login/Auth screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Focus Stones</Text>
      <View style={styles.stoneContainer}>
        {stones.map((_, index) => (
          <Image key={index} source={stoneImage} style={styles.stoneImage} />
        ))}
      </View>
      <Text style={styles.explanationText}>
        {isPremium
          ? 'As a Zenni+ member, you receive 4 Focus Stones each day to guide your sessions.'
          : 'You receive 2 Focus Stones each day. Use them wisely to begin your focus sessions.'
        }
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
    padding: 20,
    backgroundColor: '#F5F5F5', // Neutral background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  stoneContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  stoneImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  explanationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
    color: '#555',
  },
  button: {
    backgroundColor: '#607D8B', // Example Grey
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoneScarcityScreen; 