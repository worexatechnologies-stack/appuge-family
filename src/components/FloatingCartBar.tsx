import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { AppIcon } from './common/AppIcon';

interface FloatingCartBarProps {
  count: number;
  total: number;
  onPress: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  count,
  total,
  onPress,
}) => {
  if (count <= 0) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${count} items, Total Rs ${total}`}>
        <View style={styles.left}>
          <View style={styles.iconCircle}>
            <AppIcon name="cart" size={15} color="#FAF4EB" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.itemCountText}>
              {count} {count === 1 ? 'ITEM' : 'ITEMS'} ADDED
            </Text>
            <Text style={styles.totalText}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.actionText}>VIEW CART</Text>
          <Text style={styles.arrowText}>➔</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 99,
  },
  container: {
    backgroundColor: Colors.forestDark,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.4)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 244, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.terracotta,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'white',
  },
  itemCountText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#D1DCD6',
  },
  totalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FAF4EB',
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: 'white',
  },
  arrowText: {
    fontSize: 12,
    color: 'white',
  },
});
