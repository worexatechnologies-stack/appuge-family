import React from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CareMatchingOutput, DoctorMatchResult } from '../../../types/careQuestionnaire.types';
import { DoctorProfile } from '../../../data/doctorsData';

interface Props {
  visible: boolean;
  output: CareMatchingOutput | null;
  onClose: () => void;
  onRetake: () => void;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
}

export const PersonalizedDoctorResultsModal: React.FC<Props> = ({
  visible,
  output,
  onClose,
  onRetake,
  onSelectDoctor,
  onBookDoctor,
}) => {
  if (!output) return null;

  const { matches, answersSummary, hasEmergencyNotice } = output;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.headerIconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.headerIconText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerKicker}>APPUGE MATCHED CARE</Text>
            <Text style={styles.headerTitle}>Doctors selected for you</Text>
          </View>

          <TouchableOpacity
            onPress={onRetake}
            style={styles.retakeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Emergency Safety Banner if applicable */}
          {hasEmergencyNotice && (
            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyIcon}>⚠️</Text>
              <View style={styles.emergencyTextCol}>
                <Text style={styles.emergencyTitle}>HIGH PRIORITY SAFETY NOTICE</Text>
                <Text style={styles.emergencyDesc}>
                  If your infant or child has acute difficulty breathing, high fever above
                  102°F, or is lethargic/unresponsive, seek immediate in-person emergency care
                  at the nearest hospital or call 112 / 108.
                </Text>
              </View>
            </View>
          )}

          {/* Rationale Card */}
          <View style={styles.rationaleCard}>
            <View style={styles.rationaleBadgeRow}>
              <Text style={styles.rationaleBadge}>RECOMMENDED SPECIALISTS</Text>
              <View style={styles.matchCountBadge}>
                <Text style={styles.matchCount}>
                  {matches.length} {matches.length === 1 ? 'Doctor' : 'Doctors'} Matched
                </Text>
              </View>
            </View>

            <Text style={styles.rationaleHeadline}>
              Care for {answersSummary.recipientLabel} • {answersSummary.focusLabel}
            </Text>
            <Text style={styles.rationaleSub}>
              Filtered by: {answersSummary.stageOrAgeLabel} | {answersSummary.modalityLabel} |{' '}
              {answersSummary.localityLabel}
            </Text>
            <Text style={styles.rationaleDesc}>
              Our clinical matching engine selected verified doctors registered with the medical
              council who specialize directly in these needs.
            </Text>
          </View>

          {/* Empty State if no matches */}
          {matches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🩺</Text>
              <Text style={styles.emptyTitle}>No exact match found</Text>
              <Text style={styles.emptySubtitle}>
                We couldn't find a doctor strictly matching all your specific filters in that
                location. Try broadening your location preference to "Any Location" or allowing
                both Online & In-Clinic consultations.
              </Text>

              <TouchableOpacity
                style={styles.emptyActionBtn}
                activeOpacity={0.88}
                onPress={onRetake}>
                <Text style={styles.emptyActionText}>Adjust Preferences</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.doctorList}>
              {matches.map(({ doctor, matchScore, matchReasons, primaryHighlight }: DoctorMatchResult) => {
                const nextSlot =
                  doctor.availability?.[0]?.slots?.find((s: { available: boolean; time: string }) => s.available)?.time || 'Next slot available';

                return (
                  <View key={doctor.id} style={styles.doctorCard}>
                    {/* Top Row: Match Score + Primary Highlight */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.highlightPill}>
                        <Text style={styles.highlightText}>{primaryHighlight}</Text>
                      </View>
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>★ {matchScore}% MATCH</Text>
                      </View>
                    </View>

                    {/* Doctor Info Row */}
                    <View style={styles.doctorInfoRow}>
                      <Image
                        source={doctor.profileImage}
                        style={styles.doctorAvatar}
                        resizeMode="cover"
                      />
                      <View style={styles.doctorMetaCol}>
                        <Text style={styles.doctorName}>{doctor.fullName}</Text>
                        <Text style={styles.doctorSpeciality}>
                          {doctor.specialityTitle}
                        </Text>
                        <Text style={styles.doctorExp}>
                          {doctor.experienceYears} Years Experience • {doctor.rating} ★ (
                          {doctor.reviewsCount} reviews)
                        </Text>
                        <View style={styles.verifiedRow}>
                          <Text style={styles.verifiedIcon}>✓</Text>
                          <Text style={styles.verifiedText}>
                            {doctor.medicalRegistration.council} Verified (
                            {doctor.medicalRegistration.registrationNumber})
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Reasons List */}
                    <View style={styles.reasonsBox}>
                      <Text style={styles.reasonsHeading}>Why this match:</Text>
                      {matchReasons.map((reason: string, idx: number) => (
                        <View key={idx} style={styles.reasonItem}>
                          <Text style={styles.reasonCheck}>✓</Text>
                          <Text style={styles.reasonText}>{reason}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Fees & Slot Row */}
                    <View style={styles.feesSlotRow}>
                      <View>
                        <Text style={styles.feeLabel}>CONSULTATION FEE</Text>
                        <Text style={styles.feeValue}>
                          ₹{doctor.onlineFee} (Online) / ₹{doctor.inClinicFee} (Clinic)
                        </Text>
                      </View>
                      <View style={styles.slotPill}>
                        <Text style={styles.slotText}>⏱ Next: {nextSlot}</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.outlineActionBtn}
                        activeOpacity={0.88}
                        onPress={() => onSelectDoctor(doctor)}>
                        <Text style={styles.outlineActionText}>View Profile</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.filledActionBtn}
                        activeOpacity={0.88}
                        onPress={() => onBookDoctor(doctor)}>
                        <Text style={styles.filledActionText}>Book Slot →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    paddingTop: Platform.OS === 'android' ? 42 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
    backgroundColor: '#FFFDF9',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 16,
    color: '#16281E',
    fontWeight: '700',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerKicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  retakeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FAF4EB',
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C86D51',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  emergencyCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF2F0',
    borderWidth: 1,
    borderColor: '#E8A398',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  emergencyTextCol: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#C86D51',
    marginBottom: 4,
  },
  emergencyDesc: {
    fontSize: 12,
    color: '#8A2B18',
    lineHeight: 17,
    fontWeight: '500',
  },
  rationaleCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  rationaleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rationaleBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    flex: 1,
  },
  matchCountBadge: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2C4035',
  },
  rationaleHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  rationaleSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5E7A63',
    marginBottom: 6,
  },
  rationaleDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActionBtn: {
    backgroundColor: '#16281E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  doctorList: {
    gap: 18,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECE6DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightPill: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '65%',
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C4035',
  },
  scoreBadge: {
    backgroundColor: '#FDF4E7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3D8B0',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9C6315',
  },
  doctorInfoRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0ECE4',
    marginRight: 14,
  },
  doctorMetaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  doctorSpeciality: {
    fontSize: 12,
    color: '#5E7A63',
    fontWeight: '600',
    marginBottom: 4,
  },
  doctorExp: {
    fontSize: 11,
    color: '#777',
    marginBottom: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
  },
  reasonsBox: {
    backgroundColor: '#FDFBF7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3EDE2',
  },
  reasonsHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6239',
    marginBottom: 6,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  reasonCheck: {
    fontSize: 11,
    color: '#2C4035',
    fontWeight: '700',
    marginRight: 6,
    marginTop: 1,
  },
  reasonText: {
    fontSize: 12,
    color: '#444',
    flex: 1,
    lineHeight: 16,
  },
  feesSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0ECE4',
    marginBottom: 14,
  },
  feeLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#999',
    marginBottom: 2,
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  slotPill: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  slotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C4035',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  filledActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  filledActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFDF9',
  },
});
