import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import cosmetics from '../../../assets/data/cosmetics.json';
import { useGameStore } from '../../store/index';

const InventoryScreen = () => {
  const owned = useGameStore((state) => state.cosmetics.owned || []);
  const ownedCosmetics = (cosmetics as any[]).filter((item) => owned.includes(item.id));

  if (ownedCosmetics.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>You don't own any cosmetics yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cosmetics</Text>
      <FlatList
        data={ownedCosmetics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.asset }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} • {item.rarity}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#888', textAlign: 'center', marginTop: 32 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 16, backgroundColor: '#eee' },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 14, color: '#888' },
});

export default InventoryScreen; 