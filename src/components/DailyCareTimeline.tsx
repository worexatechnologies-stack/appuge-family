import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';

interface TimelineItemData {
  id: string;
  stepNumber: string;
  time: string;
  phase: string;
  title: string;
  description: string;
  icon: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  statusType: 'completed' | 'active' | 'upcoming';
  caregiver: string;
  items: string[];
  protocolNote: string;
}

const CARE_STEPS: TimelineItemData[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    time: '07:30 AM',
    phase: 'SUNRISE RITUAL',
    title: 'A gentle beginning',
    description:
      'Warm herbal oil massage (Abhyanga) and therapeutic herbal steam bath to restore circulation and ease birth fatigue.',
    icon: 'leaf',
    status: 'Completed',
    statusType: 'completed',
    caregiver: 'Smt. Lakshmi · Senior Postnatal Doula',
    items: ['Dhanwantharam Kuzhambu', 'Herbal Swedana Steam', 'Pelvic Muscle Soothing'],
    protocolNote: 'Kindles natural circulation and dispels Vata stagnation following birth.',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    time: '10:00 AM',
    phase: 'MORNING BONDING',
    title: 'Newborn care & bath',
    description:
      'Gentle baby massage using cold-pressed virgin coconut oil, warm herbal water bath, umbilical cord dressing, and sun-soothing.',
    icon: 'baby',
    status: 'Completed',
    statusType: 'completed',
    caregiver: 'Nurse Geetha · Certified Neonatal Doula',
    items: ['Virgin Coconut Oil Bath', 'Umbilical Cord Dressing', 'Gentle Infant Swaddle'],
    protocolNote: 'Promotes deep infant sleep, healthy skin barrier, and safe umbilical healing.',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    time: '01:00 PM',
    phase: 'MIDDAY NOURISHMENT',
    title: 'Nourishment and rest',
    description:
      'Healing warm Ayurvedic kashayam, hot digestible postpartum thali cooked in pure A2 ghee, followed by undisturbed maternal nap.',
    icon: 'soup',
    status: 'In Progress',
    statusType: 'active',
    caregiver: 'Chef Ananya · Postpartum Ahara Specialist',
    items: ['Fresh Shunti Kashayam', 'A2 Ghee Garlic Rasam', 'Sprouted Ragi Porridge'],
    protocolNote: 'Kindles compromised postpartum digestive Agni without causing bloating or acidity.',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    time: '05:00 PM',
    phase: 'EVENING RECOVERY',
    title: 'Mother\'s wellness & latch check',
    description:
      'Traditional cotton cloth belly wrapping, painless latch and milk supply check, soothing warm herbal compress, and emotional care.',
    icon: 'mother',
    status: 'Scheduled',
    statusType: 'upcoming',
    caregiver: 'Sister Mary · IBCLC Lactation Specialist',
    items: ['Cotton Belly Binding', 'Lactation Latch Check', 'Warm Herbal Compress'],
    protocolNote: 'Supports uterine involution and eases shoulder/neck tension from feeding.',
  },
  {
    id: 'step-5',
    stepNumber: '05',
    time: '09:00 PM',
    phase: 'NIGHT SANCTUARY',
    title: 'A peaceful night',
    description:
      'Caregiver assumes complete nocturnal nursery supervision, burping, and diapering so mother enjoys 6 to 8 hours of restorative deep sleep.',
    icon: 'moon',
    status: 'Scheduled',
    statusType: 'upcoming',
    caregiver: 'Night Nurse Rekha · Nocturnal Caregiver',
    items: ['Nighttime Feed Handover', 'Soothing Swaddle & Burp', 'Uninterrupted Mother Sleep'],
    protocolNote: 'Clinical research confirms uninterrupted night sleep is the #1 accelerant of maternal recovery.',
  },
];

