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
import { NannyBooking, BookingStatus } from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';

interface MyNannyBookingsScreenProps {
  bookings: NannyBooking[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

const LIFECYCLE_STEPS: { status: BookingStatus; label: string; desc: string }[] = [
  {
    status: 'REQUESTED',
    label: 'Request Submitted',
    desc: 'Waiting for Appuge Operations schedule review.',
  },
  {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    desc: 'Checking caregiver availability and area coverage.',
  },
  {
    status: 'PENDING_NANNY',
    label: 'Sent to Caregiver',
    desc: 'Caregiver reviewing family schedule.',
  },
  {
    status: 'ACCEPTED',
    label: 'Caregiver Accepted',
    desc: 'Ready for confirmation and arrival preparation.',
  },
  {
    status: 'CONFIRMED',
    label: 'Booking Confirmed',
    desc: 'Caregiver locked in for scheduled dates.',
  },
  {
    status: 'IN_PROGRESS',
    label: 'Session In Progress',
    desc: 'Caregiver checked in at residence.',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    desc: 'Care session completed and verified.',
  },
];

function getStepIndex(status: BookingStatus): number {
  switch (status) {
    case 'REQUESTED':
      return 0;
    case 'UNDER_REVIEW':
      return 1;
    case 'PENDING_NANNY':
      return 2;
    case 'ACCEPTED':
      return 3;
    case 'CONFIRMED':
      return 4;
    case 'IN_PROGRESS':
      return 5;
    case 'COMPLETED':
      return 6;
    default:
      return 0;
  }
}

export const MyNannyBookingsScreen: React.FC<MyNannyBookingsScreenProps> = ({
  bookings,
  onClose,
  onCancelBooking,
}) => {
  const [selectedBooking, setSelectedBooking] = useState<NannyBooking | null>(
    bookings[0] || null,
  );

  const handleCancel = (booking: NannyBooking) => {
    Alert.alert(
      'Cancel Care Booking?',
      `Are you sure you want to cancel booking ${booking.bookingNumber}? Cancellations within 12 hours of session start may be subject to platform review.`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Confirm Cancel',
          style: 'destructive',
          onPress: () => onCancelBooking(booking.id),
        },
      ],
    );
  };

