import React from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { APPUGE_INFO } from '../data/appugeData';
import { AppIcon } from './common/AppIcon';
import { useAppInsets } from '../theme/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProfileModalProps {
  visible: boolean;
  user?: { name: string; phone: string; stage?: string; location?: string } | null;
  onClose: () => void;
  onLogout: () => void;
  onSignIn?: () => void;
  onNavigateOrders?: () => void;
  onNavigateWishlist?: () => void;
  onNavigateCart?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  user,
  onClose,
  onLogout,
  onSignIn,
  onNavigateOrders,
  onNavigateWishlist,
  onNavigateCart,
}) => {
  const { top: topInset, bottom: bottomInset } = useAppInsets();

  const handleCall = () => {
    Linking.openURL(`tel:${APPUGE_INFO.phone}`).catch(() => {
      Alert.alert('Unable to place call', `Please call ${APPUGE_INFO.phoneDisplay} directly.`);
    });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Appuge! I have an inquiry regarding my physical product orders and delivery.`,
    );
    Linking.openURL(`https://wa.me/${APPUGE_INFO.phone}?text=${text}`);
  };

  const handleFeatureUnavailable = (featureName: string) => {
    Alert.alert(
      featureName,
      'This feature is not connected to a remote server in the current local demo build.',
    );
  };

  const handleSignOutConfirm = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your Appuge account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          onClose();
          onLogout();
        },
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" {...({ translucent: true, backgroundColor: 'transparent' } as any)} />

        {/* Top Header */}
        <View style={[styles.topBar, { paddingTop: topInset + 8, paddingBottom: 12 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Shopping Account</Text>
          {user ? (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleSignOutConfirm}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign out">
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          ) : onSignIn ? (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                onClose();
                onSignIn();
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign in">
              <Text style={styles.logoutText}>Sign In</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 30 }]}
          showsVerticalScrollIndicator={false}>
          {/* User Hero Banner */}
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Sanctuary Shopper'}</Text>
              <Text style={styles.userPhone}>{user?.phone || 'Guest Account'}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.stageChip}>
                  <Text style={styles.stageText}>
                    {user?.stage || 'Mother & Newborn Care'}
                  </Text>
                </View>
                <View style={styles.locationChip}>
                  <AppIcon name="location" size={11} color={Colors.sageDark} />
                  <Text style={styles.locationText}>
                    {user?.location || 'Bengaluru, KA'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Shopping Destinations */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>MY SHOPPING</Text>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onNavigateOrders?.();
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="My Orders">
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIconBox}>
                  <AppIcon name="package" size={16} color={Colors.forestDark} />
                </View>
                <View>
                  <Text style={styles.actionRowTitle}>My Orders</Text>
                  <Text style={styles.actionRowSub}>Track live delivery & repeat purchases</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" size={14} color={Colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onNavigateWishlist?.();
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Wishlist">
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIconBox}>
                  <AppIcon name="heart" size={16} color={Colors.forestDark} />
                </View>
                <View>
                  <Text style={styles.actionRowTitle}>Saved Items (Wishlist)</Text>
                  <Text style={styles.actionRowSub}>Favorites for baby and mother</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" size={14} color={Colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onNavigateCart?.();
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Shopping Cart">
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIconBox}>
                  <AppIcon name="cart" size={16} color={Colors.forestDark} />
                </View>
                <View>
                  <Text style={styles.actionRowTitle}>Shopping Basket</Text>
                  <Text style={styles.actionRowSub}>Review items & proceed to local checkout</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>ACCOUNT & ADDRESSES</Text>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => handleFeatureUnavailable('Saved Addresses')}
              activeOpacity={0.7}>
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIconBox}>
                  <AppIcon name="location" size={16} color={Colors.forestDark} />
                </View>
                <View>
                  <Text style={styles.actionRowTitle}>Delivery Addresses</Text>
                  <Text style={styles.actionRowSub}>Indiranagar, Bengaluru · 560038 (Default)</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" size={14} color={Colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => handleFeatureUnavailable('Notification Preferences')}
              activeOpacity={0.7}>
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIconBox}>
                  <AppIcon name="bell" size={16} color={Colors.forestDark} />
                </View>
                <View>
                  <Text style={styles.actionRowTitle}>Order Notifications</Text>
                  <Text style={styles.actionRowSub}>Delivery updates & dispatch alerts</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Customer Care & Concierge */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>HELP & SUPPORT</Text>

            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>Appuge Customer Care</Text>
              <Text style={styles.supportDesc}>
                Need assistance with your orders, ingredient questions, or delivery schedules?
                Our team is here to assist you.
              </Text>

              <View style={styles.supportActions}>
                <TouchableOpacity
                  style={styles.supportCallBtn}
                  onPress={handleCall}
                  activeOpacity={0.85}>
                  <View style={styles.btnContentRow}>
                    <AppIcon name="phone" size={14} color={Colors.white} />
                    <Text style={styles.supportCallText}>
                      Call {APPUGE_INFO.phoneDisplay}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.supportWhatsAppBtn}
                  onPress={handleWhatsApp}
                  activeOpacity={0.85}>
                  <View style={styles.btnContentRow}>
                    <AppIcon name="whatsapp" size={14} color={Colors.forestDark} />
                    <Text style={styles.supportWhatsAppText}>WhatsApp Care</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.contactDetailRow}>
                  <AppIcon name="mail" size={12} color={Colors.sage} />
                  <Text style={styles.contactItem}>{APPUGE_INFO.email}</Text>
                </View>
                <View style={styles.contactDetailRow}>
                  <AppIcon name="location" size={12} color={Colors.sage} />
                  <Text style={styles.contactItem}>{APPUGE_INFO.location}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          {user && (
            <TouchableOpacity
              style={styles.signOutFullBtn}
              onPress={handleSignOutConfirm}
              activeOpacity={0.8}>
              <Text style={styles.signOutFullBtnText}>SIGN OUT OF APPUGE</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.forestDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.forestDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtnText: {
    color: '#FAF4EB',
    fontSize: 13,
    fontWeight: '700',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FAF4EB',
    fontFamily: Fonts.serif,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(200, 109, 81, 0.25)',
  },
  logoutText: {
    color: '#FFB4A2',
    fontSize: 12,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  scrollContent: {
    padding: 16,
    gap: 18,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FAF4EB',
    fontFamily: Fonts.serif,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.forestDark,
    fontFamily: Fonts.serif,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  stageChip: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stageText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(94, 122, 99, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.sage,
  },
  section: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.sage,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.06)',
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  actionRowSub: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginTop: 1,
  },
  supportCard: {
    gap: 10,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  supportDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  supportActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  supportCallBtn: {
    flex: 1,
    backgroundColor: Colors.forestDark,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportCallText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF4EB',
  },
  supportWhatsAppBtn: {
    flex: 1,
    backgroundColor: '#FAF4EB',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.15)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportWhatsAppText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactDetails: {
    marginTop: 6,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.06)',
    paddingTop: 10,
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactItem: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  signOutFullBtn: {
    borderWidth: 1,
    borderColor: Colors.terracotta,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 6,
  },
  signOutFullBtnText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.terracotta,
  },
});
