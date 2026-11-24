import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../theme/colors';
import { SHOP_ITEMS, CommerceItem } from '../data/commerceData';
import { AppIcon } from './common/AppIcon';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectItem: (item: CommerceItem) => void;
  onAddToCart: (item: CommerceItem) => void;
  cart: Record<string, number>;
}

const POPULAR_SEARCHES = [
  'Baby massage oil',
  'Postpartum recovery tea',
  'Galactagogue ladoos',
  'A2 Desi Ghee',
  'Baby wash',
  'Nursing set',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSelectItem,
  onAddToCart,
  cart,
}) => {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? SHOP_ITEMS.filter(item =>
        `${item.title} ${item.brand} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : [];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Search Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            accessibilityLabel="Close search">
            <AppIcon name="arrow-left" size={16} color={Colors.forestDark} />
          </TouchableOpacity>

          <View style={styles.inputWrap}>
            <AppIcon name="search" size={16} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Find something lovely for you and your baby..."
              placeholderTextColor={Colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus={true}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                style={styles.clearBtn}>
                <AppIcon name="close" size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {/* Trending Searches when no query */}
          {!query.trim() && (
            <View style={styles.trendingSection}>
              <Text style={styles.sectionTitle}>POPULAR SEARCHES</Text>
              <View style={styles.tagGrid}>
                {POPULAR_SEARCHES.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tag}
                    onPress={() => setQuery(tag)}
                    activeOpacity={0.7}>
                    <Text style={styles.tagText}>🔍 {tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
                START WITH THESE
              </Text>
              <View style={styles.recommendedList}>
                {SHOP_ITEMS.slice(0, 4).map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resultRow}
                    onPress={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    activeOpacity={0.7}>
                    <Image source={item.image} style={styles.rowThumb} />
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowBrand}>{item.brand}</Text>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.rowPrice}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.rowAddBtn}
                      onPress={() => onAddToCart(item)}>
                      <Text style={styles.rowAddText}>
                        {cart[item.id] ? `(${cart[item.id]})` : '+ ADD'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Search Results */}
          {query.trim().length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsCount}>
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>

              {results.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No matching items found</Text>
                  <Text style={styles.emptySub}>
                    Try searching for "baby oil", "ladoos", "ghee", or "nursing set"
                  </Text>
                </View>
              ) : (
                <View style={styles.resultsList}>
                  {results.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.resultRow}
                      onPress={() => {
                        onSelectItem(item);
                        onClose();
                      }}
                      activeOpacity={0.7}>
                      <Image source={item.image} style={styles.rowThumb} />
                      <View style={styles.rowInfo}>
                        <Text style={styles.rowBrand}>{item.brand}</Text>
                        <Text style={styles.rowTitle} numberOfLines={2}>
                          {item.title}
                        </Text>
                        <View style={styles.rowPriceRow}>
                          <Text style={styles.rowPrice}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </Text>
                          {item.mrp > item.price && (
                            <Text style={styles.rowMrp}>
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </Text>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.rowAddBtn}
                        onPress={() => onAddToCart(item)}>
                        <Text style={styles.rowAddText}>
                          {cart[item.id] ? `(${cart[item.id]})` : '+ ADD'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFDF9',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.forestDark,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  scroll: {
    padding: 18,
    paddingBottom: 40,
  },
  trendingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.forestDark,
  },
  recommendedList: {
    gap: 10,
    marginTop: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  rowThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F3EDE2',
  },
  rowInfo: {
    flex: 1,
  },
  rowBrand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.sage,
  },
  rowTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
    marginTop: 2,
  },
  rowPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  rowPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  rowMrp: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  rowAddBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rowAddText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF4EB',
  },
  resultsSection: {
    paddingTop: 4,
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  resultsList: {
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.forestDark,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
