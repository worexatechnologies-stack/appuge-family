import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import { NannyProfile } from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';

interface NannyProfileModalProps {
  nanny: NannyProfile;
  visible: boolean;
  onClose: () => void;
  onRequestBooking: () => void;
}

export const NannyProfileModal: React.FC<NannyProfileModalProps> = ({
  nanny,
  visible,
  onClose,
  onRequestBooking,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Caregiver Profile</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Hero Portrait */}
          <View style={styles.heroWrap}>
            <Image source={nanny.photo} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroShade} />
            <View style={styles.heroCopy}>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        nanny.verificationState === 'VERIFIED'
                          ? '#2E7D32'
                          : '#E65100',
                    },
                  ]}
                />
                <Text style={styles.statusBadgeText}>
                  {nanny.verificationState === 'VERIFIED'
                    ? 'APPUGE VERIFIED'
                    : 'IN VERIFICATION'}
                </Text>
              </View>
              <Text style={styles.heroName}>{nanny.fullName}</Text>
              <Text style={styles.heroHeadline}>{nanny.headline}</Text>
            </View>
          </View>

          {/* Quick Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{nanny.experienceYears} Years</Text>
              <Text style={styles.statLabel}>EXPERIENCE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>★ {nanny.rating}</Text>
              <Text style={styles.statLabel}>{nanny.reviewsCount} REVIEWS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>₹{nanny.hourlyRate}</Text>
              <Text style={styles.statLabel}>PER HOUR</Text>
            </View>
          </View>

          {/* Verification Audit Checklist */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>SAFETY & VERIFICATION</Text>
            <Text style={styles.sectionTitle}>Appuge Trust & Safety Standard</Text>

            <View style={styles.checkItem}>
              <AppIcon
                name={nanny.verifiedBadges.policeBackgroundCheck ? 'check' : 'shield'}
                size={14}
                color={nanny.verifiedBadges.policeBackgroundCheck ? '#2E7D32' : Colors.textMuted}
              />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Police Verification & Criminal Clearance</Text>
                <Text style={styles.checkDesc}>
                  {nanny.verifiedBadges.policeBackgroundCheck
                    ? 'Verified on file via Bengaluru City Police station endorsement.'
                    : 'Clearance submission pending verification.'}
                </Text>
              </View>
            </View>

            <View style={styles.checkItem}>
              <AppIcon
                name={nanny.verifiedBadges.govtIdentityVerified ? 'check' : 'shield'}
                size={14}
                color={nanny.verifiedBadges.govtIdentityVerified ? '#2E7D32' : Colors.textMuted}
              />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Government Identity (Aadhaar / Passport)</Text>
                <Text style={styles.checkDesc}>
                  Biometric ID verified with address authentication.
                </Text>
              </View>
            </View>

            <View style={styles.checkItem}>
              <AppIcon
                name={nanny.verifiedBadges.cprCertified ? 'check' : 'shield'}
                size={14}
                color={nanny.verifiedBadges.cprCertified ? '#2E7D32' : Colors.textMuted}
              />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Pediatric First Aid & Infant CPR</Text>
                <Text style={styles.checkDesc}>
                  {nanny.verifiedBadges.cprCertified
                    ? 'Certified in Infant Choking, CPR, and Emergency Response.'
                    : 'Certification in progress.'}
                </Text>
              </View>
            </View>

            <View style={styles.checkItem}>
              <AppIcon
                name={nanny.verifiedBadges.medicalHealthScreened ? 'check' : 'shield'}
                size={14}
                color={nanny.verifiedBadges.medicalHealthScreened ? '#2E7D32' : Colors.textMuted}
              />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Medical Screening & Vaccine Records</Text>
                <Text style={styles.checkDesc}>
                  Comprehensive physical wellness and hygiene screening cleared.
                </Text>
              </View>
            </View>
          </View>

          {/* About & Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>ABOUT THE CAREGIVER</Text>
            <Text style={styles.bioText}>{nanny.bio}</Text>
          </View>

          {/* Supported Ages */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>CHILD AGE GROUPS SUPPORTED</Text>
            <View style={styles.pillsRow}>
              {nanny.supportedAgeGroups.map((age, i) => (
                <View key={i} style={styles.pillItem}>
                  <Text style={styles.pillItemText}>{age}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>CARE SPECIALTIES & SKILLS</Text>
            <View style={styles.pillsRow}>
              {nanny.skills.map((s, i) => (
                <View key={i} style={[styles.pillItem, styles.skillItem]}>
                  <Text style={styles.skillItemText}>✓ {s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Certifications */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>QUALIFICATIONS & CERTIFICATES</Text>
            {nanny.certifications.map((c, i) => (
              <View key={i} style={styles.certRow}>
                <AppIcon name="award" size={14} color={Colors.sage} />
                <Text style={styles.certText}>{c}</Text>
              </View>
            ))}
          </View>

          {/* Languages & Areas */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>LANGUAGES & LOCALITIES</Text>
            <Text style={styles.metaRow}>
              🗣 <Text style={styles.metaBold}>Languages:</Text>{' '}
              {nanny.languages.join(', ')}
            </Text>
            <Text style={styles.metaRow}>
              📍 <Text style={styles.metaBold}>Service Areas:</Text>{' '}
              {nanny.serviceAreas.join(', ')}
            </Text>
          </View>

          {/* Pricing Model */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>TRANSPARENT RATES</Text>
            <View style={styles.pricingTable}>
              <View style={styles.priceCol}>
                <Text style={styles.priceColTitle}>Hourly Care</Text>
                <Text style={styles.priceColRate}>₹{nanny.hourlyRate}/hr</Text>
                <Text style={styles.priceColMin}>Min {nanny.minimumHours} hrs</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceCol}>
                <Text style={styles.priceColTitle}>Half Day (4h)</Text>
                <Text style={styles.priceColRate}>₹{nanny.halfDayRate}</Text>
                <Text style={styles.priceColMin}>Morning / Afternoon</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceCol}>
                <Text style={styles.priceColTitle}>Full Day (8h)</Text>
                <Text style={styles.priceColRate}>₹{nanny.fullDayRate}</Text>
                <Text style={styles.priceColMin}>Day shift</Text>
              </View>
            </View>
          </View>

          {/* Parent Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>VERIFIED REVIEWS</Text>
            <Text style={styles.sectionTitle}>What Families Say</Text>

            {nanny.reviews.length === 0 ? (
              <Text style={styles.emptyReviews}>
                New caregiver profile. Reviews will appear here after completed sessions.
              </Text>
            ) : (
              nanny.reviews.map(rev => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View>
                      <Text style={styles.reviewerName}>{rev.parentName}</Text>
                      <Text style={styles.reviewerMeta}>
                        {rev.childAge} · {rev.locality}
                      </Text>
                    </View>
                    <Text style={styles.reviewStars}>★ {rev.rating}.0</Text>
                  </View>
                  <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                  <Text style={styles.reviewDate}>Verified Care · {rev.date}</Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Booking Action Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomRate}>₹{nanny.hourlyRate} / hour</Text>
            <Text style={styles.bottomMin}>Min {nanny.minimumHours} hrs booking</Text>
          </View>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={onRequestBooking}
            activeOpacity={0.85}>
            <Text style={styles.bookBtnText}>Request Care with {nanny.fullName.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },
  topBar: {
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
  closeBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  closeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.forestDark },
  topBarTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 20 },

  heroWrap: { height: 260, backgroundColor: Colors.forestDark },
  heroImage: { width: '100%', height: '100%' },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22,40,30,0.5)',
  },
  heroCopy: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,253,249,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 8,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.forestDark,
  },
  heroName: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: '#FFFDF9',
    marginBottom: 2,
  },
  heroHeadline: { fontSize: 12, color: 'rgba(255,253,249,0.85)', lineHeight: 16 },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.forestDark,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: '800', color: '#FFFDF9' },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: 'rgba(255,253,249,0.55)',
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: 'rgba(255,253,249,0.15)' },

  section: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44,64,53,0.08)',
  },
  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.sage,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.forestDark,
    marginBottom: 14,
  },

  checkItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  checkTextCol: { flex: 1 },
  checkTitle: { fontSize: 12, fontWeight: '700', color: Colors.forestDark },
  checkDesc: { fontSize: 11, color: Colors.textSecondary, marginTop: 1, lineHeight: 15 },

  bioText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pillItem: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pillItemText: { fontSize: 11, color: Colors.forestDark, fontWeight: '600' },
  skillItem: { backgroundColor: Colors.sagePale },
  skillItemText: { fontSize: 11, color: Colors.forestDark, fontWeight: '700' },

  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  certText: { fontSize: 12, color: Colors.forestDark, fontWeight: '600' },

  metaRow: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  metaBold: { fontWeight: '700', color: Colors.forestDark },

  pricingTable: {
    flexDirection: 'row',
    backgroundColor: Colors.cream,
    borderRadius: 12,
    paddingVertical: 14,
  },
  priceCol: { flex: 1, alignItems: 'center' },
  priceColTitle: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  priceColRate: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestDark,
    marginTop: 2,
  },
  priceColMin: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },
  priceDivider: { width: 1, backgroundColor: Colors.cardBorder },

  emptyReviews: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  reviewCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewerName: { fontSize: 12, fontWeight: '800', color: Colors.forestDark },
  reviewerMeta: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  reviewStars: { fontSize: 11, fontWeight: '800', color: Colors.terracotta },
  reviewComment: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  reviewDate: { fontSize: 9, color: Colors.textMuted, marginTop: 6 },

  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 50 : 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bottomRate: { fontSize: 15, fontWeight: '800', color: Colors.forestDark },
  bottomMin: { fontSize: 10, color: Colors.textMuted },
  bookBtn: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
  },
  bookBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFDF9' },
});
