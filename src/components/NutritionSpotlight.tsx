import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import Colors, { Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';



interface NutritionSpotlightProps {
  onNavigateTab: (tab: 'home' | 'services' | 'nutrition' | 'doctors' | 'faqs') => void;
}

const miniCards = [
  {
    image: require('../assets/images/desi_eggs.jpg'),
    label: 'Desi Eggs Pack',
    subtitle: 'Protein-rich',
  },
  {
    image: require('../assets/images/care_ritual_4.jpg'),
    label: 'Healing Kashayam',
    subtitle: 'Digestive support',
  },
  {
    image: require('../assets/images/01.jpg'),
    label: 'Postpartum Thali',
    subtitle: 'Iron-rich grains',
  },
];

const pillars = [
  { title: 'Ayurvedic Approved', desc: 'Time-tested grandmother recipes' },
  { title: 'Warm Home Delivery', desc: 'Delivered fresh across Bangalore' },
  { title: 'Galactagogue Rich', desc: 'Natural milk-boosting ingredients' },
  { title: 'A2 Desi Ghee', desc: 'Pure, traditional healing fats' },
];

export const NutritionSpotlight: React.FC<NutritionSpotlightProps> = ({ onNavigateTab }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Section Header */}
      <Text style={styles.overline}>AYURVEDIC HEALING KITCHEN</Text>
      <Text style={styles.heading}>Food that feels like home.</Text>
      <Text style={styles.supporting}>
        Every meal prepared with the wisdom of generations and the warmth of a mother's kitchen.
      </Text>

      {/* Large Featured Image Card */}
      <View style={styles.heroCard}>
        <Image
          source={require('../assets/images/nutrition_hero.png')}
          resizeMode="cover"
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroBadgeContainer}>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeContent}>
              <AppIcon name="soup" size={12} color={Colors.creamLight} />
              <Text style={styles.heroBadgeText}>FRESHLY PREPARED DAILY</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Horizontal Mini Food Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.miniCardsScroll}
        contentContainerStyle={styles.miniCardsContent}
      >
        {miniCards.map((card, index) => (
          <View key={index} style={styles.miniCard}>
            <Image source={card.image} style={styles.miniCardImage} resizeMode="cover" />
            <View style={styles.miniCardOverlay} />
            <View style={styles.miniCardContent}>
              <Text style={styles.miniCardLabel}>{card.label}</Text>
              <Text style={styles.miniCardSubtitle}>{card.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 2x2 Pillar Grid */}
      <View style={styles.pillarGrid}>
        <View style={styles.pillarGridRow}>
          <View style={styles.pillarCard}>
            <View style={styles.pillarDot} />
            <Text style={styles.pillarTitle}>{pillars[0].title}</Text>
            <Text style={styles.pillarDesc}>{pillars[0].desc}</Text>
          </View>
          <View style={styles.pillarCard}>
            <View style={styles.pillarDot} />
            <Text style={styles.pillarTitle}>{pillars[1].title}</Text>
            <Text style={styles.pillarDesc}>{pillars[1].desc}</Text>
          </View>
        </View>
        <View style={styles.pillarGridRow}>
          <View style={styles.pillarCard}>
            <View style={styles.pillarDot} />
            <Text style={styles.pillarTitle}>{pillars[2].title}</Text>
            <Text style={styles.pillarDesc}>{pillars[2].desc}</Text>
          </View>
          <View style={styles.pillarCard}>
            <View style={styles.pillarDot} />
            <Text style={styles.pillarTitle}>{pillars[3].title}</Text>
            <Text style={styles.pillarDesc}>{pillars[3].desc}</Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.88}
        onPress={() => onNavigateTab('nutrition')}
      >
        <View style={styles.ctaLeftGroup}>
          <View style={styles.ctaIconSparkle}>
            <AppIcon name="soup" size={13} color={Colors.goldWarm} />
          </View>
          <Text style={styles.ctaText}>Explore Our Ayurvedic Kitchen</Text>
        </View>
        <View style={styles.ctaIconBadge}>
          <AppIcon name="arrow-right" size={12} color={Colors.creamLight} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.sagePale,
  },

  // Header
  overline: {
    color: Colors.terracotta,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.forestDark,
    lineHeight: 32,
    marginBottom: 8,
  },
  supporting: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },

  // Hero Card
  heroCard: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0D1A11',
    opacity: 0.5,
  },
  heroBadgeContainer: {
    position: 'absolute',
    bottom: 14,
    left: 14,
  },
  heroBadge: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: Colors.forest,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
  },

  // Mini Cards
  miniCardsScroll: {
    marginBottom: 20,
  },
  miniCardsContent: {
    paddingRight: 16,
    gap: 10,
  },
  miniCard: {
    width: 130,
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  miniCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  miniCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: '#0D1A11',
    opacity: 0.65,
  },
  miniCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  miniCardLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.serif,
  },
  miniCardSubtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },

  // Pillar Grid
  pillarGrid: {
    gap: 10,
    marginBottom: 20,
  },
  pillarGridRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  pillarCard: {
    flex: 1,
    backgroundColor: Colors.sageTint,
    borderRadius: 14,
    padding: 14,
  },
  pillarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.terracotta,
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  // CTA
  ctaButton: {
    backgroundColor: Colors.forestDark,
    borderRadius: 27,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaIconSparkle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(232, 160, 32, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: Colors.creamLight,
    fontFamily: Fonts.serif,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
