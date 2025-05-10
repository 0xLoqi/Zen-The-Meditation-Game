import React from 'react';
import TikTokQ from '../../components/TikTokQ';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';

const TikTokQScreen = () => {
  const navigation = useNavigation();
  const setReduceTikTok = useUserStore((s) => s.setReduceTikTok);

  const handleNext = (reduce: boolean) => {
    setReduceTikTok(reduce);
    navigation.navigate('ColorSelection');
  };

  return <TikTokQ onNext={handleNext} />;
};

export default TikTokQScreen; 