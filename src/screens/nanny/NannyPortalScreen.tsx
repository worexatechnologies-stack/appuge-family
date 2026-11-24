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
import { Colors, Fonts } from '../../theme/colors';
import { NannyProfile, NannyBooking } from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';

interface NannyPortalScreenProps {
  nanny: NannyProfile;
  bookings: NannyBooking[];
  onAcceptBooking: (bookingId: string) => void;
  onDeclineBooking: (bookingId: string) => void;
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
}

export const NannyPortalScreen: React.FC<NannyPortalScreenProps> = ({
  nanny,
  bookings,
  onAcceptBooking,
  onDeclineBooking,
  onCheckIn,
  onCheckOut,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'earnings'>('requests');

  const incomingRequests = bookings.filter(
    b => b.status === 'REQUESTED' || b.status === 'UNDER_REVIEW' || b.status === 'PENDING_NANNY',
  );
  const activeBookings = bookings.filter(
    b => b.status === 'ACCEPTED' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS',
  );
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const totalEarnings = completedBookings.reduce(
    (sum, b) => sum + (b.subtotal || 0),
    0,
  );

  const handleAccept = (booking: NannyBooking) => {
    // Double booking guard: check if already booked for same period
    const hasOverlap = activeBookings.some(
      b => b.id !== booking.id && b.status === 'IN_PROGRESS',
    );
    if (hasOverlap) {
      Alert.alert(
        'Schedule Warning',
        'You already have an active session in progress. Please complete it before accepting overlapping requests.',
      );
      return;
    }
    Alert.alert(
      'Accept Care Request?',
      `Confirm care schedule for ${booking.parentName} (${booking.daysCount} days, ${booking.dailyHours}h/day)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Lock Schedule',
          onPress: () => onAcceptBooking(booking.id),
        },
      ],
    );
  };

  const handleDecline = (booking: NannyBooking) => {
    Alert.alert(
      'Decline Care Request?',
      'Are you unavailable for these requested dates?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => onDeclineBooking(booking.id),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Provider Header */}
      <View style={styles.providerCard}>
        <Image source={nanny.photo} style={styles.avatar} />
        <View style={styles.providerInfo}>
          <Text style={styles.kicker}>PROVIDER PORTAL</Text>
          <Text style={styles.name}>{nanny.fullName}</Text>
          <Text style={styles.role}>{nanny.headline}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.verifiedTag}>
              <AppIcon name="check" size={10} color="#1B5E20" />
              <Text style={styles.verifiedText}>Appuge Verified Partner</Text>
            </View>
            <Text style={styles.rateText}>₹{nanny.hourlyRate}/hr</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'requests' && styles.tabTextActive,
            ]}>
            Requests ({incomingRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}>
            Active Sessions ({activeBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'earnings' && styles.tabActive]}
          onPress={() => setActiveTab('earnings')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'earnings' && styles.tabTextActive,
            ]}>
            Earnings
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: INCOMING REQUESTS */}
      {activeTab === 'requests' && (
        <View style={styles.section}>
          {incomingRequests.length === 0 ? (
            <View style={styles.emptyBox}>
              <AppIcon name="inbox" size={32} color={Colors.sage} />
              <Text style={styles.emptyTitle}>No Pending Requests</Text>
              <Text style={styles.emptySub}>
                New booking requests from parents in your service areas will appear here.
              </Text>
            </View>
          ) : (
            incomingRequests.map(req => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.reqTop}>
                  <View>
                    <Text style={styles.reqParent}>{req.parentName}</Text>
                    <Text style={styles.reqMeta}>
                      Child: {req.childAgeGroup} · 📍 {req.serviceArea}
                    </Text>
                  </View>
                  <Text style={styles.reqPay}>
                    ₹{req.subtotal.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.reqScheduleBox}>
                  <Text style={styles.reqScheduleText}>
                    📅 {req.startDateText} ({req.dailyHours} hrs/day for {req.daysCount} days)
                  </Text>
                  {req.notes ? (
                    <Text style={styles.reqNotes}>Notes: "{req.notes}"</Text>
                  ) : null}
                </View>

                <View style={styles.reqActions}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => handleDecline(req)}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAccept(req)}>
                    <Text style={styles.acceptText}>Accept Care Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* TAB 2: ACTIVE SESSIONS */}
      {activeTab === 'active' && (
        <View style={styles.section}>
          {activeBookings.length === 0 ? (
            <View style={styles.emptyBox}>
              <AppIcon name="calendar" size={32} color={Colors.sage} />
              <Text style={styles.emptyTitle}>No Active Sessions</Text>
              <Text style={styles.emptySub}>
                Accepted and confirmed bookings will be listed here for session check-in.
              </Text>
            </View>
          ) : (
            activeBookings.map(session => (
              <View key={session.id} style={styles.requestCard}>
                <View style={styles.reqTop}>
                  <View>
                    <Text style={styles.reqParent}>{session.parentName}</Text>
                    <Text style={styles.reqMeta}>
                      📞 {session.parentPhone} · {session.serviceArea}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sessionStatusPill,
                      { backgroundColor: `${session.statusColor}18` },
                    ]}>
                    <Text
                      style={[
                        styles.sessionStatusText,
                        { color: session.statusColor },
                      ]}>
                      {session.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.addressLine}>📍 {session.serviceAddress}</Text>

                {/* Check In / Out controls */}
                <View style={styles.checkInOutRow}>
                  {session.status !== 'IN_PROGRESS' ? (
                    <TouchableOpacity
                      style={styles.checkInBtn}
                      onPress={() => onCheckIn(session.id)}>
                      <Text style={styles.checkInBtnText}>
                        ✓ Session Check-In (Arrived)
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flex: 1, gap: 8 }}>
                      <View style={styles.checkedInBanner}>
                        <AppIcon name="clock" size={14} color="#1B5E20" />
                        <Text style={styles.checkedInBannerText}>
                          Session Active: {session.sessionCheckIn || 'Just now'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.checkOutBtn}
                        onPress={() => onCheckOut(session.id)}>
                        <Text style={styles.checkOutBtnText}>
                          Complete & Check-Out Session
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* TAB 3: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <View style={styles.section}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsKicker}>MONTHLY EARNINGS (NOVEMBER)</Text>
            <Text style={styles.earningsTotal}>
              ₹{(totalEarnings + 14200).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.earningsSub}>
              Bank Payout Account: HDFC Bank •••• 4402 (Verified)
            </Text>
          </View>

          <Text style={styles.payoutTitle}>Recent Direct Payouts</Text>
          {[
            { date: '16 Nov 2026', desc: 'Completed care: Sharma family', amount: 3200 },
            { date: '08 Nov 2026', desc: 'Completed care: Dr. Meera S.', amount: 5600 },
            { date: '01 Nov 2026', desc: 'Completed care: Divya K.', amount: 5400 },
          ].map((item, idx) => (
            <View key={idx} style={styles.payoutRow}>
              <View>
                <Text style={styles.payoutDesc}>{item.desc}</Text>
                <Text style={styles.payoutDate}>{item.date}</Text>
              </View>
              <Text style={styles.payoutAmount}>+₹{item.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  content: { padding: 16 },

  providerCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFFDF9',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.cream },
  providerInfo: { flex: 1, justifyContent: 'center' },
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.sage,
  },
  name: { fontFamily: Fonts.serif, fontSize: 18, color: Colors.forestDark },
  role: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: '#1B5E20' },
  rateText: { fontSize: 11, fontWeight: '800', color: Colors.forestDark },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cream,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFFDF9' },
  tabText: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: Colors.forestDark, fontWeight: '800' },

  section: { gap: 12 },

  emptyBox: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.forestDark,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  requestCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  reqTop: { flexDirection: 'row', justifyContent: 'space-between' },
  reqParent: { fontSize: 14, fontWeight: '800', color: Colors.forestDark },
  reqMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  reqPay: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },

  reqScheduleBox: {
    backgroundColor: Colors.cream,
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  reqScheduleText: { fontSize: 11, color: Colors.forestDark, fontWeight: '700' },
  reqNotes: { fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic' },

  reqActions: { flexDirection: 'row', gap: 10, paddingTop: 4 },
  declineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  declineText: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  acceptBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
  },
  acceptText: { fontSize: 11, fontWeight: '800', color: '#FAF4EB' },

  sessionStatusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  sessionStatusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  addressLine: { fontSize: 11, color: Colors.textSecondary },

  checkInOutRow: { marginTop: 4 },
  checkInBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkInBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFDF9' },
  checkedInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
  },
  checkedInBannerText: { fontSize: 11, fontWeight: '700', color: '#1B5E20' },
  checkOutBtn: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkOutBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFDF9' },

  earningsCard: {
    backgroundColor: Colors.forestDark,
    borderRadius: 14,
    padding: 18,
    gap: 4,
  },
  earningsKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'rgba(255,253,249,0.6)',
  },
  earningsTotal: { fontSize: 28, fontWeight: '800', color: '#FFFDF9' },
  earningsSub: { fontSize: 10, color: 'rgba(255,253,249,0.7)', marginTop: 4 },

  payoutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
    marginTop: 8,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  payoutDesc: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  payoutDate: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  payoutAmount: { fontSize: 13, fontWeight: '800', color: '#2E7D32' },
});
