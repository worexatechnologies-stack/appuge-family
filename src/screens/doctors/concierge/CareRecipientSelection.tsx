import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ConciergeRecipient } from '../../../types/careConcierge.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 40 - 12) / 2;

interface RecipientOption {
  id: ConciergeRecipient;
  label: string;
  tagline: string;
  image: ImageSourcePropType;
}

const RECIPIENT_OPTIONS: RecipientOption[] = [
  {
    id: 'MYSELF',
    label: 'Myself',
    tagline: 'Maternal wellness & vitality',
    image: require('../../../assets/images/01.jpg'),
  },
  {
    id: 'PREGNANCY',
    label: 'My pregnancy',
    tagline: 'Trimester care & scan guidance',
    image: require('../../../assets/images/03.jpg'),
  },
  {
    id: 'NEWBORN',
    label: 'My newborn',
    tagline: 'First 40 days, latch & colic',
    image: require('../../../assets/images/hero_newborn.jpg'),
  },
  {
    id: 'CHILD',
    label: 'My child',
    tagline: 'Growth, nutrition & milestones',
    image: require('../../../assets/images/04.jpg'),
  },
];

interface Props {
  selectedRecipient: ConciergeRecipient | null;
  onSelect: (recipient: ConciergeRecipient) => void;
}

export const CareRecipientSelection: React.FC<Props> = ({
  selectedRecipient,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>QUESTION 1 OF 3</Text>
        <Text style={styles.headline}>Who are we finding care for?</Text>
        <Text style={styles.subtext}>
          Choose the person who will be receiving healthcare guidance.
        </Text>

        {/* Refined 2-Column Editorial Grid */}
        <View style={styles.grid}>
          {RECIPIENT_OPTIONS.map(opt => {
            const isSelected = selectedRecipient === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.gridCard, isSelected && styles.gridCardActive]}
                activeOpacity={0.88}
                onPress={() => onSelect(opt.id)}>
                <View style={styles.imageWrap}>
                  <Image source={opt.image} style={styles.cardImage} resizeMode="cover" />
                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Text style={styles.selectionBadgeCheck}>✓</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardMeta}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.cardTagline} numberOfLines={2}>
                    {opt.tagline}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: CARD_WIDTH,
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
  },
  gridCardActive: {
    borderColor: '#16281E',
    backgroundColor: '#F8F6F1',
    borderWidth: 2,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#EBE5D8',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  selectionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBadgeCheck: {
    fontSize: 12,
    color: '#FFFDF9',
    fontWeight: '800',
  },
  cardMeta: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  cardTitleActive: {
    color: '#16281E',
  },
  cardTagline: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
});
