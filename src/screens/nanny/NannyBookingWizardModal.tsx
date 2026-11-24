import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  NannyProfile,
  NannyBooking,
  ChildAgeGroup,
  calculateNannyBookingPrice,
} from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';

interface NannyBookingWizardModalProps {
  nanny: NannyProfile;
  visible: boolean;
  user?: { name: string; phone: string } | null;
  onClose: () => void;
  onBookingComplete: (booking: NannyBooking) => void;
  onOpenAuth?: () => void;
}

export const NannyBookingWizardModal: React.FC<NannyBookingWizardModalProps> = ({
  nanny,
  visible,
  user,
  onClose,
  onBookingComplete,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [hoursPerDay, setHoursPerDay] = useState(nanny.minimumHours || 4);
  const [daysCount, setDaysCount] = useState(3);
  const [childAgeGroup, setChildAgeGroup] = useState<ChildAgeGroup>(
    nanny.supportedAgeGroups[0] || 'Newborn (0 - 3 months)',
  );
  const [notes, setNotes] = useState('');
  const [locality, setLocality] = useState('Indiranagar');
  const [address, setAddress] = useState(
    'Flat 402, Shanthi Niketan, 12th Main, Indiranagar, Bengaluru - 560038',
  );
  const [parentName, setParentName] = useState(user?.name || 'Ananya Sharma');
  const [parentPhone, setParentPhone] = useState(user?.phone || '+91 98860 12345');

  const pricing = calculateNannyBookingPrice(
    nanny.hourlyRate,
    hoursPerDay,
    daysCount,
  );

  const handleSubmit = () => {
    if (!parentName.trim() || !parentPhone.trim() || !address.trim()) {
      Alert.alert('Required Fields', 'Please provide contact name, phone, and delivery address.');
      return;
    }

    const newBooking: NannyBooking = {
      id: `nbk-${Date.now()}`,
      bookingNumber: `APG-CARE-${Math.floor(1000 + Math.random() * 9000)}`,
      parentId: user ? 'usr-auth' : 'usr-demo',
      parentName,
      parentPhone,
      nannyId: nanny.id,
      nannyName: nanny.fullName,
      nannyPhoto: nanny.photo,
      childAgeGroup,
      serviceArea: locality,
      serviceAddress: address,
      startDateText: 'Starting Tomorrow, 9:00 AM',
      dailyHours: hoursPerDay,
      daysCount,
      hourlyRateApplied: nanny.hourlyRate,
      subtotal: pricing.subtotal,
      platformServiceFee: pricing.platformServiceFee,
      taxes: pricing.taxes,
      totalAmount: pricing.totalAmount,
      status: 'REQUESTED',
      statusColor: '#E8A020',
      notes,
      createdAt: 'Just now',
    };

    Alert.alert(
      '🎉 Care Request Submitted!',
      `Booking request ${newBooking.bookingNumber} for ${nanny.fullName} has been created and sent to Appuge Operations for schedule verification.`,
      [{ text: 'View Bookings', onPress: () => onBookingComplete(newBooking) }],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕ Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Care · Step {step}/4</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Step Indicator */}
        <View style={styles.stepTrack}>
          {[1, 2, 3, 4].map(s => (
            <View
              key={s}
              style={[
                styles.stepSegment,
                s <= step && styles.stepSegmentActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* STEP 1: SCHEDULE */}
          {step === 1 && (
            <View style={styles.stepBox}>
              <Text style={styles.stepKicker}>STEP 1 OF 4</Text>
              <Text style={styles.stepHeading}>Schedule & Duration</Text>
              <Text style={styles.stepSub}>
                Selected Caregiver: <Text style={styles.bold}>{nanny.fullName}</Text> (₹{nanny.hourlyRate}/hr)
              </Text>

              <Text style={styles.fieldLabel}>DAILY HOURS</Text>
              <View style={styles.optionsRow}>
                {[4, 6, 8, 10].map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.optionChip,
                      hoursPerDay === h && styles.optionChipActive,
                      h < nanny.minimumHours && styles.optionChipDisabled,
                    ]}
                    onPress={() => h >= nanny.minimumHours && setHoursPerDay(h)}
                    disabled={h < nanny.minimumHours}>
                    <Text
                      style={[
                        styles.optionChipText,
                        hoursPerDay === h && styles.optionChipTextActive,
                      ]}>
                      {h} hrs/day
                    </Text>
                    {h < nanny.minimumHours && (
                      <Text style={styles.minNote}>Below min</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>BOOKING DURATION</Text>
              <View style={styles.optionsRow}>
                {[1, 3, 7, 14, 21].map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.optionChip,
                      daysCount === d && styles.optionChipActive,
                    ]}
                    onPress={() => setDaysCount(d)}>
                    <Text
                      style={[
                        styles.optionChipText,
                        daysCount === d && styles.optionChipTextActive,
                      ]}>
                      {d} {d === 1 ? 'day' : 'days'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.calculatedNote}>
                <AppIcon name="clock" size={14} color={Colors.sage} />
                <Text style={styles.calculatedText}>
                  Total commitment: {hoursPerDay * daysCount} hours over {daysCount} days
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2: CHILD DETAILS */}
          {step === 2 && (
            <View style={styles.stepBox}>
              <Text style={styles.stepKicker}>STEP 2 OF 4</Text>
              <Text style={styles.stepHeading}>Child & Care Needs</Text>
              <Text style={styles.stepSub}>
                Help {nanny.fullName.split(' ')[0]} prepare for your family's routine.
              </Text>

              <Text style={styles.fieldLabel}>CHILD AGE GROUP</Text>
              <View style={styles.verticalOptions}>
                {nanny.supportedAgeGroups.map(ag => (
                  <TouchableOpacity
                    key={ag}
                    style={[
                      styles.radioOption,
                      childAgeGroup === ag && styles.radioOptionActive,
                    ]}
                    onPress={() => setChildAgeGroup(ag)}>
                    <View
                      style={[
                        styles.radioCircle,
                        childAgeGroup === ag && styles.radioCircleActive,
                      ]}
                    />
                    <Text style={styles.radioText}>{ag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>SPECIAL ROUTINE / NOTES</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="E.g., Baby likes morning abhyanga around 10am; formula feeding after nap; gentle nap routine..."
                placeholderTextColor={Colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          )}

          {/* STEP 3: ADDRESS & CONTACT */}
          {step === 3 && (
            <View style={styles.stepBox}>
              <Text style={styles.stepKicker}>STEP 3 OF 4</Text>
              <Text style={styles.stepHeading}>Location & Contact</Text>
              <Text style={styles.stepSub}>
                Care is provided at your residence in Bangalore.
              </Text>

              <Text style={styles.fieldLabel}>PARENT / GUARDIAN NAME</Text>
              <TextInput
                style={styles.textInput}
                value={parentName}
                onChangeText={setParentName}
                placeholder="Full Name"
              />

              <Text style={styles.fieldLabel}>CONTACT PHONE</Text>
              <TextInput
                style={styles.textInput}
                value={parentPhone}
                onChangeText={setParentPhone}
                placeholder="+91 98860 XXXXX"
                keyboardType="phone-pad"
              />

              <Text style={styles.fieldLabel}>SERVICE LOCALITY</Text>
              <TextInput
                style={styles.textInput}
                value={locality}
                onChangeText={setLocality}
                placeholder="Indiranagar, Koramangala..."
              />

              <Text style={styles.fieldLabel}>FULL ADDRESS</Text>
              <TextInput
                style={[styles.textInput, { height: 70 }]}
                multiline
                value={address}
                onChangeText={setAddress}
                placeholder="Apartment, Flat No, Street, Pincode"
              />
            </View>
          )}

          {/* STEP 4: SUMMARY & PRICE */}
          {step === 4 && (
            <View style={styles.stepBox}>
              <Text style={styles.stepKicker}>STEP 4 OF 4</Text>
              <Text style={styles.stepHeading}>Review & Transparent Pricing</Text>

              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Caregiver</Text>
                  <Text style={styles.summaryVal}>{nanny.fullName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Schedule</Text>
                  <Text style={styles.summaryVal}>
                    {daysCount} days · {hoursPerDay} hrs/day ({hoursPerDay * daysCount} hrs total)
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Child</Text>
                  <Text style={styles.summaryVal}>{childAgeGroup}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location</Text>
                  <Text style={styles.summaryVal} numberOfLines={1}>{locality}</Text>
                </View>
              </View>

              {/* Price Breakdown */}
              <Text style={styles.fieldLabel}>TRANSPARENT BREAKDOWN</Text>
              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Caregiver Rate (₹{nanny.hourlyRate} × {hoursPerDay * daysCount} hrs)
                  </Text>
                  <Text style={styles.priceValue}>₹{pricing.subtotal.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Appuge Managed Fee (5% verification & support)
                  </Text>
                  <Text style={styles.priceValue}>
                    ₹{pricing.platformServiceFee.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Taxes & GST (5%)</Text>
                  <Text style={styles.priceValue}>₹{pricing.taxes.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.priceRow, styles.priceTotalRow]}>
                  <Text style={styles.priceTotalLabel}>Total Amount</Text>
                  <Text style={styles.priceTotalValue}>
                    ₹{pricing.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeTitle}>✦ DEMO EXPERIENCE</Text>
                <Text style={styles.demoNoticeText}>
                  No payment gateway is currently charged. Appuge Operations will verify caregiver availability and confirm your booking.
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          {step > 1 ? (
            <TouchableOpacity
              style={styles.prevBtn}
              onPress={() => setStep((step - 1) as any)}>
              <Text style={styles.prevBtnText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {step < 4 ? (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setStep((step + 1) as any)}>
              <Text style={styles.nextBtnText}>Continue →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Care Request</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  header: {
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    height: Platform.OS === 'android' ? 68 : 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: '#FFFDF9',
  },
  closeBtn: { paddingVertical: 6 },
  closeText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.forestDark,
  },

  stepTrack: { flexDirection: 'row', height: 4, backgroundColor: '#EAE2D5' },
  stepSegment: { flex: 1, height: '100%', backgroundColor: 'transparent' },
  stepSegmentActive: { backgroundColor: Colors.terracotta },

  scroll: { flex: 1 },
  content: { padding: 20 },
  stepBox: { gap: 12 },
  stepKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
  },
  stepHeading: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Colors.forestDark,
  },
  stepSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  bold: { fontWeight: '700', color: Colors.forestDark },

  fieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginTop: 10,
  },

  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    minWidth: 80,
    alignItems: 'center',
  },
  optionChipActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  optionChipDisabled: { opacity: 0.4 },
  optionChipText: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  optionChipTextActive: { color: '#FAF4EB' },
  minNote: { fontSize: 8, color: Colors.terracotta, marginTop: 2 },

  calculatedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.sagePale,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  calculatedText: { fontSize: 12, color: Colors.forestDark, fontWeight: '600' },

  verticalOptions: { gap: 8 },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFDF9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  radioOptionActive: {
    borderColor: Colors.terracotta,
    backgroundColor: '#FFFDF9',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  radioCircleActive: {
    borderColor: Colors.terracotta,
    backgroundColor: Colors.terracotta,
  },
  radioText: { fontSize: 13, color: Colors.forestDark, fontWeight: '600' },

  textInput: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.forestDark,
  },
  textArea: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.forestDark,
    textAlignVertical: 'top',
    height: 90,
  },

  summaryCard: {
    backgroundColor: Colors.cream,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 12, color: Colors.textMuted },
  summaryVal: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },

  priceBreakdown: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    gap: 10,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 12, color: Colors.textSecondary },
  priceValue: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  priceTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 8,
    marginTop: 4,
  },
  priceTotalLabel: { fontSize: 14, fontWeight: '800', color: Colors.forestDark },
  priceTotalValue: { fontSize: 17, fontWeight: '800', color: Colors.forestDark },

  demoNotice: {
    backgroundColor: Colors.sagePale,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  demoNoticeTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.sage,
    letterSpacing: 0.8,
  },
  demoNoticeText: {
    fontSize: 11,
    color: Colors.forestDark,
    marginTop: 2,
    lineHeight: 16,
  },

  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 50 : 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  prevBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  prevBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  nextBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  nextBtnText: { fontSize: 13, fontWeight: '800', color: '#FAF4EB' },
  submitBtn: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFDF9' },
});
