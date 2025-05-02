import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BreathTracker from '../../components/BreathTracker';
import ProgressDots from '../../components/ProgressDots';
// import LottieView from 'lottie-react-native'; // Uncomment if using Lottie
// import summonAnimation from '../../../assets/animations/summon.json';
import { useGameStore } from '../../store';
// import MiniFactory from '../../lib/MiniFactory'; // Placeholder for random mini

const SummonMiniZenniScreen = ({ navigation, route }: any) => {
  const { step = 2, total = 9 } = route.params || {};
  const [breathCount, setBreathCount] = useState(0);
  const [summoned, setSummoned] = useState(false);
  const setMiniId = useGameStore((s) => s.setMiniId || (() => {}));

  const handleBreathTracked = () => {
    setBreathCount((c) => c + 1);
  };

  const handleSummon = () => {
    // const miniId = MiniFactory.random();
    const miniId = 'randomMini'; // Placeholder
    setMiniId(miniId);
    setSummoned(true);
    // Play Lottie animation here if desired
    setTimeout(() => {
      navigation.navigate('NameMini', { ...route.params });
    }, 2000);
  };

  return (
    <>
      <ProgressDots step={step} total={total} />
      <View style={styles.container}>
        <Text style={styles.title}>Summon Your Mini Zenni</Text>
        <BreathTracker
          isActive={!summoned}
          onBreathTracked={handleBreathTracked}
          onBreathScoreUpdate={() => {}}
        />
        <Text style={styles.counter}>{breathCount} / 3 breaths</Text>
        <TouchableOpacity
          style={[styles.button, breathCount < 3 && styles.buttonDisabled]}
          onPress={handleSummon}
          disabled={breathCount < 3 || summoned}
        >
          <Text style={styles.buttonText}>Summon</Text>
        </TouchableOpacity>
        {/* {summoned && (
          <LottieView source={summonAnimation} autoPlay loop={false} style={styles.lottie} />
        )} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 24 },
  counter: { fontSize: 16, marginVertical: 16 },
  button: { backgroundColor: '#6C63FF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginTop: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  lottie: { width: 200, height: 200, marginTop: 24 },
});

export default SummonMiniZenniScreen; 