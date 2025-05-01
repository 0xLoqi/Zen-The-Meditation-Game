import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useNavigation, StackActions, useRoute, RouteProp } from '@react-navigation/native';
import { GlowCardReveal } from '../../components/GlowCardReveal';
import { useUserStore } from '../../store/userStore';
import { useMeditationStore } from '../../store/meditationStore';
import { RewardType } from '../../components/GlowCardReveal'; // Import RewardType
import { MainStackParamList } from '../../navigation/MainNavigator'; // Import ParamList

const GlowCardRevealScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'GlowCardRevealScreen'>>(); // Get route object
  const drop = route.params?.drop; // Extract drop param
  const { userData, addTokens, addStreakSaver } = useUserStore((state) => ({
    userData: state.userData,
    addTokens: state.addTokens,
    addStreakSaver: state.addStreakSaver,
  }));
  const resetMeditation = useMeditationStore((state) => state.resetMeditationSession);

  const handleRewardClaimed = (reward: RewardType) => {
    console.log('Reward claimed in GlowCardRevealScreen:', reward);
    // Here you would typically integrate with inventory/backend if needed
    // For Glowbags, etc. For now, we just log it.
    if (reward.type === 'glowbag_common' || reward.type === 'glowbag_rare') {
      Alert.alert('Glowbag Acquired!', `You received a ${reward.type}!`);
    }
    // Tokens and Streak Savers are handled directly by the component via callbacks
  };

  const handleClose = () => {
    resetMeditation(); // Reset meditation state
    // Navigate back to Home or another appropriate screen, replacing the stack
    navigation.dispatch(StackActions.replace('PostSessionSummary', { drop })); // Navigate to PostSessionSummary with drop
  };

  if (!userData) {
    // Handle case where user data isn't loaded yet, maybe show loading spinner
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      <GlowCardReveal
        onRewardClaimed={handleRewardClaimed}
        userTokens={userData.tokens || 0}
        isPlusUser={userData.isPlus || false}
        streakSavers={userData.streakSavers || 0}
        onUpdateTokens={addTokens} // Pass the store action directly
        onUpdateStreakSavers={addStreakSaver} // Pass the store action directly
        onClose={handleClose} // Pass the navigation handler
        // localization can be passed here if needed
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
});

export default GlowCardRevealScreen; 