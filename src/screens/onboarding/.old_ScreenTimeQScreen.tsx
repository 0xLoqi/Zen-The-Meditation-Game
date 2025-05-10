import React from 'react';
import ScreenTimeQ from '../../components/ScreenTimeQ';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';

const ScreenTimeQScreen = () => {
  const navigation = useNavigation();
  const setScreenTime = useUserStore((s) => s.setScreenTime);

  const handleNext = (minutes: number) => {
    setScreenTime(minutes);
    navigation.navigate('TikTokQ');
  };

  return <ScreenTimeQ onNext={handleNext} />;
};

export default ScreenTimeQScreen; 