import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { APPUGE_INFO } from '../data/appugeData';
import { AppIcon } from './common/AppIcon';
import { useAppInsets } from '../theme/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface BookingData {
  id: string;
  service: string;
  tier?: string;
  stage: string;
  locality: string;
  deliveryDate: string;
  careStartDate: string;
  name: string;
  phone: string;
  email: string;
  specialRequirements: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed';
}

interface BookingModalProps {
  visible: boolean;
  prefillService?: string;
  user?: { name: string; phone: string; stage?: string; location?: string } | null;
  onClose: () => void;
  onBookingComplete?: (booking: BookingData) => void;
}

export interface ServiceTier {
  id: string;
  name: string;
  duration: string;
  description: string;
}

export interface ServiceDynamicStep {
  eyebrow: string;
  heading: string;
  italic: string;
  caption: string;
  options: string[];
}

export interface ServiceConfig {
  id: string;
  title: string;
  tag: string;
  icon: string;
  highlight: string;
  tiers: ServiceTier[];
  step2: ServiceDynamicStep;
  step4: ServiceDynamicStep;
  step5: ServiceDynamicStep;
}

export const SERVICE_CONFIGS: ServiceConfig[] = [
  {
    id: 'dual',
    title: 'Mother & Baby Dual Sanctuary',
    tag: '30 to 60 Days',
    icon: 'mother',
    highlight: 'Simultaneous in-home care restoring mother vitality while nurturing your newborn.',
    tiers: [
      {
        id: 'dual-40',
        name: 'The Sacred 40 Days (Complete Dual Sanctuary)',
        duration: '40 Days',
        description: 'Classical 40-day immersion: daily abhyanga, kashayam snana, baby massage & night rest.',
      },
      {
        id: 'dual-30',
        name: '30-Day Dual Recovery & Harmony',
        duration: '30 Days',
        description: 'Focused one-month program restoring mother stamina while establishing newborn soothing routines.',
      },
      {
        id: 'dual-60',
        name: '60-Day Extended Sanctuary Immersion',
        duration: '60 Days',
        description: 'Comprehensive two-month dual care with extended lactation support and baby milestone care.',
      },
    ],
    step2: {
      eyebrow: 'STEP 02 OF 07 · YOUR MOTHERHOOD SEASON',
      heading: 'Where are you in',
      italic: 'your dual journey?',
      caption: 'This guides our clinical team in preparing your custom mother & baby sanctuary protocols.',
      options: [
        'Expecting Mother (Planning Care for Upcoming Delivery)',
        'Hospital Discharge Approaching (Within 1 Week)',
        'Recently Delivered (First 40 Days at Home)',
        'Baby is 1 to 3 Months Old (Need Dual Support)',
      ],
    },
    step4: {
      eyebrow: 'STEP 04 OF 07 · CAREGIVER FORMAT & SHIFT',
      heading: 'Select your preferred',
      italic: 'caregiver shift.',
      caption: 'Appuge caregivers are verified, background-checked, and trained in classical postnatal rituals.',
      options: [
        '24/7 Live-In Sanctuary Nurse (Round-the-Clock Mother & Infant Care)',
        'Day Shift Sanctuary Care (10 Hours · 8:00 AM to 6:00 PM)',
        'Night Shift Newborn Care (10 Hours · 9:00 PM to 7:00 AM)',
        'C-Section Dedicated Dual Caregiver (Gentle Stitch & Infant Handling)',
      ],
    },
    step5: {
      eyebrow: 'STEP 05 OF 07 · CARE COMMENCEMENT',
      heading: 'When would you like',
      italic: 'your sanctuary to begin?',
      caption: 'We ensure your assigned caregiver and sanctuary kit are pre-dispatched to your Bangalore home.',
      options: [
        'Directly Upon Hospital Discharge',
        'Immediately / Within 24–48 Hours',
        'Starting Next Week',
        'Scheduled Around Expected Due Date',
      ],
    },
  },
  {
    id: 'mother',
    title: 'Post-Pregnancy Recovery (Mother Care)',
    tag: '21 to 45 Days',
    icon: 'mother',
    highlight: 'Dedicated maternal restorative rituals, pelvic healing, and herbal rejuvenation.',
    tiers: [
      {
        id: 'mother-40',
        name: 'The Sacred 40 Days Postnatal Rejuvenation',
        duration: '40 Days',
        description: 'Classical Ayurvedic abhyanga, herbal hot compresses, belly binding & pelvic vitality.',
      },
      {
        id: 'mother-21',
        name: '21-Day Intensive Healing Rituals',
        duration: '21 Days',
        description: 'Targeted recovery program for pain relief, spinal alignment, and lactation nourishment.',
      },
      {
        id: 'mother-30',
        name: '30-Day C-Section Restoration Program',
        duration: '30 Days',
        description: 'Gentle stitch healing, anti-inflammation care, gradual mobility, and nourishing massage.',
      },
    ],
    step2: {
      eyebrow: 'STEP 02 OF 07 · RECOVERY PROFILE',
      heading: 'Tell us about your',
      italic: 'delivery & healing needs.',
      caption: 'Caregivers tailor oil selection and belly wrapping based on your specific birth type.',
      options: [
        'Normal Delivery (Traditional Abhyanga, Belly Binding & Herbal Bath)',
        'C-Section Delivery (Gentle Stitch Care, Lymph Drainage & Soft Posture)',
        'Expecting Mother (Planning Postpartum Recovery Ahead)',
        'Experiencing Postnatal Fatigue, Back Ache & Pelvic Stiffness',
      ],
    },
    step4: {
      eyebrow: 'STEP 04 OF 07 · CAREGIVER ARRANGEMENT',
      heading: 'Choose caregiver',
      italic: 'schedule & duration.',
      caption: 'Experienced maternal care experts devoted exclusively to the mother’s physical restoration.',
      options: [
        'Day Shift Maternal Specialist (8 to 10 Hours Daily)',
        '24/7 Live-In Postnatal Caregiver',
        'Morning Intensive Rituals Session (3 to 4 Hours Daily)',
        '1-Week Postpartum Healing Trial Package',
      ],
    },
    step5: {
      eyebrow: 'STEP 05 OF 07 · RECOVERY TIMELINE',
      heading: 'When would you like',
      italic: 'maternal rituals to start?',
      caption: 'Ayurvedic rituals typically commence 3–7 days post-normal delivery or 14–21 days post-C-section.',
      options: [
        'Upon Hospital Discharge (Immediate Maternal Assistance)',
        'Within 48 Hours at Home',
        'Starting Next Week',
        'Coordinated with Expected Delivery Date',
      ],
    },
  },
  {
    id: 'baby',
    title: 'Newborn Baby Care',
    tag: 'Daytime or 24/7',
    icon: 'baby',
    highlight: 'Trained newborn specialists for sterile hygiene, baby abhyanga, and restful sleep routines.',
    tiers: [
      {
        id: 'baby-night',
        name: 'Night Angel Care (10 Hours)',
        duration: 'Night Shift',
        description: 'Night infant feeding assistance, soothing colic & allowing parents restful sleep.',
      },
      {
        id: 'baby-day',
        name: 'Daytime Newborn Care (8 to 10 Hours)',
        duration: 'Day Shift',
        description: 'Gentle baby massage, warm bath, sun exposure, milestone play & sterile hygiene.',
      },
      {
        id: 'baby-full',
        name: '24/7 Live-In Newborn Caregiver',
        duration: 'Full Time',
        description: 'Around-the-clock newborn handling, sleep establishing, and mother support.',
      },
    ],
    step2: {
      eyebrow: 'STEP 02 OF 07 · BABY PROFILE',
      heading: 'What is your baby’s',
      italic: 'current age & stage?',
      caption: 'We match specialists who specialize in the exact developmental stage of your little one.',
      options: [
        'Immediate Newborn (0 to 28 Days Old)',
        'Infant (1 to 3 Months Old)',
        'Infant (3 to 6 Months Old)',
        'Preterm Baby or Twin Babies Support',
      ],
    },
    step4: {
      eyebrow: 'STEP 04 OF 07 · PRIMARY CARE FOCUS',
      heading: 'What is the primary care',
      italic: 'focus for your baby?',
      caption: 'Select the area where your family desires the highest support from our trained newborn staff.',
      options: [
        'Baby Abhyanga Massage, Warm Bathing & Sunbath Routine',
        'Night Soothing, Establishing Sleep Rhythms & Calming Colic',
        'Sterile Umbilical Cord Care & Clinical Hygiene Maintenance',
        'Feeding Assistance, Burping & Bottle Sterilization Routine',
      ],
    },
    step5: {
      eyebrow: 'STEP 05 OF 07 · START TIMELINE',
      heading: 'When should baby care',
      italic: 'begin at home?',
      caption: 'Our newborn care coordinator will reserve and brief your baby specialist in advance.',
      options: [
        'Immediately / Starting Tonight',
        'From Hospital Discharge Date',
        'Starting Next Week',
        'Planning Ahead for Upcoming Birth',
      ],
    },
  },
  {
    id: 'doctor',
    title: 'Specialist Doctor Consultation',
    tag: 'Home Visit / Tele-Consult',
    icon: 'doctor',
    highlight: 'Consult leading pediatricians, obstetricians, lactation consultants, and Ayurvedic doctors.',
    tiers: [
      {
        id: 'doc-lactation',
        name: 'Certified Lactation Consultant (IBCLC)',
        duration: 'Home / Online',
        description: 'Painless latching assessment, correcting nipple soreness & boosting breast milk supply.',
      },
      {
        id: 'doc-pediatrician',
        name: 'Senior Pediatrician & Neonatologist',
        duration: 'Home / Online',
        description: 'Newborn health, jaundice evaluation, weight gain tracking & infant reflux checks.',
      },
      {
        id: 'doc-obgyn',
        name: 'Postnatal Obstetrician & Gynecologist',
        duration: 'Home / Online',
        description: 'C-Section/episiotomy stitch healing evaluation, pelvic health & uterine recovery.',
      },
      {
        id: 'doc-ayurveda',
        name: 'Ayurvedic Postnatal Vaidya',
        duration: 'Home / Online',
        description: 'Traditional pulse diagnosis, custom kashayam formulation & restorative dietary roadmap.',
      },
    ],
    step2: {
      eyebrow: 'STEP 02 OF 07 · CONSULTATION FORMAT',
      heading: 'How would you like to',
      italic: 'meet your specialist?',
      caption: 'Choose comfortable in-home clinical visits across Bangalore or instant secure video consults.',
      options: [
        'In-Home Doctor Visit (Doctor Visits Your Bangalore Home)',
        'High-Definition Video Tele-Consultation (Instant or Scheduled)',
        'Priority Emergency Video Consultation (Within 2 Hours)',
        'Comprehensive In-Home Lactation Assessment & Practical Latch Training',
      ],
    },
    step4: {
      eyebrow: 'STEP 04 OF 07 · PRIMARY MEDICAL REASON',
      heading: 'What is the primary',
      italic: 'reason for consultation?',
      caption: 'This allows our medical team to review relevant history prior to connecting with you.',
      options: [
        'Latching Difficulties, Nipple Soreness or Low Milk Supply',
        'C-Section Stitch Pain, Redness or Healing Review',
        'Baby Jaundice, Colic, Excessive Crying or Growth Concerns',
        'Postnatal Mood Changes, Hormonal Imbalance or Fatigue',
        'Routine Newborn & Mother Post-Hospital Health Checkup',
      ],
    },
    step5: {
      eyebrow: 'STEP 05 OF 07 · PREFERRED TIMING',
      heading: 'When would you like',
      italic: 'your consultation slot?',
      caption: 'We coordinate with senior specialists to schedule your private Bangalore consultation.',
      options: [
        'Earliest Available Slot (Today)',
        'Tomorrow Morning (10:00 AM to 1:00 PM)',
        'Tomorrow Afternoon / Evening (3:00 PM to 7:00 PM)',
        'Upcoming Weekend (Saturday / Sunday)',
      ],
    },
  },
  {
    id: 'nutrition',
    title: 'Nutritional Food Delivery',
    tag: 'Daily Warm Delivery',
    icon: 'soup',
    highlight: 'Warm, freshly prepared traditional postpartum meals, healing kashayams, and energy laddus.',
    tiers: [
      {
        id: 'food-40',
        name: 'Sacred 40-Day Postpartum Healing Thali',
        duration: '40 Days',
        description: 'Fresh warm daily lunch, dinner, morning herbal kashayam & restorative Gond laddus.',
      },
      {
        id: 'food-21',
        name: '21-Day Lactation & Digestion Boost Plan',
        duration: '21 Days',
        description: 'Galactagogue-rich Ayurvedic meals promoting milk supply, digestive fire & iron recovery.',
      },
      {
        id: 'food-7',
        name: '7-Day Healing Nourishment Trial',
        duration: '7 Days',
        description: 'One-week fresh trial of warm traditional post-pregnancy lunch & dinner drops.',
      },
      {
        id: 'food-box',
        name: 'Ayurvedic Kashayam & Desi Ghee Laddu Pack',
        duration: 'Weekly Box',
        description: 'Restorative postpartum snack pack with Methi laddus, Dink laddus & herbal decoctions.',
      },
    ],
    step2: {
      eyebrow: 'STEP 02 OF 07 · DIETARY TRADITION',
      heading: 'Which dietary tradition',
      italic: 'do you follow at home?',
      caption: 'Our kitchen prepares authentic satvik healing meals tailored strictly to your dietary customs.',
      options: [
        'Pure Satvik Vegetarian (No Onion, No Garlic, Easy Digestion)',
        'Traditional South Indian Pathiya Samayal (Garlic & Pepper Restorative)',
        'Vegetarian with Free-Range Organic Desi Eggs (High Protein)',
        'Custom Ayurvedic Diet (Personalized Based on Vaidya Guidance)',
      ],
    },
    step4: {
      eyebrow: 'STEP 04 OF 07 · DELIVERY SCHEDULE',
      heading: 'Select your daily',
      italic: 'meal delivery format.',
      caption: 'Delivered in insulated food-grade containers to preserve temperature and nutritional prana.',
      options: [
        'Twice Daily Warm Delivery (Fresh Lunch by 12 PM, Warm Dinner by 6:30 PM)',
        'Single Morning Delivery (Insulated Fresh Lunch + Dinner + Herbal Brew)',
        'Lunch Meal Only + Evening Herbal Soup & Restorative Laddu',
        'Trial Week Delivery (Test Flavor & Digestion for 7 Days)',
      ],
    },
    step5: {
      eyebrow: 'STEP 05 OF 07 · FIRST DELIVERY DATE',
      heading: 'When should your first',
      italic: 'warm meal arrive?',
      caption: 'Meals are cooked fresh in our certified clean kitchen each morning in Bangalore.',
      options: [
        'Starting Tomorrow Morning',
        'Starting in 2 to 3 Days',
        'Starting from Hospital Discharge Date',
        'Starting Next Monday',
      ],
    },
  },
];

