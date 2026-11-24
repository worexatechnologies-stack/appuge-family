import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { CommerceOrder, CommerceItem } from '../data/commerceData';
import { AppIcon } from '../components/common/AppIcon';
import { OrderDetailScreen } from './OrderDetailScreen';

interface OrdersScreenProps {
  orders: CommerceOrder[];
  onRepeatOrder: (order: CommerceOrder) => void;
  onExploreStore: () => void;
  onSelectItem?: (item: CommerceItem) => void;
  onAddToCart?: (item: CommerceItem) => void;
}

type Filter = 'all' | 'processing' | 'shipped' | 'delivered';

function statusDot(status: CommerceOrder['status']): string {
  if (status === 'Delivered')  return '#2E7D32';
  if (status === 'In Transit') return Colors.terracotta;
  return '#E8A020';
}

const FilterPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={[styles.pill, active && styles.pillActive]}>
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  onRepeatOrder,
  onExploreStore,
  onSelectItem,
  onAddToCart,
}) => {
  const [filter,       setFilter]       = useState<Filter>('all');
  const [detailOrder,  setDetailOrder]  = useState<CommerceOrder | null>(null);
  const [showAll,      setShowAll]      = useState(false);

  /* ── Detail view ── */
  if (detailOrder) {
    return (
      <OrderDetailScreen
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        onRepeatOrder={order => { onRepeatOrder(order); setDetailOrder(null); }}
        onExploreStore={() => { setDetailOrder(null); onExploreStore(); }}
        onSelectItem={onSelectItem}
        onAddToCart={onAddToCart}
      />
    );
  }

  /* ── Filtered list ── */
  const filtered = orders.filter(o => {
    if (filter === 'all')        return true;
    if (filter === 'processing') return o.status === 'Confirmed';
    if (filter === 'shipped')    return o.status === 'In Transit';
    if (filter === 'delivered')  return o.status === 'Delivered';
    return false;
  });

  const activeOrder    = orders.find(o => o.status === 'Confirmed' || o.status === 'In Transit');
  const prevOrders     = orders.filter(o => o.id !== activeOrder?.id);
  const displayedPrev  = showAll ? prevOrders : prevOrders.slice(0, 3);

  /* ── Empty state ── */
  if (orders.length === 0) {
    return (
      <View style={styles.emptyRoot}>
        <Image source={require('../assets/images/hero_newborn_daylight.jpg')} style={styles.emptyImage} resizeMode="cover" />
        <View style={styles.emptyShade} />
        <View style={styles.emptyContent}>
          <Text style={styles.emptyEyebrow}>YOUR ORDERS</Text>
          <Text style={styles.emptyHeading}>Your next little{'\n'}discovery starts here.</Text>
          <Text style={styles.emptySub}>Find thoughtful essentials for you and your little one.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={onExploreStore} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>Explore Appuge</Text>
            <AppIcon name="arrow-right" size={14} color="#FAF4EB" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ── Main immersive orders view ── */
  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>

      {/* ── EDITORIAL OPENING ── */}
      <View style={styles.opening}>
        <Text style={styles.openingEyebrow}>YOUR APPUGE JOURNEY</Text>
        <Text style={styles.openingHeading}>{'Something lovely,\non its way.'}</Text>
        <Text style={styles.openingSub}>Follow every little order, from our hands to your home.</Text>
      </View>

      {/* ── ACTIVE ORDER — BIG IMMERSIVE CARD ── */}
      {activeOrder ? (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => setDetailOrder(activeOrder)}
          style={styles.activeCard}>
          {/* Product image collage */}
          <View style={styles.activeImageWrap}>
            {activeOrder.items.slice(0, 2).map((item, idx) => (
              <Image
                key={idx}
                source={item.image}
                style={[styles.activeImage, idx === 1 && styles.activeImageSecond]}
                resizeMode="cover"
              />
            ))}
            <View style={styles.activeShade} />
            {/* Status pill */}
            <View style={[styles.activePill, { borderColor: statusDot(activeOrder.status) }]}>
              <View style={[styles.activePillDot, { backgroundColor: statusDot(activeOrder.status) }]} />
              <Text style={[styles.activePillText, { color: statusDot(activeOrder.status) }]}>
                {activeOrder.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Info panel */}
          <View style={styles.activeInfo}>
            <View style={styles.activeInfoTop}>
              <View>
                <Text style={styles.activeRef}>{activeOrder.orderNumber}</Text>
                <Text style={styles.activeName} numberOfLines={1}>
                  {activeOrder.items.length === 1
                    ? activeOrder.items[0].title
                    : `${activeOrder.items[0].title} + ${activeOrder.items.length - 1} more`}
                </Text>
              </View>
              <View style={styles.activeStats}>
                <Text style={styles.activeStatLabel}>{activeOrder.items.length} item{activeOrder.items.length > 1 ? 's' : ''}</Text>
                <Text style={styles.activeTotal}>₹{activeOrder.totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Mini progress */}
            <View style={styles.miniTimeline}>
              {['Placed', 'Preparing', 'Dispatched', 'On the way', 'Delivered'].map((step, i) => {
                const prog = activeOrder.status === 'Confirmed' ? 1 : activeOrder.status === 'In Transit' ? 3 : 4;
                const done = i <= prog;
                return (
                  <View key={i} style={styles.miniStep}>
                    <View style={[styles.miniDot, done && styles.miniDotDone, i === prog && styles.miniDotActive]} />
                    {i < 4 && <View style={[styles.miniLine, done && i < prog && styles.miniLineDone]} />}
                  </View>
                );
              })}
            </View>
            <Text style={styles.activeEta}>{activeOrder.deliveryDateText}</Text>

            <View style={styles.followRow}>
              <Text style={styles.followText}>Follow your parcel</Text>
              <AppIcon name="arrow-right" size={13} color={Colors.terracotta} />
            </View>
          </View>
        </TouchableOpacity>
      ) : null}

      {/* ── FILTER ROW ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterWrap}>
        {(['all', 'processing', 'shipped', 'delivered'] as Filter[]).map(f => (
          <FilterPill
            key={f}
            label={f === 'all' ? 'All orders' : f === 'processing' ? 'Confirmed' : f === 'shipped' ? 'In Transit' : 'Delivered'}
            active={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </ScrollView>

      {/* ── PREVIOUS PARCELS or FILTERED LIST ── */}
      {filter === 'all' && prevOrders.length > 0 ? (
        <View style={styles.prevSection}>
          <View style={styles.prevHeader}>
            <Text style={styles.prevEyebrow}>LITTLE MOMENTS, ALREADY DELIVERED.</Text>
          </View>
          {displayedPrev.map(order => (
            <TouchableOpacity
              key={order.id}
              onPress={() => setDetailOrder(order)}
              activeOpacity={0.88}
              style={styles.prevCard}>
              {/* Image strip */}
              <View style={styles.prevImageRow}>
                {order.items.slice(0, 3).map((item, idx) => (
                  <Image
                    key={idx}
                    source={item.image}
                    style={[styles.prevThumb, idx === 0 && styles.prevThumbLarge]}
                    resizeMode="cover"
                  />
                ))}
              </View>
              {/* Meta */}
              <View style={styles.prevMeta}>
                <View style={styles.prevMetaLeft}>
                  <Text style={styles.prevDate}>{order.orderDate}</Text>
                  <Text style={styles.prevName} numberOfLines={1}>
                    {order.items.length === 1
                      ? order.items[0].title
                      : `${order.items[0].title} & ${order.items.length - 1} more`}
                  </Text>
                  <Text style={styles.prevItems}>{order.items.length} item{order.items.length > 1 ? 's' : ''} · ₹{order.totalAmount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.prevMetaRight}>
                  <View style={[styles.prevStatus, { backgroundColor: `${statusDot(order.status)}18` }]}>
                    <View style={[styles.prevStatusDot, { backgroundColor: statusDot(order.status) }]} />
                    <Text style={[styles.prevStatusText, { color: statusDot(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                  <AppIcon name="arrow-right" size={12} color={Colors.textMuted} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {!showAll && prevOrders.length > 3 && (
            <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showAllBtn} activeOpacity={0.8}>
              <Text style={styles.showAllText}>Explore all your orders  →</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Filtered view */
        <View style={styles.prevSection}>
          {filtered.length === 0 ? (
            <View style={styles.filterEmpty}>
              <Text style={styles.filterEmptyTitle}>No {filter} orders</Text>
              <Text style={styles.filterEmptySub}>Place an order and it will appear here.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={onExploreStore} activeOpacity={0.85}>
                <Text style={styles.emptyBtnText}>Explore Appuge</Text>
                <AppIcon name="arrow-right" size={14} color="#FAF4EB" />
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map(order => (
              <TouchableOpacity
                key={order.id}
                onPress={() => setDetailOrder(order)}
                activeOpacity={0.88}
                style={styles.prevCard}>
                <View style={styles.prevImageRow}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <Image
                      key={idx}
                      source={item.image}
                      style={[styles.prevThumb, idx === 0 && styles.prevThumbLarge]}
                      resizeMode="cover"
                    />
                  ))}
                </View>
                <View style={styles.prevMeta}>
                  <View style={styles.prevMetaLeft}>
                    <Text style={styles.prevDate}>{order.orderDate}</Text>
                    <Text style={styles.prevName} numberOfLines={1}>
                      {order.items.length === 1
                        ? order.items[0].title
                        : `${order.items[0].title} & ${order.items.length - 1} more`}
                    </Text>
                    <Text style={styles.prevItems}>{order.items.length} item{order.items.length > 1 ? 's' : ''} · ₹{order.totalAmount.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.prevMetaRight}>
                    <View style={[styles.prevStatus, { backgroundColor: `${statusDot(order.status)}18` }]}>
                      <View style={[styles.prevStatusDot, { backgroundColor: statusDot(order.status) }]} />
                      <Text style={[styles.prevStatusText, { color: statusDot(order.status) }]}>
                        {order.status}
                      </Text>
                    </View>
                    <AppIcon name="arrow-right" size={12} color={Colors.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* ── PROMISE FOOTER ── */}
      <View style={styles.promise}>
        <AppIcon name="shield" size={14} color={Colors.sage} />
        <Text style={styles.promiseText}>Thoughtfully sourced  ·  Quality guaranteed  ·  Care when you need it</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  scroll: { paddingBottom: 20 },

  // Opening
  opening: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    backgroundColor: Colors.creamLight,
  },
  openingEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.sage,
    marginBottom: 6,
  },
  openingHeading: {
    fontFamily: Fonts.serif,
    fontSize: 30,
    lineHeight: 36,
    color: Colors.forestDark,
    marginBottom: 8,
  },
  openingSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    maxWidth: 300,
  },

  // Active order card
  activeCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    elevation: 4,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  activeImageWrap: { height: 200, flexDirection: 'row', backgroundColor: Colors.cream },
  activeImage: { flex: 1, height: '100%' },
  activeImageSecond: { borderLeftWidth: 2, borderLeftColor: '#FFFDF9' },
  activeShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22,40,30,0.18)',
  },
  activePill: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,253,249,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  activePillDot:  { width: 6, height: 6, borderRadius: 3 },
  activePillText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  activeInfo: { padding: 16 },
  activeInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  activeRef: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.4 },
  activeName: { fontFamily: Fonts.serif, fontSize: 17, color: Colors.forestDark, marginTop: 2, maxWidth: 200 },
  activeStats: { alignItems: 'flex-end' },
  activeStatLabel: { fontSize: 10, color: Colors.textMuted },
  activeTotal: { fontSize: 16, fontWeight: '800', color: Colors.forestDark, marginTop: 2 },

  // Mini progress
  miniTimeline: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  miniStep: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  miniDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1DCD6' },
  miniDotDone:   { backgroundColor: '#2E7D32' },
  miniDotActive: { backgroundColor: Colors.terracotta, width: 10, height: 10, borderRadius: 5 },
  miniLine: { flex: 1, height: 2, backgroundColor: '#D1DCD6', marginHorizontal: 2 },
  miniLineDone: { backgroundColor: '#2E7D32' },
  activeEta: { fontSize: 11, color: Colors.textMuted, marginBottom: 12 },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.08)',
    paddingTop: 12,
  },
  followText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.terracotta,
    letterSpacing: 0.2,
  },

  // Filter pills
  filterWrap:  { backgroundColor: Colors.creamLight },
  filterRow:   { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: '#FFFDF9',
  },
  pillActive:    { backgroundColor: Colors.forestDark, borderColor: Colors.forestDark },
  pillText:      { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  pillTextActive: { color: '#FAF4EB' },

  // Previous parcels
  prevSection: { marginHorizontal: 16 },
  prevHeader:  { marginBottom: 14 },
  prevEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: Colors.sage,
  },

  prevCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  prevImageRow: { flexDirection: 'row', height: 110, backgroundColor: Colors.cream },
  prevThumb: { flex: 1, height: '100%' },
  prevThumbLarge: { flex: 2 },
  prevMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  prevMetaLeft: { flex: 1 },
  prevDate: { fontSize: 10, color: Colors.textMuted, marginBottom: 3 },
  prevName: { fontFamily: Fonts.serif, fontSize: 14, color: Colors.forestDark, lineHeight: 18 },
  prevItems: { fontSize: 11, color: Colors.textSecondary, marginTop: 3 },
  prevMetaRight: { alignItems: 'flex-end', gap: 8 },
  prevStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  prevStatusDot:  { width: 5, height: 5, borderRadius: 3 },
  prevStatusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },

  // Show all
  showAllBtn: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingVertical: 8,
  },
  showAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.terracotta,
    letterSpacing: 0.2,
  },

  // Filter empty
  filterEmpty: { paddingVertical: 48, alignItems: 'center', paddingHorizontal: 24 },
  filterEmptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.forestDark,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  filterEmptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Empty root (no orders)
  emptyRoot: { flex: 1, backgroundColor: Colors.forestDark },
  emptyImage: { width: '100%', height: '100%', position: 'absolute' },
  emptyShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22,40,30,0.72)',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 28,
    paddingBottom: 60,
  },
  emptyEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: 'rgba(255,253,249,0.6)',
    marginBottom: 10,
  },
  emptyHeading: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: '#FFFDF9',
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 14,
    color: 'rgba(255,253,249,0.75)',
    lineHeight: 21,
    marginBottom: 28,
    maxWidth: 290,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.terracotta,
    alignSelf: 'flex-start',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFDF9' },

  // Promise footer
  promise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.08)',
  },
  promiseText: { flex: 1, fontSize: 11, color: Colors.textMuted, lineHeight: 17 },
});
