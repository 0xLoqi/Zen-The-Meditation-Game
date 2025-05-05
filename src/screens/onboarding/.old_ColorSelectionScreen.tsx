import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ViewStyle,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import FloatingLeaves from '../../components/FloatingLeaves';
import { COLOR_SCHEMES } from '../../constants/miniZenni';
import { useMiniZenniStore } from '../../store/miniZenniStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MiniZenni from '../../components/MiniZenni';
import PatternBackground from '../../components/PatternBackground';

const getElementIcon = (elementId: string) => {
  switch (elementId) {
    case 'earth':
      return 'terrain';
    case 'water':
      return 'water';
    case 'fire':
      return 'fire';
    case 'air':
      return 'weather-windy';
    default:
      return 'circle';
  }
};

const ColorSelectionScreen = () => {
  const navigation = useNavigation();
  const { setColorScheme } = useMiniZenniStore();
  const [selectedColor, setSelectedColor] = useState(COLOR_SCHEMES[0]);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -16,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handleColorSelect = (color: typeof COLOR_SCHEMES[0]) => {
    setSelectedColor(color);
  };

  const handleNext = () => {
    setColorScheme(selectedColor);
    navigation.navigate('TraitSelection');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <PatternBackground>
      <SafeAreaView style={styles.container}>
        <FloatingLeaves count={30} style={styles.leavesBackground} />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons 
            name="chevron-back" 
            size={28} 
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
              <Image
                source={require('../../../assets/images/minizenni.png')}
                style={[
                  styles.miniZenniImage,
                  { tintColor: selectedColor.primary }
                ]}
                resizeMode="contain"
              />
              </Animated.View>
              <Text style={styles.title}>Choose Your Element</Text>
              <Text style={styles.description}>
                Select an element that will define your Mini Zenni's essence.
              </Text>
            </View>

            <View style={styles.elementGrid}>
              {COLOR_SCHEMES.map((element) => (
                <TouchableOpacity
                  key={element.id}
                  style={[
                    styles.elementOption,
                    selectedColor.id === element.id && styles.selectedElementOption,
                    { backgroundColor: element.secondary }
                  ]}
                  onPress={() => handleColorSelect(element)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: element.primary }]}>
                    <MaterialCommunityIcons
                      name={getElementIcon(element.id)}
                      size={32}
                      color={element.secondary}
                    />
                  </View>
                  <Text style={[styles.elementName, { color: element.primary }]}>
                    {element.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Continue"
              onPress={handleNext}
              size="large"
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xxlarge + 40,
    paddingBottom: SPACING.xxlarge,
    paddingHorizontal: SPACING.medium,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
    width: '100%',
    maxWidth: 300,
  },
  miniZenniImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  description: {
    fontSize: 16,
    color: COLORS.neutralDark,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  elementGrid: {
    width: '100%',
    maxWidth: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: SPACING.medium,
    marginBottom: SPACING.xxlarge,
  },
  elementOption: {
    width: 130,
    height: 130,
    borderRadius: 16,
    padding: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.medium,
    ...SHADOWS.medium,
  },
  selectedElementOption: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.small,
  },
  elementName: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: SPACING.small,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});

export default ColorSelectionScreen; 