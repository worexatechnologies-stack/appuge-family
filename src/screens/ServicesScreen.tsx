import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { SERVICES, ServiceItem } from '../data/appugeData';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal';
import { AppIcon } from '../components/common/AppIcon';

interface ServicesScreenProps {
  onOpenBooking: (serviceTitle?: string) => void;
}

const categories = [
  { key: 'all', label: 'All Offerings' },
  { key: 'mother', label: 'Mother Care' },
  { key: 'baby', label: 'Baby Care' },
  { key: 'specialist', label: 'Doctors' },
  { key: 'nutrition', label: 'Nutrition' },
];

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const services = useMemo(
    () =>
      selectedCategory === 'all'
        ? SERVICES
        : SERVICES.filter(s => s.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Editorial Screen Header */}
        <View style={styles.header}>
          <Text style={styles.overline}>THE APPUGE EDIT · 01—04</Text>
          <Text style={styles.title}>
            Care, thoughtfully{'\n'}
            <Text style={styles.titleItalic}>chosen.</Text>
          </Text>
          <Text style={styles.subtitle}>
            A circle of care for the days that change everything. Rooted in
            traditional Indian postpartum wisdom and refined by clinical hygiene
            standards in Bangalore.
          </Text>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat.key && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.75}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat.key && styles.categoryTextActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Services Showcase Cards */}
        <View style={styles.servicesList}>
          {services.map((service: ServiceItem, index: number) => (
            <View key={service.id} style={styles.serviceCard}>
              {/* Editorial Photograph */}
              <View style={styles.imageContainer}>
                <Image
                  source={service.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />

                {/* Top Badges */}
                <View style={styles.topRow}>
                  <View style={styles.numBadge}>
                    <Text style={styles.numText}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
                  {service.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>★ Most Chosen</Text>
                    </View>
                  )}
                </View>

                {/* Bottom Overlay Title */}
                <View style={styles.imageBottomContent}>
                  <Text style={styles.cardTagline}>{service.tagline}</Text>
                  <Text style={styles.cardTitle}>{service.title}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardDesc}>{service.desc}</Text>

                {/* Key Highlights */}
                <View style={styles.highlightsContainer}>
                  {service.highlights.slice(0, 3).map((h, i) => (
                    <View key={i} style={styles.highlightItem}>
                      <Text style={styles.highlightDot}>•</Text>
                      <Text style={styles.highlightText} numberOfLines={2}>
                        {h}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Card Footer Actions */}
                <View style={styles.cardFooter}>
                  <View style={styles.durationCol}>
                    <Text style={styles.durationLabel}>DURATION</Text>
                    <Text style={styles.durationValue}>
                      {service.duration || 'Flexible Program'}
                    </Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => setActiveDetailId(service.id)}
                      activeOpacity={0.8}>
                      <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => onOpenBooking(service.title)}
                      activeOpacity={0.88}>
                      <View style={styles.bookBtnContent}>
                        <Text style={styles.bookBtnText}>Book Care</Text>
                        <View style={styles.bookBtnIconCircle}>
                          <AppIcon name="arrow-up-right" size={10} color={Colors.terracotta} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Full-Page Service Details Modal */}
      <ServiceDetailsModal
        visible={!!activeDetailId}
        serviceId={activeDetailId}
        onClose={() => setActiveDetailId(null)}
        onBookService={serviceTitle => {
          setActiveDetailId(null);
          onOpenBooking(serviceTitle);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: Colors.creamLight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  overline: {
    color: Colors.sage,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  titleItalic: {
    fontStyle: 'italic',
    color: Colors.forest,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryRow: {
    gap: 8,
    paddingTop: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryPillActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  categoryText: {
    color: Colors.forest,
    fontSize: 11.5,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.creamLight,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 22,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.45)',
  },
  topRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  popularBadge: {
    backgroundColor: Colors.goldWarm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: Colors.forestDark,
    fontSize: 9.5,
    fontWeight: '800',
  },
  imageBottomContent: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  cardTagline: {
    color: Colors.goldWarm,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  highlightsContainer: {
    backgroundColor: Colors.sagePale,
    padding: 12,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  highlightDot: {
    color: Colors.forest,
    fontSize: 12,
    lineHeight: 16,
  },
  highlightText: {
    color: Colors.forestDark,
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.cardBorder,
    paddingTop: 12,
  },
  durationCol: {
    maxWidth: '40%',
  },
  durationLabel: {
    color: Colors.sage,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  durationValue: {
    color: Colors.forestDark,
    fontSize: 11.5,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FAF5ED',
    borderWidth: 1,
    borderColor: 'rgba(22, 40, 30, 0.15)',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: Colors.forestDark,
    fontSize: 11,
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
  },
  bookBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bookBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  bookBtnIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
