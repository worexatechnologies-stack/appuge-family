import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import {
  SHOP_ITEMS,
  SHOP_CATEGORIES,
  CommerceCategory,
  CommerceItem,
} from '../data/commerceData';
import { ProductCard } from '../components/ProductCard';
import { AppIcon } from '../components/common/AppIcon';

interface ShopScreenProps {
  cart: Record<string, number>;
  wishlist: string[];
  initialCategory?: CommerceCategory;
  onOpenSearch: () => void;
  onSelectItem: (item: CommerceItem) => void;
  onAddToCart: (item: CommerceItem) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onToggleWishlist: (id: string) => void;
}

type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'rating';

export const ShopScreen: React.FC<ShopScreenProps> = ({
  cart,
  wishlist,
  initialCategory = 'All',
  onOpenSearch,
  onSelectItem,
  onAddToCart,
  onUpdateQty,
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CommerceCategory>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredItems = useMemo(() => {
    let result = [...SHOP_ITEMS];
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }
    return result;
  }, [selectedCategory, sortBy]);

  const keyExtractor = useCallback((item: CommerceItem) => item.id, []);

  const renderProductItem = useCallback(
    ({ item }: { item: CommerceItem }) => (
      <View style={styles.gridCol}>
        <ProductCard
          item={item}
          quantity={cart[item.id] || 0}
          isWishlisted={wishlist.includes(item.id)}
          onPress={() => onSelectItem(item)}
          onAdd={() => onAddToCart(item)}
          onIncrement={() => onUpdateQty(item.id, 1)}
          onDecrement={() => onUpdateQty(item.id, -1)}
          onToggleWishlist={() => onToggleWishlist(item.id)}
        />
      </View>
    ),
    [cart, wishlist, onSelectItem, onAddToCart, onUpdateQty, onToggleWishlist],
  );

  const renderHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {/* Category Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPills}>
          {SHOP_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[styles.pill, isSelected && styles.pillActive]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`${cat.label} category`}>
                <Text style={styles.pillIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Filter / Sort Row */}
        <View style={styles.filterRow}>
          <Text style={styles.countText}>
            Showing {filteredItems.length} items
          </Text>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>SORT BY:</Text>
            <TouchableOpacity
              style={styles.sortChip}
              onPress={() => {
                const nextSort: Record<SortOption, SortOption> = {
                  popular: 'priceAsc',
                  priceAsc: 'priceDesc',
                  priceDesc: 'rating',
                  rating: 'popular',
                };
                setSortBy(nextSort[sortBy]);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Change sort order">
              <Text style={styles.sortChipText}>
                {sortBy === 'popular'
                  ? 'Bestsellers'
                  : sortBy === 'priceAsc'
                  ? 'Price: Low to High'
                  : sortBy === 'priceDesc'
                  ? 'Price: High to Low'
                  : 'Highest Rated'}
              </Text>
              <Text style={styles.sortArrow}>▾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [selectedCategory, sortBy, filteredItems.length],
  );

  const renderEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No products found</Text>
        <Text style={styles.emptySub}>
          Try selecting "All Items" or searching for a specific product.
        </Text>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setSelectedCategory('All')}
          activeOpacity={0.8}>
          <Text style={styles.resetBtnText}>SHOW ALL PRODUCTS</Text>
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onOpenSearch}
          activeOpacity={0.8}
          accessibilityLabel="Search products"
          accessibilityRole="button">
          <AppIcon name="search" size={16} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>
            Find something lovely for you and your baby...
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={renderProductItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFDF9',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  searchPlaceholder: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  headerContainer: {
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 110,
  },
  columnWrapper: {
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
  },
  categoryPills: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 6,
  },
  pillActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  pillIcon: {
    fontSize: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  pillTextActive: {
    color: '#FAF4EB',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textMuted,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  sortChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  sortArrow: {
    fontSize: 10,
    color: Colors.forestDark,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.forestDark,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF4EB',
    letterSpacing: 0.8,
  },
});
