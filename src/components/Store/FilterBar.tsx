import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { COLORS } from '../../constants/theme';

const RARITIES = ['common', 'rare', 'epic', 'legendary'];
const SORTS = [
  { label: 'Price: Low→High', value: 'price_asc' },
  { label: 'Price: High→Low', value: 'price_desc' },
  { label: 'New', value: 'new' },
];

const FilterBar = ({ selectedRarities, sort, onChange }: any) => {
  const [localRarities, setLocalRarities] = useState(selectedRarities || []);
  const [localSort, setLocalSort] = useState(sort || 'price_asc');

  const toggleRarity = (rarity: string) => {
    const next = localRarities.includes(rarity)
      ? localRarities.filter((r: string) => r !== rarity)
      : [...localRarities, rarity];
    setLocalRarities(next);
    onChange({ rarities: next, sort: localSort });
  };

  const changeSort = (value: string) => {
    setLocalSort(value);
    onChange({ rarities: localRarities, sort: value });
  };

  return (
    <View style={styles.bar}>
      <View style={styles.chipsRow}>
        {RARITIES.map((rarity) => (
          <TouchableOpacity
            key={rarity}
            style={[styles.chip, localRarities.includes(rarity) && styles.chipActive]}
            onPress={() => toggleRarity(rarity)}
          >
            <Text style={[styles.chipText, localRarities.includes(rarity) && styles.chipTextActive]}>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Picker
        selectedValue={localSort}
        style={styles.picker}
        onValueChange={changeSort}
        mode="dropdown"
      >
        {SORTS.map((s) => (
          <Picker.Item key={s.value} label={s.label} value={s.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, backgroundColor: COLORS.white },
  chipsRow: { flexDirection: 'row' },
  chip: { backgroundColor: COLORS.neutralLight, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: 'bold' },
  chipTextActive: { color: COLORS.white },
  picker: { width: 150, color: COLORS.primary },
});

export default FilterBar; 