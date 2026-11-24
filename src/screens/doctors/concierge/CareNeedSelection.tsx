import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CareOptionItem, ConciergeRecipient } from '../../../types/careConcierge.types';

const CARE_OPTIONS_BY_RECIPIENT: Record<ConciergeRecipient, CareOptionItem[]> = {
  MYSELF: [
    { id: 'postpartum_care', title: 'Postpartum care', subtitle: 'Pelvic health & restore' },
    { id: 'womens_health', title: "Women's health", subtitle: 'Maternal wellness & check-up' },
    { id: 'breastfeeding_support', title: 'Breastfeeding support', subtitle: 'Latch, supply & comfort' },
    { id: 'nutrition', title: 'Nutrition', subtitle: 'Energy, minerals & recovery' },
    { id: 'skin_hair', title: 'Skin and hair', subtitle: 'Postpartum shedding & barrier' },
    { id: 'general_consultation', title: 'General consultation', subtitle: 'Everyday physical care' },
  ],
  PREGNANCY: [
    { id: 'pregnancy_care', title: 'Pregnancy care', subtitle: 'Routine trimester tracking' },
    { id: 'pregnancy_nutrition', title: 'Pregnancy nutrition', subtitle: 'Antenatal meal planning' },
    { id: 'obstetric_consultation', title: 'Obstetric consultation', subtitle: 'Doctor consultation & scans' },
    { id: 'high_risk_consultation', title: 'High-risk pregnancy consultation', subtitle: 'Specialized oversight' },
    { id: 'general_pregnancy_guidance', title: 'General pregnancy guidance', subtitle: 'Questions & reassurance' },
  ],
  NEWBORN: [
    { id: 'newborn_health', title: 'Newborn health', subtitle: 'First 40 days wellness' },
    { id: 'feeding_support', title: 'Feeding support', subtitle: 'Gentle latch & nourishment' },
    { id: 'baby_skin_concerns', title: 'Baby skin concerns', subtitle: 'Cradle cap, rash & barrier' },
    { id: 'growth_development', title: 'Growth and development', subtitle: 'Weight curves & milestones' },
    { id: 'vaccination_guidance', title: 'Vaccination guidance', subtitle: 'Immunization schedule' },
    { id: 'general_pediatric_care', title: 'General pediatric care', subtitle: 'Colic, sleep & digestion' },
  ],
  CHILD: [
    { id: 'general_health', title: 'General health', subtitle: 'Fevers, coughs & recovery' },
    { id: 'nutrition_growth', title: 'Nutrition and growth', subtitle: 'Picky eating & vitality' },
    { id: 'skin_concerns', title: 'Skin concerns', subtitle: 'Allergies & gentle healing' },
    { id: 'development', title: 'Development', subtitle: 'Motor & speech milestones' },
    { id: 'vaccination', title: 'Vaccination', subtitle: 'Childhood immunization' },
    { id: 'pediatric_consultation', title: 'Pediatric consultation', subtitle: 'Clinical evaluation' },
  ],
};

const RECIPIENT_DISPLAY_NAME: Record<ConciergeRecipient, string> = {
  MYSELF: 'Myself',
  PREGNANCY: 'My pregnancy',
  NEWBORN: 'My newborn',
  CHILD: 'My child',
};

interface Props {
  recipient: ConciergeRecipient;
  selectedCareNeedId: string | null;
  optionalNote: string;
  onSelectCareNeed: (item: CareOptionItem) => void;
  onChangeOptionalNote: (note: string) => void;
}

export const CareNeedSelection: React.FC<Props> = ({
  recipient,
  selectedCareNeedId,
  optionalNote,
  onSelectCareNeed,
  onChangeOptionalNote,
}) => {
  const options = CARE_OPTIONS_BY_RECIPIENT[recipient] || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>QUESTION 2 OF 3</Text>
        <Text style={styles.headline}>What kind of care?</Text>
        <Text style={styles.subtext}>
          Showing choices tailored for{' '}
          <Text style={{ fontWeight: '700', color: '#16281E' }}>
            {RECIPIENT_DISPLAY_NAME[recipient]}
          </Text>
          .
        </Text>

        {/* Compact Selectable Tiles */}
        <View style={styles.tilesContainer}>
          {options.map(item => {
            const isSelected = selectedCareNeedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tile, isSelected && styles.tileActive]}
                activeOpacity={0.88}
                onPress={() => onSelectCareNeed(item)}>
                <View style={styles.tileHeader}>
                  <Text style={[styles.tileTitle, isSelected && styles.tileTitleActive]}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>
                {item.subtitle && (
                  <Text style={styles.tileSubtitle}>{item.subtitle}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional Concern Input */}
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Specific concern or note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="e.g. Newborn latch soreness, or infant eczema"
            placeholderTextColor="#999"
            value={optionalNote}
            onChangeText={onChangeOptionalNote}
            maxLength={120}
          />
        </View>
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
  tilesContainer: {
    gap: 10,
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#ECE6DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tileActive: {
    borderColor: '#16281E',
    backgroundColor: '#F8F6F1',
    borderWidth: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
  },
  tileTitleActive: {
    color: '#16281E',
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
  tileSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAE2D2',
    marginTop: 4,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#8C6239',
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#16281E',
  },
});
