import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';
import { useAppInsets } from '../theme/responsive';

interface HeaderProps {
  onOpenBooking: (prefillService?: string) => void;
  user?: { name: string; phone: string } | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  showBookButton?: boolean;
  showBackButton?: boolean;
  onGoBack?: () => void;
  cartCount?: number;
  wishlistCount?: number;
  currentLocality?: string;
  onOpenLocation?: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  user,
  onOpenAuth,
  onOpenProfile,
  showBackButton = false,
  onGoBack,
  cartCount = 0,
  wishlistCount = 0,
  currentLocality = 'Indiranagar',
  onOpenLocation,
  onOpenCart,
  onOpenWishlist,
}) => {
  const { left: leftInset, right: rightInset } = useAppInsets();
  const horizPadding = Math.max(leftInset, rightInset, 20);

  const handleProfilePress = () => {
    if (onOpenProfile) {
      onOpenProfile();
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: horizPadding }]}>
      {/* 1. Brand & Actions Row */}
      <View style={styles.brandRow}>
        <View style={styles.leftBrand}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.logoBlock}>
            <Text style={styles.brandTitle}>appuge</Text>
            <Text style={styles.brandTagline}>HEARTBEATS WRAPPED WITH LOVE</Text>
          </TouchableOpacity>
        </View>

        {/* Right Action Icons: Wishlist + Cart + Profile */}
        <View style={styles.rightActions}>
          {/* Wishlist Icon */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenWishlist}
            activeOpacity={0.75}
            accessibilityLabel={`Wishlist, ${wishlistCount} saved`}
            accessibilityRole="button">
            <AppIcon name="heart" size={15} color={Colors.forestDark} />
            {wishlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Bag Icon with Live Count */}
          <TouchableOpacity
            style={[styles.actionBtn, cartCount > 0 && styles.cartBtnActive]}
            onPress={onOpenCart}
            activeOpacity={0.75}
            accessibilityLabel={`Shopping cart, ${cartCount} items`}>
            <AppIcon name="cart" size={15} color={Colors.forestDark} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Sign In / Profile Avatar */}
          {user ? (
            <TouchableOpacity
              style={styles.userAvatarBtn}
              onPress={handleProfilePress}
              activeOpacity={0.75}
              accessibilityLabel="User profile">
              <Text style={styles.userAvatarLetter}>
                {user.name.trim().charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleProfilePress}
              activeOpacity={0.75}
              accessibilityLabel="Account">
              <AppIcon name="user" size={15} color={Colors.forestDark} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Unified Delivery Location Bar */}
      <TouchableOpacity
        style={styles.deliveryBar}
        onPress={onOpenLocation}
        activeOpacity={0.75}
        accessibilityLabel={`Delivering to ${currentLocality}, tap to change`}>
        <View style={styles.deliveryLeft}>
          <AppIcon name="location" size={11} color={Colors.terracotta} />
          <Text style={styles.deliveryPrompt}>Delivering to</Text>
          <Text style={styles.deliveryLocality} numberOfLines={1}>
            {currentLocality}, Bengaluru
          </Text>
          <Text style={styles.deliveryChevron}>▾</Text>
        </View>
        <View style={styles.deliveryRight}>
          <Text style={styles.deliverySpeedTag}>Local Delivery</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.creamLight,
    paddingTop: 2,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.07)',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.forestDark,
    letterSpacing: 0.3,
  },
  logoBlock: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.forestDark,
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  brandTagline: {
    fontSize: 6.8,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.sage,
    marginTop: 0,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBtnActive: {
    backgroundColor: '#FFF8F4',
    borderColor: 'rgba(200, 109, 81, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.forestDark,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: 'white',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.terracotta,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'white',
  },
  userAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarLetter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FAF4EB',
  },
  signInCapsule: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  signInText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.forestDark,
  },
  deliveryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    marginTop: 2,
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  deliveryPrompt: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: Colors.sage,
  },
  deliveryLocality: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.forestDark,
    maxWidth: 160,
  },
  deliveryChevron: {
    fontSize: 10,
    color: Colors.forestDark,
  },
  deliveryRight: {
    backgroundColor: 'rgba(44, 64, 53, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  deliverySpeedTag: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
});
