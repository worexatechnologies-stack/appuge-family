import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import {
  CommerceOrder,
  CommerceItem,
  COMMERCE_ITEMS,
  SHOP_ITEMS,
} from '../data/commerceData';
import { AppIcon } from '../components/common/AppIcon';

interface OrderDetailScreenProps {
  order: CommerceOrder;
  onClose: () => void;
  onRepeatOrder: (order: CommerceOrder) => void;
  onExploreStore: () => void;
  onSelectItem?: (item: CommerceItem) => void;
  onAddToCart?: (item: CommerceItem) => void;
}

const STAGES = [
  { key: 'placed',    label: '01', title: 'Order received',              desc: 'Your order has been placed successfully.' },
  { key: 'prepared',  label: '02', title: 'Being prepared',              desc: 'Your products are being carefully prepared.' },
  { key: 'handed',    label: '03', title: 'Handed to delivery partner',  desc: 'Your parcel has been handed over.' },
  { key: 'transit',   label: '04', title: 'On its way home',             desc: 'Your parcel is on its journey to you.' },
  { key: 'delivered', label: '05', title: 'Delivered',                   desc: 'Your order has arrived. Enjoy!' },
];

function stageIndex(status: CommerceOrder['status']): number {
  if (status === 'Confirmed')  return 1;
  if (status === 'In Transit') return 3;
  if (status === 'Delivered')  return 4;
  return 0;
}

