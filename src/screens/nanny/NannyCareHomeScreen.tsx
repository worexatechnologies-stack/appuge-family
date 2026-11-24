import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  NannyProfile,
  NannyBooking,
  ChildAgeGroup,
  DEMO_NANNIES,
  INITIAL_NANNY_BOOKINGS,
} from '../../data/nannyCareData';
import { AppIcon } from '../../components/common/AppIcon';
import { NannyProfileModal } from './NannyProfileModal';
import { NannyBookingWizardModal } from './NannyBookingWizardModal';
import { MyNannyBookingsScreen } from './MyNannyBookingsScreen';

interface NannyCareHomeScreenProps {
  user?: { name: string; phone: string } | null;
  onOpenAuth?: () => void;
  onGoBack?: () => void;
}

const AGE_FILTERS: (ChildAgeGroup | 'All Ages')[] = [
  'All Ages',
  'Newborn (0 - 3 months)',
  'Infant (3 - 12 months)',
  'Toddler (1 - 3 years)',
  'Pre-school (3 - 5 years)',
];

export const NannyCareHomeScreen: React.FC<NannyCareHomeScreenProps> = ({
  user,
  onOpenAuth,
  onGoBack,
}) => {
  const [nannies] = useState<NannyProfile[]>(DEMO_NANNIES);
  const [selectedAge, setSelectedAge] = useState<ChildAgeGroup | 'All Ages'>('All Ages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNanny, setSelectedNanny] = useState<NannyProfile | null>(null);
  const [bookingNanny, setBookingNanny] = useState<NannyProfile | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Managed Booking state
  const [bookings, setBookings] = useState<NannyBooking[]>(INITIAL_NANNY_BOOKINGS);

  // Filter nannies
  const filteredNannies = nannies.filter(n => {
    const matchesAge =
      selectedAge === 'All Ages' || n.supportedAgeGroups.includes(selectedAge);
    const matchesSearch =
      !searchQuery.trim() ||
      n.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.serviceAreas.some(a =>
        a.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      n.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAge && matchesSearch;
  });

  const handleBookingCreated = (newBooking: NannyBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    setBookingNanny(null);
    setShowMyBookings(true);
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    newStatus: NannyBooking['status'],
  ) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b)),
    );
  };

  return (
    <View style={styles.root}>
      {showMyBookings ? (
        <MyNannyBookingsScreen
          bookings={bookings}
          onClose={() => setShowMyBookings(false)}
          onCancelBooking={id => handleUpdateBookingStatus(id, 'CANCELLED')}
        />
      ) : (
        /* ── PARENT EXPERIENCE ── */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.kicker}>APPUGE CARE · MANAGED CHILDCARE</Text>
                <Text style={styles.title}>Nurturing hands for your little world.</Text>
              </View>
            </View>
            <Text style={styles.sub}>
              Every nanny is rigorously vetted with police verification, background
              checks, and pediatric first-aid certification in Bangalore.
            </Text>

            {/* My Bookings Pill */}
            <TouchableOpacity
              style={styles.myBookingsBtn}
              activeOpacity={0.85}
              onPress={() => setShowMyBookings(true)}>
              <AppIcon name="calendar" size={15} color="#FAF4EB" />
              <Text style={styles.myBookingsText}>
                My Childcare Bookings ({bookings.length})
              </Text>
              <AppIcon name="arrow-right" size={13} color="#FAF4EB" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBox}>
            <AppIcon name="search" size={16} color={Colors.sage} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by area (Indiranagar, HSR...), skill or name..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Age Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ageFilters}>
            {AGE_FILTERS.map(age => (
              <TouchableOpacity
                key={age}
                style={[
                  styles.agePill,
                  selectedAge === age && styles.agePillActive,
                ]}
                onPress={() => setSelectedAge(age)}>
                <Text
                  style={[
                    styles.agePillText,
                    selectedAge === age && styles.agePillTextActive,
                  ]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Nannies List */}
          <View style={styles.list}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {filteredNannies.length} Verified Caregivers in Bangalore
              </Text>
              <Text style={styles.demoBadge}>DEMO PROFILES</Text>
            </View>

            {filteredNannies.map(nanny => (
              <TouchableOpacity
                key={nanny.id}
                style={styles.nannyCard}
                activeOpacity={0.92}
                onPress={() => setSelectedNanny(nanny)}>
                <Image source={nanny.photo} style={styles.nannyPhoto} resizeMode="cover" />

                <View style={styles.cardBody}>
                  {/* Name & Rate */}
                  <View style={styles.nameRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.nannyName}>{nanny.fullName}</Text>
                      <Text style={styles.nannyHeadline} numberOfLines={1}>
                        {nanny.headline}
                      </Text>
                    </View>
                    <View style={styles.rateBadge}>
                      <Text style={styles.rateAmount}>₹{nanny.hourlyRate}</Text>
                      <Text style={styles.rateUnit}>/hr</Text>
                    </View>
                  </View>

                  {/* Verification Tag */}
                  <View style={styles.verificationRow}>
                    {nanny.verificationState === 'VERIFIED' ? (
                      <View style={styles.verifiedTag}>
                        <AppIcon name="check" size={10} color="#1B5E20" />
                        <Text style={styles.verifiedTagText}>
                          Police & Background Verified
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.pendingTag}>
                        <Text style={styles.pendingTagText}>Verification In Review</Text>
                      </View>
                    )}
                    <Text style={styles.expText}>{nanny.experienceYears} yrs exp</Text>
                  </View>

                  {/* Skills Pills */}
                  <View style={styles.skillsRow}>
                    {nanny.skills.slice(0, 3).map((s, idx) => (
                      <View key={idx} style={styles.skillPill}>
                        <Text style={styles.skillText}>{s}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Service Areas */}
                  <Text style={styles.areasText} numberOfLines={1}>
                    📍 Areas: {nanny.serviceAreas.join(' · ')}
                  </Text>

                  {/* Card Actions */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.viewProfileBtn}
                      onPress={() => setSelectedNanny(nanny)}>
                      <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.requestCareBtn}
                      onPress={() => setBookingNanny(nanny)}>
                      <Text style={styles.requestCareText}>Request Care →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── PROFILE MODAL ── */}
      {selectedNanny && (
        <NannyProfileModal
          nanny={selectedNanny}
          visible={!!selectedNanny}
          onClose={() => setSelectedNanny(null)}
          onRequestBooking={() => {
            const n = selectedNanny;
            setSelectedNanny(null);
            setBookingNanny(n);
          }}
        />
      )}

      {/* ── BOOKING WIZARD MODAL ── */}
      {bookingNanny && (
        <NannyBookingWizardModal
          nanny={bookingNanny}
          visible={!!bookingNanny}
          user={user}
          onClose={() => setBookingNanny(null)}
          onBookingComplete={handleBookingCreated}
          onOpenAuth={onOpenAuth}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamLight },

  scroll: { flex: 1 },
  content: { paddingBottom: 110 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: Colors.creamLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
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
    maxWidth: 280,
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  myBookingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  myBookingsText: { fontSize: 12, fontWeight: '800', color: '#FAF4EB' },

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: { flex: 1, fontSize: 12, color: Colors.forestDark },
  clearSearch: { fontSize: 18, color: Colors.textMuted, paddingHorizontal: 4 },

  // Age filters
  ageFilters: { paddingHorizontal: 20, gap: 8, paddingBottom: 14 },
  agePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  agePillActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  agePillText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  agePillTextActive: { color: '#FAF4EB' },

  // List
  list: { marginHorizontal: 20 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: { fontSize: 12, fontWeight: '800', color: Colors.forestDark },
  demoBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.terracotta,
    letterSpacing: 0.8,
  },

  // Nanny Card
  nannyCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  nannyPhoto: { width: '100%', height: 180, backgroundColor: Colors.cream },
  cardBody: { padding: 14, gap: 8 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  nannyName: { fontFamily: Fonts.serif, fontSize: 18, color: Colors.forestDark },
  nannyHeadline: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  rateBadge: { alignItems: 'flex-end' },
  rateAmount: { fontSize: 16, fontWeight: '800', color: Colors.forestDark },
  rateUnit: { fontSize: 10, color: Colors.textMuted },

  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedTagText: { fontSize: 10, fontWeight: '700', color: '#1B5E20' },
  pendingTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pendingTagText: { fontSize: 10, fontWeight: '700', color: '#E65100' },
  expText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillPill: {
    backgroundColor: Colors.sagePale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: { fontSize: 10, color: Colors.forestDark, fontWeight: '600' },

  areasText: { fontSize: 10, color: Colors.textMuted },

  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44,64,53,0.06)',
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  viewProfileText: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  requestCareBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
  },
  requestCareText: { fontSize: 11, fontWeight: '800', color: '#FFFDF9' },
});
