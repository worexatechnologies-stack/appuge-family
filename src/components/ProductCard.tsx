import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { CommerceItem } from '../data/commerceData';
import { AppIcon } from './common/AppIcon';

interface ProductCardProps {
  item: CommerceItem;
  quantity?: number;
  isWishlisted?: boolean;
  onPress: () => void;
  onAdd: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onToggleWishlist?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  quantity = 0,
  isWishlisted = false,
  onPress,
  onAdd,
  onIncrement,
  onDecrement,
  onToggleWishlist,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, Rs ${item.price}`}>
      {/* Top Image Container */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* Badge */}
        {item.badge && (item.isBestseller || item.isPopular) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={onToggleWishlist}
          activeOpacity={0.7}
          accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <AppIcon
            name="heart"
            size={14}
            color={isWishlisted ? '#D9383A' : Colors.forestDark}
          />
        </TouchableOpacity>

      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text style={styles.brand} numberOfLines={1}>{item.brand.toUpperCase()}</Text>

        {/* Product Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.weight} numberOfLines={1}>{item.durationOrWeight}</Text>

        {/* Pricing & Add to Cart Row */}
        <View style={styles.pricingRow}>
          <View style={styles.priceContainer}>
            <View style={styles.currentPriceRow}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString('en-IN')}
              </Text>
            </View>
            {item.mrp > item.price && (
              <View style={styles.mrpRow}>
                <Text style={styles.mrp}>₹{item.mrp.toLocaleString('en-IN')}</Text>
                <Text style={styles.discount}>
                  {item.discountPercent}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* E-Commerce Add Button / Stepper */}
          {quantity > 0 ? (
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={onDecrement}
                activeOpacity={0.7}>
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={onIncrement || onAdd}
                activeOpacity={0.7}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAdd}
              activeOpacity={0.8}
              accessibilityLabel={`Add ${item.title} to cart`}>
              <Text style={styles.addBtnText}>+ ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    overflow: 'hidden',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 156,
    backgroundColor: '#F3EDE2',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: 'white',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 253, 249, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryPill: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  deliveryPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  content: {
    padding: 11,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: Colors.sage,
    marginBottom: 4,
  },
  weight: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: Colors.forestDark,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5ECE3',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 2,
  },
  star: {
    fontSize: 10,
    color: Colors.terracotta,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  reviewsText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.08)',
  },
  priceContainer: {
    flex: 1,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
    marginRight: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mrp: {
    fontSize: 10,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  addBtn: {
    backgroundColor: '#16281E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#FAF4EB',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.forestDark,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepperBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  stepperQty: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestDark,
    minWidth: 16,
    textAlign: 'center',
  },
});
