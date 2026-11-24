import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors, { Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';

interface BangaloreCoverageProps {
  onOpenBooking: (service?: string) => void;
}

const LOCALITIES = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Whitefield',
  'Jayanagar',
  'JP Nagar',
  'Electronic City',
  'Hebbal',
  'Yelahanka',
  'Malleshwaram',
  'Sarjapur Road',
  'Bellandur',
];

export const BangaloreCoverage: React.FC<BangaloreCoverageProps> = ({
  onOpenBooking,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('Indiranagar');

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <Text style={styles.overline}>BANGALORE COVERAGE</Text>
      <Text style={styles.heading}>Care, close to home.</Text>
      <Text style={styles.subtext}>
        Our caregivers serve families across Bangalore's prime neighbourhoods.
      </Text>

      {/* Locality Chip Grid */}
      <View style={styles.chipGrid}>
        {LOCALITIES.map((locality) => {
          const isSelected = selectedArea === locality;
          return (
            <TouchableOpacity
              key={locality}
              activeOpacity={0.75}
              onPress={() => setSelectedArea(locality)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipDefault,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextDefault,
                ]}
              >
                {locality}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Status Note */}
      <Text style={styles.statusNote}>
        Caregivers are available in {selectedArea}. Enquire to find your match.
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.ctaButton}
        onPress={() => onOpenBooking(selectedArea)}
      >
        <View style={styles.ctaContentRow}>
          <View style={styles.ctaLeftGroup}>
            <View style={styles.ctaIconBadge}>
              <AppIcon name="mapPin" size={13} color={Colors.goldWarm} />
            </View>
            <Text style={styles.ctaText}>
              Check Care Availability in {selectedArea}
            </Text>
          </View>
          <View style={styles.ctaArrowCircle}>
            <AppIcon name="arrow-up-right" size={11} color={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  overline: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#C86D51',
    fontWeight: '600',
    marginBottom: 8,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: '#16281E',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 2,
  },
  chipDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipSelected: {
    backgroundColor: '#16281E',
    borderWidth: 0,
  },
  chipText: {
    fontSize: 12,
  },
  chipTextDefault: {
    color: '#16281E',
  },
  chipTextSelected: {
    color: '#FAF4EB',
  },
  statusNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#5E7A63',
    marginTop: 12,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: '#16281E',
    borderRadius: 27,
    minHeight: 52,
    marginTop: 18,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.35)',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ctaIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(232, 160, 32, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 13.5,
    color: '#FAF4EB',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BangaloreCoverage;
