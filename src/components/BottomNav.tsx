import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useAppInsets } from '../theme/responsive';
import { AppIcon } from './common/AppIcon';

export type TabKey =
  | 'home'
  | 'shop'
  | 'wishlist'
  | 'profile'
  | 'nutrition'
  | 'cart'
  | 'orders'
  | 'services'
  | 'nanny'
  | 'doctors'
  | 'faqs';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  wishlistCount?: number;
}

interface TabItemConfig {
  key: TabKey;
  label: string;
  imageIcon?: ImageSourcePropType;
  vectorIcon?: string;
  badgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  wishlistCount = 0,
}) => {
  const { bottom: bottomInset } = useAppInsets();
  const tabs: TabItemConfig[] = [
    {
      key: 'home',
      label: 'Home',
      imageIcon: require('../assets/icons/home.png'),
    },
    {
      key: 'doctors',
      label: 'Doctors',
      imageIcon: require('../assets/icons/doctors.png'),
    },
    {
      key: 'nanny',
      label: 'Nanny',
      imageIcon: require('../assets/icons/services.png'),
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      vectorIcon: 'heart',
      badgeCount: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      key: 'orders',
      label: 'Orders',
      vectorIcon: 'package',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(bottomInset, 10),
          paddingTop: 8,
        },
      ]}
      accessibilityRole="tablist">
      {tabs.map(tab => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}>
            <View
              style={[
                styles.iconWrapper,
                isActive && styles.activeIconWrapper,
              ]}>
              {tab.imageIcon ? (
                <Image
                  source={tab.imageIcon}
                  style={[
                    styles.tabIcon,
                    {
                      tintColor: isActive ? Colors.forestDark : Colors.textMuted,
                    },
                  ]}
                  resizeMode="contain"
                />
              ) : (
                <AppIcon
                  name={tab.vectorIcon || 'sparkle'}
                  size={19}
                  color={isActive ? Colors.forestDark : Colors.textMuted}
                />
              )}

              {/* Dynamic Badge (e.g. for Cart) */}
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badgeCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activePill} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.08)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  iconWrapper: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    backgroundColor: Colors.terracotta,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'white',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
  },
  activeTabLabel: {
    color: Colors.forestDark,
    fontWeight: '800',
  },
  activePill: {
    position: 'absolute',
    bottom: -4,
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: Colors.terracotta,
  },
});