export const DailyCareTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('step-3');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      {/* 1. SECTION TITLE & EDITORIAL OVERVIEW */}
      <View style={styles.header}>
        <Text style={styles.overline}>IN-HOME RESTORATION</Text>
        <Text style={styles.heading}>A little more care, every day.</Text>
        <Text style={styles.subtext}>
          From sunrise rituals to peaceful nights, your caregiver is there.
        </Text>
      </View>

      {/* 2. FLIPKART / ORDER DETAILS LIVE TRACKER HEADER */}
      <View style={styles.orderTrackerCard}>
        <View style={styles.orderTrackerTop}>
          <View style={styles.protocolBadge}>
            <Text style={styles.protocolBadgeText}>PROTOCOL #APG-CARE-2026</Text>
          </View>
          <View style={styles.liveStatusPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveStatusText}>LIVE SCHEDULE</Text>
          </View>
        </View>

        <Text style={styles.orderTrackerTitle}>Today's In-Home Caregiver Schedule</Text>
        <Text style={styles.orderTrackerLocation}>📍 Bangalore Sanctuary · 5 Coordinated Rituals</Text>

        {/* Segmented Progress Tracker Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabelText}>3 of 5 Rituals Active Today</Text>
            <Text style={styles.progressPercentText}>60% Complete</Text>
          </View>
        </View>
      </View>

      {/* 3. VERTICAL ORDER DETAILS STEPPER */}
      <View style={styles.stepperContainer}>
        {CARE_STEPS.map((step, index) => {
          const isLast = index === CARE_STEPS.length - 1;
          const isExpanded = expandedId === step.id;

          // Stepper Node styling
          const isCompleted = step.statusType === 'completed';
          const isActive = step.statusType === 'active';

          return (
            <View key={step.id} style={styles.stepRow}>
              {/* LEFT: STEPPER NODE & CONNECTOR LINE */}
              <View style={styles.stepperLineCol}>
                {/* Milestone Node */}
                <View
                  style={[
                    styles.stepperNode,
                    isCompleted && styles.nodeCompleted,
                    isActive && styles.nodeActive,
                    !isCompleted && !isActive && styles.nodeUpcoming,
                  ]}>
                  {isCompleted ? (
                    <AppIcon name="check" size={13} color={Colors.white} />
                  ) : isActive ? (
                    <View style={styles.activeInnerDot} />
                  ) : (
                    <View style={styles.upcomingInnerDot} />
                  )}
                </View>

                {/* Connecting Vertical Line */}
                {!isLast && (
                  <View
                    style={[
                      styles.connectorLine,
                      isCompleted ? styles.connectorCompleted : styles.connectorUpcoming,
                    ]}
                  />
                )}
              </View>

              {/* RIGHT: REAL ORDER DETAILS CARD */}
              <TouchableOpacity
                style={[
                  styles.card,
                  isActive && styles.cardActiveHighlight,
                ]}
                activeOpacity={0.92}
                onPress={() => toggleExpand(step.id)}>
                {/* Header Row: Phase Tag + Time Pill */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.phasePill}>
                    <Text style={styles.phasePillText}>{step.stepNumber} · {step.phase}</Text>
                  </View>

                  <View style={styles.timePill}>
                    <AppIcon name="clock" size={11} color={Colors.textSecondary} />
                    <Text style={styles.timePillText}>{step.time}</Text>
                  </View>
                </View>

                {/* Status Indicator (Flipkart style) */}
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusChip,
                      isCompleted && styles.statusChipCompleted,
                      isActive && styles.statusChipActive,
                      !isCompleted && !isActive && styles.statusChipUpcoming,
                    ]}>
                    <Text
                      style={[
                        styles.statusChipText,
                        isCompleted && styles.statusChipTextCompleted,
                        isActive && styles.statusChipTextActive,
                        !isCompleted && !isActive && styles.statusChipTextUpcoming,
                      ]}>
                      {isCompleted ? '✓ Completed' : isActive ? '● Active In Progress' : '○ Scheduled'}
                    </Text>
                  </View>
                </View>

                {/* Title & Description */}
                <Text style={styles.cardTitle}>{step.title}</Text>
                <Text style={styles.cardDesc}>{step.description}</Text>

                {/* Tangible Items / Ritual Deliverables Pills */}
                <View style={styles.itemsWrapper}>
                  {step.items.map((item, itemIdx) => (
                    <View key={itemIdx} style={styles.itemTag}>
                      <Text style={styles.itemTagBullet}>✦</Text>
                      <Text style={styles.itemTagText}>{item}</Text>
                    </View>
                  ))}
                </View>

                {/* Expandable Protocol Insight */}
                {isExpanded && (
                  <View style={styles.expandedBox}>
                    <View style={styles.expandedDivider} />
                    <View style={styles.expandedRow}>
                      <AppIcon name="verified" size={13} color={Colors.forestMedium} />
                      <Text style={styles.expandedLabel}>CLINICAL POSTNATAL PURPOSE:</Text>
                    </View>
                    <Text style={styles.expandedNote}>{step.protocolNote}</Text>
                  </View>
                )}

                {/* Card Footer: Caregiver & Action Indicator */}
                <View style={styles.cardFooter}>
                  <View style={styles.caregiverInfo}>
                    <AppIcon name="shield" size={12} color={Colors.sageDark} />
                    <Text style={styles.caregiverText} numberOfLines={1}>
                      {step.caregiver}
                    </Text>
                  </View>

                  <Text style={styles.expandActionText}>
                    {isExpanded ? 'Less ▴' : 'Details ▾'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  // HEADER
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  overline: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: '#5E7A63',
    fontWeight: '800',
    marginBottom: 6,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 25,
    color: '#16281E',
    lineHeight: 33,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 13,
    color: '#475C50',
    lineHeight: 19,
  },

  // FLIPKART / ORDER TRACKER SUMMARY CARD
  orderTrackerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EDE5D8',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderTrackerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  protocolBadge: {
    backgroundColor: '#F3EFE6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  protocolBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.forestDark,
    letterSpacing: 0.8,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  orderTrackerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 2,
  },
  orderTrackerLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  progressBarWrapper: {
    gap: 5,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F0EAE1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestDark,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },

  // STEPPER LAYOUT
  stepperContainer: {
    flexDirection: 'column',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepperLineCol: {
    width: 32,
    alignItems: 'center',
  },
  stepperNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: '#2E7D32',
  },
  nodeActive: {
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.terracotta,
  },
  activeInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.terracotta,
  },
  nodeUpcoming: {
    backgroundColor: '#FAF4EB',
    borderWidth: 2,
    borderColor: '#C8D9CB',
  },
  upcomingInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A2B5A5',
  },
  connectorLine: {
    width: 2.5,
    flex: 1,
    minHeight: 120,
    marginTop: 2,
    marginBottom: 2,
  },
  connectorCompleted: {
    backgroundColor: '#2E7D32',
  },
  connectorUpcoming: {
    backgroundColor: '#C8D9CB',
  },

  // CARD COLUMN
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginLeft: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EDE5D8',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardActiveHighlight: {
    borderColor: 'rgba(200, 109, 81, 0.45)',
    backgroundColor: '#FFFCFA',
    shadowColor: Colors.terracotta,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phasePill: {
    backgroundColor: '#F3EFE6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  phasePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.forestDark,
    letterSpacing: 0.8,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F7F3EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },

  // STATUS INDICATOR
  statusRow: {
    marginBottom: 6,
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  statusChipCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusChipActive: {
    backgroundColor: '#FDF2E9',
  },
  statusChipUpcoming: {
    backgroundColor: '#F2F5F3',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statusChipTextCompleted: {
    color: '#2E7D32',
  },
  statusChipTextActive: {
    color: Colors.terracotta,
  },
  statusChipTextUpcoming: {
    color: '#5E7A63',
  },

  // TITLE & DESCRIPTION
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 10,
  },

  // TANGIBLE ITEMS / RITUAL DELIVERABLES
  itemsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9F6F0',
    borderWidth: 1,
    borderColor: '#ECE4D7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemTagBullet: {
    fontSize: 8,
    color: Colors.goldWarm,
  },
  itemTagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.forestDark,
  },

  // EXPANDABLE PROTOCOL NOTES
  expandedBox: {
    marginBottom: 10,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: '#EFE7DA',
    marginBottom: 8,
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  expandedLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.forestMedium,
    letterSpacing: 0.8,
  },
  expandedNote: {
    fontSize: 11.5,
    lineHeight: 17,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // CARD FOOTER
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0E8DC',
    paddingTop: 8,
    marginTop: 2,
  },
  caregiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    paddingRight: 8,
  },
  caregiverText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  expandActionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.terracotta,
  },
});

export default DailyCareTimeline;
