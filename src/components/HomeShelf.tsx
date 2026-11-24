import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { CommerceItem } from '../data/commerceData';
import { ProductCard } from './ProductCard';

interface HomeShelfProps { title: string; subtitle?: string; items: CommerceItem[]; cart: Record<string, number>; wishlist: string[]; onViewAll: () => void; onSelectItem?: (item: CommerceItem) => void; onAddToCart?: (item: CommerceItem) => void; onUpdateQty?: (id: string, delta: number) => void; onToggleWishlist?: (id: string) => void; }
export const HomeShelf = memo((props: HomeShelfProps) => <View style={styles.section}>
  <View style={styles.header}><View style={styles.titleBlock}><Text style={styles.title}>{props.title}</Text>{props.subtitle ? <Text style={styles.subtitle}>{props.subtitle}</Text> : null}</View><TouchableOpacity onPress={props.onViewAll}><Text style={styles.action}>VIEW ALL →</Text></TouchableOpacity></View>
  <FlatList horizontal data={props.items} keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list} initialNumToRender={3} windowSize={3} renderItem={({ item }) => <View style={styles.card}><ProductCard item={item} quantity={props.cart[item.id] || 0} isWishlisted={props.wishlist.includes(item.id)} onPress={() => props.onSelectItem?.(item)} onAdd={() => props.onAddToCart?.(item)} onIncrement={() => props.onUpdateQty?.(item.id, 1)} onDecrement={() => props.onUpdateQty?.(item.id, -1)} onToggleWishlist={() => props.onToggleWishlist?.(item.id)} /></View>} />
</View>);
const styles = StyleSheet.create({ section: { marginTop: 30 }, header: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 13, justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }, titleBlock: { flex: 1 }, title: { fontFamily: Fonts.serif, fontSize: 22, color: Colors.forestDark }, subtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 3 }, action: { fontSize: 9, fontWeight: '800', letterSpacing: .5, color: Colors.terracotta, paddingBottom: 2 }, list: { paddingLeft: 16, paddingRight: 4, gap: 12 }, card: { width: 168 } });
