import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ConciergeLocality, ConciergeModality } from '../../../types/careConcierge.types';

const LOCALITY_OPTIONS: ConciergeLocality[] = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'ANY',
];

interface Props {
  modality: ConciergeModality | null;
  locality: ConciergeLocality;
  onSelectModality: (modality: ConciergeModality) => void;
  onSelectLocality: (locality: ConciergeLocality) => void;
  onSubmit: () => void;
}

export const ConsultationPreference: React.FC<Props> = ({
  modality,
  locality,
  onSelectModality,
  onSelectLocality,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>QUESTION 3 OF 3</Text>
        <Text style={styles.headline}>How would you like to meet your doctor?</Text>
        <Text style={styles.subtext}>
          Choose your preferred consultation format.
        </Text>

        {/* Two Visual Modality Choices */}
        <View style={styles.modalityList}>
          {/* ONLINE */}
          <TouchableOpacity
            style={[styles.modalityCard, modality === 'ONLINE' && styles.modalityCardActive]}
            activeOpacity={0.88}
            onPress={() => onSelectModality('ONLINE')}>
            <Image
              source={require('../../../assets/images/02.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={[styles.cardTitle, modality === 'ONLINE' && styles.cardTitleActive]}>
                  Online
                </Text>
                <View
                  style={[
                    styles.radioCircle,
                    modality === 'ONLINE' && styles.radioCircleActive,
                  ]}>
                  {modality === 'ONLINE' && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.cardDesc}>From the comfort of home.</Text>
              <Text style={styles.cardSub}>
                Unhurried video consultation with digital prescription.
              </Text>
            </View>
          </TouchableOpacity>

          {/* IN-CLINIC */}
          <TouchableOpacity
            style={[styles.modalityCard, modality === 'IN_CLINIC' && styles.modalityCardActive]}
            activeOpacity={0.88}
            onPress={() => onSelectModality('IN_CLINIC')}>
            <Image
              source={require('../../../assets/images/hero_clinical.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={[styles.cardTitle, modality === 'IN_CLINIC' && styles.cardTitleActive]}>
                  In-clinic
                </Text>
                <View
                  style={[
                    styles.radioCircle,
                    modality === 'IN_CLINIC' && styles.radioCircleActive,
                  ]}>
                  {modality === 'IN_CLINIC' && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.cardDesc}>Meet your doctor in person.</Text>
              <Text style={styles.cardSub}>
                At our serene, sanitized partner clinics in Bengaluru.
              </Text>
            </View>
          </TouchableOpacity>

          {/* EITHER WORKS FOR ME */}
          <TouchableOpacity
            style={[styles.eitherPill, modality === 'EITHER' && styles.eitherPillActive]}
            activeOpacity={0.88}
            onPress={() => onSelectModality('EITHER')}>
            <Text style={[styles.eitherPillText, modality === 'EITHER' && styles.eitherPillTextActive]}>
              Either works for me
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location Selection (Only when In-clinic chosen) */}
        {modality === 'IN_CLINIC' && (
          <View style={styles.localityContainer}>
            <Text style={styles.localityHeadline}>Preferred Bengaluru Clinic Area:</Text>
            <View style={styles.localityChipsRow}>
              {LOCALITY_OPTIONS.map(loc => {
                const isSelected = locality === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.localityChip, isSelected && styles.localityChipActive]}
                    onPress={() => onSelectLocality(loc)}>
                    <Text
                      style={[
                        styles.localityChipText,
                        isSelected && styles.localityChipTextActive,
                      ]}>
                      {loc === 'ANY' ? 'Any Location' : loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryBtn, !modality && styles.primaryBtnDisabled]}
          activeOpacity={0.88}
          disabled={!modality}
          onPress={onSubmit}>
          <Text style={styles.primaryBtnText}>Find My Specialists</Text>
          <Text style={styles.primaryBtnArrow}>→</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 20,
    paddingBottom: 36,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 4,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 13,
    color: '#5E7A63',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalityList: {
    gap: 14,
    marginBottom: 20,
  },
  modalityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ECE6DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    height: 110,
  },
  modalityCardActive: {
    borderColor: '#16281E',
    backgroundColor: '#F8F6F1',
    borderWidth: 2,
  },
  cardImage: {
    width: 110,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  cardTitleActive: {
    color: '#16281E',
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C4035',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: '#777',
    lineHeight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#16281E',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16281E',
  },
  eitherPill: {
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0D2',
  },
  eitherPillActive: {
    backgroundColor: '#16281E',
    borderColor: '#16281E',
  },
  eitherPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C6239',
  },
  eitherPillTextActive: {
    color: '#FFFDF9',
  },
  localityContainer: {
    backgroundColor: '#FAF4EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  localityHeadline: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#8C6239',
    marginBottom: 8,
  },
  localityChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  localityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  localityChipActive: {
    backgroundColor: '#16281E',
    borderColor: '#16281E',
  },
  localityChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  localityChipTextActive: {
    color: '#FFFDF9',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 48 : 16,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#16281E',
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.5,
  },
  primaryBtnArrow: {
    fontSize: 16,
    color: '#FFFDF9',
    fontWeight: '700',
  },
});