  const handleEmergencyHelp = () => {
    Alert.alert(
      '🚨 Appuge Care Concierge',
      'Priority Support Hotline: +91 80 4000 8820\nAvailable 24/7 for families with active childcare bookings.',
      [{ text: 'Close' }],
    );
  };

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Care</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Childcare Bookings</Text>
        <TouchableOpacity onPress={handleEmergencyHelp} style={styles.sosBtn}>
          <Text style={styles.sosText}>SOS Help</Text>
        </TouchableOpacity>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyWrap}>
          <AppIcon name="calendar" size={44} color={Colors.sage} />
          <Text style={styles.emptyTitle}>No Childcare Bookings Yet</Text>
          <Text style={styles.emptySub}>
            Discover verified nannies and request personalized childcare in Bangalore.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={onClose}>
            <Text style={styles.emptyBtnText}>Explore Caregivers</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {bookings.map(booking => {
            const currentStep = getStepIndex(booking.status);
            const isTerminal =
              booking.status === 'CANCELLED' ||
              booking.status === 'DECLINED' ||
              booking.status === 'COMPLETED';

            return (
              <View key={booking.id} style={styles.bookingCard}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.bookingNumber}>
                      {booking.bookingNumber}
                    </Text>
                    <Text style={styles.createdDate}>
                      Requested: {booking.createdAt}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${booking.statusColor}18` },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: booking.statusColor },
                      ]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>

                {/* Nanny Info */}
                <View style={styles.nannyRow}>
                  <Image source={booking.nannyPhoto} style={styles.nannyThumb} />
                  <View style={styles.nannyInfo}>
                    <Text style={styles.nannyName}>{booking.nannyName}</Text>
                    <Text style={styles.nannySub}>
                      {booking.childAgeGroup} · {booking.serviceArea}
                    </Text>
                    <Text style={styles.scheduleText}>
                      📅 {booking.startDateText} ({booking.dailyHours}h/day for{' '}
                      {booking.daysCount} days)
                    </Text>
                  </View>
                </View>

                {/* Managed Lifecycle Timeline */}
                {!isTerminal && (
                  <View style={styles.timelineSection}>
                    <Text style={styles.timelineTitle}>MANAGED CARE PROGRESS</Text>
                    <View style={styles.stepTrack}>
                      {LIFECYCLE_STEPS.slice(0, 6).map((step, idx) => {
                        const isDone = idx < currentStep;
                        const isActive = idx === currentStep;
                        return (
                          <View key={step.status} style={styles.stepNode}>
                            <View
                              style={[
                                styles.dot,
                                isDone && styles.dotDone,
                                isActive && styles.dotActive,
                              ]}>
                              {isDone ? (
                                <AppIcon name="check" size={8} color="#FFFDF9" />
                              ) : null}
                            </View>
                            <Text
                              style={[
                                styles.stepLabel,
                                (isDone || isActive) && styles.stepLabelActive,
                              ]}
                              numberOfLines={1}>
                              {step.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Session Check-in Alert */}
                {booking.sessionCheckIn && (
                  <View style={styles.checkInBox}>
                    <AppIcon name="check" size={14} color="#1B5E20" />
                    <Text style={styles.checkInText}>
                      Caregiver Checked In: {booking.sessionCheckIn}
                    </Text>
                  </View>
                )}

                {/* Address & Total */}
                <View style={styles.metaRow}>
                  <Text style={styles.addressText} numberOfLines={1}>
                    📍 {booking.serviceAddress}
                  </Text>
                  <Text style={styles.totalAmount}>
                    ₹{booking.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {booking.status === 'CONFIRMED' ||
                  booking.status === 'REQUESTED' ||
                  booking.status === 'UNDER_REVIEW' ? (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(booking)}>
                      <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={styles.supportBtn}
                    onPress={handleEmergencyHelp}>
                    <Text style={styles.supportBtnText}>Concierge Support</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: '#FFFDF9',
  },
  backBtn: { paddingVertical: 6 },
  backText: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },
  topBarTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  sosBtn: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  sosText: { fontSize: 11, fontWeight: '800', color: '#C62828' },

  scroll: { flex: 1 },
  content: { padding: 16 },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.forestDark,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '800', color: '#FAF4EB' },

  bookingCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44,64,53,0.06)',
    paddingBottom: 8,
  },
  bookingNumber: { fontSize: 13, fontWeight: '800', color: Colors.forestDark },
  createdDate: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },

  nannyRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  nannyThumb: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.cream },
  nannyInfo: { flex: 1 },
  nannyName: { fontFamily: Fonts.serif, fontSize: 16, color: Colors.forestDark },
  nannySub: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  scheduleText: { fontSize: 11, color: Colors.forestDark, fontWeight: '600', marginTop: 3 },

  timelineSection: {
    backgroundColor: Colors.cream,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  timelineTitle: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  stepTrack: { flexDirection: 'row', justifyContent: 'space-between' },
  stepNode: { alignItems: 'center', width: 48 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D1DCD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dotDone: { backgroundColor: '#2E7D32' },
  dotActive: { backgroundColor: Colors.terracotta },
  stepLabel: { fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
  stepLabelActive: { color: Colors.forestDark, fontWeight: '700' },

  checkInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
  },
  checkInText: { fontSize: 11, color: '#1B5E20', fontWeight: '700' },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  addressText: { flex: 1, fontSize: 11, color: Colors.textSecondary },
  totalAmount: { fontSize: 15, fontWeight: '800', color: Colors.forestDark, marginLeft: 10 },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.06)',
    paddingTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 11, fontWeight: '700', color: '#C62828' },
  supportBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
  },
  supportBtnText: { fontSize: 11, fontWeight: '700', color: '#FAF4EB' },
});
