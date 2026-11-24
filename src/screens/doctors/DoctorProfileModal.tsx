import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import { DoctorProfile } from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';

interface DoctorProfileModalProps {
  doctor: DoctorProfile | null;
  visible: boolean;
  onClose: () => void;
  onBookAppointment: (doctor: DoctorProfile) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  visible,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityLabel="Close profile">
            <AppIcon name="close" size={16} color={Colors.forestDark} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            Doctor Profile
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Hero Portrait & Summary */}
          <View style={styles.heroSection}>
            <View style={styles.imageWrap}>
              <Image
                source={doctor.profileImage}
                style={styles.portrait}
                resizeMode="cover"
              />
              {doctor.isDemo && (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO PROFILE</Text>
                </View>
              )}
            </View>

            <View style={styles.doctorHeader}>
              <View style={styles.verifiedRow}>
                <AppIcon name="verified" size={14} color="#1B5E20" />
                <Text style={styles.verifiedText}>
                  {doctor.medicalRegistration.council} Verified
                </Text>
              </View>

              <Text style={styles.doctorName}>{doctor.fullName}</Text>
              <Text style={styles.specialityTitle}>{doctor.specialityTitle}</Text>

              {/* Stats Bar */}
              <View style={styles.statsBar}>
                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>{doctor.experienceYears}+ yrs</Text>
                  <Text style={styles.statLabel}>EXPERIENCE</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCol}>
                  <View style={styles.ratingRow}>
                    <AppIcon name="star" size={13} color={Colors.goldWarm} />
                    <Text style={styles.statNumber}> {doctor.rating.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.statLabel}>{doctor.reviewsCount} REVIEWS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>₹{doctor.onlineFee}</Text>
                  <Text style={styles.statLabel}>STARTING FEE</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Medical Registration & Credentials */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>MEDICAL VERIFICATION & CREDENTIALS</Text>
            <View style={styles.regBox}>
              <View style={styles.regHeader}>
                <AppIcon name="shield" size={16} color={Colors.forestDark} />
                <Text style={styles.regCouncil}>{doctor.medicalRegistration.council}</Text>
              </View>
              <Text style={styles.regNumber}>
                Reg Number: {doctor.medicalRegistration.registrationNumber}
              </Text>
              <Text style={styles.regStatusText}>
                ✓ Verified via Official Medical Registry · Active License
              </Text>
            </View>

            <View style={styles.qualificationsList}>
              <Text style={styles.sectionSubtitle}>Qualifications</Text>
              {doctor.qualifications.map((q, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{q}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* About Doctor */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>ABOUT THE DOCTOR</Text>
            <Text style={styles.bioText}>{doctor.biography}</Text>
            
            <View style={styles.langRow}>
              <Text style={styles.langLabel}>Languages Spoken: </Text>
              <Text style={styles.langList}>{doctor.languages.join(', ')}</Text>
            </View>
          </View>

          {/* Areas of Expertise */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>AREAS OF CLINICAL EXPERTISE</Text>
            <View style={styles.chipsWrap}>
              {doctor.areasOfExpertise.map((exp, idx) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>{exp}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Consultation Formats & Clinics */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>CONSULTATION FORMATS</Text>

            {/* Online Format */}
            <View style={styles.formatItem}>
              <View style={styles.formatTop}>
                <View style={styles.formatIconWrap}>
                  <AppIcon name="chat" size={16} color={Colors.forestDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formatTitle}>Online Video Consultation</Text>
                  <Text style={styles.formatDesc}>
                    30-minute private HD video consultation from the comfort of home.
                  </Text>
                </View>
                <Text style={styles.formatPrice}>₹{doctor.onlineFee}</Text>
              </View>
            </View>

            {/* In-Clinic Format */}
            <View style={[styles.formatItem, { marginTop: 12 }]}>
              <View style={styles.formatTop}>
                <View style={styles.formatIconWrap}>
                  <AppIcon name="location" size={16} color={Colors.forestDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formatTitle}>In-Clinic Consultation</Text>
                  <Text style={styles.formatDesc}>{doctor.clinic.name}</Text>
                  <Text style={styles.clinicAddress}>{doctor.clinic.address}</Text>
                  <Text style={styles.clinicHours}>Hours: {doctor.clinic.consultationHours}</Text>
                  {!!doctor.clinic.directionsNote && (
                    <Text style={styles.clinicNote}>✦ {doctor.clinic.directionsNote}</Text>
                  )}
                </View>
                <Text style={styles.formatPrice}>₹{doctor.inClinicFee}</Text>
              </View>
            </View>
          </View>

          {/* Verified Patient Reviews */}
          <View style={styles.card}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.cardEyebrow}>VERIFIED PATIENT REVIEWS</Text>
              <Text style={styles.reviewCountBadge}>{doctor.reviews.length} Verified</Text>
            </View>

            {doctor.reviews.map(rev => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View>
                    <Text style={styles.reviewerName}>{rev.parentName}</Text>
                    <Text style={styles.reviewerMeta}>
                      {rev.patientType} · {rev.consultationType === 'ONLINE' ? 'Video Consult' : 'Clinic Visit'}
                    </Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>★ {rev.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                <Text style={styles.reviewDate}>{rev.date}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Bottom Booking Action */}
        <View style={styles.bottomBar}>
          <View style={styles.feeColumn}>
            <Text style={styles.bottomFeeLabel}>CONSULTATION FROM</Text>
            <Text style={styles.bottomFeeValue}>₹{doctor.onlineFee}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.88}
            onPress={() => onBookAppointment(doctor)}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
            <AppIcon name="arrow-right" size={14} color="#FFFDF9" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero Section
  heroSection: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  imageWrap: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.forestDark,
    marginBottom: 16,
    position: 'relative',
  },
  portrait: { width: '100%', height: '100%' },
  demoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(22, 40, 30, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.creamLight,
  },
  doctorHeader: {},
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B5E20',
  },
  doctorName: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.forestDark,
    marginBottom: 4,
  },
  specialityTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(44, 64, 53, 0.08)' },
  statNumber: { fontSize: 14, fontWeight: '800', color: Colors.forestDark, marginBottom: 2 },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8, color: Colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },

  // Card
  card: {
    backgroundColor: '#FFFDF9',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  cardEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.sage,
    marginBottom: 10,
  },
  regBox: {
    backgroundColor: Colors.creamLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  regHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  regCouncil: { fontSize: 12, fontWeight: '800', color: Colors.forestDark },
  regNumber: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  regStatusText: { fontSize: 10, fontWeight: '700', color: '#1B5E20' },

  sectionSubtitle: { fontSize: 12, fontWeight: '700', color: Colors.forestDark, marginBottom: 6 },
  qualificationsList: {},
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  bulletDot: { width: 14, fontSize: 14, color: Colors.sage },
  bulletText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  bioText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  langRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  langLabel: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  langList: { fontSize: 11, color: Colors.textSecondary },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  chipText: { fontSize: 11, color: Colors.forestDark, fontWeight: '600' },

  formatItem: {
    backgroundColor: Colors.creamLight,
    padding: 12,
    borderRadius: 10,
  },
  formatTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  formatIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatTitle: { fontSize: 13, fontWeight: '800', color: Colors.forestDark, marginBottom: 2 },
  formatDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: 4 },
  clinicAddress: { fontSize: 10, color: Colors.textMuted, lineHeight: 14 },
  clinicHours: { fontSize: 10, color: Colors.sage, marginTop: 2, fontWeight: '600' },
  clinicNote: { fontSize: 9, color: Colors.terracotta, marginTop: 4 },
  formatPrice: { fontSize: 14, fontWeight: '800', color: Colors.forestDark },

  reviewHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewCountBadge: { fontSize: 10, color: Colors.sage, fontWeight: '700' },
  reviewCard: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.08)',
    paddingTop: 10,
    marginTop: 8,
  },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  reviewerName: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  reviewerMeta: { fontSize: 10, color: Colors.textMuted },
  ratingBadge: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.forestDark },
  reviewComment: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, fontStyle: 'italic', marginBottom: 4 },
  reviewDate: { fontSize: 9, color: Colors.textMuted },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 36 : 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.08)',
    elevation: 20,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  feeColumn: {},
  bottomFeeLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: Colors.textMuted },
  bottomFeeValue: { fontSize: 18, fontWeight: '800', color: Colors.forestDark },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bookButtonText: { fontSize: 13, fontWeight: '700', color: '#FFFDF9' },
});