export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({
  order,
  onClose,
  onRepeatOrder,
  onExploreStore,
  onSelectItem,
  onAddToCart,
}) => {
  const orderedIds = useMemo(() => new Set(order.items.map(it => it.itemId)), [order]);
  const primaryCategory = useMemo(() => {
    const first = COMMERCE_ITEMS.find(c => c.id === order.items[0]?.itemId);
    return first?.category;
  }, [order]);

  const similarProducts = useMemo(() => {
    const matching = SHOP_ITEMS.filter(
      it => !orderedIds.has(it.id) && (!primaryCategory || it.category === primaryCategory),
    );
    if (matching.length >= 2) return matching.slice(0, 4);
    const others = SHOP_ITEMS.filter(it => !orderedIds.has(it.id));
    return [...matching, ...others].slice(0, 4);
  }, [orderedIds, primaryCategory]);

  const heroOpacity  = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(18)).current;
  const refOpacity   = useRef(new Animated.Value(0)).current;
  const lineProgress = useRef(new Animated.Value(0)).current;
  const contentY     = useRef(new Animated.Value(28)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const seq = Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity,  { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(heroY,        { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
      Animated.timing(refOpacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(lineProgress, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(contentY,       { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ]);
    seq.start();
    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => {
      backSub.remove();
      heroOpacity.stopAnimation();
      heroY.stopAnimation();
      refOpacity.stopAnimation();
      lineProgress.stopAnimation();
      contentOpacity.stopAnimation();
      contentY.stopAnimation();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeStage = stageIndex(order.status);
  const firstItem   = order.items[0];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" {...({ backgroundColor: Colors.forestDark } as any)} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── IMMERSIVE HERO ── */}
        <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroY }] }]}>
          {firstItem?.image ? (
            <Image source={firstItem.image} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}
          <View style={styles.heroShade} />

          {/* Hero copy */}
          <View style={styles.heroCopy}>
            <Animated.Text style={[styles.heroEyebrow, { opacity: refOpacity }]}>ORDER DETAILS</Animated.Text>
            <Text style={styles.heroRef} numberOfLines={1}>{order.orderNumber}</Text>
            <Text style={styles.heroName} numberOfLines={2}>
              {order.items.length === 1
                ? firstItem.title
                : `${firstItem.title} & ${order.items.length - 1} more`}
            </Text>
            <View style={styles.heroBadge}>
              <View style={[styles.heroDot, { backgroundColor: order.statusColor }]} />
              <Text style={[styles.heroBadgeText, { color: order.statusColor }]}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── PURCHASE SUMMARY BAR ── */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ORDERED</Text>
            <Text style={styles.summaryValue}>{order.orderDate}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ITEMS</Text>
            <Text style={styles.summaryValue}>{order.items.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL</Text>
            <Text style={styles.summaryValue}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* ── PARCEL JOURNEY ── */}
        <Animated.View style={[styles.section, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
          <Text style={styles.sectionEyebrow}>THE PARCEL JOURNEY</Text>
          <Text style={styles.sectionHeading}>Following your order home.</Text>
          <Text style={styles.demoNote}>✦ This is a local demo experience. Live courier tracking will be available soon.</Text>

          <View style={styles.timeline}>
            {STAGES.map((stage, idx) => {
              const isDone    = idx < activeStage;
              const isActive  = idx === activeStage;
              const isLast    = idx === STAGES.length - 1;
              return (
                <View key={stage.key} style={styles.stageRow}>
                  {/* Track */}
                  <View style={styles.trackCol}>
                    <View style={[
                      styles.stageNode,
                      isDone   && styles.stageNodeDone,
                      isActive && styles.stageNodeActive,
                    ]}>
                      {isDone ? (
                        <AppIcon name="check" size={9} color="#FFFDF9" />
                      ) : isActive ? (
                        <View style={styles.activeInner} />
                      ) : (
                        <Text style={styles.stageLabel}>{stage.label}</Text>
                      )}
                    </View>
                    {!isLast && (
                      <View style={[styles.trackLine, isDone && styles.trackLineDone]} />
                    )}
                  </View>
                  {/* Content */}
                  <View style={[styles.stageContent, !isLast && { paddingBottom: 20 }]}>
                    <Text style={[
                      styles.stageTitle,
                      isDone   && styles.stageTitleDone,
                      isActive && styles.stageTitleActive,
                    ]}>{stage.title}</Text>
                    <Text style={[
                      styles.stageDesc,
                      (isDone || isActive) && styles.stageDescVisible,
                    ]}>{stage.desc}</Text>
                    {isActive && (
                      <View style={styles.activeChip}>
                        <Text style={styles.activeChipText}>CURRENT STAGE</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* ── PRODUCTS ── */}
        <Animated.View style={[styles.section, { opacity: contentOpacity }]}>
          <Text style={styles.sectionEyebrow}>YOUR SELECTION</Text>
          <Text style={styles.sectionHeading}>What's in your parcel.</Text>

          {order.items.map((item, idx) => (
            <View key={idx} style={styles.productRow}>
              <Image source={item.image} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.productMeta}>{item.durationOrWeight}</Text>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productQty}>Qty {item.quantity}</Text>
                  <Text style={styles.productPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* ── ORDER SUMMARY ── */}
        <Animated.View style={[styles.section, { opacity: contentOpacity }]}>
          <Text style={styles.sectionEyebrow}>ORDER SUMMARY</Text>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Subtotal</Text>
              <Text style={styles.summaryRowValue}>₹{(order.totalAmount + order.discountAmount).toLocaleString('en-IN')}</Text>
            </View>
            {order.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryRowLabel}>Discount</Text>
                <Text style={[styles.summaryRowValue, styles.discountValue]}>−₹{order.discountAmount.toLocaleString('en-IN')}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total paid</Text>
              <Text style={styles.totalValue}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── DELIVERY ADDRESS ── */}
        {!!order.deliveryAddress && (
          <Animated.View style={[styles.section, { opacity: contentOpacity }]}>
            <Text style={styles.sectionEyebrow}>DELIVERY ADDRESS</Text>
            <View style={styles.addressBox}>
              <AppIcon name="map-pin" size={14} color={Colors.sage} />
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── ACTIONS ── */}
        <Animated.View style={[styles.actionsSection, { opacity: contentOpacity }]}>
          {order.status === 'Delivered' ? (
            <TouchableOpacity style={styles.primaryAction} onPress={() => onRepeatOrder(order)} activeOpacity={0.85}>
              <Text style={styles.primaryActionText}>Shop these products again</Text>
              <AppIcon name="arrow-right" size={14} color="#FAF4EB" />
            </TouchableOpacity>
          ) : (
            <View style={styles.inTransitNote}>
              <AppIcon name="truck" size={16} color={Colors.sage} />
              <Text style={styles.inTransitText}>Your parcel is being prepared for delivery.</Text>
            </View>
          )}
          <TouchableOpacity style={styles.ghostAction} onPress={onExploreStore} activeOpacity={0.8}>
            <Text style={styles.ghostActionText}>Explore more products</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── SIMILAR PRODUCTS (In place of back button) ── */}
        {similarProducts.length > 0 && (
          <Animated.View style={[styles.section, { opacity: contentOpacity }]}>
            <Text style={styles.sectionEyebrow}>YOU MIGHT ALSO LOVE</Text>
            <Text style={styles.sectionHeading}>Similar essentials.</Text>
            <Text style={styles.similarSub}>Carefully chosen care to complement your parcel.</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScroll}>
              {similarProducts.map(prod => (
                <TouchableOpacity
                  key={prod.id}
                  style={styles.similarCard}
                  activeOpacity={0.88}
                  onPress={() => (onSelectItem ? onSelectItem(prod) : onExploreStore())}>
                  <Image source={prod.image} style={styles.similarImage} resizeMode="cover" />
                  <View style={styles.similarCardContent}>
                    <Text style={styles.similarCardTitle} numberOfLines={1}>
                      {prod.title}
                    </Text>
                    <Text style={styles.similarCardMeta}>{prod.durationOrWeight}</Text>
                    <View style={styles.similarPriceRow}>
                      <Text style={styles.similarPrice}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </Text>
                      {onAddToCart && (
                        <TouchableOpacity
                          style={styles.similarAddBtn}
                          activeOpacity={0.8}
                          onPress={() => onAddToCart(prod)}>
                          <Text style={styles.similarAddText}>+ ADD</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },

  // Hero
  hero: { height: 310, backgroundColor: Colors.forestDark, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { flex: 1, backgroundColor: Colors.forest },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22,40,30,0.62)',
  },
  heroCopy: { position: 'absolute', left: 20, right: 20, bottom: 24 },
  heroEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: 'rgba(255,253,249,0.65)',
    marginBottom: 6,
  },
  heroRef: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255,253,249,0.75)',
    marginBottom: 4,
  },
  heroName: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 29,
    color: '#FFFDF9',
    marginBottom: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,253,249,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroDot: { width: 6, height: 6, borderRadius: 3 },
  heroBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Summary bar
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.forestDark,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(255,253,249,0.5)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,253,249,0.15)' },

  // Generic section
  section: {
    marginHorizontal: 20,
    marginTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44,64,53,0.08)',
  },
  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 4,
  },
  sectionHeading: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.forestDark,
    marginBottom: 14,
  },
  demoNote: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 15,
  },

  // Timeline
  timeline: { gap: 0 },
  stageRow: { flexDirection: 'row' },
  trackCol: { alignItems: 'center', width: 32 },
  stageNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E8E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNodeDone:   { backgroundColor: '#2E7D32' },
  stageNodeActive: { backgroundColor: Colors.terracotta, borderWidth: 2, borderColor: '#F7DDD5' },
  activeInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFDF9' },
  stageLabel: { fontSize: 7, fontWeight: '800', color: Colors.textMuted },
  trackLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D1DCD6',
    marginVertical: 3,
    minHeight: 16,
  },
  trackLineDone: { backgroundColor: '#2E7D32' },
  stageContent: { flex: 1, paddingLeft: 12, paddingTop: 2 },
  stageTitle: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  stageTitleDone:   { color: Colors.forestDark, fontWeight: '700' },
  stageTitleActive: { color: Colors.terracotta, fontWeight: '800' },
  stageDesc: { fontSize: 11, color: 'transparent', marginTop: 2, lineHeight: 16 },
  stageDescVisible: { color: Colors.textSecondary },
  activeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7DDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 5,
  },
  activeChipText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.terracotta,
  },

  // Products
  productRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    backgroundColor: Colors.cream,
    borderRadius: 12,
    padding: 12,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#EDE8DF',
  },
  productInfo: { flex: 1 },
  productTitle: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    color: Colors.forestDark,
    lineHeight: 18,
  },
  productMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  productQty: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  productPrice: { fontSize: 13, fontWeight: '800', color: Colors.forestDark },

  // Summary table
  summaryTable: { gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryRowLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryRowValue: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },
  discountValue: { color: '#2E7D32' },
  totalRow: {
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.1)',
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.forestDark },

  // Address
  addressBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.cream,
    borderRadius: 10,
    padding: 14,
    alignItems: 'flex-start',
  },
  addressText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  // Actions
  actionsSection: { marginHorizontal: 20, marginTop: 28, gap: 12 },
  primaryAction: {
    backgroundColor: Colors.forestDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FAF4EB',
    letterSpacing: 0.3,
  },
  inTransitNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.sagePale,
    padding: 14,
    borderRadius: 12,
  },
  inTransitText: { flex: 1, fontSize: 13, color: Colors.forestDark, lineHeight: 18 },
  ghostAction: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ghostActionText: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },

  // Similar Products
  similarSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: -8,
    marginBottom: 16,
    lineHeight: 16,
  },
  similarScroll: {
    paddingRight: 20,
    gap: 12,
  },
  similarCard: {
    width: 140,
    backgroundColor: Colors.cream,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.06)',
  },
  similarImage: {
    width: 140,
    height: 110,
    backgroundColor: '#EDE8DF',
  },
  similarCardContent: {
    padding: 10,
  },
  similarCardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 12,
    color: Colors.forestDark,
    lineHeight: 16,
  },
  similarCardMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  similarPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  similarAddBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  similarAddText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFDF9',
    letterSpacing: 0.5,
  },
});