export function getServiceConfig(titleOrId: string): ServiceConfig {
  const norm = (titleOrId || '').toLowerCase();
  if (norm.includes('dual') || (norm.includes('mother') && norm.includes('baby'))) {
    return SERVICE_CONFIGS[0];
  }
  if (norm.includes('recovery') || (norm.includes('mother') && !norm.includes('baby')) || norm.includes('post-pregnancy')) {
    return SERVICE_CONFIGS[1];
  }
  if (norm.includes('baby') || norm.includes('newborn')) {
    return SERVICE_CONFIGS[2];
  }
  if (norm.includes('doctor') || norm.includes('consult') || norm.includes('specialist')) {
    return SERVICE_CONFIGS[3];
  }
  if (norm.includes('nutrition') || norm.includes('food') || norm.includes('diet') || norm.includes('meal')) {
    return SERVICE_CONFIGS[4];
  }
  return SERVICE_CONFIGS[0];
}

const LOCALITIES = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Whitefield',
  'Jayanagar',
  'JP Nagar',
  'Electronic City',
  'Hebbal / North BLR',
  'Sarjapur Road',
  'Bellandur',
  'Malleshwaram',
  'Yelahanka',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  prefillService = 'Mother & Baby Dual Sanctuary',
  user,
  onClose,
  onBookingComplete,
}) => {
  const { top: topInset, bottom: bottomInset } = useAppInsets();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedService, setSelectedService] = useState(prefillService);
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedLocality, setSelectedLocality] = useState(user?.location || LOCALITIES[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [careStartDate, setCareStartDate] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentConfig = useMemo(() => getServiceConfig(selectedService), [selectedService]);

  useEffect(() => {
    if (visible) {
      const config = getServiceConfig(prefillService || 'Mother & Baby Dual Sanctuary');
      setSelectedService(config.title);
      setSelectedTier(config.tiers[0].name);
      setSelectedStage(user?.stage || config.step2.options[0]);
      setSelectedLocality(user?.location || LOCALITIES[0]);
      setDeliveryDate(config.step4.options[0]);
      setCareStartDate(config.step5.options[0]);
      if (user?.name) setName(user.name);
      if (user?.phone) setPhone(user.phone);
      setCurrentStep(1);
      setIsConfirmed(false);
    }
  }, [user, prefillService, visible]);

  const handleSelectService = (config: ServiceConfig) => {
    setSelectedService(config.title);
    setSelectedTier(config.tiers[0].name);
    setSelectedStage(config.step2.options[0]);
    setDeliveryDate(config.step4.options[0]);
    setCareStartDate(config.step5.options[0]);
  };

  const handleNext = () => {
    if (currentStep === 6) {
      if (!name.trim()) {
        Alert.alert('Name Required', 'Please enter your name.');
        return;
      }
      if (!phone.trim()) {
        Alert.alert('Phone Required', 'Please enter your phone number.');
        return;
      }
    }
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 7) {
      // Complete booking
      const newBooking: BookingData = {
        id: `BK-${Date.now().toString().slice(-6)}`,
        service: selectedService,
        tier: selectedTier,
        stage: selectedStage,
        locality: selectedLocality,
        deliveryDate,
        careStartDate,
        name,
        phone,
        email,
        specialRequirements,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Confirmed',
      };
      onBookingComplete?.(newBooking);
      setIsConfirmed(true);
      setCurrentStep(8);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isConfirmed) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Hello Appuge Care Concierge! I have submitted a care consultation request.\n\n` +
        `• Service: ${selectedService}\n` +
        (selectedTier ? `• Program / Tier: ${selectedTier}\n` : '') +
        `• Stage / Preference: ${selectedStage}\n` +
        `• Bangalore Area: ${selectedLocality}\n` +
        `• Details: ${deliveryDate}\n` +
        `• Schedule: ${careStartDate}\n` +
        `• Name: ${name} (${phone})\n` +
        (specialRequirements ? `• Special Notes: ${specialRequirements}\n` : ''),
    );
    Linking.openURL(`https://wa.me/${APPUGE_INFO.phone}?text=${text}`).catch(() => {
      Alert.alert('Unable to open WhatsApp', 'Please call us directly at ' + APPUGE_INFO.phoneDisplay);
    });
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

        {/* Top Header */}
        <View style={[styles.topBar, { paddingTop: topInset + 8, paddingBottom: 12 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityLabel="Back or close">
            <Text style={styles.backBtnText}>
              {currentStep === 1 || isConfirmed ? '✕ Close' : '← Back'}
            </Text>
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <Text style={styles.topBrand}>appuge</Text>
            <Text style={styles.topSubtitle}>CARE CONCIERGE</Text>
          </View>

          <View style={styles.stepCounter}>
            <Text style={styles.stepCounterText}>
              {isConfirmed ? '✓' : `${currentStep} / 7`}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {!isConfirmed && (
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentStep / 7) * 100}%` },
              ]}
            />
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
                    {/* STEP 1: SELECT SERVICE & PROGRAM */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 01 OF 07 · SANCTUARY & PROGRAM</Text>
              <Text style={styles.stepHeading}>
                Which care sanctuary{'\n'}
                <Text style={styles.stepItalic}>are you looking for?</Text>
              </Text>
              <Text style={styles.stepCaption}>
                Select a maternal care domain to view verified in-home programs in Bangalore.
              </Text>

              {/* 1. Horizontal Sanctuary Category Selector Rail */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sanctuaryTabsRail}
                style={styles.sanctuaryTabsScroll}>
                {SERVICE_CONFIGS.map(s => {
                  const isActive = currentConfig.id === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.sanctuaryTab, isActive && styles.sanctuaryTabActive]}
                      onPress={() => handleSelectService(s)}
                      activeOpacity={0.8}>
                      <View
                        style={[
                          styles.sanctuaryTabIconBox,
                          isActive && styles.sanctuaryTabIconBoxActive,
                        ]}>
                        <AppIcon
                          name={s.icon}
                          size={18}
                          color={isActive ? Colors.creamLight : Colors.forestDark}
                        />
                      </View>
                      <View style={styles.sanctuaryTabTextCol}>
                        <Text
                          style={[
                            styles.sanctuaryTabTitle,
                            isActive && styles.sanctuaryTabTitleActive,
                          ]}>
                          {s.title.replace(' (Mother Care)', '')}
                        </Text>
                        <Text
                          style={[
                            styles.sanctuaryTabTag,
                            isActive && styles.sanctuaryTabTagActive,
                          ]}>
                          {s.tag}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* 2. Active Sanctuary Header Banner */}
              <View style={styles.activeDomainBanner}>
                <View style={styles.activeDomainTop}>
                  <View style={styles.activeDomainBadge}>
                    <AppIcon name="sparkle" size={11} color={Colors.goldWarm} />
                    <Text style={styles.activeDomainBadgeText}>
                      {currentConfig.title.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.activeDomainCount}>
                    {currentConfig.tiers.length} Curated Options
                  </Text>
                </View>
                <Text style={styles.activeDomainHighlight}>
                  {currentConfig.highlight}
                </Text>
              </View>

              {/* 3. Tailored Program Cards */}
              <View style={styles.programList}>
                {currentConfig.tiers.map((tier, index) => {
                  const isTierActive = selectedTier === tier.name;
                  return (
                    <TouchableOpacity
                      key={tier.id}
                      style={[
                        styles.programCard,
                        isTierActive && styles.programCardActive,
                      ]}
                      onPress={() => setSelectedTier(tier.name)}
                      activeOpacity={0.85}>
                      {/* Top row: Number + Title + Duration */}
                      <View style={styles.programCardHeader}>
                        <View style={styles.programCardLeft}>
                          <Text
                            style={[
                              styles.programCardIndex,
                              isTierActive && styles.programCardIndexActive,
                            ]}>
                            0{index + 1}
                          </Text>
                          <Text
                            style={[
                              styles.programCardTitle,
                              isTierActive && styles.programCardTitleActive,
                            ]}>
                            {tier.name}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.programDurationBadge,
                            isTierActive && styles.programDurationBadgeActive,
                          ]}>
                          <Text
                            style={[
                              styles.programDurationText,
                              isTierActive && styles.programDurationTextActive,
                            ]}>
                            {tier.duration}
                          </Text>
                        </View>
                      </View>

                      {/* Description */}
                      <Text
                        style={[
                          styles.programCardDesc,
                          isTierActive && styles.programCardDescActive,
                        ]}>
                        {tier.description}
                      </Text>

                      {/* Bottom Inclusions & Selection Indicator */}
                      <View style={styles.programCardFooter}>
                        <View style={styles.programCardInclusions}>
                          <AppIcon
                            name="shieldCheck"
                            size={13}
                            color={isTierActive ? Colors.goldWarm : Colors.sage}
                          />
                          <Text
                            style={[
                              styles.programCardInclusionText,
                              isTierActive && styles.programCardInclusionTextActive,
                            ]}>
                            Verified Protocol · Bangalore In-Home Care
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.programSelectCircle,
                            isTierActive && styles.programSelectCircleActive,
                          ]}>
                          <Text
                            style={[
                              styles.programSelectIcon,
                              isTierActive && styles.programSelectIconActive,
                            ]}>
                            {isTierActive ? '✓' : '○'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

{/* STEP 2: DYNAMIC STAGE / FORMAT */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>{currentConfig.step2.eyebrow}</Text>
              <Text style={styles.stepHeading}>
                {currentConfig.step2.heading}{'\n'}
                <Text style={styles.stepItalic}>{currentConfig.step2.italic}</Text>
              </Text>
              <Text style={styles.stepCaption}>
                {currentConfig.step2.caption}
              </Text>

              <View style={styles.optionsList}>
                {currentConfig.step2.options.map((opt, i) => {
                  const isSelected = selectedStage === opt;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.choiceCard, isSelected && styles.optionCardActive]}
                      onPress={() => setSelectedStage(opt)}
                      activeOpacity={0.8}>
                      <Text
                        style={[
                          styles.choiceText,
                          isSelected && styles.optionTitleActive,
                        ]}>
                        {opt}
                      </Text>
                      <Text
                        style={[
                          styles.optionRadio,
                          isSelected && styles.optionRadioActive,
                        ]}>
                        {isSelected ? '●' : '○'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: BANGALORE LOCALITY */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 03 OF 07 · HOME LOCATION</Text>
              <Text style={styles.stepHeading}>
                Your Bangalore{'\n'}
                <Text style={styles.stepItalic}>neighbourhood.</Text>
              </Text>
              <Text style={styles.stepCaption}>
                We serve homes across all prime zones in Bangalore with verified local staff.
              </Text>

              <View style={styles.chipsWrap}>
                {LOCALITIES.map((loc, i) => {
                  const isSelected = selectedLocality === loc;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.localityChip, isSelected && styles.localityChipActive]}
                      onPress={() => setSelectedLocality(loc)}
                      activeOpacity={0.75}>
                      <Text
                        style={[
                          styles.localityChipText,
                          isSelected && styles.localityChipTextActive,
                        ]}>
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: DYNAMIC DETAILS / FORMAT */}
          {currentStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>{currentConfig.step4.eyebrow}</Text>
              <Text style={styles.stepHeading}>
                {currentConfig.step4.heading}{'\n'}
                <Text style={styles.stepItalic}>{currentConfig.step4.italic}</Text>
              </Text>
              <Text style={styles.stepCaption}>
                {currentConfig.step4.caption}
              </Text>

              <View style={styles.optionsList}>
                {currentConfig.step4.options.map((opt, i) => {
                  const isSelected = deliveryDate === opt;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.choiceCard, isSelected && styles.optionCardActive]}
                      onPress={() => setDeliveryDate(opt)}
                      activeOpacity={0.8}>
                      <Text
                        style={[
                          styles.choiceText,
                          isSelected && styles.optionTitleActive,
                        ]}>
                        {opt}
                      </Text>
                      <Text
                        style={[
                          styles.optionRadio,
                          isSelected && styles.optionRadioActive,
                        ]}>
                        {isSelected ? '●' : '○'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: DYNAMIC TIMELINE / START DATE */}
          {currentStep === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>{currentConfig.step5.eyebrow}</Text>
              <Text style={styles.stepHeading}>
                {currentConfig.step5.heading}{'\n'}
                <Text style={styles.stepItalic}>{currentConfig.step5.italic}</Text>
              </Text>
              <Text style={styles.stepCaption}>
                {currentConfig.step5.caption}
              </Text>

              <View style={styles.optionsList}>
                {currentConfig.step5.options.map((opt, i) => {
                  const isSelected = careStartDate === opt;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.choiceCard, isSelected && styles.optionCardActive]}
                      onPress={() => setCareStartDate(opt)}
                      activeOpacity={0.8}>
                      <Text
                        style={[
                          styles.choiceText,
                          isSelected && styles.optionTitleActive,
                        ]}>
                        {opt}
                      </Text>
                      <Text
                        style={[
                          styles.optionRadio,
                          isSelected && styles.optionRadioActive,
                        ]}>
                        {isSelected ? '●' : '○'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 6: CONTACT DETAILS */}
          {currentStep === 6 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 06 OF 07 · CONTACT DETAILS</Text>
              <Text style={styles.stepHeading}>
                How may our Care Desk{'\n'}
                <Text style={styles.stepItalic}>reach you?</Text>
              </Text>
              <Text style={styles.stepCaption}>
                Our senior care coordinator will reach out warmly with program details.
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>FULL NAME *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Ananya Sharma"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.inputLabel}>WHATSAPP / PHONE NUMBER *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor={Colors.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>EMAIL ADDRESS (OPTIONAL)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. ananya@example.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* STEP 7: SPECIAL REQUIREMENTS */}
          {currentStep === 7 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEyebrow}>STEP 07 OF 07 · PERSONAL PREFERENCES</Text>
              <Text style={styles.stepHeading}>
                Anything else you’d{'\n'}
                <Text style={styles.stepItalic}>like us to know?</Text>
              </Text>
              <Text style={styles.stepCaption}>
                Share dietary preferences, C-section notes, twin care, or caregiver language preferences.
              </Text>

              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. Vegetarian diet, Kannada or English speaking caregiver preferred, recovering from planned C-section..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={specialRequirements}
                onChangeText={setSpecialRequirements}
              />

              {/* Review Summary Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>CONSULTATION SUMMARY</Text>
                <Text style={styles.summaryItem}>• Sanctuary: {selectedService}</Text>
                {selectedTier ? (
                  <Text style={styles.summaryItem}>• Selected Plan: {selectedTier}</Text>
                ) : null}
                <Text style={styles.summaryItem}>• Stage / Preference: {selectedStage}</Text>
                <Text style={styles.summaryItem}>• Area: {selectedLocality}, Bangalore</Text>
                <Text style={styles.summaryItem}>• Details: {deliveryDate}</Text>
                <Text style={styles.summaryItem}>• Schedule: {careStartDate}</Text>
                <Text style={styles.summaryItem}>• Parent: {name} ({phone})</Text>
              </View>
            </View>
          )}

          {/* STEP 8: CONFIRMATION SUCCESS */}
          {currentStep === 8 && isConfirmed && (
            <View style={styles.stepContainer}>
              <View style={styles.confirmedIconCircle}>
                <AppIcon name="check" size={26} color={Colors.white} />
              </View>

              <Text style={styles.confirmedEyebrow}>REQUEST RECEIVED · BENGALURU</Text>
              <Text style={styles.confirmedHeading}>Your care journey begins here.</Text>
              <Text style={styles.confirmedDesc}>
                Thank you, {name || 'Mama'}. Our Appuge Care Coordinator has
                received your request for {selectedService} in {selectedLocality}.
                We will call you shortly to align on your caregiver match.
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.whatsAppConfirmBtn}
                  onPress={handleWhatsAppConfirmation}
                  activeOpacity={0.85}>
                  <View style={styles.whatsAppBtnRow}>
                    <AppIcon name="whatsapp" size={16} color={Colors.white} />
                    <Text style={styles.whatsAppConfirmText}>
                      Connect on WhatsApp Instantly
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeDoneBtn}
                  onPress={onClose}
                  activeOpacity={0.8}>
                  <Text style={styles.closeDoneText}>Return to Appuge Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Bar */}
        {!isConfirmed && (
          <View style={[styles.bottomBar, { paddingBottom: Math.max(bottomInset, 16), paddingTop: 10 }]}>
            {currentStep === 1 && selectedTier ? (
              <View style={styles.bottomSelectionPreview}>
                <Text style={styles.bottomPreviewLabel}>SELECTED PROGRAM:</Text>
                <Text style={styles.bottomPreviewText} numberOfLines={1}>
                  {selectedTier}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.primaryNextBtn}
              onPress={handleNext}
              activeOpacity={0.88}>
              <View style={styles.primaryNextBtnContent}>
                <Text style={styles.primaryNextBtnText}>
                  {currentStep === 7 ? 'Submit Care Request' : 'Continue'}
                </Text>
                <View style={styles.primaryNextBtnIconCircle}>
                  <AppIcon
                    name={currentStep === 7 ? 'arrow-up-right' : 'arrow-right'}
                    size={13}
                    color={Colors.terracotta}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sanctuaryTabsScroll: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  sanctuaryTabsRail: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
  },
  sanctuaryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sanctuaryTabActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  sanctuaryTabIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanctuaryTabIconBoxActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sanctuaryTabTextCol: {
    justifyContent: 'center',
  },
  sanctuaryTabTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
  },
  sanctuaryTabTitleActive: {
    color: Colors.creamLight,
  },
  sanctuaryTabTag: {
    color: Colors.sage,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  sanctuaryTabTagActive: {
    color: Colors.goldWarm,
  },
  activeDomainBanner: {
    backgroundColor: 'rgba(44, 64, 53, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
    padding: 14,
    marginBottom: 16,
  },
  activeDomainTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  activeDomainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeDomainBadgeText: {
    color: Colors.forest,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  activeDomainCount: {
    color: Colors.terracotta,
    fontSize: 11,
    fontWeight: '700',
  },
  activeDomainHighlight: {
    color: Colors.forestDark,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  programList: {
    gap: 12,
  },
  programCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    padding: 16,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  programCardActive: {
    borderColor: Colors.forestDark,
    backgroundColor: '#FCFAF6',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  programCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  programCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  programCardIndex: {
    color: Colors.sage,
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  programCardIndexActive: {
    color: Colors.terracotta,
  },
  programCardTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
  },
  programCardTitleActive: {
    color: Colors.forestDark,
  },
  programDurationBadge: {
    backgroundColor: Colors.sagePale,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  programDurationBadgeActive: {
    backgroundColor: Colors.terracotta,
  },
  programDurationText: {
    color: Colors.forestDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  programDurationTextActive: {
    color: Colors.white,
  },
  programCardDesc: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
    paddingLeft: 22,
  },
  programCardDescActive: {
    color: Colors.forest,
  },
  programCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(22, 40, 30, 0.08)',
    paddingLeft: 22,
  },
  programCardInclusions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  programCardInclusionText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  programCardInclusionTextActive: {
    color: Colors.sageDark,
    fontWeight: '600',
  },
  programSelectCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  programSelectCircleActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  programSelectIcon: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  programSelectIconActive: {
    color: Colors.creamLight,
  },
  bottomSelectionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bottomPreviewLabel: {
    color: Colors.sageDark,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomPreviewText: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 240,
  },

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
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  backBtnText: {
    color: Colors.creamLight,
    fontSize: 12,
    fontWeight: '700',
  },
  topCenter: {
    alignItems: 'center',
  },
  topBrand: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  topSubtitle: {
    color: Colors.goldWarm,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  stepCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepCounterText: {
    color: Colors.creamLight,
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.terracotta,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    paddingTop: 10,
  },
  stepEyebrow: {
    color: Colors.sage,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  stepHeading: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 8,
  },
  stepItalic: {
    fontStyle: 'italic',
    color: Colors.forest,
  },
  stepCaption: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 22,
  },
  optionsList: {
    gap: 10,
  },
  serviceCardWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  serviceCardWrapperActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceHeaderTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  optionIconBoxActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  tiersContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  tiersDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 10,
  },
  tiersHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  tiersHeading: {
    color: Colors.goldWarm,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  tiersList: {
    gap: 8,
  },
  tierCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 11,
  },
  tierCardActive: {
    backgroundColor: 'rgba(232, 160, 32, 0.16)',
    borderColor: Colors.goldWarm,
  },
  tierTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    marginRight: 8,
  },
  tierBullet: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  tierBulletActive: {
    color: Colors.goldWarm,
  },
  tierTitle: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  tierTitleActive: {
    color: Colors.white,
  },
  tierBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tierBadgeActive: {
    backgroundColor: Colors.terracotta,
  },
  tierBadgeText: {
    color: Colors.creamLight,
    fontSize: 9,
    fontWeight: '800',
  },
  tierBadgeTextActive: {
    color: Colors.white,
  },
  tierDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    lineHeight: 15.5,
    marginLeft: 21,
  },
  tierDescriptionActive: {
    color: Colors.creamLight,
  },
  serviceOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  optionCardActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(22, 40, 30, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsAppBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
  },
  optionTitleActive: {
    color: Colors.creamLight,
  },
  optionTag: {
    color: Colors.sage,
    fontSize: 11,
    marginTop: 2,
  },
  optionTagActive: {
    color: Colors.goldWarm,
  },
  optionRadio: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  optionRadioActive: {
    color: Colors.goldWarm,
  },
  choiceText: {
    color: Colors.forestDark,
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  localityChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  localityChipActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  localityChipText: {
    color: Colors.forest,
    fontSize: 12.5,
    fontWeight: '600',
  },
  localityChipTextActive: {
    color: Colors.creamLight,
  },
  formGroup: {
    gap: 14,
  },
  inputLabel: {
    color: Colors.sage,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    color: Colors.forestDark,
  },
  textArea: {
    height: 110,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: Colors.sagePale,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  summaryTitle: {
    color: Colors.forestDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  summaryItem: {
    color: Colors.forest,
    fontSize: 12,
    lineHeight: 17,
  },
  confirmedIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  confirmedIcon: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '800',
  },
  confirmedEyebrow: {
    color: Colors.sage,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  confirmedHeading: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmedDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButtons: {
    gap: 12,
  },
  whatsAppConfirmBtn: {
    backgroundColor: Colors.forestDark,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  whatsAppConfirmText: {
    color: Colors.creamLight,
    fontSize: 13.5,
    fontWeight: '700',
  },
  closeDoneBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  closeDoneText: {
    color: Colors.forest,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    backgroundColor: Colors.creamLight,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryNextBtn: {
    backgroundColor: Colors.terracotta,
    minHeight: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryNextBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryNextBtnText: {
    color: Colors.white,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryNextBtnIconCircle: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
});
