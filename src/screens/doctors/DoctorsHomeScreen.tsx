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
import {
  DoctorProfile,
  DoctorAppointment,
  DoctorSpecialityId,
  DOCTOR_SPECIALITIES,
  DEMO_DOCTORS,
  INITIAL_DOCTOR_APPOINTMENTS,
} from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';
import { DoctorProfileModal } from './DoctorProfileModal';
import { DoctorBookingWizardModal } from './DoctorBookingWizardModal';
import { DoctorSearchModal } from './DoctorSearchModal';
import { MyAppointmentsScreen } from './MyAppointmentsScreen';

interface DoctorsHomeScreenProps {
  user?: { name: string; phone: string } | null;
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const DoctorsHomeScreen: React.FC<DoctorsHomeScreenProps> = ({
  user,
  onOpenAuth,
  onNavigateTab,
}) => {
  const [doctors] = useState<DoctorProfile[]>(DEMO_DOCTORS);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(INITIAL_DOCTOR_APPOINTMENTS);

  // Modals & Navigation States
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedSpecialityFilter, setSelectedSpecialityFilter] = useState<DoctorSpecialityId | null>(null);
  const [showMyAppointments, setShowMyAppointments] = useState(false);

  const handleBookingCreated = (newAppointment: DoctorAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    setBookingDoctor(null);
    setShowMyAppointments(true);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'CANCELLED', statusColor: '#8C9A90' } : apt)),
    );
  };

  const handleOpenSpeciality = (specId: DoctorSpecialityId) => {
    setSelectedSpecialityFilter(specId);
    setSearchVisible(true);
  };

  const upcomingCount = appointments.filter(
    a => a.status === 'CONFIRMED' || a.status === 'ACCEPTED' || a.status === 'REQUESTED',
  ).length;

  return (
    <View style={styles.root}>
      {showMyAppointments ? (
        <MyAppointmentsScreen
          appointments={appointments}
          onClose={() => setShowMyAppointments(false)}
          onCancelAppointment={handleCancelAppointment}
          onBookNew={() => {
            setShowMyAppointments(false);
            setSearchVisible(true);
          }}
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* ── EMERGENCY NOTICE BANNER ── */}
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyIconWrap}>
              <AppIcon name="shield" size={14} color="#C86D51" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>FOR ROUTINE & PREVENTATIVE CARE</Text>
              <Text style={styles.emergencyText}>
                Appuge is a managed booking platform. In case of acute breathing distress, high fever in infants, or medical emergencies, dial 112 / 108 or proceed immediately to the nearest hospital.
              </Text>
            </View>
          </View>

          {/* ── EDITORIAL HEADER ── */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.kicker}>APPUGE HEALTH · MANAGED APPOINTMENTS</Text>
                <Text style={styles.title}>Care starts with the right doctor.</Text>
                <Text style={styles.sub}>
                  Trusted, verified pediatricians and maternal specialists for every milestone and new beginning.
                </Text>
              </View>
            </View>

            {/* My Appointments Pill Shortcut */}
            <TouchableOpacity
              style={styles.myAppointmentsBtn}
              activeOpacity={0.85}
              onPress={() => setShowMyAppointments(true)}>
              <AppIcon name="calendar" size={15} color="#FAF4EB" />
              <Text style={styles.myAppointmentsText}>
                My Doctor Appointments ({upcomingCount})
              </Text>
              <AppIcon name="arrow-right" size={13} color="#FAF4EB" />
            </TouchableOpacity>

            {/* Search Trigger Bar */}
            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedSpecialityFilter(null);
                setSearchVisible(true);
              }}>
              <AppIcon name="search" size={16} color={Colors.sage} />
              <Text style={styles.searchPlaceholder}>
                Search doctors, specialities, or health concerns...
              </Text>
              <View style={styles.searchArrow}>
                <AppIcon name="arrow-right" size={12} color={Colors.forestDark} />
              </View>
            </TouchableOpacity>

            {/* Common Suggestion Tags */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}>
              {[
                'Newborn Colic',
                'Postpartum Healing',
                'Lactation Support',
                'Infant Eczema',
                'Weaning Advice',
              ].map((sugg, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionPill}
                  onPress={() => {
                    setSelectedSpecialityFilter(null);
                    setSearchVisible(true);
                  }}>
                  <Text style={styles.suggestionText}>+ {sugg}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── SPECIALITY DISCOVERY SECTION ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>MEDICAL SPECIALITIES</Text>
            <Text style={styles.sectionHeading}>Browse by care needed.</Text>
          </View>

          <View style={styles.specialityGrid}>
            {DOCTOR_SPECIALITIES.map(sp => (
              <TouchableOpacity
                key={sp.id}
                style={[styles.specialityCard, { backgroundColor: sp.bgTone }]}
                activeOpacity={0.88}
                onPress={() => handleOpenSpeciality(sp.id)}>
                <View style={styles.specialityIconWrap}>
                  <AppIcon name={sp.iconName} size={20} color={Colors.forestDark} />
                </View>
                <Text style={styles.specialityTitle}>{sp.title}</Text>
                <Text style={styles.specialityDesc} numberOfLines={2}>
                  {sp.description}
                </Text>
                <View style={styles.specialityCountRow}>
                  <Text style={styles.specialityCount}>
                    {sp.doctorCount} Verified Doctor{sp.doctorCount === 1 ? '' : 's'}
                  </Text>
                  <AppIcon name="arrow-right" size={11} color={Colors.forestDark} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── CONSULTATION FORMATS SHOWCASE ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>HOW APPUGE CONSULTATIONS WORK</Text>
            <Text style={styles.sectionHeading}>Two calm ways to meet your doctor.</Text>
          </View>

          <View style={styles.formatsContainer}>
            {/* Online Video Card */}
            <View style={styles.formatBox}>
              <View style={styles.formatBoxTop}>
                <View style={styles.formatBadge}>
                  <Text style={styles.formatBadgeText}>FROM HOME</Text>
                </View>
                <AppIcon name="chat" size={18} color={Colors.forestDark} />
              </View>
              <Text style={styles.formatBoxTitle}>Private Video Consultations</Text>
              <Text style={styles.formatBoxDesc}>
                Connect directly from home over high-definition secure video. Perfect for feeding guidance, lab review, postpartum check-ins, and infant rashes.
              </Text>
              <View style={styles.formatPoints}>
                <Text style={styles.formatPoint}>✓ 30-minute unhurried clinical slot</Text>
                <Text style={styles.formatPoint}>✓ Direct digital prescription & care summary</Text>
              </View>
            </View>

            {/* In-Clinic Card */}
            <View style={[styles.formatBox, { marginTop: 12 }]}>
              <View style={styles.formatBoxTop}>
                <View style={[styles.formatBadge, { backgroundColor: '#F3E7DC' }]}>
                  <Text style={[styles.formatBadgeText, { color: Colors.terracotta }]}>IN BENGALURU</Text>
                </View>
                <AppIcon name="location" size={18} color={Colors.forestDark} />
              </View>
              <Text style={styles.formatBoxTitle}>In-Clinic Appointments</Text>
              <Text style={styles.formatBoxDesc}>
                In-person clinical evaluations at verified sanctuary clinics in Indiranagar, Koramangala, Whitefield, and HSR Layout.
              </Text>
              <View style={styles.formatPoints}>
                <Text style={styles.formatPoint}>✓ Verified sanitization protocols for newborns</Text>
                <Text style={styles.formatPoint}>✓ Physical milestone, weight & incision check</Text>
              </View>
            </View>
          </View>

          {/* ── FEATURED DOCTORS ("Doctors parents trust") ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>DOCTORS PARENTS TRUST</Text>
            <Text style={styles.sectionHeading}>Bengaluru's caring specialists.</Text>
          </View>

          <View style={styles.doctorsList}>
            {doctors.slice(0, 4).map(doc => (
              <View key={doc.id} style={styles.docCard}>
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => setSelectedDoctor(doc)}
                  style={styles.docCardMain}>
                  <Image
                    source={doc.profileImage}
                    style={styles.docCardImage}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.docVerifiedTag}>
                      <AppIcon name="verified" size={12} color="#1B5E20" />
                      <Text style={styles.docVerifiedText}>
                        {doc.medicalRegistration.council}
                      </Text>
                    </View>
                    <Text style={styles.docCardName}>{doc.fullName}</Text>
                    <Text style={styles.docCardSpeciality} numberOfLines={2}>
                      {doc.specialityTitle}
                    </Text>
                    <Text style={styles.docCardExp}>
                      {doc.experienceYears} yrs clinical exp · ★ {doc.rating.toFixed(2)} ({doc.reviewsCount} reviews)
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Fees and Formats */}
                <View style={styles.docCardMetaRow}>
                  <View style={styles.feeGroup}>
                    <Text style={styles.feeKicker}>ONLINE VIDEO</Text>
                    <Text style={styles.feeAmount}>₹{doc.onlineFee}</Text>
                  </View>
                  <View style={styles.feeDivider} />
                  <View style={styles.feeGroup}>
                    <Text style={styles.feeKicker}>IN-CLINIC ({doc.clinic.locality})</Text>
                    <Text style={styles.feeAmount}>₹{doc.inClinicFee}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.docCardActions}>
                  <TouchableOpacity
                    style={styles.docProfileBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDoctor(doc)}>
                    <Text style={styles.docProfileBtnText}>View Full Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.docBookBtn}
                    activeOpacity={0.88}
                    onPress={() => setBookingDoctor(doc)}>
                    <Text style={styles.docBookBtnText}>Book Slot →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* ── APPUGE CONCIERGE & SUPPORT ── */}
          <View style={styles.conciergeCard}>
            <View style={styles.conciergeIconWrap}>
              <AppIcon name="stethoscope" size={24} color={Colors.creamLight} />
            </View>
            <Text style={styles.conciergeKicker}>APPUGE HEALTHCARE CONCIERGE</Text>
            <Text style={styles.conciergeTitle}>Need guidance choosing the right specialist?</Text>
            <Text style={styles.conciergeText}>
              Our medical coordination desk assists parents with symptom triage, appointment coordination, and home-care continuity across Bengaluru.
            </Text>
            <TouchableOpacity
              style={styles.conciergeBtn}
              activeOpacity={0.88}
              onPress={() =>
                Alert.alert(
                  'Appuge Healthcare Concierge',
                  'Call: +91 80 4719 2200\nWhatsApp: +91 98450 12345\nAvailable: Monday to Saturday, 8:00 AM - 8:00 PM',
                  [{ text: 'Close' }],
                )
              }>
              <Text style={styles.conciergeBtnText}>Speak with Healthcare Desk</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* MODALS */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        visible={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBookAppointment={doc => {
          setSelectedDoctor(null);
          setBookingDoctor(doc);
        }}
      />

      <DoctorBookingWizardModal
        doctor={bookingDoctor}
        visible={!!bookingDoctor}
        onClose={() => setBookingDoctor(null)}
        onBookingSubmitted={handleBookingCreated}
        user={user}
      />

      <DoctorSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        doctors={doctors}
        initialSpecialityId={selectedSpecialityFilter}
        onSelectDoctor={doc => {
          setSearchVisible(false);
          setSelectedDoctor(doc);
        }}
        onBookDoctor={doc => {
          setSearchVisible(false);
          setBookingDoctor(doc);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  scroll: { flex: 1 },
  content: { paddingBottom: 110 },

  // Emergency Banner
  emergencyBanner: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 109, 81, 0.2)',
    gap: 12,
    alignItems: 'flex-start',
  },
  emergencyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(200, 109, 81, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  emergencyTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.terracotta,
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: Colors.creamLight,
  },
  headerTop: { marginBottom: 14 },
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.forestDark,
    marginBottom: 6,
    maxWidth: 300,
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  myAppointmentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.forestDark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  myAppointmentsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FAF4EB',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
  },
  searchArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  suggestionRow: { gap: 8, paddingTop: 12 },
  suggestionPill: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestDark,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 4,
  },
  sectionHeading: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.forestDark,
  },

  // Speciality Grid
  specialityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  specialityCard: {
    width: '48%',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  specialityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  specialityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  specialityDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
    marginBottom: 10,
  },
  specialityCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.06)',
    paddingTop: 6,
  },
  specialityCount: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
  },

  // Formats
  formatsContainer: { paddingHorizontal: 16 },
  formatBox: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  formatBoxTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  formatBadge: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  formatBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.forestDark, letterSpacing: 0.8 },
  formatBoxTitle: { fontSize: 15, fontWeight: '800', color: Colors.forestDark, marginBottom: 4 },
  formatBoxDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: 10 },
  formatPoints: { gap: 4 },
  formatPoint: { fontSize: 10, color: Colors.sage, fontWeight: '600' },

  // Featured Doctors
  doctorsList: { paddingHorizontal: 16, gap: 14 },
  docCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  docCardMain: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  docCardImage: { width: 72, height: 72, borderRadius: 12, backgroundColor: Colors.forestDark },
  docVerifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  docVerifiedText: { fontSize: 9, fontWeight: '700', color: '#1B5E20' },
  docCardName: { fontFamily: Fonts.serif, fontSize: 16, color: Colors.forestDark, marginBottom: 2 },
  docCardSpeciality: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  docCardExp: { fontSize: 10, color: Colors.textMuted },

  docCardMetaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.creamLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  feeGroup: { flex: 1, alignItems: 'center' },
  feeDivider: { width: 1, backgroundColor: 'rgba(44, 64, 53, 0.08)' },
  feeKicker: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8, color: Colors.textMuted, marginBottom: 2 },
  feeAmount: { fontSize: 13, fontWeight: '800', color: Colors.forestDark },

  docCardActions: { flexDirection: 'row', gap: 10 },
  docProfileBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  docProfileBtnText: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  docBookBtn: {
    flex: 1.2,
    backgroundColor: Colors.forestDark,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  docBookBtnText: { fontSize: 11, fontWeight: '700', color: '#FFFDF9' },

  // Concierge
  conciergeCard: {
    backgroundColor: Colors.forestDark,
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  conciergeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 253, 249, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  conciergeKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: 'rgba(255, 253, 249, 0.6)',
    marginBottom: 4,
  },
  conciergeTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: '#FFFDF9',
    textAlign: 'center',
    marginBottom: 8,
  },
  conciergeText: {
    fontSize: 11,
    color: 'rgba(255, 253, 249, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  conciergeBtn: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
  },
  conciergeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestDark,
  },
});
