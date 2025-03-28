import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import MiniZenni from '../../components/MiniZenni';
import OutfitItem from '../../components/OutfitItem';
import Card from '../../components/Card';
import { useUserStore } from '../../store/userStore';
import { OUTFITS, getAvailableOutfits } from '../../constants/outfits';
import { Outfit, OutfitId } from '../../types';

const WardrobeScreen = () => {
  const { userData, equipOutfit, isLoadingUser, userError, getUserData } = useUserStore();
  
  const [availableOutfits, setAvailableOutfits] = useState<Outfit[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitId | null>(null);
  const [previewOutfit, setPreviewOutfit] = useState<OutfitId | null>(null);
  
  // Load user data and available outfits
  useEffect(() => {
    loadData();
  }, []);
  
  // Update selected outfit when user data changes
  useEffect(() => {
    if (userData) {
      setSelectedOutfit(userData.equippedOutfit);
      
      // Get available outfits based on user level
      const outfits = getAvailableOutfits(userData.level);
      setAvailableOutfits(outfits);
    }
  }, [userData]);
  
  // Load user data
  const loadData = async () => {
    await getUserData();
  };
  
  // Handle outfit selection
  const handleOutfitSelect = (outfitId: OutfitId) => {
    // Only select if outfit is unlocked
    if (userData && userData.unlockedOutfits.includes(outfitId)) {
      setPreviewOutfit(outfitId);
    } else {
      // Show message that outfit is locked
      const outfit = OUTFITS.find(o => o.id === outfitId);
      if (outfit) {
        if (outfit.tokenCost) {
          Alert.alert(
            'Outfit Locked',
            `This outfit requires level ${outfit.requiredLevel} and ${outfit.tokenCost} Zen Tokens.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Outfit Locked',
            `Reach level ${outfit.requiredLevel} to unlock this outfit.`,
            [{ text: 'OK' }]
          );
        }
      }
    }
  };
  
  // Handle equipping outfit
  const handleEquipOutfit = async () => {
    if (previewOutfit && userData && userData.unlockedOutfits.includes(previewOutfit)) {
      try {
        await equipOutfit(previewOutfit);
        setSelectedOutfit(previewOutfit);
        Alert.alert('Success', 'Outfit equipped successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };
  
  // Render outfit item
  const renderOutfitItem = ({ item }: { item: Outfit }) => {
    const isUnlocked = userData ? userData.unlockedOutfits.includes(item.id) : false;
    const isEquipped = selectedOutfit === item.id;
    
    return (
      <OutfitItem
        outfit={item}
        isUnlocked={isUnlocked}
        isEquipped={isEquipped}
        onPress={() => handleOutfitSelect(item.id)}
      />
    );
  };
  
  // Loading state
  if (isLoadingUser) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Wardrobe...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mini Zenni Wardrobe</Text>
        <Text style={styles.subtitle}>
          Customize your meditation buddy
        </Text>
      </View>
      
      <View style={styles.previewContainer}>
        <Card style={styles.previewCard}>
          <MiniZenni
            outfitId={previewOutfit || (userData?.equippedOutfit || 'default')}
            size="large"
          />
          
          {previewOutfit && previewOutfit !== selectedOutfit && (
            <View style={styles.previewActions}>
              <Text style={styles.previewText}>Preview Mode</Text>
              <View style={styles.previewButtons}>
                <MaterialCommunityIcons
                  name="close"
                  size={SIZES.icon.medium}
                  color={COLORS.neutralMedium}
                  style={styles.cancelIcon}
                  onPress={() => setPreviewOutfit(selectedOutfit)}
                />
                <MaterialCommunityIcons
                  name="check"
                  size={SIZES.icon.medium}
                  color={COLORS.primary}
                  style={styles.confirmIcon}
                  onPress={handleEquipOutfit}
                />
              </View>
            </View>
          )}
        </Card>
      </View>
      
      <View style={styles.outfitsContainer}>
        <Text style={styles.sectionTitle}>Available Outfits</Text>
        <FlatList
          data={OUTFITS}
          renderItem={renderOutfitItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.outfitsList}
        />
      </View>
      
      {userError && (
        <Text style={styles.errorText}>{userError}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutralLight,
  },
  loadingText: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
    marginTop: SPACING.m,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    ...FONTS.heading.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  previewContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.l,
  },
  previewCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  previewActions: {
    marginTop: SPACING.m,
    alignItems: 'center',
  },
  previewText: {
    ...FONTS.body.small,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelIcon: {
    marginRight: SPACING.l,
    padding: SPACING.xs,
  },
  confirmIcon: {
    padding: SPACING.xs,
  },
  outfitsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    marginBottom: SPACING.m,
  },
  outfitsList: {
    paddingBottom: SPACING.xl,
  },
  errorText: {
    ...FONTS.body.small,
    color: COLORS.warning,
    textAlign: 'center',
    padding: SPACING.m,
  },
});

export default WardrobeScreen;
