import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  DoctorProfile,
  DoctorAppointment,
  DoctorSpecialityId,
  DOCTOR_SPECIALITIES,
  DEMO_DOCTORS,
  INITIAL_DOCTOR_APPOINTMENTS,
  FAMILY_JOURNEY_NEEDS,
  FamilyJourneyNeed,
} from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';
import { DoctorProfileModal } from './DoctorProfileModal';
import { DoctorBookingWizardModal } from './DoctorBookingWizardModal';
import { DoctorSearchModal } from './DoctorSearchModal';
import { MyAppointmentsScreen } from './MyAppointmentsScreen';
import { notificationService } from '../../services/notificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(
    INITIAL_DOCTOR_APPOINTMENTS,
  );

  // Modals & Navigation States
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedSpecialityFilter, setSelectedSpecialityFilter] =
    useState<DoctorSpecialityId | null>(null);
  const [showMyAppointments, setShowMyAppointments] = useState(false);

  const handleBookingCreated = (newAppointment: DoctorAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    setBookingDoctor(null);
    setShowMyAppointments(true);

    // Dynamic Authoritative Notification Event
    notificationService.addNotification({
      userId: user?.phone || 'usr-default',
      title: 'Appointment Request Submitted',
      body: `Your consultation request with ${newAppointment.doctorName} for ${newAppointment.appointmentDate} at ${newAppointment.appointmentTime} is submitted for clinical verification.`,
      category: 'DOCTOR',
      eventType: 'APPOINTMENT_REQUESTED',
      relatedEntityId: newAppointment.id,
      relatedEntityType: 'doctor_appointment',
      priority: 'HIGH',
      actionRoute: 'doctors',
      actionParams: { appointmentId: newAppointment.id },
      ctaLabel: 'View Appointment Status →',
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? { ...apt, status: 'CANCELLED', statusColor: '#8C9A90' }
          : apt,
      ),
    );

    notificationService.addNotification({
      userId: user?.phone || 'usr-default',
      title: 'Appointment Cancelled',
      body: `Your appointment request has been cancelled as per your schedule request.`,
      category: 'DOCTOR',
      eventType: 'APPOINTMENT_CANCELLED',
      relatedEntityId: id,
      relatedEntityType: 'doctor_appointment',
      priority: 'NORMAL',
      actionRoute: 'doctors',
      actionParams: { appointmentId: id },
      ctaLabel: 'View Appointments →',
    });
  };

  const handleOpenSpeciality = (specId: DoctorSpecialityId) => {
    setSelectedSpecialityFilter(specId);
    setSearchVisible(true);
  };

  const handleOpenJourney = (journey: FamilyJourneyNeed) => {
    setSelectedSpecialityFilter(journey.specialityId);
    setSearchVisible(true);
  };

  const upcomingAppointments = appointments.filter(
    a =>
      a.status === 'CONFIRMED' ||
      a.status === 'ACCEPTED' ||
      a.status === 'REQUESTED',
  );
  const primaryAppointment = upcomingAppointments[0];

  // Spotlight Doctor: Dr. Radhika Menon
  const spotlightDoctor = doctors.find(d => d.id === 'doc-radhika') || doctors[0];

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
              <AppIcon name="shield" size={13} color="#C86D51" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>
                FOR ROUTINE & PREVENTATIVE CARE
              </Text>
              <Text style={styles.emergencyText}>
                Appuge is a managed booking platform. For acute breathing distress,
                high infant fever, or emergencies, dial 112 / 108 or proceed to the
                nearest hospital.
              </Text>
            </View>
          </View>

          {/* ── SECTION A: PREMIUM EDITORIAL HEADER ── */}
          <View style={styles.header}>
            <View style={styles.headerEyebrowRow}>
              <Text style={styles.headerEyebrow}>
                ✦ APPUGE CLINICAL SANCTUARY
              </Text>
              <TouchableOpacity
                style={styles.locationPill}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    'Sanctuary Localities',
                    'In-clinic consultations available at Indiranagar, Koramangala, Whitefield, and HSR Layout. Online consultations cover all of India.',
                  )
                }>
                <AppIcon name="location" size={10} color={Colors.terracotta} />
                <Text style={styles.locationPillText}>Bengaluru ▾</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.headerHeadline}>
              Care that understands every little beginning.
            </Text>
            <Text style={styles.headerSupport}>
              Meet trusted healthcare professionals for you, your baby and your
              growing family.
            </Text>

            {/* Quick Appointments Shortcut */}
            <TouchableOpacity
              style={styles.shortcutBtn}
              activeOpacity={0.85}
              onPress={() => setShowMyAppointments(true)}>
              <View style={styles.shortcutLeft}>
                <AppIcon name="calendar" size={14} color="#FAF4EB" />
                <Text style={styles.shortcutText}>
                  My Doctor Appointments ({upcomingAppointments.length})
                </Text>
              </View>
              <AppIcon name="arrow-right" size={12} color="#FAF4EB" />
            </TouchableOpacity>
          </View>

          {/* ── SECTION B: IMAGE-LED HERO EXPERIENCE ── */}
          <View style={styles.heroWrapper}>
            <View style={styles.heroCard}>
              <Image
                source={require('../../assets/images/hero_clinical.jpg')}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroGradientOverlay} />

              <View style={styles.heroBadgeTop}>
                <Text style={styles.heroBadgeTopText}>
                  VERIFIED CLINICAL COMPASSION
                </Text>
              </View>

              <View style={styles.heroFloatingCard}>
                <Text style={styles.heroFloatingTitle}>
                  Unhurried, compassionate care designed around a mother and her newborn.
                </Text>
                <View style={styles.heroChipsRow}>
                  <View style={styles.heroChip}>
                    <AppIcon name="check" size={10} color={Colors.forestDark} />
                    <Text style={styles.heroChipText}>30-Min Unhurried Slots</Text>
                  </View>
                  <View style={styles.heroChip}>
                    <AppIcon name="video" size={10} color={Colors.forestDark} />
                    <Text style={styles.heroChipText}>Video & In-Clinic</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.heroActionBtn}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedSpecialityFilter(null);
                    setSearchVisible(true);
                  }}>
                  <Text style={styles.heroActionBtnText}>
                    Find Your Specialist
                  </Text>
                  <AppIcon name="arrow-right" size={12} color="#FAF4EB" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── SECTION C: INTELLIGENT DOCTOR SEARCH ── */}
          <View style={styles.searchSection}>
            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedSpecialityFilter(null);
                setSearchVisible(true);
              }}>
              <AppIcon name="search" size={16} color={Colors.sage} />
              <Text style={styles.searchPlaceholder}>
                Find the right care for your family...
              </Text>
              <View style={styles.searchActionArrow}>
                <AppIcon name="arrow-right" size={12} color={Colors.forestDark} />
              </View>
            </TouchableOpacity>

            {/* Curated Suggestion Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionScroll}>
              {[
                { label: 'Newborn Colic', id: 'pediatrician' },
                { label: 'Postpartum Healing', id: 'gynecologist' },
                { label: 'Lactation Support', id: 'lactation' },
                { label: 'Infant Eczema', id: 'dermatologist' },
                { label: 'Weaning Advice', id: 'nutritionist' },
                { label: 'Motor Milestones', id: 'development' },
              ].map((sugg, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionPill}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleOpenSpeciality(sugg.id as DoctorSpecialityId)
                  }>
                  <Text style={styles.suggestionText}>+ {sugg.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── SECTION I: UPCOMING APPOINTMENT PREVIEW ── */}
          <View style={styles.appointmentPreviewSection}>
            {primaryAppointment ? (
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentCardHeader}>
                  <View style={styles.appointmentKickerRow}>
                    <View style={styles.appointmentLiveDot} />
                    <Text style={styles.appointmentKicker}>
                      UPCOMING APPOINTMENT · {primaryAppointment.appointmentReference}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          primaryAppointment.status === 'CONFIRMED'
                            ? '#EAF2EC'
                            : '#FDF2E9',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            primaryAppointment.status === 'CONFIRMED'
                              ? '#1B5E20'
                              : Colors.terracotta,
                        },
                      ]}>
                      {primaryAppointment.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentBody}>
                  <Image
                    source={primaryAppointment.doctorImage}
                    style={styles.appointmentDocImg}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.appointmentDocName}>
                      {primaryAppointment.doctorName}
                    </Text>
                    <Text style={styles.appointmentDocSpec}>
                      {primaryAppointment.doctorSpeciality}
                    </Text>
                    <View style={styles.appointmentTimeRow}>
                      <AppIcon name="clock" size={11} color={Colors.sageDark} />
                      <Text style={styles.appointmentTimeText}>
                        {primaryAppointment.appointmentDate} ·{' '}
                        {primaryAppointment.appointmentTime}
                      </Text>
                    </View>
                    <Text style={styles.appointmentPatientText}>
                      Patient: {primaryAppointment.patientName} (
                      {primaryAppointment.patientType})
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.appointmentActionBtn}
                  activeOpacity={0.85}
                  onPress={() => setShowMyAppointments(true)}>
                  <Text style={styles.appointmentActionText}>
                    Manage Appointment & Details
                  </Text>
                  <AppIcon name="arrow-right" size={12} color={Colors.forestDark} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyAppointmentCard}>
                <View style={styles.emptyIconWrap}>
                  <AppIcon name="heart" size={18} color={Colors.sage} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.emptyAppointmentTitle}>
                    Your family's care journey starts here.
                  </Text>
                  <Text style={styles.emptyAppointmentSub}>
                    Schedule your first unhurried consultation with verified
                    specialists.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.emptyExploreBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedSpecialityFilter(null);
                    setSearchVisible(true);
                  }}>
                  <Text style={styles.emptyExploreBtnText}>Explore Doctors →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── SECTION D: CARE BY SPECIALITY (EDITORIAL DISCOVERY LAYOUT) ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>MEDICAL SPECIALITIES</Text>
            <Text style={styles.sectionHeading}>Browse by care needed.</Text>
            <Text style={styles.sectionSubtitle}>
              Dedicated medical disciplines tailored for maternal wellness and infant
              health.
            </Text>
          </View>

          {/* Editorial Speciality Discovery Cards */}
          <View style={styles.specialityEditorialGrid}>
            {/* Lead Large Speciality: Pediatrics */}
            {DOCTOR_SPECIALITIES[0] && (
              <TouchableOpacity
                style={styles.specialityLeadCard}
                activeOpacity={0.9}
                onPress={() => handleOpenSpeciality(DOCTOR_SPECIALITIES[0].id)}>
                <Image
                  source={DOCTOR_SPECIALITIES[0].image!}
                  style={styles.specialityLeadImage}
                  resizeMode="cover"
                />
                <View style={styles.specialityImageOverlay} />
                <View style={styles.specialityContent}>
                  <View style={styles.specialityKickerBadge}>
                    <Text style={styles.specialityKickerText}>
                      {DOCTOR_SPECIALITIES[0].editorialTag || 'INFANT HEALTH'}
                    </Text>
                  </View>
                  <Text style={styles.specialityLeadTitle}>
                    {DOCTOR_SPECIALITIES[0].title}
                  </Text>
                  <Text style={styles.specialityLeadDesc}>
                    {DOCTOR_SPECIALITIES[0].description}
                  </Text>
                  <View style={styles.specialityFooterRow}>
                    <Text style={styles.specialityDoctorCountText}>
                      {DOCTOR_SPECIALITIES[0].doctorCount} Verified Doctors
                    </Text>
                    <View style={styles.specialityCircleArrow}>
                      <AppIcon name="arrow-right" size={11} color="#FFFDF9" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Asymmetric 2-Column Cards for other specialities */}
            <View style={styles.specialityRowGrid}>
              {DOCTOR_SPECIALITIES.slice(1).map(sp => (
                <TouchableOpacity
                  key={sp.id}
                  style={styles.specialityGridCard}
                  activeOpacity={0.88}
                  onPress={() => handleOpenSpeciality(sp.id)}>
                  {sp.image && (
                    <Image
                      source={sp.image}
                      style={styles.specialityCardThumb}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.specialityCardShade} />
                  <View style={styles.specialityCardContent}>
                    <Text style={styles.specialityCardTag}>
                      {sp.editorialTag || sp.subtitle}
                    </Text>
                    <Text style={styles.specialityCardTitle}>{sp.title}</Text>
                    <Text style={styles.specialityCardCount}>
                      {sp.doctorCount} Specialists →
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── SECTION E: DOCTOR SPOTLIGHT ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>DOCTOR SPOTLIGHT</Text>
            <Text style={styles.sectionHeading}>Meet your care specialists.</Text>
            <Text style={styles.sectionSubtitle}>
              Clinicians recognized across Bengaluru for empathetic practice and clinical
              excellence.
            </Text>
          </View>

          <View style={styles.spotlightWrapper}>
            <View style={styles.spotlightCard}>
              <View style={styles.spotlightImageContainer}>
                <Image
                  source={spotlightDoctor.profileImage}
                  style={styles.spotlightImage}
                  resizeMode="cover"
                />
                <View style={styles.spotlightVerifiedBadge}>
                  <AppIcon name="verified" size={12} color="#1B5E20" />
                  <Text style={styles.spotlightVerifiedText}>
                    {spotlightDoctor.medicalRegistration.council} Verified
                  </Text>
                </View>
                <View style={styles.spotlightExpBadge}>
                  <Text style={styles.spotlightExpText}>
                    {spotlightDoctor.experienceYears} Years Exp
                  </Text>
                </View>
              </View>

              <View style={styles.spotlightInfo}>
                <Text style={styles.spotlightKicker}>
                  FEATURED CLINICAL SPECIALIST
                </Text>
                <Text style={styles.spotlightName}>{spotlightDoctor.fullName}</Text>
                <Text style={styles.spotlightSpeciality}>
                  {spotlightDoctor.specialityTitle}
                </Text>

                <View style={styles.spotlightQuoteBox}>
                  <Text style={styles.spotlightQuote}>
                    "Care should be an unhurried, listening sanctuary for growing
                    families."
                  </Text>
                </View>

                {/* Credentials list */}
                <View style={styles.spotlightCredsRow}>
                  <Text style={styles.spotlightCredText}>
                    Reg: {spotlightDoctor.medicalRegistration.registrationNumber}
                  </Text>
                  <Text style={styles.spotlightCredDivider}>·</Text>
                  <Text style={styles.spotlightCredText}>
                    ★ {spotlightDoctor.rating.toFixed(2)} ({spotlightDoctor.reviewsCount}{' '}
                    reviews)
                  </Text>
                </View>

                {/* Consultation types & fees */}
                <View style={styles.spotlightFeeBar}>
                  <View style={styles.spotlightFeeCol}>
                    <Text style={styles.spotlightFeeLabel}>VIDEO CONSULT</Text>
                    <Text style={styles.spotlightFeeValue}>
                      ₹{spotlightDoctor.onlineFee}
                    </Text>
                  </View>
                  <View style={styles.spotlightFeeSep} />
                  <View style={styles.spotlightFeeCol}>
                    <Text style={styles.spotlightFeeLabel}>
                      IN-CLINIC ({spotlightDoctor.clinic.locality})
                    </Text>
                    <Text style={styles.spotlightFeeValue}>
                      ₹{spotlightDoctor.inClinicFee}
                    </Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.spotlightActions}>
                  <TouchableOpacity
                    style={styles.spotlightProfileBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDoctor(spotlightDoctor)}>
                    <Text style={styles.spotlightProfileBtnText}>
                      View Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.spotlightBookBtn}
                    activeOpacity={0.88}
                    onPress={() => setBookingDoctor(spotlightDoctor)}>
                    <Text style={styles.spotlightBookBtnText}>
                      Book Consultation →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* ── SECTION F: DOCTORS FOR YOUR JOURNEY ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>CURATED FOR EVERY MILESTONE</Text>
            <Text style={styles.sectionHeading}>Doctors for your journey.</Text>
            <Text style={styles.sectionSubtitle}>
              From the sacred first 40 days to infant nutrition and childhood growth.
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.journeyScroll}>
            {FAMILY_JOURNEY_NEEDS.map(journey => (
              <TouchableOpacity
                key={journey.id}
                style={styles.journeyCard}
                activeOpacity={0.9}
                onPress={() => handleOpenJourney(journey)}>
                <Image
                  source={journey.image}
                  style={styles.journeyImage}
                  resizeMode="cover"
                />
                <View style={styles.journeyShade} />
                <View style={styles.journeyContent}>
                  <View style={styles.journeyBadge}>
                    <Text style={styles.journeyBadgeText}>{journey.badge}</Text>
                  </View>
                  <Text style={styles.journeyKicker}>{journey.kicker}</Text>
                  <Text style={styles.journeyTitle}>{journey.title}</Text>
                  <Text style={styles.journeySub} numberOfLines={2}>
                    {journey.subtitle}
                  </Text>
                  <View style={styles.journeyActionRow}>
                    <Text style={styles.journeyActionText}>
                      View Specialists →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── SECTION G: CHOOSE YOUR CONSULTATION ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>CARE ON YOUR TERMS</Text>
            <Text style={styles.sectionHeading}>Choose your consultation format.</Text>
            <Text style={styles.sectionSubtitle}>
              Two tranquil modalities designed to suit your schedule and parental comfort.
            </Text>
          </View>

          <View style={styles.formatsContainer}>
            {/* Online Video Consultation Card */}
            <View style={styles.formatCard}>
              <Image
                source={require('../../assets/images/01.jpg')}
                style={styles.formatImage}
                resizeMode="cover"
              />
              <View style={styles.formatCardShade} />
              <View style={styles.formatCardBody}>
                <View style={styles.formatKickerRow}>
                  <Text style={styles.formatKicker}>FROM HOME</Text>
                  <AppIcon name="video" size={16} color="#FFFDF9" />
                </View>
                <Text style={styles.formatTitle}>Private Video Consultations</Text>
                <Text style={styles.formatDesc}>
                  Unhurried 30-minute consultations with top Bengaluru pediatricians
                  and maternal specialists. Direct digital prescriptions and follow-up
                  support.
                </Text>
                <View style={styles.formatFeatures}>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ 30-min unhurried clinical slot
                  </Text>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ Direct digital prescription & summary
                  </Text>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ Zero waiting room infection exposure
                  </Text>
                </View>
                <View style={styles.formatActionRow}>
                  <Text style={styles.formatPriceText}>From ₹800 / consult</Text>
                  <TouchableOpacity
                    style={styles.formatBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedSpecialityFilter(null);
                      setSearchVisible(true);
                    }}>
                    <Text style={styles.formatBtnText}>Book Video Consult →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* In-Clinic Sanctuary Visit Card */}
            <View style={[styles.formatCard, { marginTop: 18 }]}>
              <Image
                source={require('../../assets/images/hero_clinical.jpg')}
                style={styles.formatImage}
                resizeMode="cover"
              />
              <View style={styles.formatCardShade} />
              <View style={styles.formatCardBody}>
                <View style={styles.formatKickerRow}>
                  <Text style={styles.formatKicker}>IN BENGALURU SANCTUARY</Text>
                  <AppIcon name="location" size={16} color="#FFFDF9" />
                </View>
                <Text style={styles.formatTitle}>Sanctuary Clinic Appointments</Text>
                <Text style={styles.formatDesc}>
                  In-person clinical evaluations at verified sanctuary suites in
                  Indiranagar, Koramangala, Whitefield, and HSR Layout.
                </Text>
                <View style={styles.formatFeatures}>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ Rigorous pediatric sanitization protocols
                  </Text>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ Comprehensive physical milestone & vitals check
                  </Text>
                  <Text style={styles.formatFeaturePoint}>
                    ✓ Calming mother-and-baby nursery suite
                  </Text>
                </View>
                <View style={styles.formatActionRow}>
                  <Text style={styles.formatPriceText}>From ₹1,100 / visit</Text>
                  <TouchableOpacity
                    style={styles.formatBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedSpecialityFilter(null);
                      setSearchVisible(true);
                    }}>
                    <Text style={styles.formatBtnText}>Find Nearby Clinic →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* ── SECTION H: DOCTORS AVAILABLE FOR BOOKING ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>VERIFIED PRACTITIONERS</Text>
            <Text style={styles.sectionHeading}>Doctors available for booking.</Text>
            <Text style={styles.sectionSubtitle}>
              Select a practitioner to review verified credentials, clinic details, and
              open schedules.
            </Text>
          </View>

          <View style={styles.doctorsDirectory}>
            {doctors.map(doc => (
              <View key={doc.id} style={styles.editorialDoctorCard}>
                <View style={styles.editorialDoctorTop}>
                  <Image
                    source={doc.profileImage}
                    style={styles.editorialDoctorPortrait}
                    resizeMode="cover"
                  />
                  <View style={styles.editorialDoctorMeta}>
                    <View style={styles.editorialVerifiedRow}>
                      <AppIcon name="verified" size={11} color="#1B5E20" />
                      <Text style={styles.editorialVerifiedText}>
                        {doc.medicalRegistration.council}
                      </Text>
                    </View>
                    <Text style={styles.editorialDoctorName}>{doc.fullName}</Text>
                    <Text style={styles.editorialDoctorSpeciality}>
                      {doc.specialityTitle}
                    </Text>
                    <Text style={styles.editorialDoctorHospital}>
                      {doc.qualifications[0]} · {doc.experienceYears} yrs exp
                    </Text>
                    <View style={styles.editorialRatingRow}>
                      <AppIcon name="star" size={11} color={Colors.goldWarm} />
                      <Text style={styles.editorialRatingText}>
                        {' '}
                        {doc.rating.toFixed(2)} ({doc.reviewsCount} reviews)
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Available Slot Badge */}
                <View style={styles.slotTagRow}>
                  <AppIcon name="clock" size={11} color={Colors.sageDark} />
                  <Text style={styles.slotTagText}>
                    Next available slot: {doc.availability[0]?.dayLabel || 'Tomorrow'},{' '}
                    {doc.availability[0]?.slots[0]?.time || '10:00 AM'}
                  </Text>
                </View>

                {/* Fees and Formats */}
                <View style={styles.editorialFeeBar}>
                  <Text style={styles.editorialFeeText}>
                    Video: <Text style={styles.boldFee}>₹{doc.onlineFee}</Text> · In-Clinic: <Text style={styles.boldFee}>₹{doc.inClinicFee}</Text>
                  </Text>
                  <Text style={styles.editorialLocalityText}>
                    {doc.clinic.locality}
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.editorialCardActions}>
                  <TouchableOpacity
                    style={styles.editorialGhostBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDoctor(doc)}>
                    <Text style={styles.editorialGhostBtnText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editorialSolidBtn}
                    activeOpacity={0.88}
                    onPress={() => setBookingDoctor(doc)}>
                    <Text style={styles.editorialSolidBtnText}>Book Slot →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* ── SECTION J: APPUGE TRUST & VERIFICATION ── */}
          <View style={styles.trustSection}>
            <View style={styles.trustHeader}>
              <Text style={styles.trustEyebrow}>THE APPUGE CLINICAL STANDARD</Text>
              <Text style={styles.trustTitle}>Care with confidence.</Text>
              <Text style={styles.trustSub}>
                Every doctor on Appuge undergoes strict credentialing and hospital
                practice oversight.
              </Text>
            </View>

            <View style={styles.trustPillarsGrid}>
              <View style={styles.trustPillar}>
                <View style={styles.trustIconCircle}>
                  <AppIcon name="shield" size={15} color={Colors.forestDark} />
                </View>
                <Text style={styles.trustPillarTitle}>100% Medical Council Verified</Text>
                <Text style={styles.trustPillarText}>
                  Every registration is authenticated against the official Karnataka
                  Medical Council registry.
                </Text>
              </View>

              <View style={styles.trustPillar}>
                <View style={styles.trustIconCircle}>
                  <AppIcon name="clock" size={15} color={Colors.forestDark} />
                </View>
                <Text style={styles.trustPillarTitle}>Unhurried 30-Minute Slots</Text>
                <Text style={styles.trustPillarText}>
                  Never rushed; thorough assessments for mother and infant transition.
                </Text>
              </View>

              <View style={styles.trustPillar}>
                <View style={styles.trustIconCircle}>
                  <AppIcon name="sparkle" size={15} color={Colors.forestDark} />
                </View>
                <Text style={styles.trustPillarTitle}>Pediatric Infection Control</Text>
                <Text style={styles.trustPillarText}>
                  Hospital-grade sanitization across all our partnered clinic suites.
                </Text>
              </View>

              <View style={styles.trustPillar}>
                <View style={styles.trustIconCircle}>
                  <AppIcon name="chat" size={15} color={Colors.forestDark} />
                </View>
                <Text style={styles.trustPillarTitle}>Dedicated Care Concierge</Text>
                <Text style={styles.trustPillarText}>
                  Direct helpline support for appointment coordination, reminders, and triage.
                </Text>
              </View>
            </View>

            {/* Support Desk Bar */}
            <View style={styles.conciergeBar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.conciergeBarTitle}>
                  Appuge Healthcare Concierge
                </Text>
                <Text style={styles.conciergeBarSub}>
                  Mon–Sat 8:00 AM – 8:00 PM · Dedicated Bangalore Coordination
                </Text>
              </View>
              <TouchableOpacity
                style={styles.conciergeBarBtn}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    'Appuge Healthcare Concierge',
                    'Direct Desk: +91 80 4719 2200\nWhatsApp: +91 98450 12345\nEmail: care@appuge.com',
                    [{ text: 'Close' }],
                  )
                }>
                <Text style={styles.conciergeBarBtnText}>Contact Desk</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      )}

      {/* ── MODALS ── */}
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
  content: { paddingBottom: 40 },

  // Emergency banner
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FDF2E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5D7C9',
  },
  emergencyIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F7DDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  emergencyTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#A84B31',
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 10.5,
    color: '#6E4334',
    lineHeight: 15,
  },

  // Editorial Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  headerHeadline: {
    fontFamily: Fonts.serif,
    fontSize: 27,
    lineHeight: 33,
    color: Colors.forestDark,
    marginBottom: 6,
  },
  headerSupport: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  shortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.forestDark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shortcutText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FAF4EB',
    letterSpacing: 0.3,
  },

  // Hero Experience
  heroWrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 20,
  },
  heroCard: {
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.52)',
  },
  heroBadgeTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(250, 244, 235, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  heroBadgeTopText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.forestDark,
  },
  heroFloatingCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  heroFloatingTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    lineHeight: 21,
    color: Colors.forestDark,
    marginBottom: 10,
  },
  heroChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.terracotta,
    paddingVertical: 9,
    borderRadius: 12,
  },
  heroActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#FAF4EB',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.14)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 12.5,
    color: Colors.textMuted,
    marginLeft: 10,
  },
  searchActionArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionScroll: {
    gap: 8,
    paddingRight: 20,
  },
  suggestionPill: {
    backgroundColor: '#FAF4EB',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestDark,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 3,
  },
  sectionHeading: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.forestDark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  // Appointment Preview
  appointmentPreviewSection: {
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  appointmentCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.1)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44,64,53,0.06)',
    marginBottom: 12,
  },
  appointmentKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appointmentLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.terracotta,
  },
  appointmentKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.forestDark,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  appointmentDocImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FAF4EB',
  },
  appointmentDocName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: Colors.forestDark,
  },
  appointmentDocSpec: {
    fontSize: 11.5,
    color: Colors.sage,
    fontWeight: '600',
    marginBottom: 4,
  },
  appointmentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  appointmentTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  appointmentPatientText: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  appointmentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FAF4EB',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.1)',
  },
  appointmentActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  emptyAppointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAF4EB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.08)',
  },
  emptyIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAppointmentTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13.5,
    color: Colors.forestDark,
  },
  emptyAppointmentSub: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  emptyExploreBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  emptyExploreBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FAF4EB',
  },

  // Speciality Editorial Grid
  specialityEditorialGrid: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  specialityLeadCard: {
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
    marginBottom: 14,
  },
  specialityLeadImage: {
    width: '100%',
    height: '100%',
  },
  specialityImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.48)',
  },
  specialityContent: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
  },
  specialityKickerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(250, 244, 235, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  specialityKickerText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.forestDark,
  },
  specialityLeadTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: '#FFFDF9',
    marginBottom: 4,
  },
  specialityLeadDesc: {
    fontSize: 11.5,
    color: 'rgba(255, 253, 249, 0.88)',
    lineHeight: 16,
    marginBottom: 10,
  },
  specialityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specialityDoctorCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FAF4EB',
  },
  specialityCircleArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 253, 249, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialityRowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specialityGridCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  specialityCardThumb: {
    width: '100%',
    height: '100%',
  },
  specialityCardShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.55)',
  },
  specialityCardContent: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  specialityCardTag: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#D4A373',
    marginBottom: 2,
  },
  specialityCardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 14.5,
    color: '#FFFDF9',
    marginBottom: 2,
  },
  specialityCardCount: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255, 253, 249, 0.8)',
  },

  // Doctor Spotlight
  spotlightWrapper: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  spotlightCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.1)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  spotlightImageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightVerifiedBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  spotlightVerifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1B5E20',
    letterSpacing: 0.4,
  },
  spotlightExpBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(22,40,30,0.85)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  spotlightExpText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FAF4EB',
  },
  spotlightInfo: {
    padding: 18,
  },
  spotlightKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.terracotta,
    marginBottom: 4,
  },
  spotlightName: {
    fontFamily: Fonts.serif,
    fontSize: 21,
    color: Colors.forestDark,
    marginBottom: 2,
  },
  spotlightSpeciality: {
    fontSize: 12,
    color: Colors.sage,
    fontWeight: '600',
    marginBottom: 10,
  },
  spotlightQuoteBox: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.sage,
    marginBottom: 12,
  },
  spotlightQuote: {
    fontFamily: Fonts.serif,
    fontSize: 11.5,
    fontStyle: 'italic',
    color: Colors.forestDark,
    lineHeight: 16,
  },
  spotlightCredsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  spotlightCredText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  spotlightCredDivider: {
    color: Colors.textMuted,
  },
  spotlightFeeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  spotlightFeeCol: {
    flex: 1,
    alignItems: 'center',
  },
  spotlightFeeLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  spotlightFeeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  spotlightFeeSep: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(44,64,53,0.12)',
  },
  spotlightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  spotlightProfileBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightProfileBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  spotlightBookBtn: {
    flex: 1.3,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightBookBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FAF4EB',
  },

  // Family Journey Needs
  journeyScroll: {
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  journeyCard: {
    width: SCREEN_WIDTH * 0.65,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  journeyImage: {
    width: '100%',
    height: '100%',
  },
  journeyShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.58)',
  },
  journeyContent: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  journeyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,253,249,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  journeyBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  journeyKicker: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#D4A373',
    marginBottom: 2,
  },
  journeyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: '#FFFDF9',
    marginBottom: 4,
  },
  journeySub: {
    fontSize: 10.5,
    color: 'rgba(255,253,249,0.85)',
    lineHeight: 14,
    marginBottom: 8,
  },
  journeyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FAF4EB',
  },

  // Formats Container
  formatsContainer: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  formatCard: {
    height: 240,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  formatImage: {
    width: '100%',
    height: '100%',
  },
  formatCardShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.65)',
  },
  formatCardBody: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 16,
  },
  formatKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  formatKicker: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#D4A373',
  },
  formatTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: '#FFFDF9',
    marginBottom: 4,
  },
  formatDesc: {
    fontSize: 11,
    color: 'rgba(255,253,249,0.88)',
    lineHeight: 15,
    marginBottom: 8,
  },
  formatFeatures: {
    gap: 2,
    marginBottom: 10,
  },
  formatFeaturePoint: {
    fontSize: 10,
    color: '#FAF4EB',
    fontWeight: '600',
  },
  formatActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,253,249,0.18)',
  },
  formatPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FAF4EB',
  },
  formatBtn: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  formatBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FAF4EB',
  },

  // Doctors Directory
  doctorsDirectory: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 28,
  },
  editorialDoctorCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44,64,53,0.1)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  editorialDoctorTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
  },
  editorialDoctorPortrait: {
    width: 84,
    height: 98,
    borderRadius: 14,
    backgroundColor: '#EAEAEA',
  },
  editorialDoctorMeta: {
    flex: 1,
  },
  editorialVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  editorialVerifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1B5E20',
  },
  editorialDoctorName: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    color: Colors.forestDark,
    marginBottom: 2,
  },
  editorialDoctorSpeciality: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.sage,
    marginBottom: 4,
  },
  editorialDoctorHospital: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  editorialRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editorialRatingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  slotTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  slotTagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.forestDark,
  },
  editorialFeeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.06)',
    marginBottom: 12,
  },
  editorialFeeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  boldFee: {
    fontWeight: '800',
    color: Colors.forestDark,
  },
  editorialLocalityText: {
    fontSize: 10.5,
    color: Colors.sage,
    fontWeight: '600',
  },
  editorialCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editorialGhostBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorialGhostBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  editorialSolidBtn: {
    flex: 1.3,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorialSolidBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF4EB',
  },

  // Trust Section
  trustSection: {
    marginHorizontal: 20,
    backgroundColor: Colors.forestDark,
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
  },
  trustHeader: {
    marginBottom: 18,
  },
  trustEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#D4A373',
    marginBottom: 4,
  },
  trustTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: '#FFFDF9',
    marginBottom: 6,
  },
  trustSub: {
    fontSize: 12,
    color: 'rgba(255,253,249,0.75)',
    lineHeight: 17,
  },
  trustPillarsGrid: {
    gap: 14,
    marginBottom: 20,
  },
  trustPillar: {
    backgroundColor: 'rgba(255,253,249,0.06)',
    borderRadius: 14,
    padding: 14,
  },
  trustIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  trustPillarTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFDF9',
    marginBottom: 4,
  },
  trustPillarText: {
    fontSize: 11,
    color: 'rgba(255,253,249,0.75)',
    lineHeight: 15,
  },
  conciergeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,253,249,0.12)',
    borderRadius: 14,
    padding: 12,
  },
  conciergeBarTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FAF4EB',
    marginBottom: 2,
  },
  conciergeBarSub: {
    fontSize: 9.5,
    color: 'rgba(255,253,249,0.65)',
  },
  conciergeBarBtn: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  conciergeBarBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.forestDark,
  },
});
