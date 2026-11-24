import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ConciergeResultsData, RecommendedDoctor } from '../../../types/careConcierge.types';
import { DoctorProfile } from '../../../data/doctorsData';

interface Props {
  results: ConciergeResultsData;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
  onAdjustPreferences: () => void;
}

export const CareConciergeResults: React.FC<Props> = ({
  results,
  onSelectDoctor,
  onBookDoctor,
  onAdjustPreferences,
}) => {
  const [showAllMatches, setShowAllMatches] = useState(false);
  const { featured, secondary, additionalCount, whyExplanation, modalityLabel, hasUrgentWarning, urgentWarningMessage } =
    results;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Your recommended specialists</Text>
          <Text style={styles.subtitle}>
            Selected based on the care you're looking for.
          </Text>
        </View>

        {/* Safety Warning (if urgent symptoms flagged) */}
        {hasUrgentWarning && (
          <View style={styles.urgentCard}>
            <Text style={styles.urgentIcon}>⚠️</Text>
            <Text style={styles.urgentText}>{urgentWarningMessage}</Text>
          </View>
        )}

        {/* Subtle Why Section */}
        <View style={styles.whyBox}>
          <Text style={styles.whyLabel}>WHY THESE SPECIALISTS?</Text>
          <Text style={styles.whyText}>{whyExplanation}</Text>
          <Text style={styles.whyModality}>Consultation: {modalityLabel}</Text>
        </View>

        {/* NO MATCH STATE */}
        {!featured ? (
          <View style={styles.noMatchCard}>
            <Text style={styles.noMatchIcon}>🌿</Text>
            <Text style={styles.noMatchTitle}>No exact match found</Text>
            <Text style={styles.noMatchDesc}>
              We couldn't find a doctor strictly matching all chosen criteria in this
              locality. Try choosing "Either works for me" or "Any Location".
            </Text>
            <TouchableOpacity
              style={styles.noMatchAction}
              activeOpacity={0.88}
              onPress={onAdjustPreferences}>
              <Text style={styles.noMatchActionText}>Adjust Preferences</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recommendationsList}>
            {/* ── FEATURED DOCTOR — LARGE PORTRAIT CARD ── */}
            <View style={styles.featuredCard}>
              <View style={styles.featuredTagRow}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>FEATURED SPECIALIST</Text>
                </View>
                {featured.doctor.medicalRegistration.isVerified && (
                  <View style={styles.verifiedRow}>
                    <Text style={styles.verifiedCheck}>✓</Text>
                    <Text style={styles.verifiedText}>Verified Medical Council</Text>
                  </View>
                )}
              </View>

              <Image
                source={featured.doctor.profileImage}
                style={styles.featuredPortrait}
                resizeMode="cover"
              />

              <View style={styles.featuredBody}>
                <Text style={styles.featuredName}>{featured.doctor.fullName}</Text>
                <Text style={styles.featuredSpeciality}>
                  {featured.doctor.specialityTitle}
                </Text>

                {/* Concise Qualifications Line */}
                <Text style={styles.featuredQualLine} numberOfLines={1}>
                  {featured.doctor.qualifications.join(' • ')}
                </Text>

                <Text style={styles.featuredExpLine}>
                  {featured.doctor.experienceYears} Years Clinical Experience •{' '}
                  {featured.doctor.clinic.locality}
                </Text>

                {/* Match Reason and Relevant Expertise */}
                <View style={styles.featuredExpertiseBox}>
                  <Text style={styles.featuredReasonText}>{featured.matchReason}</Text>
                  <View style={styles.expertisePillRow}>
                    {featured.relevantExpertise.map((exp, idx) => (
                      <View key={idx} style={styles.miniPill}>
                        <Text style={styles.miniPillText}>{exp}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Fees Bar */}
                <View style={styles.featuredFeeRow}>
                  <View>
                    <Text style={styles.feeKicker}>CONSULTATION FEE</Text>
                    <Text style={styles.feeAmount}>
                      ₹{featured.doctor.onlineFee} (Online) / ₹{featured.doctor.inClinicFee}{' '}
                      (In-Clinic)
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.featuredActionsRow}>
                  <TouchableOpacity
                    style={styles.viewProfileBtn}
                    activeOpacity={0.88}
                    onPress={() => onSelectDoctor(featured.doctor)}>
                    <Text style={styles.viewProfileBtnText}>View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bookSlotBtn}
                    activeOpacity={0.88}
                    onPress={() => onBookDoctor(featured.doctor)}>
                    <Text style={styles.bookSlotBtnText}>Book Slot →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ── TWO ADDITIONAL RECOMMENDATIONS — EDITORIAL CARDS ── */}
            {secondary.length > 0 && (
              <View style={styles.secondarySection}>
                <Text style={styles.secondarySectionHeading}>ADDITIONAL SPECIALISTS</Text>
                {secondary.map(item => (
                  <View key={item.doctor.id} style={styles.secondaryCard}>
                    <Image
                      source={item.doctor.profileImage}
                      style={styles.secondaryAvatar}
                      resizeMode="cover"
                    />
                    <View style={styles.secondaryCol}>
                      <Text style={styles.secondaryName}>{item.doctor.fullName}</Text>
                      <Text style={styles.secondarySpeciality}>
                        {item.doctor.specialityTitle}
                      </Text>
                      <Text style={styles.secondaryMeta}>
                        {item.doctor.experienceYears} Yrs Exp • {item.doctor.clinic.locality}
                      </Text>
                      <Text style={styles.secondaryReason} numberOfLines={2}>
                        {item.matchReason}
                      </Text>

                      <View style={styles.secondaryActionRow}>
                        <Text style={styles.secondaryFee}>
                          From ₹{item.doctor.onlineFee}
                        </Text>
                        <View style={styles.secondaryBtnGroup}>
                          <TouchableOpacity
                            style={styles.secondaryProfileBtn}
                            onPress={() => onSelectDoctor(item.doctor)}>
                            <Text style={styles.secondaryProfileBtnText}>Profile</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.secondaryBookBtn}
                            onPress={() => onBookDoctor(item.doctor)}>
                            <Text style={styles.secondaryBookBtnText}>Book →</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* View all matching doctors button if additional exist */}
            {additionalCount > 0 && !showAllMatches && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                activeOpacity={0.88}
                onPress={() => setShowAllMatches(true)}>
                <Text style={styles.viewAllBtnText}>
                  View all matching doctors ({additionalCount} more)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#5E7A63',
  },
  urgentCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF2F0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8A398',
    marginBottom: 16,
    alignItems: 'center',
  },
  urgentIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  urgentText: {
    flex: 1,
    fontSize: 12,
    color: '#8A2B18',
    lineHeight: 16,
    fontWeight: '600',
  },
  whyBox: {
    backgroundColor: '#FAF4EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  whyLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8C6239',
    marginBottom: 4,
  },
  whyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 2,
  },
  whyModality: {
    fontSize: 11,
    color: '#5E7A63',
  },
  noMatchCard: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#FAF4EB',
    borderRadius: 16,
  },
  noMatchIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noMatchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 8,
  },
  noMatchDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  noMatchAction: {
    backgroundColor: '#16281E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  noMatchActionText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '700',
  },
  recommendationsList: {
    gap: 20,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F1E9',
  },
  featuredBadge: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8C6239',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedCheck: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  featuredPortrait: {
    width: '100%',
    height: 220,
  },
  featuredBody: {
    padding: 18,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 2,
  },
  featuredSpeciality: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5E7A63',
    marginBottom: 6,
  },
  featuredQualLine: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  featuredExpLine: {
    fontSize: 11,
    color: '#555',
    marginBottom: 12,
  },
  featuredExpertiseBox: {
    backgroundColor: '#FBF9F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0ECE4',
  },
  featuredReasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C4035',
    marginBottom: 8,
    lineHeight: 16,
  },
  expertisePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniPill: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C4035',
  },
  featuredFeeRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0ECE4',
    marginBottom: 14,
  },
  feeKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#999',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  featuredActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  bookSlotBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookSlotBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  secondarySection: {
    gap: 12,
  },
  secondarySectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 4,
  },
  secondaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE6DC',
  },
  secondaryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#F0ECE4',
  },
  secondaryCol: {
    flex: 1,
  },
  secondaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  secondarySpeciality: {
    fontSize: 11,
    color: '#5E7A63',
    fontWeight: '600',
    marginBottom: 2,
  },
  secondaryMeta: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  secondaryReason: {
    fontSize: 11,
    color: '#444',
    lineHeight: 15,
    marginBottom: 8,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  secondaryFee: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16281E',
  },
  secondaryBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  secondaryProfileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#16281E',
  },
  secondaryProfileBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16281E',
  },
  secondaryBookBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#16281E',
  },
  secondaryBookBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  viewAllBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#16281E',
    backgroundColor: '#FAF4EB',
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
});
