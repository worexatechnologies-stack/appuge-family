import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import {
  DoctorProfile,
  DoctorSpecialityId,
  ConsultationType,
  DOCTOR_SPECIALITIES,
} from '../../data/doctorsData';
import { AppIcon } from '../../components/common/AppIcon';

interface DoctorSearchModalProps {
  visible: boolean;
  onClose: () => void;
  doctors: DoctorProfile[];
  initialSpecialityId?: DoctorSpecialityId | null;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
}

type SortOption = 'recommended' | 'experience' | 'fee_low' | 'rating';

export const DoctorSearchModal: React.FC<DoctorSearchModalProps> = ({
  visible,
  onClose,
  doctors,
  initialSpecialityId = null,
  onSelectDoctor,
  onBookDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState<DoctorSpecialityId | 'all'>(
    initialSpecialityId || 'all',
  );
  const [consultationFilter, setConsultationFilter] = useState<ConsultationType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  const filteredDoctors = useMemo(() => {
    let list = [...doctors];

    // Filter by Speciality
    if (selectedSpeciality !== 'all') {
      list = list.filter(d => d.specialityId === selectedSpeciality);
    }

    // Filter by Consultation Format
    if (consultationFilter !== 'ALL') {
      list = list.filter(d => d.consultationTypes.includes(consultationFilter));
    }

    // Filter by Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        d =>
          d.fullName.toLowerCase().includes(q) ||
          d.specialityTitle.toLowerCase().includes(q) ||
          d.clinic.locality.toLowerCase().includes(q) ||
          d.areasOfExpertise.some(e => e.toLowerCase().includes(q)) ||
          d.languages.some(l => l.toLowerCase().includes(q)),
      );
    }

    // Sort
    if (sortBy === 'experience') {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === 'fee_low') {
      list.sort((a, b) => a.onlineFee - b.onlineFee);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [doctors, selectedSpeciality, consultationFilter, searchQuery, sortBy]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Top Search Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityLabel="Close search">
            <AppIcon name="close" size={16} color={Colors.forestDark} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <AppIcon name="search" size={15} color={Colors.sage} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, specialities, symptoms..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Pills Scroll */}
        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {/* Speciality Pills */}
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedSpeciality === 'all' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedSpeciality('all')}>
              <Text
                style={[
                  styles.filterPillText,
                  selectedSpeciality === 'all' && styles.filterPillTextActive,
                ]}>
                All Specialities
              </Text>
            </TouchableOpacity>
            {DOCTOR_SPECIALITIES.map(sp => (
              <TouchableOpacity
                key={sp.id}
                style={[
                  styles.filterPill,
                  selectedSpeciality === sp.id && styles.filterPillActive,
                ]}
                onPress={() => setSelectedSpeciality(sp.id)}>
                <Text
                  style={[
                    styles.filterPillText,
                    selectedSpeciality === sp.id && styles.filterPillTextActive,
                  ]}>
                  {sp.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Secondary Options: Type & Sort */}
          <View style={styles.subFilterRow}>
            {/* Consultation Types */}
            <View style={styles.formatPills}>
              {(['ALL', 'ONLINE', 'IN_CLINIC'] as (ConsultationType | 'ALL')[]).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.formatPill,
                    consultationFilter === type && styles.formatPillActive,
                  ]}
                  onPress={() => setConsultationFilter(type)}>
                  <Text
                    style={[
                      styles.formatPillText,
                      consultationFilter === type && styles.formatPillTextActive,
                    ]}>
                    {type === 'ALL' ? 'All Formats' : type === 'ONLINE' ? 'Video Consult' : 'In-Clinic'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sort Toggle */}
            <TouchableOpacity
              style={styles.sortToggle}
              onPress={() => {
                if (sortBy === 'recommended') setSortBy('experience');
                else if (sortBy === 'experience') setSortBy('fee_low');
                else if (sortBy === 'fee_low') setSortBy('rating');
                else setSortBy('recommended');
              }}>
              <Text style={styles.sortToggleText}>
                Sort: {sortBy === 'recommended' ? 'Recommended' : sortBy === 'experience' ? 'Experience' : sortBy === 'fee_low' ? 'Fee ↑' : 'Rating'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Doctor Results List */}
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredDoctors.length} Qualified Doctor{filteredDoctors.length === 1 ? '' : 's'} in Bengaluru
              </Text>
              <Text style={styles.resultsDemoBadge}>DEMO PROFILES</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppIcon name="search" size={32} color={Colors.sage} />
              <Text style={styles.emptyTitle}>No matching doctors found</Text>
              <Text style={styles.emptySub}>
                Try searching for a different speciality, symptom, or clearing active filters.
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSpeciality('all');
                  setConsultationFilter('ALL');
                }}>
                <Text style={styles.resetBtnText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.doctorCard}
              activeOpacity={0.92}
              onPress={() => onSelectDoctor(item)}>
              <View style={styles.cardTop}>
                <Image
                  source={item.profileImage}
                  style={styles.cardPortrait}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.cardVerifiedRow}>
                    <AppIcon name="verified" size={12} color="#1B5E20" />
                    <Text style={styles.cardVerifiedText}>KMC Verified</Text>
                  </View>
                  <Text style={styles.cardName}>{item.fullName}</Text>
                  <Text style={styles.cardSpeciality} numberOfLines={1}>
                    {item.specialityTitle}
                  </Text>
                  <Text style={styles.cardExp}>
                    {item.experienceYears} yrs exp · ★ {item.rating.toFixed(2)} ({item.reviewsCount} reviews)
                  </Text>
                </View>
              </View>

              {/* Clinic / Online Badges */}
              <View style={styles.formatBadgesRow}>
                {item.consultationTypes.includes('ONLINE') && (
                  <View style={styles.modeBadge}>
                    <Text style={styles.modeBadgeText}>Video ₹{item.onlineFee}</Text>
                  </View>
                )}
                {item.consultationTypes.includes('IN_CLINIC') && (
                  <View style={styles.modeBadge}>
                    <Text style={styles.modeBadgeText}>Clinic ({item.clinic.locality}) ₹{item.inClinicFee}</Text>
                  </View>
                )}
              </View>

              {/* Card Footer Actions */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => onSelectDoctor(item)}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookSlotBtn}
                  activeOpacity={0.88}
                  onPress={() => onBookDoctor(item)}>
                  <Text style={styles.bookSlotText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
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
    paddingHorizontal: 16,
    backgroundColor: Colors.creamLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 12, color: Colors.forestDark, paddingVertical: 0 },
  clearText: { fontSize: 16, color: Colors.textMuted, paddingHorizontal: 4 },

  filtersSection: {
    backgroundColor: '#FFFDF9',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.06)',
  },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  filterPillActive: { backgroundColor: Colors.forestDark, borderColor: Colors.forestDark },
  filterPillText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  filterPillTextActive: { color: '#FFFDF9' },

  subFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  formatPills: { flexDirection: 'row', gap: 6 },
  formatPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(44, 64, 53, 0.05)',
  },
  formatPillActive: { backgroundColor: Colors.sage },
  formatPillText: { fontSize: 9, fontWeight: '700', color: Colors.forestDark },
  formatPillTextActive: { color: '#FFFDF9' },

  sortToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(44, 64, 53, 0.05)',
  },
  sortToggleText: { fontSize: 9, fontWeight: '800', color: Colors.forestDark },

  listContent: { padding: 16, paddingBottom: 60 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: { fontSize: 12, fontWeight: '800', color: Colors.forestDark },
  resultsDemoBadge: { fontSize: 9, fontWeight: '800', color: Colors.terracotta, letterSpacing: 0.8 },

  doctorCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.08)',
  },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 10 },
  cardPortrait: { width: 68, height: 68, borderRadius: 10, backgroundColor: Colors.forestDark },
  cardVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  cardVerifiedText: { fontSize: 9, fontWeight: '700', color: '#1B5E20' },
  cardName: { fontFamily: Fonts.serif, fontSize: 16, color: Colors.forestDark, marginBottom: 2 },
  cardSpeciality: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  cardExp: { fontSize: 10, color: Colors.textMuted },

  formatBadgesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  modeBadge: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modeBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.forestDark },

  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.06)',
    paddingTop: 10,
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  viewProfileText: { fontSize: 11, fontWeight: '700', color: Colors.forestDark },
  bookSlotBtn: {
    flex: 1.3,
    backgroundColor: Colors.forestDark,
    paddingVertical: 9,
    borderRadius: 18,
    alignItems: 'center',
  },
  bookSlotText: { fontSize: 11, fontWeight: '700', color: '#FFFDF9' },

  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontFamily: Fonts.serif, fontSize: 18, color: Colors.forestDark, marginTop: 12, marginBottom: 6 },
  emptySub: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  resetBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFDF9' },
});
