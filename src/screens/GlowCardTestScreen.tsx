import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import GlowCardReveal, { RewardType } from '../components/GlowCardReveal';

const GlowCardTestScreen = () => {
  const [tokens, setTokens] = useState(100);
  const [streakSavers, setStreakSavers] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#232946' }}>
      <GlowCardReveal
        onRewardClaimed={(reward: RewardType) => {
          console.log(`Test Screen - Reward Claimed: ${JSON.stringify(reward)}`);
        }}
        userTokens={tokens}
        isPlusUser={true}
        streakSavers={streakSavers}
        onUpdateTokens={setTokens}
        onUpdateStreakSavers={setStreakSavers}
        onShareReward={(reward) => alert(`Shared: ${JSON.stringify(reward)}`)}
        picksLeft={1}
        localization={(key) => key}
      />
    </SafeAreaView>
  );
};

export default GlowCardTestScreen;
