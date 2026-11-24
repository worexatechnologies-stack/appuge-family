import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  NannyProfile,
  NannyBooking,
  VerificationQueueItem,
  INITIAL_VERIFICATION_QUEUE,
  INITIAL_INCIDENTS,
  NannyIncident,
} from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';

interface AdminOpsScreenProps {
  nannies: NannyProfile[];
  bookings: NannyBooking[];
  onVerifyNanny: (nannyId: string, verified: boolean) => void;
  onInterveneBooking: (bookingId: string, newStatus: NannyBooking['status']) => void;
}

export const AdminOpsScreen: React.FC<AdminOpsScreenProps> = ({
  nannies,
  bookings,
  onVerifyNanny,
  onInterveneBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'bookings' | 'incidents'>(
    'verification',
  );
  const [queue, setQueue] = useState<VerificationQueueItem[]>(INITIAL_VERIFICATION_QUEUE);
  const [incidents, setIncidents] = useState<NannyIncident[]>(INITIAL_INCIDENTS);

  const handleApprove = (item: VerificationQueueItem) => {
    Alert.alert(
      'Approve & Verify Provider?',
      `Confirm all 4 mandatory checks (Police clearance, Govt ID, CPR, Health) for ${item.nannyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Verify',
          onPress: () => {
            setQueue(prev =>
              prev.map(q =>
                q.id === item.id ? { ...q, currentStatus: 'VERIFIED' } : q,
              ),
            );
            onVerifyNanny(item.nannyId, true);
          },
        },
      ],
    );
  };

  const handleReject = (item: VerificationQueueItem) => {
    Alert.alert(
      'Reject / Suspend Provider?',
      `Reject verification for ${item.nannyName} and revoke booking eligibility?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setQueue(prev =>
              prev.map(q =>
                q.id === item.id ? { ...q, currentStatus: 'REJECTED' } : q,
              ),
            );
            onVerifyNanny(item.nannyId, false);
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Admin Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>APPUGE OPERATIONS</Text>
        <Text style={styles.title}>Trust, Safety & Marketplace Ops</Text>
        <Text style={styles.sub}>
          Real-time oversight of caregiver vetting, ongoing childcare sessions, and safety compliance.
        </Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'verification' && styles.tabActive]}
          onPress={() => setActiveTab('verification')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'verification' && styles.tabTextActive,
            ]}>
            Verification ({queue.filter(q => q.currentStatus === 'PENDING').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bookings' && styles.tabActive]}
          onPress={() => setActiveTab('bookings')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'bookings' && styles.tabTextActive,
            ]}>
            Bookings ({bookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'incidents' && styles.tabActive]}
          onPress={() => setActiveTab('incidents')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'incidents' && styles.tabTextActive,
            ]}>
            Safety & Incidents ({incidents.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider Application Reviews</Text>
          {queue.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardName}>{item.nannyName}</Text>
                  <Text style={styles.cardSub}>Applied: {item.appliedDate}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        item.currentStatus === 'VERIFIED'
                          ? '#E8F5E9'
                          : item.currentStatus === 'REJECTED'
                          ? '#FFEBEE'
                          : '#FFF3E0',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          item.currentStatus === 'VERIFIED'
                            ? '#2E7D32'
                            : item.currentStatus === 'REJECTED'
                            ? '#C62828'
                            : '#E65100',
                      },
                    ]}>
                    {item.currentStatus}
                  </Text>
                </View>
              </View>

              {/* Document checklist */}
              <View style={styles.docsList}>
                {item.documents.map((doc, idx) => (
                  <View key={idx} style={styles.docRow}>
                    <AppIcon
                      name={doc.status === 'VERIFIED' ? 'check' : 'clock'}
                      size={12}
                      color={doc.status === 'VERIFIED' ? '#2E7D32' : Colors.textMuted}
                    />
                    <Text style={styles.docType}>{doc.docType}:</Text>
                    <Text
                      style={[
                        styles.docStatus,
                        doc.status === 'VERIFIED' && styles.docStatusOk,
                      ]}>
                      {doc.status} {doc.verifiedAt ? `(${doc.verifiedAt})` : ''}
                    </Text>
                    {doc.verifierNote && (
                      <Text style={styles.docNote} numberOfLines={1}>
                        · {doc.verifierNote}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              {item.reviewNotes && (
                <Text style={styles.reviewNotes}>Reviewer Note: "{item.reviewNotes}"</Text>
              )}

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(item)}>
                  <Text style={styles.rejectText}>Reject Application</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(item)}>
                  <Text style={styles.approveText}>Approve & Grant Badge</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB 2: ALL BOOKINGS OVERSIGHT */}
      {activeTab === 'bookings' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Childcare Sessions</Text>
          {bookings.length === 0 ? (
            <Text style={styles.emptyText}>No active or past bookings in system.</Text>
          ) : (
            bookings.map(b => (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.cardName}>{b.bookingNumber}</Text>
                    <Text style={styles.cardSub}>
                      Parent: {b.parentName} ({b.parentPhone})
                    </Text>
                  </View>
                  <Text style={styles.bookingStatus}>{b.status}</Text>
                </View>

                <Text style={styles.bookingDetail}>
                  Caregiver: {b.nannyName} · 📍 {b.serviceArea}
                </Text>
                <Text style={styles.bookingDetail}>
                  Schedule: {b.startDateText} ({b.dailyHours}h/day, {b.daysCount} days)
                </Text>
                <Text style={styles.bookingDetail}>
                  Total: ₹{b.totalAmount.toLocaleString('en-IN')} (Fee: ₹{b.platformServiceFee})
                </Text>

                {/* Operations Interventions */}
                <View style={styles.interveneRow}>
                  <TouchableOpacity
                    style={styles.actionChip}
                    onPress={() => onInterveneBooking(b.id, 'CONFIRMED')}>
                    <Text style={styles.actionChipText}>Force Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionChip}
                    onPress={() => onInterveneBooking(b.id, 'COMPLETED')}>
                    <Text style={styles.actionChipText}>Mark Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionChip, styles.actionChipDanger]}
                    onPress={() => onInterveneBooking(b.id, 'CANCELLED')}>
                    <Text style={[styles.actionChipText, { color: '#C62828' }]}>
                      Cancel Booking
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* TAB 3: SAFETY & INCIDENTS */}
      {activeTab === 'incidents' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Audit & Incident Log</Text>
          {incidents.map(inc => (
            <View key={inc.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardName}>{inc.title}</Text>
                  <Text style={styles.cardSub}>
                    Booking: {inc.bookingNumber} · Reported by {inc.reportedBy} ({inc.timestamp})
                  </Text>
                </View>
                <View style={styles.severityTag}>
                  <Text style={styles.severityText}>{inc.severity} Severity</Text>
                </View>
              </View>
              <Text style={styles.incDesc}>{inc.description}</Text>
              <View style={styles.resolvedRow}>
                <AppIcon name="check" size={12} color="#1B5E20" />
                <Text style={styles.resolvedText}>Status: {inc.status}</Text>
              </View>
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

  header: { marginBottom: 16 },
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.sage,
  },
  title: { fontFamily: Fonts.serif, fontSize: 22, color: Colors.forestDark, marginTop: 2 },
  sub: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cream,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFFDF9' },
  tabText: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: Colors.forestDark, fontWeight: '800' },

  section: { gap: 12 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  emptyText: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },

  card: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 8,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.forestDark },
  cardSub: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },

  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusPillText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  docsList: {
    backgroundColor: Colors.cream,
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  docType: { fontSize: 10, fontWeight: '700', color: Colors.forestDark },
  docStatus: { fontSize: 10, color: Colors.textMuted },
  docStatusOk: { color: '#2E7D32', fontWeight: '700' },
  docNote: { fontSize: 10, color: Colors.textSecondary, fontStyle: 'italic', flex: 1 },

  reviewNotes: { fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic' },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  rejectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  rejectText: { fontSize: 10, fontWeight: '700', color: '#C62828' },
  approveBtn: {
    flex: 2,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
  },
  approveText: { fontSize: 10, fontWeight: '800', color: '#FAF4EB' },

  bookingStatus: { fontSize: 11, fontWeight: '800', color: Colors.terracotta },
  bookingDetail: { fontSize: 11, color: Colors.textSecondary },

  interveneRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  actionChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: '#FFFDF9',
  },
  actionChipDanger: { borderColor: '#FFCDD2', backgroundColor: '#FFEBEE' },
  actionChipText: { fontSize: 9, fontWeight: '700', color: Colors.forestDark },

  severityTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: { fontSize: 9, fontWeight: '700', color: '#E65100' },
  incDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
  resolvedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resolvedText: { fontSize: 10, color: '#1B5E20', fontWeight: '700' },
});
