import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlowCardReveal } from '../../components/GlowCardReveal';
import ExtraGlowModal from '../../components/modals/ExtraGlowModal';
import { useUserStore } from '../../store/userStore';
import { useMeditationStore } from '../../store/meditationStore';

const CHOOSE_WISELY_IMAGE = require('../../../assets/images/Choose_wisely.png');

const GlowCardRevealScreen = () => {
  const navigation = useNavigation();
  const { 
      userData, 
      isPremium, 
      extraGlowAvailable, 
      setExtraGlowAvailable,
      addTokens,         // Get addTokens action
      addStreakSaver     // Get addStreakSaver action
  } = useUserStore((state) => ({ 
    userData: state.userData,
    isPremium: state.isPremium,
    extraGlowAvailable: state.extraGlowAvailable,
    setExtraGlowAvailable: state.setExtraGlowAvailable,
    addTokens: state.addTokens,             // Select action
    addStreakSaver: state.addStreakSaver,   // Select action
  }));
  // Read session count directly for passing down
  const sessionCountToday = useUserStore((state) => state.sessionCountToday);
  const resetMeditation = useMeditationStore((state) => state.resetMeditationSession);

  // State for modal visibility
  const [isExtraGlowModalVisible, setIsExtraGlowModalVisible] = useState(false);
  // State for picks left - initialize to 1 for the default pick
  const [picksLeft, setPicksLeft] = useState(1);

  // Effect to show modal when extraGlowAvailable becomes true
  useEffect(() => {
    if (extraGlowAvailable) {
      console.log('Extra glow available, showing modal...');
      setIsExtraGlowModalVisible(true);
    }
  }, [extraGlowAvailable]);

  // Function to add a pick
  const handleAddPick = () => {
    setPicksLeft(prev => prev + 1);
    console.log('Added a pick, picks left:', picksLeft + 1);
  };

  const handleRewardClaimed = (reward) => {
    // A pick is consumed when a reward is claimed in the child component.
    // We reflect that consumption here.
    setPicksLeft(prev => Math.max(0, prev - 1)); 
    console.log('Reward claimed in GlowCardRevealScreen:', reward, 'Picks left:', picksLeft -1);
  };

  const handleModalClose = () => {
    setIsExtraGlowModalVisible(false);
    // Reset the flag if closed without purchase
    setExtraGlowAvailable(false); 
  };

  const handleModalPurchaseSuccess = () => {
    console.log('Extra glow purchased successfully!');
    setIsExtraGlowModalVisible(false);
    setExtraGlowAvailable(false); // Reset the flag
    handleAddPick(); // Grant the extra pick
  };

  const handleClose = () => {
    resetMeditation();
    // TODO: Add navigation logic if needed, maybe go Home?
    navigation.navigate('Main', { screen: 'Home'}); // Navigate home after closing
  };

  if (!userData) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image 
          source={CHOOSE_WISELY_IMAGE}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>
      <GlowCardReveal
        onRewardClaimed={handleRewardClaimed}
        userTokens={userData?.tokens || 0} // Use optional chaining
        isPlusUser={isPremium}
        streakSavers={userData?.streakSavers || 0} // Use optional chaining
        onUpdateTokens={addTokens}      // Pass down action
        onUpdateStreakSavers={addStreakSaver} // Pass down action
        onClose={handleClose}
        sessionIndex={sessionCountToday}
        picksAvailable={picksLeft}
        onAddPick={handleAddPick}
      />
      
      <ExtraGlowModal
        visible={isExtraGlowModalVisible}
        onClose={handleModalClose}
        onPurchaseSuccess={handleModalPurchaseSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  topImageContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  topImage: {
    width: '80%',
    height: '100%',
  },
});

export default GlowCardRevealScreen; 