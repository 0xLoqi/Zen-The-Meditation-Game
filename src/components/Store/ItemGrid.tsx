import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemCard from './ItemCard';
import PreviewSheet from './PreviewSheet';
import cosmetics from '../../../assets/data/cosmetics.json';
import EmptyState from './EmptyState';
import { useGameStore } from '../../store';

interface ItemGridProps {
  category: string;
  rarities?: string[];
  sort?: string;
  onSwitchCategory: () => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({ category, rarities = [], sort = 'price_asc', onSwitchCategory }) => {
  const [selected, setSelected] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const owned = useGameStore((s) => s.cosmetics.owned);

  // Filter and sort cosmetics
  const filtered = useMemo(() => {
    let items = cosmetics;
    if (category !== 'All') {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
    if (rarities.length > 0) {
      items = items.filter((item) => rarities.includes(item.rarity.toLowerCase()));
    }
    if (sort === 'price_asc') {
      items = items.slice().sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      items = items.slice().sort((a, b) => b.price - a.price);
    } else if (sort === 'new') {
      items = items.slice().sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return items;
  }, [category, rarities, sort]);

  const allOwned = filtered.length > 0 && filtered.every((item) => owned.includes(item.id));

  const handlePress = (item: any) => {
    setSelected(item);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleBuy = () => {
    alert('Purchased!');
    handleClose();
  };

  const handleOpenGlowbag = () => {
    alert('Glowbag opening not implemented yet!');
  };

  return (
    <>
      {allOwned ? (
        <EmptyState onOpenGlowbag={handleOpenGlowbag} onSwitchCategory={onSwitchCategory} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <ItemCard item={item} onPress={() => handlePress(item)} />}
        />
      )}
      <PreviewSheet item={selected} visible={modalVisible} onClose={handleClose} onBuy={handleBuy} />
    </>
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 8,
    alignItems: 'center',
  },
});

export default ItemGrid; 