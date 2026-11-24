import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

interface Testimonial {
  author: string;
  location: string;
  role: string;
  quote: string;
  service: string;
  initial: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    author: 'Ananya S.',
    location: 'Indiranagar, Bangalore',
    role: 'First-Time Mother',
    quote:
      'Appuge gave me the sacred space I didn\u2019t know I needed. Every ritual, every meal, every moment was filled with genuine warmth.',
    service: 'Mother & Baby Dual Sanctuary',
    initial: 'A',
  },
  {
    author: 'Deepa & Rohit M.',
    location: 'Whitefield, Bangalore',
    role: 'Parents of a Newborn',
    quote:
      'We were nervous about bringing someone into our home. Appuge put us completely at ease with their caregiving philosophy and careful matching.',
    service: 'Newborn Baby Care',
    initial: 'D',
  },
  {
    author: 'Priya K.',
    location: 'HSR Layout, Bangalore',
    role: 'Mother of Two',
    quote:
      'The Ayurvedic meals and consistent caregiver presence made my postpartum recovery feel supported, nourished and deeply cared for.',
    service: 'Post-Pregnancy Recovery',
    initial: 'P',
  },
];

const StarRow: React.FC = () => (
  <View style={styles.starRow}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Text key={i} style={styles.star}>
        ★
      </Text>
    ))}
  </View>
);

const VerifiedBadge: React.FC = () => (
  <View style={styles.verifiedBadge}>
    <View style={styles.verifiedDot} />
    <Text style={styles.verifiedText}>Verified Review</Text>
  </View>
);

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => (
  <View style={styles.card}>
    {/* Top row: stars + verified badge */}
    <View style={styles.cardTopRow}>
      <StarRow />
      <VerifiedBadge />
    </View>

    {/* Quote */}
    <Text style={styles.quote}>&ldquo;{item.quote}&rdquo;</Text>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Author row */}
    <View style={styles.authorRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{item.initial}</Text>
      </View>
      <View style={styles.authorInfo}>
        <Text style={styles.authorName}>{item.author}</Text>
        <Text style={styles.authorRole}>{item.role}</Text>
        <Text style={styles.authorLocation}>{item.location}</Text>
        <Text style={styles.serviceTag}>Care: {item.service}</Text>
      </View>
    </View>
  </View>
);

export const MotherhoodStories: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + 16));
    setActiveIndex(index);
  };

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.overline}>MOTHER VOICES</Text>
        <Text style={styles.heading}>Stories from our mothers.</Text>
        <Text style={styles.subtext}>Shared by families across Bangalore.</Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {TESTIMONIALS.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <TestimonialCard item={item} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {TESTIMONIALS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FAF4EB',
    paddingTop: 40,
    paddingBottom: 36,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  overline: {
    fontSize: 10,
    fontFamily: 'System',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#5E7A63',
    marginBottom: 8,
  },
  heading: {
    fontSize: 26,
    fontFamily: Fonts.serif,
    color: '#16281E',
    marginBottom: 6,
    lineHeight: 34,
  },
  subtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // ── Carousel ─────────────────────────────────────────────
  carouselContent: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 16,
  },

  // ── Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  // Stars
  starRow: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    color: '#E8A020',
    marginRight: 2,
  },

  // Verified badge
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF6EE',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#388E3C',
    fontWeight: '500',
  },

  // Quote
  quote: {
    fontSize: 14,
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    color: '#16281E',
    lineHeight: 22,
    marginVertical: 12,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginBottom: 14,
  },

  // Author
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D5A3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16281E',
    marginBottom: 1,
  },
  authorRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  authorLocation: {
    fontSize: 12,
    color: '#5E7A63',
    marginBottom: 4,
  },
  serviceTag: {
    fontSize: 11,
    color: Colors.terracotta ?? '#B85C38',
    fontWeight: '500',
  },

  // ── Pagination ───────────────────────────────────────────
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#16281E',
  },
  dotInactive: {
    width: 7,
    backgroundColor: Colors.sageLight ?? '#C2D4C5',
  },
});
