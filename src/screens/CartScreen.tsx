import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { useAppInsets } from '../theme/responsive';
import { CommerceItem, isShopProduct } from '../data/commerceData';
import { AppIcon } from '../components/common/AppIcon';

interface CartScreenProps {
  cart: Record<string, number>;
  items: CommerceItem[];
  currentLocality: string;
  currentPincode: string;
  onOpenLocation: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderSummary: {
    items: { item: CommerceItem; quantity: number }[];
    total: number;
    discount: number;
    address: string;
  }) => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  items,
  currentLocality,
  currentPincode,
  onOpenLocation,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onContinueShopping,
}) => {
  const { bottom: bottomInset } = useAppInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow Morning (8:00 AM - 10:00 AM)');

  // Filter items in cart — strictly physical products
  const cartEntries = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = items.find(i => i.id === id);
      return { item, quantity: qty };
    })
    .filter(
      (entry): entry is { item: CommerceItem; quantity: number } =>
        entry.item !== undefined && isShopProduct(entry.item),
    );

  const totalMRP = cartEntries.reduce(
    (sum, e) => sum + e.item.mrp * e.quantity,
    0,
  );
  const totalSelling = cartEntries.reduce(
    (sum, e) => sum + e.item.price * e.quantity,
    0,
  );
  const catalogDiscount = totalMRP - totalSelling;
  const finalPayable = totalSelling;
  const totalSavings = catalogDiscount;

  const handleCheckout = () => {
    if (isSubmitting) return;

    if (cartEntries.length === 0) {
      Alert.alert('Your basket is empty', 'Please select products before checking out.');
      return;
    }

    setIsSubmitting(true);
    try {
      onPlaceOrder({
        items: cartEntries,
        total: finalPayable,
        discount: totalSavings,
        address: `Flat 402, 12th Main, ${currentLocality}, Bengaluru - ${currentPincode}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBg}>
          <AppIcon name="cart" size={42} color={Colors.sage} />
        </View>
        <Text style={styles.emptyTitle}>Your basket is waiting.</Text>
        <Text style={styles.emptySub}>
          Find something lovely for you and your little one.
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={onContinueShopping}
          activeOpacity={0.85}>
          <Text style={styles.shopBtnText}>EXPLORE PRODUCTS</Text>
          <Text style={styles.shopBtnArrow}>➔</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>
          {cartEntries.length} {cartEntries.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {/* Delivery Address Card (Flipkart / Amazon style) */}
        <View style={styles.addressCard}>
          <View style={styles.addressLeft}>
            <View style={styles.addressIconWrap}>
              <AppIcon name="location" size={15} color={Colors.terracotta} />
            </View>
            <View style={styles.addressTexts}>
              <Text style={styles.addressLabel}>DELIVERING TO HOME</Text>
              <Text style={styles.addressLine}>
                {currentLocality}, Bengaluru · {currentPincode}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={onOpenLocation}
            activeOpacity={0.7}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Slot Selector */}
        <View style={styles.slotCard}>
          <View style={styles.slotHeader}>
            <AppIcon name="calendar" size={14} color={Colors.forestDark} />
            <Text style={styles.slotTitle}>PREFERRED DELIVERY SLOT</Text>
          </View>
          <View style={styles.slotChips}>
            {[
              'Tomorrow Morning (8:00 AM - 10:00 AM)',
              'Tomorrow Afternoon (12:30 PM - 2:30 PM)',
              'Same Day Express (Within 3 Hours)',
            ].map(slot => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotChip,
                  selectedSlot === slot && styles.slotChipActive,
                ]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.slotChipText,
                    selectedSlot === slot && styles.slotChipTextActive,
                  ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionHeading}>ORDER ITEMS</Text>
          {cartEntries.map(({ item, quantity }) => (
            <View key={item.id} style={styles.cartItemRow}>
              <Image source={item.image} style={styles.itemImage} />

              <View style={styles.itemDetails}>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemWeight}>{item.durationOrWeight}</Text>

                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </Text>
                  {item.mrp > item.price && (
                    <Text style={styles.itemMrp}>
                      ₹{item.mrp.toLocaleString('en-IN')}
                    </Text>
                  )}
                  {item.discountPercent > 0 && (
                    <Text style={styles.itemDiscount}>
                      {item.discountPercent}% OFF
                    </Text>
                  )}
                </View>
              </View>

              {/* Stepper & Remove */}
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => onRemoveItem(item.id)}
                  accessibilityLabel="Remove item">
                  <AppIcon name="trash" size={14} color={Colors.textMuted} />
                </TouchableOpacity>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => onUpdateQty(item.id, -1)}
                    activeOpacity={0.7}>
                    <Text style={styles.stepText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => onUpdateQty(item.id, 1)}
                    activeOpacity={0.7}>
                    <Text style={styles.stepText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Demo Mode Notice */}
        <View style={styles.demoBanner}>
          <AppIcon name="shield" size={13} color={Colors.sage} />
          <Text style={styles.demoBannerText}>
            Local Demo Experience · No actual payment processed · Stored locally
          </Text>
        </View>

        {/* Price Breakdown / Bill Details (Flipkart / Amazon standard) */}
        <View style={styles.billCard}>
          <Text style={styles.billHeading}>PRICE DETAILS</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total MRP ({cartEntries.length} items)</Text>
            <Text style={styles.billVal}>₹{totalMRP.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Product Discount</Text>
            <Text style={styles.billDiscount}>
              − ₹{catalogDiscount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Charges</Text>
            <Text style={styles.billFree}>FREE</Text>
          </View>

          <View style={styles.billDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Payable</Text>
            <Text style={styles.totalValue}>
              ₹{finalPayable.toLocaleString('en-IN')}
            </Text>
          </View>

          {totalSavings > 0 && (
            <View style={styles.savingsBanner}>
              <Text style={styles.savingsText}>
                🎉 You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
              </Text>
            </View>
          )}
        </View>

        {/* Trust Badges */}
        <View style={styles.assuranceBox}>
          <View style={styles.assuranceItem}>
            <AppIcon name="lock" size={14} color={Colors.forestDark} />
            <Text style={styles.assuranceText}>Local Demo Checkout · Local Device Storage</Text>
          </View>
          <View style={styles.assuranceItem}>
            <AppIcon name="verified" size={14} color={Colors.forestDark} />
            <Text style={styles.assuranceText}>Handcrafted Physical Essentials for Mother & Baby</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar (Flipkart style) */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(bottomInset + 10, 14) },
        ]}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomTotalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.bottomTotalPrice}>
            ₹{finalPayable.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            (isSubmitting || cartEntries.length === 0) && styles.placeOrderBtnDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isSubmitting || cartEntries.length === 0}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Place local demo order"
          accessibilityState={{ disabled: isSubmitting || cartEntries.length === 0, busy: isSubmitting }}>
          <Text style={styles.placeOrderText}>
            {isSubmitting ? 'CREATING DEMO ORDER...' : 'PLACE DEMO ORDER'}
          </Text>
          {!isSubmitting && <Text style={styles.placeOrderArrow}>➔</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFDF9',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 8,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  headerCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  scroll: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  addressIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 109, 81, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTexts: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.sage,
  },
  addressLine: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
    marginTop: 2,
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.terracotta,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  slotCard: {
    backgroundColor: '#FFFDF9',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  slotTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.forestDark,
  },
  slotChips: {
    gap: 6,
  },
  slotChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  slotChipActive: {
    borderColor: Colors.forestDark,
    backgroundColor: '#EAE2D5',
  },
  slotChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  slotChipTextActive: {
    color: Colors.forestDark,
    fontWeight: '700',
  },
  itemsSection: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.06)',
    gap: 12,
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#F3EDE2',
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.sage,
  },
  itemTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
    marginTop: 2,
    lineHeight: 18,
  },
  itemWeight: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  itemMrp: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 68,
  },
  trashBtn: {
    padding: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.forestDark,
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestDark,
    minWidth: 16,
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  demoBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestDark,
    flex: 1,
  },
  billFree: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
  },
  billCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  billHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.forestDark,
    marginBottom: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  billVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.forestDark,
  },
  billDiscount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freeStrike: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  freeTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  savingsBanner: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
  },
  assuranceBox: {
    gap: 8,
    paddingHorizontal: 4,
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assuranceText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPriceCol: {
    justifyContent: 'center',
  },
  bottomTotalLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textMuted,
  },
  bottomTotalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.forestDark,
    marginTop: 1,
  },
  placeOrderBtn: {
    backgroundColor: '#C86D51',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#C86D51',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  placeOrderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: 'white',
  },
  placeOrderArrow: {
    fontSize: 14,
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: Colors.creamLight,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAE2D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.forestDark,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: Colors.forestDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#FAF4EB',
  },
  shopBtnArrow: {
    fontSize: 14,
    color: '#FAF4EB',
  },
});
