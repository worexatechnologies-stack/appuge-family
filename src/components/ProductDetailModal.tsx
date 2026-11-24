import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { useAppInsets } from '../theme/responsive';
import { CommerceItem } from '../data/commerceData';
import { AppIcon } from './common/AppIcon';

interface ProductDetailModalProps {
  item: CommerceItem | null;
  visible: boolean;
  onClose: () => void;
  quantity?: number;
  isWishlisted?: boolean;
  onAddToCart: (item: CommerceItem) => void;
  onToggleWishlist?: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  visible,
  onClose,
  quantity = 0,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
}) => {
  const { top: topInset, bottom: bottomInset } = useAppInsets();
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Floating Action Bar */}
        <View style={[styles.topBar, { top: Math.max(topInset + 8, 16) }]}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onClose}
            accessibilityLabel="Close product details">
            <AppIcon name="arrow-left" size={16} color={Colors.forestDark} />
          </TouchableOpacity>
          <View style={styles.topRight}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => onToggleWishlist?.(item.id)}
              accessibilityLabel="Wishlist item">
              <AppIcon
                name="heart"
                size={16}
                color={isWishlisted ? '#D9383A' : Colors.forestDark}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {/* Hero Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={item.image}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {item.badge && (
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>{item.badge}</Text>
              </View>
            )}
          </View>

          {/* Details Header */}
          <View style={styles.body}>
            <View style={styles.categoryRow}>
              <Text style={styles.brandText}>{item.brand.toUpperCase()}</Text>
              <Text style={styles.categoryPill}>{item.category}</Text>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            {/* Ratings & Verification */}
            <View style={styles.ratingsRow}>
              <View style={styles.ratingBox}>
                <Text style={styles.starText}>★</Text>
                <Text style={styles.ratingNumber}>
                  {item.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={styles.reviewsCount}>
                {item.reviewsCount} verified mothers rated this
              </Text>
            </View>

            {/* Price Box */}
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceCurrency}>₹</Text>
                <Text style={styles.priceValue}>
                  {item.price.toLocaleString('en-IN')}
                </Text>
                {item.mrp > item.price && (
                  <>
                    <Text style={styles.mrpValue}>
                      ₹{item.mrp.toLocaleString('en-IN')}
                    </Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {item.discountPercent}% OFF
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <Text style={styles.taxText}>
                Inclusive of all taxes · {item.durationOrWeight}
              </Text>
            </View>

            {/* Delivery Assurance */}
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryIconBg}>
                <AppIcon name="delivery" size={16} color={Colors.forestDark} />
              </View>
              <View style={styles.deliveryTextCol}>
                <Text style={styles.deliveryTitle}>{item.deliveryTag}</Text>
                <Text style={styles.deliverySub}>
                  Hygienic temperature-controlled packaging guaranteed
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>About this care</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Benefits */}
            {item.benefits && item.benefits.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>Key Benefits</Text>
                <View style={styles.benefitList}>
                  {item.benefits.map((benefit, idx) => (
                    <View key={idx} style={styles.benefitRow}>
                      <View style={styles.benefitBullet}>
                        <AppIcon name="check" size={10} color="white" />
                      </View>
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Inclusions */}
            {item.inclusions && item.inclusions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>What's Included</Text>
                <View style={styles.inclusionList}>
                  {item.inclusions.map((inc, idx) => (
                    <View key={idx} style={styles.inclusionChip}>
                      <Text style={styles.inclusionText}>✦ {inc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Trust Assurances */}
            <View style={styles.trustBox}>
              <View style={styles.trustItem}>
                <AppIcon name="shield" size={18} color={Colors.forestDark} />
                <Text style={styles.trustTitle}>100% Genuine</Text>
                <Text style={styles.trustSub}>Handcrafted & Certified</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <AppIcon name="verified" size={18} color={Colors.forestDark} />
                <Text style={styles.trustTitle}>Doctor Approved</Text>
                <Text style={styles.trustSub}>Maternal Safety Tested</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <AppIcon name="leaf" size={18} color={Colors.forestDark} />
                <Text style={styles.trustTitle}>Pure Herbal</Text>
                <Text style={styles.trustSub}>Zero harsh chemicals</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Add to Cart Bar */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(bottomInset + 10, 14) },
          ]}>
          <View style={styles.bottomPriceCol}>
            <Text style={styles.bottomPriceLabel}>TOTAL PRICE</Text>
            <Text style={styles.bottomPrice}>
              ₹{item.price.toLocaleString('en-IN')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bottomAddBtn}
            onPress={() => {
              onAddToCart(item);
            }}
            activeOpacity={0.85}>
            <AppIcon name="cart" size={16} color="white" />
            <Text style={styles.bottomAddText}>
              {quantity > 0 ? `ADDED (${quantity}) · ADD MORE` : 'ADD TO CART'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  topBar: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  scroll: {
    paddingBottom: 100,
  },
  imageWrapper: {
    width: '100%',
    height: 320,
    backgroundColor: '#F3EDE2',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: 'white',
  },
  body: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.sage,
  },
  categoryPill: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
    backgroundColor: '#EAE2D5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.forestDark,
    marginBottom: 8,
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5ECE3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  starText: {
    fontSize: 12,
    color: Colors.terracotta,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  reviewsCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  mrpValue: {
    fontSize: 15,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  taxText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 93, 79, 0.08)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  deliveryIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTextCol: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  deliverySub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: Colors.forestDark,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  benefitList: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 13,
    color: Colors.forestDark,
    flex: 1,
    lineHeight: 18,
  },
  inclusionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inclusionChip: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  inclusionText: {
    fontSize: 12,
    color: Colors.forestDark,
    fontWeight: '600',
  },
  trustBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFDF9',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 8,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
    marginTop: 6,
  },
  trustSub: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderColor: Colors.cardBorder,
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
  bottomPriceLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textMuted,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.forestDark,
    marginTop: 1,
  },
  bottomAddBtn: {
    backgroundColor: Colors.forestDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bottomAddText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#FAF4EB',
  },
});
