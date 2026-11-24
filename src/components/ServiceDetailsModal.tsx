import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../theme/colors';
import { ServiceDetailData, SERVICE_DETAILS } from '../data/appugeData';
import { AppIcon } from './common/AppIcon';
import { useAppInsets } from '../theme/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ServiceDetailsModalProps {
  visible: boolean;
  serviceId?: string | null;
  onClose: () => void;
  onBookService: (serviceTitle: string) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  visible,
  serviceId,
  onClose,
  onBookService,
}) => {
  const { top: topInset, bottom: bottomInset } = useAppInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!serviceId) return null;
  const detail: ServiceDetailData | undefined =
    SERVICE_DETAILS[serviceId] || SERVICE_DETAILS['mother-care'];

  if (!detail) return null;

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" {...({ translucent: true, backgroundColor: 'transparent' } as any)} />

        {/* Floating Top Navigation */}
        <View style={[styles.topBar, { paddingTop: topInset + 8, paddingBottom: 12 }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityLabel="Close service details">
            <Text style={styles.closeBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {detail.title}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* 1. Full-Width Hero Photograph */}
          <View style={styles.heroContainer}>
            <Image
              source={detail.heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  ✦ {detail.suitableStage.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.heroTitle}>{detail.title}</Text>
              <Text style={styles.heroTagline}>{detail.tagline}</Text>
            </View>
          </View>

          {/* 2. Key Metadata Badges */}
          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>DURATION</Text>
              <Text style={styles.metaValue}>{detail.duration}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>FORMAT</Text>
              <Text style={styles.metaValue}>{detail.format}</Text>
            </View>
          </View>

          {/* 3. Overview Paragraph */}
          <View style={styles.section}>
            <Text style={styles.sectionOverline}>CARE PHILOSOPHY</Text>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>{detail.overview}</Text>
          </View>

          {/* 4. What Is Included */}
          <View style={styles.section}>
            <Text style={styles.sectionOverline}>IN-HOME OFFERINGS</Text>
            <Text style={styles.sectionTitle}>What is Included</Text>

            <View style={styles.inclusionsList}>
              {detail.inclusions.map((item, idx) => (
                <View key={idx} style={styles.inclusionCard}>
                  <View style={styles.inclusionIconWrapper}>
                    <AppIcon name={item.icon} size={20} color={Colors.forestDark} />
                  </View>
                  <View style={styles.inclusionText}>
                    <Text style={styles.inclusionTitle}>{item.title}</Text>
                    <Text style={styles.inclusionDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 5. How It Works (4 Steps) */}
          <View style={[styles.section, styles.howItWorksSection]}>
            <Text style={[styles.sectionOverline, { color: Colors.creamDark }]}>
              THE PROCESS
            </Text>
            <Text style={[styles.sectionTitle, { color: Colors.creamLight }]}>
              How Your Care Begins
            </Text>

            <View style={styles.stepsList}>
              {detail.howItWorks.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNumCol}>
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepNumber}>{step.step}</Text>
                    </View>
                    {idx < detail.howItWorks.length - 1 && (
                      <View style={styles.stepLine} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 6. Frequently Asked Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionOverline}>CLARITY FOR FAMILIES</Text>
            <Text style={styles.sectionTitle}>Common Questions</Text>

            <View style={styles.faqsList}>
              {detail.faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.faqCard}
                    onPress={() => toggleFaq(idx)}
                    activeOpacity={0.8}>
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Text style={styles.faqToggle}>{isOpen ? '−' : '+'}</Text>
                    </View>
                    {isOpen && (
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Spacer */}
          <View style={{ height: 130 + bottomInset }} />
        </ScrollView>

        {/* Sticky Bottom Consultation Bar */}
        <View style={[styles.stickyBottom, { paddingBottom: Math.max(bottomInset, 16), paddingTop: 12 }]}>
          <View style={styles.stickyInfo}>
            <Text style={styles.stickySubtitle}>Bangalore In-Home Care</Text>
            <Text style={styles.stickyTitle}>{detail.title}</Text>
          </View>
          <TouchableOpacity
            style={styles.consultationBtn}
            onPress={() => {
              onClose();
              onBookService(detail.title);
            }}
            activeOpacity={0.88}>
            <View style={styles.consultationBtnContent}>
              <Text style={styles.consultationBtnText}>Book Consultation</Text>
              <View style={styles.consultationBtnIconCircle}>
                <AppIcon name="arrow-up-right" size={11} color={Colors.terracotta} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.forestDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.forestDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  closeBtnText: {
    color: Colors.creamLight,
    fontSize: 12,
    fontWeight: '700',
  },
  topBarTitle: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '600',
    maxWidth: SCREEN_WIDTH - 150,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 310,
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.65)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 253, 249, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: Colors.goldWarm,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 33,
    marginBottom: 4,
  },
  heroTagline: {
    color: Colors.creamDark,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
  },
  metaCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  metaLabel: {
    color: Colors.sage,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  metaValue: {
    color: Colors.forestDark,
    fontSize: 12.5,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 26,
  },
  sectionOverline: {
    color: Colors.sage,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  overviewText: {
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 22,
  },
  inclusionsList: {
    gap: 12,
  },
  inclusionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'flex-start',
    gap: 12,
  },
  inclusionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  inclusionText: {
    flex: 1,
  },
  inclusionTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  inclusionDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  howItWorksSection: {
    backgroundColor: Colors.forestDark,
    paddingVertical: 28,
    marginTop: 34,
  },
  stepsList: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
  },
  stepNumCol: {
    alignItems: 'center',
    width: 28,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: Colors.creamLight,
    fontSize: 11,
    fontWeight: '800',
  },
  stepLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 4,
    minHeight: 28,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepTitle: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    color: 'rgba(255, 253, 249, 0.75)',
    fontSize: 12,
    lineHeight: 18,
  },
  faqsList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  faqToggle: {
    color: Colors.terracotta,
    fontSize: 18,
    fontWeight: '700',
  },
  faqAnswer: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.cardBorder,
    paddingTop: 8,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.creamLight,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  stickyInfo: {
    flex: 1,
    paddingRight: 12,
  },
  stickySubtitle: {
    color: Colors.sage,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stickyTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
  },
  consultationBtn: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
  },
  consultationBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consultationBtnText: {
    color: Colors.white,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  consultationBtnIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
