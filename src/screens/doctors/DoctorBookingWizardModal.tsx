import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  DoctorProfile,
  DoctorAppointment,
  ConsultationType,
  calculateDoctorAppointmentPrice,
} from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';

interface DoctorBookingWizardModalProps {
  doctor: DoctorProfile | null;
  visible: boolean;
  onClose: () => void;
  onBookingSubmitted: (booking: DoctorAppointment) => void;
  user?: { name: string; phone: string } | null;
}

type PatientCategory = 'Mother' | 'Baby' | 'Child' | 'Family';

export const DoctorBookingWizardModal: React.FC<DoctorBookingWizardModalProps> = ({
  doctor,
  visible,
  onClose,
  onBookingSubmitted,
  user,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Consultation Type
  const [consultationType, setConsultationType] = useState<ConsultationType>('ONLINE');

  // Step 2: Date & Slot
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Step 3: Patient Information
  const [patientType, setPatientType] = useState<PatientCategory>('Baby');
  const [patientName, setPatientName] = useState(user?.name ? `${user.name.split(' ')[0]}'s Baby` : '');
  const [patientAge, setPatientAge] = useState('4 months old');
  const [reason, setReason] = useState('Routine check-up & gentle sleep routine assessment.');
  const [contactPhone, setContactPhone] = useState(user?.phone || '98450 12345');

  // Confirmation state
  const [createdAppointment, setCreatedAppointment] = useState<DoctorAppointment | null>(null);

  if (!doctor) return null;

  const currentAvailability = doctor.availability[selectedDateIdx] || doctor.availability[0];
  const feeApplied = consultationType === 'ONLINE' ? doctor.onlineFee : doctor.inClinicFee;
  const pricing = calculateDoctorAppointmentPrice(feeApplied);

  const resetState = () => {
    setStep(1);
    setSelectedSlot('');
    setCreatedAppointment(null);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!selectedSlot) {
        Alert.alert('Please Select a Time Slot', 'Choose an available appointment window to proceed.');
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (!patientName.trim()) {
        Alert.alert('Patient Name Required', 'Please enter the patient’s name.');
        return;
      }
      setStep(4);
      return;
    }
    if (step === 4) {
      // Create new appointment in REQUESTED status
      const refNum = `APG-DOC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: DoctorAppointment = {
        id: `apt-${Date.now()}`,
        appointmentReference: refNum,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        doctorSpeciality: doctor.specialityTitle,
        doctorImage: doctor.profileImage,
        consultationType,
        appointmentDate: currentAvailability.displayDate,
        appointmentTime: selectedSlot,
        patientType,
        patientName: patientName.trim(),
        patientAgeOrDob: patientAge.trim(),
        reasonForVisit: reason.trim(),
        clinicName: consultationType === 'IN_CLINIC' ? doctor.clinic.name : undefined,
        clinicAddress: consultationType === 'IN_CLINIC' ? doctor.clinic.address : undefined,
        consultationFee: pricing.consultationFee,
        platformFee: pricing.platformFee,
        taxes: pricing.taxes,
        totalAmount: pricing.totalAmount,
        status: 'REQUESTED',
        statusColor: '#C86D51',
        createdAt: 'Just now',
        timeline: [
          {
            status: 'REQUESTED',
            title: 'Appointment Requested',
            desc: 'Your request is submitted to the clinical scheduling desk.',
            timestamp: 'Just now',
            completed: true,
            active: true,
          },
          {
            status: 'ACCEPTED',
            title: 'Doctor Acceptance',
            desc: `${doctor.fullName} reviews your notes and confirms availability.`,
            timestamp: 'Pending',
            completed: false,
            active: false,
          },
          {
            status: 'CONFIRMED',
            title: 'Appointment Confirmed',
            desc: consultationType === 'ONLINE' ? 'Private HD video link issued.' : 'In-clinic slot secured.',
            timestamp: 'Pending confirmation',
            completed: false,
            active: false,
          },
        ],
        onlinePrepNote:
          consultationType === 'ONLINE'
            ? 'Private meeting link will activate 15 minutes before your scheduled slot once confirmed.'
            : undefined,
      };

      setCreatedAppointment(newBooking);
      setStep(5);
      onBookingSubmitted(newBooking);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <View style={styles.root}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityLabel="Close booking">
            <AppIcon name="close" size={16} color={Colors.forestDark} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>
            {step === 5 ? 'Booking Request Placed' : `Book Appointment · Step ${step} of 4`}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* STEP 1: CONSULTATION TYPE */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 01 OF 04 · CONSULTATION FORMAT</Text>
              <Text style={styles.stepTitle}>How would you like to consult?</Text>
              <Text style={styles.stepSub}>
                Choose between secure video consultation from home or visiting the doctor’s verified clinic in Bengaluru.
              </Text>

              {/* Online Option */}
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  consultationType === 'ONLINE' && styles.typeCardSelected,
                ]}
                activeOpacity={0.85}
                onPress={() => setConsultationType('ONLINE')}>
                <View style={styles.typeIconWrap}>
                  <AppIcon name="chat" size={20} color={consultationType === 'ONLINE' ? Colors.forestDark : Colors.sage} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.typeTitleRow}>
                    <Text style={styles.typeTitle}>Online Video Consultation</Text>
                    <Text style={styles.typeFee}>₹{doctor.onlineFee}</Text>
                  </View>
                  <Text style={styles.typeDesc}>
                    30-minute private HD video call from home. Ideal for follow-ups, feeding guidance, and general check-ups.
                  </Text>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeTagText}>✓ Instant Meeting Access on Confirmation</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* In-Clinic Option */}
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  consultationType === 'IN_CLINIC' && styles.typeCardSelected,
                  { marginTop: 14 },
                ]}
                activeOpacity={0.85}
                onPress={() => setConsultationType('IN_CLINIC')}>
                <View style={styles.typeIconWrap}>
                  <AppIcon name="location" size={20} color={consultationType === 'IN_CLINIC' ? Colors.forestDark : Colors.sage} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.typeTitleRow}>
                    <Text style={styles.typeTitle}>In-Clinic Consultation</Text>
                    <Text style={styles.typeFee}>₹{doctor.inClinicFee}</Text>
                  </View>
                  <Text style={styles.typeDesc}>{doctor.clinic.name}</Text>
                  <Text style={styles.clinicAddressSmall}>{doctor.clinic.address}</Text>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeTagText}>✓ Verified Sanitation & Safe Clinic Environment</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 02 OF 04 · DATE & TIME</Text>
              <Text style={styles.stepTitle}>Choose consultation slot</Text>
              <Text style={styles.stepSub}>
                Slots are managed in real-time according to {doctor.fullName}'s clinical schedule.
              </Text>

              {/* Date Selector Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateList}>
                {doctor.availability.map((avail, idx) => (
                  <TouchableOpacity
                    key={avail.date}
                    style={[
                      styles.datePill,
                      selectedDateIdx === idx && styles.datePillSelected,
                    ]}
                    onPress={() => {
                      setSelectedDateIdx(idx);
                      setSelectedSlot('');
                    }}>
                    <Text
                      style={[
                        styles.dateDayLabel,
                        selectedDateIdx === idx && styles.dateTextSelected,
                      ]}>
                      {avail.dayLabel}
                    </Text>
                    <Text
                      style={[
                        styles.dateValue,
                        selectedDateIdx === idx && styles.dateTextSelected,
                      ]}>
                      {avail.displayDate.split(', ')[1]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Slots Grid */}
              <Text style={styles.slotsHeader}>Available Time Slots</Text>
              <View style={styles.slotsGrid}>
                {currentAvailability.slots.map(slot => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <TouchableOpacity
                      key={slot.time}
                      disabled={!slot.available}
                      style={[
                        styles.slotBtn,
                        isSelected && styles.slotBtnSelected,
                        !slot.available && styles.slotBtnDisabled,
                      ]}
                      onPress={() => setSelectedSlot(slot.time)}>
                      <Text
                        style={[
                          styles.slotTimeText,
                          isSelected && styles.slotTimeSelected,
                          !slot.available && styles.slotTimeDisabled,
                        ]}>
                        {slot.time}
                      </Text>
                      <Text
                        style={[
                          styles.slotPeriodText,
                          isSelected && styles.slotPeriodSelected,
                          !slot.available && styles.slotPeriodDisabled,
                        ]}>
                        {slot.available ? slot.period : 'Booked'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: PATIENT INFORMATION */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 03 OF 04 · PATIENT INFORMATION</Text>
              <Text style={styles.stepTitle}>Who is this appointment for?</Text>
              <Text style={styles.stepSub}>
                We collect only essential details to prepare the doctor for a focused, compassionate consultation.
              </Text>

              {/* Patient Category Pills */}
              <View style={styles.patientPillRow}>
                {(['Baby', 'Mother', 'Child', 'Family'] as PatientCategory[]).map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.patientPill,
                      patientType === cat && styles.patientPillSelected,
                    ]}
                    onPress={() => setPatientType(cat)}>
                    <Text
                      style={[
                        styles.patientPillText,
                        patientType === cat && styles.patientPillTextSelected,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Patient Name</Text>
              <TextInput
                style={styles.textInput}
                value={patientName}
                onChangeText={setPatientName}
                placeholder="e.g. Aarav Sharma"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.inputLabel}>Patient Age / Date of Birth</Text>
              <TextInput
                style={styles.textInput}
                value={patientAge}
                onChangeText={setPatientAge}
                placeholder="e.g. 4 months old or 12 July 2026"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.inputLabel}>Contact Phone (For Appointment SMS)</Text>
              <TextInput
                style={styles.textInput}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                placeholder="10-digit mobile number"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.inputLabel}>Primary Concern / Reason for Visit</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                placeholder="Briefly describe any symptoms, routine concerns, or feeding questions..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          )}

          {/* STEP 4: REVIEW & PRICING */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 04 OF 04 · APPOINTMENT SUMMARY</Text>
              <Text style={styles.stepTitle}>Review your appointment</Text>
              <Text style={styles.stepSub}>
                Your request will be submitted to Appuge Clinical Desk. No fee is charged in this demo mode.
              </Text>

              {/* Appointment Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Doctor</Text>
                  <Text style={styles.summaryVal}>{doctor.fullName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Speciality</Text>
                  <Text style={styles.summaryVal}>{doctor.specialityTitle.split(' & ')[0]}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Consultation Format</Text>
                  <Text style={styles.summaryVal}>
                    {consultationType === 'ONLINE' ? 'Private Video Consult' : 'In-Clinic Appointment'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Scheduled Slot</Text>
                  <Text style={styles.summaryVal}>
                    {currentAvailability.displayDate} at {selectedSlot}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Patient</Text>
                  <Text style={styles.summaryVal}>
                    {patientName} ({patientType}, {patientAge})
                  </Text>
                </View>
                {consultationType === 'IN_CLINIC' && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Clinic Location</Text>
                    <Text style={styles.summaryVal}>{doctor.clinic.name}</Text>
                  </View>
                )}
              </View>

              {/* Transparent Pricing Table */}
              <View style={styles.priceCard}>
                <Text style={styles.priceHeading}>Fee Breakdown</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Consultation Fee</Text>
                  <Text style={styles.priceValue}>₹{pricing.consultationFee}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Platform Coordination (5%)</Text>
                  <Text style={styles.priceValue}>₹{pricing.platformFee}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Applicable GST (5%)</Text>
                  <Text style={styles.priceValue}>₹{pricing.taxes}</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>₹{pricing.totalAmount}</Text>
                </View>
              </View>

              <View style={styles.demoDisclaimerBox}>
                <Text style={styles.demoDisclaimerText}>
                  ✦ Demonstration Mode: This booking request is placed into Appuge Managed Appointments with initial status "REQUESTED". No payment is processed.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 5: CONFIRMATION */}
          {step === 5 && createdAppointment && (
            <View style={styles.confirmationContainer}>
              <View style={styles.confirmIconWrap}>
                <AppIcon name="check" size={32} color="#1B5E20" />
              </View>
              <Text style={styles.confirmTitle}>Appointment Requested!</Text>
              <Text style={styles.confirmRef}>
                Reference: {createdAppointment.appointmentReference}
              </Text>
              <Text style={styles.confirmSub}>
                Your request has been routed to {doctor.fullName}’s clinical desk. You will receive an SMS update once accepted.
              </Text>

              <View style={styles.confirmSummaryCard}>
                <Text style={styles.confirmDoctor}>{doctor.fullName}</Text>
                <Text style={styles.confirmSlot}>
                  {createdAppointment.appointmentDate} · {createdAppointment.appointmentTime}
                </Text>
                <Text style={styles.confirmType}>
                  {createdAppointment.consultationType === 'ONLINE'
                    ? '💻 Online Private Video Consultation'
                    : `🏥 In-Clinic at ${doctor.clinic.name}`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                activeOpacity={0.88}
                onPress={handleClose}>
                <Text style={styles.doneBtnText}>View in My Appointments</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Buttons for Steps 1-4 */}
        {step < 5 && (
          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.prevBtn}
                onPress={() => setStep((step - 1) as any)}>
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, step === 1 && { flex: 1 }]}
              onPress={handleNext}
              activeOpacity={0.88}>
              <Text style={styles.nextBtnText}>
                {step === 4 ? 'Submit Booking Request →' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    fontSize: 14,
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

  stepContainer: { paddingHorizontal: 20, paddingTop: 18 },
  stepEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 6,
  },
  stepTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.forestDark,
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 20,
  },

  // Step 1: Type Card
  typeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    padding: 16,
    gap: 14,
  },
  typeCardSelected: {
    borderColor: Colors.forestDark,
    backgroundColor: '#FAF4EB',
  },
  typeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  typeTitle: { fontSize: 14, fontWeight: '800', color: Colors.forestDark },
  typeFee: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },
  typeDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: 8 },
  clinicAddressSmall: { fontSize: 10, color: Colors.textMuted, marginBottom: 8 },
  typeTag: {
    backgroundColor: 'rgba(94, 122, 99, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeTagText: { fontSize: 9, fontWeight: '700', color: Colors.forestDark },

  // Step 2: Date & Slot
  dateList: { gap: 10, paddingVertical: 6, marginBottom: 20 },
  datePill: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
    alignItems: 'center',
    minWidth: 80,
  },
  datePillSelected: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  dateDayLabel: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, marginBottom: 4 },
  dateValue: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },
  dateTextSelected: { color: '#FFFDF9' },

  slotsHeader: { fontSize: 12, fontWeight: '800', color: Colors.forestDark, marginBottom: 12 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBtn: {
    width: '30%',
    backgroundColor: '#FFFDF9',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
    alignItems: 'center',
  },
  slotBtnSelected: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  slotBtnDisabled: {
    backgroundColor: 'rgba(44, 64, 53, 0.04)',
    borderColor: 'rgba(44, 64, 53, 0.06)',
    opacity: 0.5,
  },
  slotTimeText: { fontSize: 12, fontWeight: '800', color: Colors.forestDark },
  slotTimeSelected: { color: '#FFFDF9' },
  slotTimeDisabled: { color: Colors.textMuted },
  slotPeriodText: { fontSize: 8, color: Colors.textMuted, marginTop: 2, fontWeight: '700' },
  slotPeriodSelected: { color: 'rgba(255, 253, 249, 0.7)' },
  slotPeriodDisabled: { color: Colors.textMuted },

  // Step 3: Patient
  patientPillRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  patientPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
  },
  patientPillSelected: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  patientPillText: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  patientPillTextSelected: { color: '#FFFDF9' },

  inputLabel: { fontSize: 11, fontWeight: '800', color: Colors.forestDark, marginBottom: 6, marginTop: 10 },
  textInput: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.forestDark,
  },
  textArea: { height: 72, textAlignVertical: 'top' },

  // Step 4: Summary
  summaryCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.05)',
  },
  summaryKey: { fontSize: 11, color: Colors.textSecondary },
  summaryVal: { fontSize: 11, fontWeight: '700', color: Colors.forestDark, maxWidth: '60%', textAlign: 'right' },

  priceCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    marginBottom: 14,
  },
  priceHeading: { fontSize: 11, fontWeight: '800', color: Colors.forestDark, marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { fontSize: 11, color: Colors.textSecondary },
  priceValue: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.1)',
    paddingTop: 8,
    marginTop: 6,
  },
  totalLabel: { fontSize: 13, fontWeight: '800', color: Colors.forestDark },
  totalValue: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },

  demoDisclaimerBox: {
    backgroundColor: 'rgba(200, 109, 81, 0.08)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.terracotta,
  },
  demoDisclaimerText: { fontSize: 10, color: Colors.terracotta, lineHeight: 15 },

  // Step 5: Confirmation
  confirmationContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF2EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.forestDark,
    marginBottom: 6,
  },
  confirmRef: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.sage,
    marginBottom: 12,
  },
  confirmSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  confirmSummaryCard: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
    marginBottom: 28,
  },
  confirmDoctor: { fontSize: 15, fontWeight: '800', color: Colors.forestDark, marginBottom: 4 },
  confirmSlot: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  confirmType: { fontSize: 11, color: Colors.sage, fontWeight: '600' },
  doneBtn: {
    width: '100%',
    backgroundColor: Colors.forestDark,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFDF9' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 36 : 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.08)',
    elevation: 20,
  },
  prevBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnText: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },
  nextBtn: {
    flex: 1,
    backgroundColor: Colors.forestDark,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFDF9' },
});
