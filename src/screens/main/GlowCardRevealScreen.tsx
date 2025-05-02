import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlowCardReveal } from '../../components/GlowCardReveal';
import { useUserStore } from '../../store/userStore';
import { useMeditationStore } from '../../store/meditationStore';

const CHOOSE_WISELY_IMAGE = require('../../../assets/images/Choose_wisely.png');

const GlowCardRevealScreen = () => {
  const navigation = useNavigation();
  const userData = useUserStore((state) => state.userData);
  const resetMeditation = useMeditationStore((state) => state.resetMeditationSession);

  const handleRewardClaimed = (reward) => {
    console.log('Reward claimed in GlowCardRevealScreen:', reward);
    // No alert needed here anymore, handled visually in the component
  };

  const handleClose = () => {
    resetMeditation();
    // TODO: Add navigation logic if needed
    // navigation.dispatch(StackActions.replace('PostSessionSummary', { drop }));
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
        userTokens={userData.tokens || 0}
        isPlusUser={false}
        streakSavers={0}
        onUpdateTokens={() => {}}
        onUpdateStreakSavers={() => {}}
        onClose={handleClose}
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