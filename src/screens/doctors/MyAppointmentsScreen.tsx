import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import { DoctorAppointment } from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';

interface MyAppointmentsScreenProps {
  appointments: DoctorAppointment[];
  onClose: () => void;
  onCancelAppointment: (id: string) => void;
  onBookNew?: () => void;
}

type TabCategory = 'upcoming' | 'pending' | 'completed' | 'cancelled';

export const MyAppointmentsScreen: React.FC<MyAppointmentsScreenProps> = ({
  appointments,
  onClose,
  onCancelAppointment,
  onBookNew,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);

  const filtered = appointments.filter(apt => {
    if (activeTab === 'upcoming') {
      return apt.status === 'CONFIRMED' || apt.status === 'ACCEPTED';
    }
    if (activeTab === 'pending') {
      return apt.status === 'REQUESTED' || apt.status === 'UNDER_REVIEW' || apt.status === 'PENDING_DOCTOR';
    }
    if (activeTab === 'completed') {
      return apt.status === 'COMPLETED';
    }
    if (activeTab === 'cancelled') {
      return apt.status === 'CANCELLED' || apt.status === 'DECLINED' || apt.status === 'NO_SHOW';
    }
    return true;
  });

  const handleCancelClick = (apt: DoctorAppointment) => {
    Alert.alert(
      'Cancel Appointment?',
      `Are you sure you wish to cancel your appointment with ${apt.doctorName} on ${apt.appointmentDate}?\n\nCancellation Policy: Free cancellation up to 4 hours prior to appointment.`,
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            onCancelAppointment(apt.id);
            setSelectedAppointment(null);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.backBtn}
          accessibilityLabel="Go back">
          <AppIcon name="arrow-left" size={16} color={Colors.forestDark} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Healthcare Appointments</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {(
          [
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'pending', label: 'Pending' },
            { key: 'completed', label: 'Past Care' },
            { key: 'cancelled', label: 'Cancelled' },
          ] as { key: TabCategory; label: string }[]
        ).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <AppIcon name="stethoscope" size={32} color={Colors.sage} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} appointments</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'upcoming'
                ? 'You do not have any upcoming doctor appointments scheduled.'
                : activeTab === 'pending'
                ? 'No appointment requests currently awaiting clinical confirmation.'
                : `No ${activeTab} consultations recorded.`}
            </Text>
            {onBookNew && (
              <TouchableOpacity
                style={styles.emptyBookBtn}
                activeOpacity={0.85}
                onPress={onBookNew}>
                <Text style={styles.emptyBookBtnText}>Find a Qualified Doctor</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map(apt => (
            <TouchableOpacity
              key={apt.id}
              style={styles.appointmentCard}
              activeOpacity={0.92}
              onPress={() => setSelectedAppointment(apt)}>
              {/* Card Top */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.refNumber}>{apt.appointmentReference}</Text>
                  <Text style={styles.createdDate}>Placed on {apt.createdAt}</Text>
                </View>
                <View style={[styles.statusChip, { backgroundColor: apt.statusColor + '1A' }]}>
                  <View style={[styles.statusDot, { backgroundColor: apt.statusColor }]} />
                  <Text style={[styles.statusText, { color: apt.statusColor }]}>
                    {apt.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              {/* Doctor Details */}
              <View style={styles.doctorRow}>
                <Image
                  source={apt.doctorImage}
                  style={styles.doctorThumb}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorName}>{apt.doctorName}</Text>
                  <Text style={styles.specialityText}>{apt.doctorSpeciality}</Text>
                  <View style={styles.slotRow}>
                    <AppIcon name="calendar" size={12} color={Colors.forestDark} />
                    <Text style={styles.slotText}>
                      {apt.appointmentDate} · {apt.appointmentTime}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Consultation Format & Patient */}
              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  Format: {apt.consultationType === 'ONLINE' ? 'Private Video Consult' : `In-Clinic (${apt.clinicName || 'Clinic'})`}
                </Text>
                <Text style={styles.metaText}>
                  Patient: {apt.patientName} ({apt.patientType})
                </Text>
              </View>

              {/* Action Bar */}
              <View style={styles.cardFooter}>
                <Text style={styles.feeText}>Total: ₹{apt.totalAmount}</Text>
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => setSelectedAppointment(apt)}>
                  <Text style={styles.viewDetailsText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* APPOINTMENT DETAILS MODAL */}
      <Modal
        visible={!!selectedAppointment}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedAppointment(null)}>
        {selectedAppointment && (
          <View style={styles.detailRoot}>
            {/* Modal Top Bar */}
            <View style={styles.detailTopBar}>
              <TouchableOpacity
                onPress={() => setSelectedAppointment(null)}
                style={styles.closeBtn}
                accessibilityLabel="Close">
                <AppIcon name="close" size={16} color={Colors.forestDark} />
              </TouchableOpacity>
              <Text style={styles.detailTopTitle}>Appointment Details</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.detailContent}
              showsVerticalScrollIndicator={false}>
              {/* Doctor summary */}
              <View style={styles.detailDoctorCard}>
                <Image
                  source={selectedAppointment.doctorImage}
                  style={styles.detailDoctorThumb}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailRef}>{selectedAppointment.appointmentReference}</Text>
                  <Text style={styles.detailDoctorName}>{selectedAppointment.doctorName}</Text>
                  <Text style={styles.detailSpeciality}>{selectedAppointment.doctorSpeciality}</Text>
                  <View style={[styles.statusChip, { alignSelf: 'flex-start', marginTop: 4, backgroundColor: selectedAppointment.statusColor + '1A' }]}>
                    <View style={[styles.statusDot, { backgroundColor: selectedAppointment.statusColor }]} />
                    <Text style={[styles.statusText, { color: selectedAppointment.statusColor }]}>
                      {selectedAppointment.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Slot & Format Box */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionEyebrow}>CONSULTATION DETAILS</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Date & Time</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Format</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedAppointment.consultationType === 'ONLINE' ? 'Private Video Consultation' : 'In-Clinic Consultation'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Patient</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedAppointment.patientName} ({selectedAppointment.patientType}, {selectedAppointment.patientAgeOrDob})
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Reason / Concern</Text>
                  <Text style={styles.detailRowVal}>{selectedAppointment.reasonForVisit}</Text>
                </View>
              </View>

              {/* Format-Specific Guidance */}
              {selectedAppointment.consultationType === 'ONLINE' ? (
                <View style={styles.guidanceBox}>
                  <Text style={styles.guidanceTitle}>💻 Online Video Instructions</Text>
                  <Text style={styles.guidanceText}>
                    {selectedAppointment.status === 'CONFIRMED'
                      ? '✓ Your meeting room is secured. The join button will become active 15 minutes prior to your appointment time.'
                      : '✦ Online consultation access will be available once your appointment is confirmed and the consultation service is configured.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.guidanceBox}>
                  <Text style={styles.guidanceTitle}>🏥 Clinic Location & Directions</Text>
                  <Text style={styles.guidanceClinicName}>{selectedAppointment.clinicName}</Text>
                  <Text style={styles.guidanceText}>{selectedAppointment.clinicAddress}</Text>
                  <Text style={styles.guidanceNote}>
                    ✦ Please arrive 10 minutes before your slot with any past test reports or maternal/child growth booklets.
                  </Text>
                </View>
              )}

              {/* Timeline Progress */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionEyebrow}>BOOKING LIFECYCLE TRACK</Text>
                {selectedAppointment.timeline.map((evt, idx) => (
                  <View key={idx} style={styles.timelineRow}>
                    <View style={styles.timelineNodeCol}>
                      <View
                        style={[
                          styles.timelineNode,
                          evt.completed && styles.timelineNodeDone,
                          evt.active && styles.timelineNodeActive,
                        ]}>
                        {evt.completed && <AppIcon name="check" size={10} color="#FFFDF9" />}
                      </View>
                      {idx < selectedAppointment.timeline.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            evt.completed && styles.timelineLineDone,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, evt.active && styles.timelineTitleActive]}>
                        {evt.title}
                      </Text>
                      <Text style={styles.timelineDesc}>{evt.desc}</Text>
                      <Text style={styles.timelineTime}>{evt.timestamp}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Transparent Fee Summary */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionEyebrow}>PAYMENT OVERVIEW</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Consultation Fee</Text>
                  <Text style={styles.detailRowVal}>₹{selectedAppointment.consultationFee}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Platform Coordination (5%)</Text>
                  <Text style={styles.detailRowVal}>₹{selectedAppointment.platformFee}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowKey}>Taxes (5%)</Text>
                  <Text style={styles.detailRowVal}>₹{selectedAppointment.taxes}</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
                  <Text style={[styles.detailRowKey, { fontWeight: '800', color: Colors.forestDark }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.detailRowVal, { fontSize: 15, fontWeight: '800' }]}>
                    ₹{selectedAppointment.totalAmount}
                  </Text>
                </View>
              </View>

              {/* Actions: Cancel & Support */}
              <View style={styles.actionRow}>
                {selectedAppointment.status !== 'CANCELLED' &&
                  selectedAppointment.status !== 'COMPLETED' && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      activeOpacity={0.85}
                      onPress={() => handleCancelClick(selectedAppointment)}>
                      <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                  )}
                <TouchableOpacity
                  style={styles.supportBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      'Appuge Clinical Concierge',
                      'Our dedicated medical coordination desk is available 24/7 for Bengaluru families.\n\nHelpline: +91 80 4719 2200\nEmail: care@appuge.in',
                      [{ text: 'Close' }],
                    )
                  }>
                  <Text style={styles.supportBtnText}>Healthcare Concierge</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  topBar: {
    height: Platform.OS === 'android' ? 68 : 52,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.creamLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
  },
  topBarTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: Colors.forestDark },
  tabLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  tabLabelActive: { color: Colors.forestDark },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 60 },

  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontFamily: Fonts.serif, fontSize: 18, color: Colors.forestDark, marginBottom: 8 },
  emptySub: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  emptyBookBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyBookBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFDF9' },

  // Card
  appointmentCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    elevation: 2,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  refNumber: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, color: Colors.forestDark },
  createdDate: { fontSize: 10, color: Colors.textMuted },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },

  doctorRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  doctorThumb: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.forestDark },
  doctorName: { fontSize: 14, fontWeight: '800', color: Colors.forestDark, marginBottom: 2 },
  specialityText: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  slotText: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },

  metaBox: {
    backgroundColor: Colors.creamLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 3,
  },
  metaText: { fontSize: 11, color: Colors.textSecondary },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.06)',
    paddingTop: 10,
  },
  feeText: { fontSize: 13, fontWeight: '800', color: Colors.forestDark },
  viewDetailsBtn: {},
  viewDetailsText: { fontSize: 12, fontWeight: '700', color: Colors.sage },

  // Details Modal
  detailRoot: { flex: 1, backgroundColor: Colors.creamLight },
  detailTopBar: {
    height: Platform.OS === 'android' ? 68 : 52,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.creamLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
  },
  detailTopTitle: { fontFamily: Fonts.serif, fontSize: 15, fontWeight: '700', color: Colors.forestDark },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: { padding: 18 },
  detailDoctorCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFDF9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  detailDoctorThumb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.forestDark },
  detailRef: { fontSize: 10, fontWeight: '800', color: Colors.sage, letterSpacing: 0.8 },
  detailDoctorName: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },
  detailSpeciality: { fontSize: 11, color: Colors.textSecondary },

  detailSection: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  detailSectionEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: Colors.sage, marginBottom: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.05)',
  },
  detailRowKey: { fontSize: 11, color: Colors.textSecondary },
  detailRowVal: { fontSize: 11, fontWeight: '700', color: Colors.forestDark, maxWidth: '60%', textAlign: 'right' },

  guidanceBox: {
    backgroundColor: '#FAF4EB',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.forestDark,
    marginBottom: 14,
  },
  guidanceTitle: { fontSize: 12, fontWeight: '800', color: Colors.forestDark, marginBottom: 4 },
  guidanceClinicName: { fontSize: 12, fontWeight: '700', color: Colors.forestDark, marginBottom: 2 },
  guidanceText: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
  guidanceNote: { fontSize: 10, color: Colors.sage, marginTop: 6 },

  timelineRow: { flexDirection: 'row', gap: 10 },
  timelineNodeCol: { alignItems: 'center', width: 20 },
  timelineNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(44, 64, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodeDone: { backgroundColor: '#1B5E20' },
  timelineNodeActive: { backgroundColor: Colors.terracotta },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(44, 64, 53, 0.12)', marginVertical: 3 },
  timelineLineDone: { backgroundColor: '#1B5E20' },
  timelineContent: { flex: 1, paddingBottom: 14 },
  timelineTitle: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  timelineTitleActive: { color: Colors.terracotta },
  timelineDesc: { fontSize: 10, color: Colors.textSecondary, marginTop: 1 },
  timelineTime: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },

  actionRow: { gap: 10, marginTop: 6 },
  cancelBtn: {
    backgroundColor: 'rgba(200, 109, 81, 0.1)',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 12, fontWeight: '700', color: Colors.terracotta },
  supportBtn: {
    backgroundColor: Colors.forestDark,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  supportBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFDF9' },
});
