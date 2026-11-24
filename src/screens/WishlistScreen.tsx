import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { CommerceItem } from '../data/commerceData';
import { ProductCard } from '../components/ProductCard';

interface Props {
  items: CommerceItem[];
  cart: Record<string, number>;
  onShop: () => void;
  onSelect: (item: CommerceItem) => void;
  onAdd: (item: CommerceItem) => void;
  onQty: (id: string, delta: number) => void;
  onToggle: (id: string) => void;
  onClear: () => void;
}

export const WishlistScreen: React.FC<Props> = ({
  items,
  cart,
  onShop,
  onSelect,
  onAdd,
  onQty,
  onToggle,
  onClear,
}) => {
  const clear = () =>
    Alert.alert(
      'Clear your wishlist?',
      'Your saved products will be removed from this list.',
      [
        { text: 'Keep them', style: 'cancel' },
        { text: 'Clear wishlist', style: 'destructive', onPress: onClear },
      ],
    );

  const keyExtractor = useCallback((item: CommerceItem) => item.id, []);

  const renderProductItem = useCallback(
    ({ item }: { item: CommerceItem }) => (
      <View style={styles.card}>
        <ProductCard
          item={item}
          quantity={cart[item.id] || 0}
          isWishlisted={true}
          onPress={() => onSelect(item)}
          onAdd={() => onAdd(item)}
          onIncrement={() => onQty(item.id, 1)}
          onDecrement={() => onQty(item.id, -1)}
          onToggleWishlist={() => onToggle(item.id)}
        />
      </View>
    ),
    [cart, onSelect, onAdd, onQty, onToggle],
  );

  const renderHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Your little list of lovely things</Text>
          <Text style={styles.sub}>
            Everything you've saved, all in one place.
          </Text>
        </View>
        {items.length > 0 ? (
          <TouchableOpacity
            onPress={clear}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Clear entire wishlist">
            <Text style={styles.clear}>CLEAR</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    ),
    [items.length],
  );

  const renderEmpty = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nothing saved just yet.</Text>
        <Text style={styles.emptyText}>
          Discover something lovely for you and your little one.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onShop}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Explore the collection">
          <Text style={styles.buttonText}>EXPLORE THE COLLECTION</Text>
        </TouchableOpacity>
      </View>
    ),
    [onShop],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={items.length > 0 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={renderProductItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.forestDark,
    maxWidth: 280,
  },
  sub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  clear: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: Colors.terracotta,
    paddingBottom: 3,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.forestDark,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 7,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.creamLight,
  },
});
