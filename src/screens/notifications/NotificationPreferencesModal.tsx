import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import { AppIcon } from '../../components/common/AppIcon';
import {
  NotificationPreferences,
  DoctorPreferences,
  NannyPreferences,
  ShoppingPreferences,
  AppugeUpdatesPreferences,
} from '../../types/notification';
import { notificationService } from '../../services/notificationService';

interface NotificationPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<
  NotificationPreferencesModalProps
> = ({ visible, onClose }) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(
    notificationService.getPreferences(),
  );

  useEffect(() => {
    const current = notificationService.getPreferences();
    setPrefs(current);
  }, [visible]);

  const updateMasterPush = async (val: boolean) => {
    if (val) {
      const res = await notificationService.requestPushPermission();
      setPrefs(notificationService.getPreferences());
      if (res === 'denied') {
        Alert.alert(
          'Permission Needed',
          'Push notifications are currently disabled in your device settings. Tap "Device Settings" to enable alerts for unhurried appointment reminders.',
        );
      }
    } else {
      const updated = notificationService.updatePreferences({
        pushNotificationsEnabled: false,
      });
      setPrefs(updated);
    }
  };

  const updateDoctorPref = (key: keyof DoctorPreferences, val: boolean) => {
    const updated = notificationService.updatePreferences({
      doctor: { ...prefs.doctor, [key]: val },
    });
    setPrefs(updated);
  };

  const updateNannyPref = (key: keyof NannyPreferences, val: boolean) => {
    const updated = notificationService.updatePreferences({
      nanny: { ...prefs.nanny, [key]: val },
    });
    setPrefs(updated);
  };

  const updateShoppingPref = (key: keyof ShoppingPreferences, val: boolean) => {
    const updated = notificationService.updatePreferences({
      shopping: { ...prefs.shopping, [key]: val },
    });
    setPrefs(updated);
  };

  const updateAppugePref = (
    key: keyof AppugeUpdatesPreferences,
    val: boolean,
  ) => {
    const updated = notificationService.updatePreferences({
      appuge: { ...prefs.appuge, [key]: val },
    });
    setPrefs(updated);
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => {
        Alert.alert(
          'Device Settings',
          'Please navigate to Android Settings > Apps > Appuge > Notifications to manage operating system permissions.',
        );
      });
    } else {
      Linking.openURL('app-settings:').catch(() => {
        Alert.alert(
          'Device Settings',
          'Please open iOS Settings > Appuge > Notifications.',
        );
      });
    }
  };

  const handleResetDefaults = () => {
    notificationService.resetToInitial();
    setPrefs(notificationService.getPreferences());
    Alert.alert(
      'Preferences Reset',
      'Notification preferences have been restored to recommended Appuge clinical defaults.',
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backBtn}
              activeOpacity={0.7}
              accessibilityLabel="Back to updates">
              <AppIcon name="close" size={16} color={Colors.forestDark} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetDefaults}
              style={styles.resetBtn}
              activeOpacity={0.7}>
              <Text style={styles.resetBtnText}>Restore Defaults</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Notification Preferences</Text>
            <Text style={styles.headerSubtitle}>
              Tailor how and when you receive care and appointment alerts.
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Master Push Toggle Card */}
          <View style={styles.masterCard}>
            <View style={styles.masterTop}>
              <View style={styles.masterIconWrap}>
                <AppIcon name="bell" size={16} color={Colors.forestDark} />
              </View>
              <View style={styles.masterTextWrap}>
                <View style={styles.masterTitleRow}>
                  <Text style={styles.masterTitle}>Device Push Alerts</Text>
                  <View
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: prefs.pushNotificationsEnabled
                          ? '#EAF2EC'
                          : '#FDECEB',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusChipText,
                        {
                          color: prefs.pushNotificationsEnabled
                            ? '#1B5E20'
                            : '#C62828',
                        },
                      ]}>
                      {prefs.pushNotificationsEnabled ? 'ACTIVE' : 'MUTED'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.masterDesc}>
                  Receive real-time chime alerts on your device for upcoming
                  doctor visits and caregiver arrivals.
                </Text>
              </View>
              <Switch
                value={prefs.pushNotificationsEnabled}
                onValueChange={updateMasterPush}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <TouchableOpacity
              style={styles.settingsLinkRow}
              onPress={handleOpenSettings}
              activeOpacity={0.75}>
              <Text style={styles.settingsLinkText}>
                Manage System Permissions in Android Settings
              </Text>
              <AppIcon
                name="arrow-up-right"
                size={11}
                color={Colors.forestDark}
              />
            </TouchableOpacity>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                Note: In-app notification history remains available in your
                Notification Centre even if device push is disabled.
              </Text>
            </View>
          </View>

          {/* 1. Doctor Care Notifications */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconCircle}>
                <AppIcon
                  name="stethoscope"
                  size={14}
                  color={Colors.forestDark}
                />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Doctor Consultations</Text>
                <Text style={styles.sectionSubtitle}>
                  Verified clinical appointments & pediatric visits
                </Text>
              </View>
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Appointment Confirmations</Text>
                <Text style={styles.prefDesc}>
                  When Dr. Radhika Menon or specialists confirm your slot.
                </Text>
              </View>
              <Switch
                value={prefs.doctor.confirmations}
                onValueChange={val => updateDoctorPref('confirmations', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Care Session Reminders</Text>
                <Text style={styles.prefDesc}>
                  30 minutes before video consult or sanctuary visit.
                </Text>
              </View>
              <Switch
                value={prefs.doctor.reminders}
                onValueChange={val => updateDoctorPref('reminders', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Rescheduling & Cancellations</Text>
                <Text style={styles.prefDesc}>
                  Immediate alerts if clinical time slots require adjustment.
                </Text>
              </View>
              <Switch
                value={prefs.doctor.reschedulingAndCancellations}
                onValueChange={val =>
                  updateDoctorPref('reschedulingAndCancellations', val)
                }
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Consultation Follow-ups</Text>
                <Text style={styles.prefDesc}>
                  Prescription releases and doctor care recommendations.
                </Text>
              </View>
              <Switch
                value={prefs.doctor.consultationUpdates}
                onValueChange={val =>
                  updateDoctorPref('consultationUpdates', val)
                }
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>
          </View>

          {/* 2. Nanny Care Notifications */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconCircle,
                  { backgroundColor: '#FDF1EC' },
                ]}>
                <AppIcon name="baby" size={14} color={Colors.terracotta} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Managed Childcare</Text>
                <Text style={styles.sectionSubtitle}>
                  Caregiver matches, bookings, and arrival updates
                </Text>
              </View>
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Booking Requests & Matching</Text>
                <Text style={styles.prefDesc}>
                  When Appuge reviews your childcare request and matches a nanny.
                </Text>
              </View>
              <Switch
                value={prefs.nanny.requestsAndResponses}
                onValueChange={val =>
                  updateNannyPref('requestsAndResponses', val)
                }
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Nanny Confirmations</Text>
                <Text style={styles.prefDesc}>
                  When the caregiver accepts your booking schedule.
                </Text>
              </View>
              <Switch
                value={prefs.nanny.confirmations}
                onValueChange={val => updateNannyPref('confirmations', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Care-Session Arrival Reminders</Text>
                <Text style={styles.prefDesc}>
                  Notifications when your nanny is en route or arrives.
                </Text>
              </View>
              <Switch
                value={prefs.nanny.sessionReminders}
                onValueChange={val => updateNannyPref('sessionReminders', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Booking & Support Updates</Text>
                <Text style={styles.prefDesc}>
                  Appuge Care Concierge assistance and verification renewals.
                </Text>
              </View>
              <Switch
                value={prefs.nanny.bookingUpdates}
                onValueChange={val => updateNannyPref('bookingUpdates', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>
          </View>

          {/* 3. Shopping & Kitchen Orders */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconCircle,
                  { backgroundColor: '#EAF0EB' },
                ]}>
                <AppIcon name="delivery" size={14} color={Colors.sage} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>
                  Shopping & Fresh Kitchen
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Order tracking, preparation & express delivery
                </Text>
              </View>
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Order & Payment Updates</Text>
                <Text style={styles.prefDesc}>
                  Instant confirmation and kitchen preparation notices.
                </Text>
              </View>
              <Switch
                value={prefs.shopping.orderUpdates}
                onValueChange={val => updateShoppingPref('orderUpdates', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Shipping & Delivery Progress</Text>
                <Text style={styles.prefDesc}>
                  Live courier dispatch and doorstep arrival alerts.
                </Text>
              </View>
              <Switch
                value={prefs.shopping.shippingAndDelivery}
                onValueChange={val =>
                  updateShoppingPref('shippingAndDelivery', val)
                }
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Refunds & Store Credit</Text>
                <Text style={styles.prefDesc}>
                  Status updates for returns or adjustments.
                </Text>
              </View>
              <Switch
                value={prefs.shopping.refundUpdates}
                onValueChange={val => updateShoppingPref('refundUpdates', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>
          </View>

          {/* 4. Appuge Updates & Sanctuary Content */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconCircle,
                  { backgroundColor: '#FFF8EE' },
                ]}>
                <AppIcon name="sparkle" size={14} color={Colors.goldWarm} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>
                  Appuge Updates & Editorial
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Clinical guidance, sanctuary announcements and stories
                </Text>
              </View>
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.prefLabel}>Important Clinical Announcements</Text>
                  <View style={styles.lockedChip}>
                    <Text style={styles.lockedChipText}>REQUIRED</Text>
                  </View>
                </View>
                <Text style={styles.prefDesc}>
                  Essential medical policy notices and platform safety bulletins.
                </Text>
              </View>
              <Switch
                value={true}
                disabled={true}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Special Care Offers</Text>
                <Text style={styles.prefDesc}>
                  Seasonal family bundles and promotional rates.
                </Text>
              </View>
              <Switch
                value={prefs.appuge.offersAndPromotions}
                onValueChange={val =>
                  updateAppugePref('offersAndPromotions', val)
                }
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>

            <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
              <View style={styles.prefTextWrap}>
                <Text style={styles.prefLabel}>Pediatric Guides & Product Releases</Text>
                <Text style={styles.prefDesc}>
                  Weekly expert doctor tips and infant nourishment articles.
                </Text>
              </View>
              <Switch
                value={prefs.appuge.productNews}
                onValueChange={val => updateAppugePref('productNews', val)}
                trackColor={{ false: '#D9D3C7', true: Colors.forestDark }}
                thumbColor="#FFFDF9"
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    backgroundColor: Colors.creamLight,
    paddingTop: Platform.OS === 'android' ? 46 : 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
  },
  resetBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.sageDark,
  },
  headerTitles: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.forestDark,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Master Card
  masterCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  masterTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  masterIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterTextWrap: {
    flex: 1,
  },
  masterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  masterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusChipText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  masterDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  settingsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.06)',
  },
  settingsLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  noticeBox: {
    backgroundColor: Colors.creamLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  noticeText: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 15,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.06)',
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.05)',
  },
  prefTextWrap: {
    flex: 1,
    paddingRight: 14,
  },
  prefLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 2,
  },
  prefDesc: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  lockedChip: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  lockedChipText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#666',
  },
});
