import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants/theme';
import StoreHeader from '../../components/Store/Header';
import ItemGrid from '../../components/Store/ItemGrid';
import FilterBar from '../../components/Store/FilterBar';

const CATEGORIES = ['All', 'Background', 'Character', 'Totem', 'Icon', 'Glowbag'];

const StoreScreen = () => {
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState({ rarities: [], sort: 'price_asc' });

  const handleHowToEarn = () => {
    // TODO: navigate to GlowbagInfo or show a modal
    alert('Earn tokens by meditating, completing quests, and opening Glowbags!');
  };

  return (
    <View style={styles.container}>
      {/* Store Header */}
      <StoreHeader onHowToEarn={handleHowToEarn} />
      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, category === cat && styles.tabActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.tabText, category === cat && styles.tabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Filter & Sort Bar */}
      <FilterBar selectedRarities={filter.rarities} sort={filter.sort} onChange={setFilter} />
      {/* Item Grid */}
      <ItemGrid category={category} rarities={filter.rarities} sort={filter.sort} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 24, alignItems: 'center', backgroundColor: COLORS.primary },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, backgroundColor: COLORS.white },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.neutralLight },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.primary, fontWeight: 'bold' },
  tabTextActive: { color: COLORS.white },
  gridPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default StoreScreen; 