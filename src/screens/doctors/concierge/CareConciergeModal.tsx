import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CareConciergeState,
  CareOptionItem,
  ConciergeLocality,
  ConciergeModality,
  ConciergeRecipient,
  ConciergeResultsData,
  RecommendedDoctor,
} from '../../../types/careConcierge.types';
import { DoctorMatchingService } from '../../../services/doctorMatching.service';
import { DoctorProfile } from '../../../data/doctorsData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
}

// Visual options for Question 1
const RECIPIENT_OPTIONS: {
  id: ConciergeRecipient;
  label: string;
  image: ImageSourcePropType;
  tagline: string;
}[] = [
  {
    id: 'MYSELF',
    label: 'Myself',
    image: require('../../../assets/images/01.jpg'),
    tagline: 'Maternal vitality & postpartum healing',
  },
  {
    id: 'PREGNANCY',
    label: 'My pregnancy',
    image: require('../../../assets/images/03.jpg'),
    tagline: 'Trimester care & scan guidance',
  },
  {
    id: 'NEWBORN',
    label: 'My newborn',
    image: require('../../../assets/images/hero_newborn.jpg'),
    tagline: 'First 40 days, feeding & transition',
  },
  {
    id: 'CHILD',
    label: 'My child',
    image: require('../../../assets/images/04.jpg'),
    tagline: 'Growth, nutrition & milestones',
  },
];

// Dynamic options for Question 2
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

type StepType = 'INTRO' | 'Q1_WHO' | 'Q2_CARE' | 'Q3_CONSULT' | 'TRANSITION' | 'RESULTS';

export const CareConciergeModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectDoctor,
  onBookDoctor,
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>('INTRO');

  // Form State
  const [conciergeState, setConciergeState] = useState<CareConciergeState>({
    recipient: null,
    careNeedId: null,
    careNeedTitle: null,
    optionalNote: '',
    modality: null,
    locality: 'ANY',
  });

  // Results State
  const [results, setResults] = useState<ConciergeResultsData | null>(null);

  // Pulse animation for transition
  const pulseAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    if (currentStep === 'TRANSITION') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const timer = setTimeout(() => {
        const matchingOutput = DoctorMatchingService.matchConcierge(conciergeState);
        setResults(matchingOutput);
        setCurrentStep('RESULTS');
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [currentStep, conciergeState, pulseAnim]);

  const handleReset = () => {
    setConciergeState({
      recipient: null,
      careNeedId: null,
      careNeedTitle: null,
      optionalNote: '',
      modality: null,
      locality: 'ANY',
    });
    setResults(null);
    setCurrentStep('INTRO');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'INTRO':
        onClose();
        break;
      case 'Q1_WHO':
        setCurrentStep('INTRO');
        break;
      case 'Q2_CARE':
        setCurrentStep('Q1_WHO');
        break;
      case 'Q3_CONSULT':
        setCurrentStep('Q2_CARE');
        break;
      case 'RESULTS':
        setCurrentStep('Q3_CONSULT');
        break;
      default:
        onClose();
    }
  };

  const selectRecipient = (recipient: ConciergeRecipient) => {
    setConciergeState(prev => ({
      ...prev,
      recipient,
      // Clear dependent care need if recipient changed
      careNeedId: null,
      careNeedTitle: null,
    }));
    setCurrentStep('Q2_CARE');
  };

  const selectCareNeed = (item: CareOptionItem) => {
    setConciergeState(prev => ({
      ...prev,
      careNeedId: item.id,
      careNeedTitle: item.title,
    }));
    setCurrentStep('Q3_CONSULT');
  };

  const selectModality = (modality: ConciergeModality) => {
    setConciergeState(prev => ({
      ...prev,
      modality,
    }));
  };

  const submitConcierge = () => {
    setCurrentStep('TRANSITION');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* ── HEADER ── */}
        {currentStep !== 'TRANSITION' && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.headerBackBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.headerBackIcon}>
                {currentStep === 'INTRO' || currentStep === 'RESULTS' ? '✕' : '←'}
              </Text>
            </TouchableOpacity>

            <View style={styles.headerCenterCol}>
              <Text style={styles.headerKicker}>APPUGE CARE CONCIERGE</Text>
              <Text style={styles.headerTagline}>Finding the right care, made personal.</Text>
            </View>

            {currentStep === 'RESULTS' ? (
              <TouchableOpacity
                onPress={handleReset}
                style={styles.headerActionPill}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.headerActionPillText}>Restart</Text>
              </TouchableOpacity>
            ) : currentStep !== 'INTRO' ? (
              <View style={styles.stepIndicator}>
                <Text style={styles.stepIndicatorText}>
                  {currentStep === 'Q1_WHO' ? '1/3' : currentStep === 'Q2_CARE' ? '2/3' : '3/3'}
                </Text>
              </View>
            ) : (
              <View style={{ width: 36 }} />
            )}
          </View>
        )}

        {/* ── STEP 0: CARE CONCIERGE INTRODUCTION ── */}
        {currentStep === 'INTRO' && (
          <View style={styles.flexOne}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.introScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Editorial Hero Photograph */}
              <View style={styles.introHeroWrap}>
                <Image
                  source={require('../../../assets/images/01.jpg')}
                  style={styles.introHeroImg}
                  resizeMode="cover"
                />
                <View style={styles.introHeroScrim} />
                <View style={styles.introPillTag}>
                  <Text style={styles.introPillTagText}>PERSONALIZED DOCTOR DISCOVERY</Text>
                </View>
              </View>

              {/* Text Composition */}
              <View style={styles.introContentBlock}>
                <Text style={styles.introHeadline}>Let's find the care you need.</Text>
                <Text style={styles.introSupporting}>
                  A few simple choices will help us find the right specialists for your family.
                </Text>

                <View style={styles.introFeatureList}>
                  <View style={styles.introFeatureItem}>
                    <Text style={styles.introFeatureCheck}>✓</Text>
                    <Text style={styles.introFeatureText}>Strictly verified medical council practitioners</Text>
                  </View>
                  <View style={styles.introFeatureItem}>
                    <Text style={styles.introFeatureCheck}>✓</Text>
                    <Text style={styles.introFeatureText}>Matched to your specific maternal or child milestone</Text>
                  </View>
                  <View style={styles.introFeatureItem}>
                    <Text style={styles.introFeatureCheck}>✓</Text>
                    <Text style={styles.introFeatureText}>Both unhurried video & local Bengaluru clinic visits</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom CTA Action */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.88}
                onPress={() => setCurrentStep('Q1_WHO')}>
                <Text style={styles.primaryBtnText}>Begin your journey</Text>
                <Text style={styles.primaryBtnArrow}>→</Text>
              </TouchableOpacity>
              <Text style={styles.bottomSubtext}>Takes less than a minute.</Text>
            </View>
          </View>
        )}

        {/* ── QUESTION 1: WHO NEEDS CARE? ── */}
        {currentStep === 'Q1_WHO' && (
          <View style={styles.flexOne}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.questionScrollContent}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.questionEyebrow}>QUESTION 1 OF 3</Text>
              <Text style={styles.questionHeadline}>Who are we finding care for?</Text>
              <Text style={styles.questionSubtext}>
                Select the person who will be receiving healthcare guidance.
              </Text>

              {/* Refined 2-column editorial image grid */}
              <View style={styles.recipientGrid}>
                {RECIPIENT_OPTIONS.map(opt => {
                  const isSelected = conciergeState.recipient === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.recipientCard, isSelected && styles.recipientCardActive]}
                      activeOpacity={0.88}
                      onPress={() => selectRecipient(opt.id)}>
                      <Image source={opt.image} style={styles.recipientImg} resizeMode="cover" />
                      <View style={styles.recipientMeta}>
                        <View style={styles.recipientTitleRow}>
                          <Text
                            style={[
                              styles.recipientTitle,
                              isSelected && styles.recipientTitleActive,
                            ]}>
                            {opt.label}
                          </Text>
                          {isSelected && <View style={styles.selectedPillDot} />}
                        </View>
                        <Text style={styles.recipientTagline} numberOfLines={2}>
                          {opt.tagline}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* ── QUESTION 2: WHAT KIND OF CARE? ── */}
        {currentStep === 'Q2_CARE' && conciergeState.recipient && (
          <View style={styles.flexOne}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.questionScrollContent}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.questionEyebrow}>QUESTION 2 OF 3</Text>
              <Text style={styles.questionHeadline}>What kind of care are you looking for?</Text>
              <Text style={styles.questionSubtext}>
                Showing choices tailored for{' '}
                <Text style={{ fontWeight: '700', color: '#16281E' }}>
                  {conciergeState.recipient === 'MYSELF'
                    ? 'Myself'
                    : conciergeState.recipient === 'PREGNANCY'
                    ? 'My pregnancy'
                    : conciergeState.recipient === 'NEWBORN'
                    ? 'My newborn'
                    : 'My child'}
                </Text>
                .
              </Text>

              {/* Dynamic Compact Care Tiles */}
              <View style={styles.careTilesGrid}>
                {CARE_OPTIONS_BY_RECIPIENT[conciergeState.recipient].map(item => {
                  const isSelected = conciergeState.careNeedId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.careTile, isSelected && styles.careTileActive]}
                      activeOpacity={0.88}
                      onPress={() => selectCareNeed(item)}>
                      <View style={styles.careTileHeader}>
                        <Text style={[styles.careTileTitle, isSelected && styles.careTileTitleActive]}>
                          {item.title}
                        </Text>
                        <View
                          style={[
                            styles.tileRadioCircle,
                            isSelected && styles.tileRadioCircleActive,
                          ]}>
                          {isSelected && <View style={styles.tileRadioDot} />}
                        </View>
                      </View>
                      {item.subtitle && (
                        <Text style={styles.careTileSubtitle}>{item.subtitle}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Optional Short Concern Note */}
              <View style={styles.optionalNoteBox}>
                <Text style={styles.optionalNoteLabel}>
                  Specific question or note (Optional)
                </Text>
                <TextInput
                  style={styles.optionalNoteInput}
                  placeholder="e.g. Newborn latch soreness, or 6-month solids transition"
                  placeholderTextColor="#999"
                  value={conciergeState.optionalNote}
                  onChangeText={text =>
                    setConciergeState(prev => ({ ...prev, optionalNote: text }))
                  }
                  multiline={false}
                  maxLength={120}
                />
              </View>
            </ScrollView>
          </View>
        )}

        {/* ── QUESTION 3: HOW WOULD YOU LIKE TO MEET? ── */}
        {currentStep === 'Q3_CONSULT' && (
          <View style={styles.flexOne}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.questionScrollContent}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.questionEyebrow}>QUESTION 3 OF 3</Text>
              <Text style={styles.questionHeadline}>How would you like to meet your doctor?</Text>
              <Text style={styles.questionSubtext}>
                Choose your preferred consultation format.
              </Text>

              {/* Two Premium Visual Choices */}
              <View style={styles.modalityList}>
                {/* ONLINE */}
                <TouchableOpacity
                  style={[
                    styles.modalityCard,
                    conciergeState.modality === 'ONLINE' && styles.modalityCardActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => selectModality('ONLINE')}>
                  <Image
                    source={require('../../../assets/images/02.jpg')}
                    style={styles.modalityCardImg}
                    resizeMode="cover"
                  />
                  <View style={styles.modalityContent}>
                    <View style={styles.modalityTitleRow}>
                      <Text
                        style={[
                          styles.modalityTitle,
                          conciergeState.modality === 'ONLINE' && styles.modalityTitleActive,
                        ]}>
                        Online
                      </Text>
                      <View
                        style={[
                          styles.tileRadioCircle,
                          conciergeState.modality === 'ONLINE' && styles.tileRadioCircleActive,
                        ]}>
                        {conciergeState.modality === 'ONLINE' && <View style={styles.tileRadioDot} />}
                      </View>
                    </View>
                    <Text style={styles.modalityDesc}>From the comfort of home.</Text>
                    <Text style={styles.modalitySub}>
                      Unhurried video consultation with digital prescription.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* IN-CLINIC */}
                <TouchableOpacity
                  style={[
                    styles.modalityCard,
                    conciergeState.modality === 'IN_CLINIC' && styles.modalityCardActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => selectModality('IN_CLINIC')}>
                  <Image
                    source={require('../../../assets/images/hero_clinical.jpg')}
                    style={styles.modalityCardImg}
                    resizeMode="cover"
                  />
                  <View style={styles.modalityContent}>
                    <View style={styles.modalityTitleRow}>
                      <Text
                        style={[
                          styles.modalityTitle,
                          conciergeState.modality === 'IN_CLINIC' && styles.modalityTitleActive,
                        ]}>
                        In-clinic
                      </Text>
                      <View
                        style={[
                          styles.tileRadioCircle,
                          conciergeState.modality === 'IN_CLINIC' && styles.tileRadioCircleActive,
                        ]}>
                        {conciergeState.modality === 'IN_CLINIC' && <View style={styles.tileRadioDot} />}
                      </View>
                    </View>
                    <Text style={styles.modalityDesc}>Meet your doctor in person.</Text>
                    <Text style={styles.modalitySub}>
                      At our serene, sanitized partner clinics in Bengaluru.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* EITHER OPTION */}
                <TouchableOpacity
                  style={[
                    styles.eitherPill,
                    conciergeState.modality === 'EITHER' && styles.eitherPillActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => selectModality('EITHER')}>
                  <Text
                    style={[
                      styles.eitherPillText,
                      conciergeState.modality === 'EITHER' && styles.eitherPillTextActive,
                    ]}>
                    Either works for me
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location Selector (Only when in-clinic chosen) */}
              {conciergeState.modality === 'IN_CLINIC' && (
                <View style={styles.localityContainer}>
                  <Text style={styles.localityHeadline}>Preferred Bengaluru Clinic Area:</Text>
                  <View style={styles.localityChipsRow}>
                    {(['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'ANY'] as ConciergeLocality[]).map(
                      loc => {
                        const isSel = conciergeState.locality === loc;
                        return (
                          <TouchableOpacity
                            key={loc}
                            style={[styles.localityChip, isSel && styles.localityChipActive]}
                            onPress={() => setConciergeState(prev => ({ ...prev, locality: loc }))}>
                            <Text
                              style={[
                                styles.localityChipText,
                                isSel && styles.localityChipTextActive,
                              ]}>
                              {loc === 'ANY' ? 'Any Location' : loc}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Submit Action */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  !conciergeState.modality && styles.primaryBtnDisabled,
                ]}
                activeOpacity={0.88}
                disabled={!conciergeState.modality}
                onPress={submitConcierge}>
                <Text style={styles.primaryBtnText}>Find My Specialists</Text>
                <Text style={styles.primaryBtnArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── SCREEN 5: FINDING YOUR SPECIALIST TRANSITION ── */}
        {currentStep === 'TRANSITION' && (
          <View style={styles.transitionContainer}>
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}>
              <Text style={styles.pulseIcon}>🌿</Text>
            </Animated.View>
            <Text style={styles.transitionText}>Finding care that fits your needs...</Text>
            <Text style={styles.transitionSub}>Matching verified council practitioners</Text>
          </View>
        )}

        {/* ── SCREEN 6: PERSONALIZED DOCTOR RESULTS ── */}
        {currentStep === 'RESULTS' && results && (
          <View style={styles.flexOne}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.resultsScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Header Title */}
              <View style={styles.resultsHeaderBlock}>
                <Text style={styles.resultsTitle}>Your recommended specialists</Text>
                <Text style={styles.resultsSubtitle}>
                  Selected based on the care you're looking for.
                </Text>
              </View>

              {/* Safety notice if urgent keywords triggered */}
              {results.hasUrgentWarning && (
                <View style={styles.urgentWarningCard}>
                  <Text style={styles.urgentIcon}>⚠️</Text>
                  <Text style={styles.urgentText}>{results.urgentWarningMessage}</Text>
                </View>
              )}

              {/* Subtle Why Section */}
              <View style={styles.whySpecialistsBox}>
                <Text style={styles.whySpecialistsLabel}>WHY THESE SPECIALISTS?</Text>
                <Text style={styles.whySpecialistsText}>{results.whyExplanation}</Text>
                <Text style={styles.whySpecialistsSub}>
                  Consultation: {results.modalityLabel}
                </Text>
              </View>

              {/* NO MATCH FALLBACK */}
              {!results.featured ? (
                <View style={styles.noMatchCard}>
                  <Text style={styles.noMatchIcon}>🌿</Text>
                  <Text style={styles.noMatchTitle}>No exact match found</Text>
                  <Text style={styles.noMatchDesc}>
                    We couldn't find a doctor strictly matching all chosen criteria in this
                    locality. Try selecting "Either works for me" or "Any Location".
                  </Text>
                  <TouchableOpacity
                    style={styles.noMatchAction}
                    activeOpacity={0.88}
                    onPress={() => setCurrentStep('Q3_CONSULT')}>
                    <Text style={styles.noMatchActionText}>Adjust Preferences</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.recommendationsContainer}>
                  {/* FEATURED DOCTOR — LARGE PORTRAIT */}
                  <View style={styles.featuredCard}>
                    <View style={styles.featuredTagRow}>
                      <View style={styles.featuredTagPill}>
                        <Text style={styles.featuredTagText}>FEATURED SPECIALIST</Text>
                      </View>
                      {results.featured.doctor.medicalRegistration.isVerified && (
                        <View style={styles.verifiedRow}>
                          <Text style={styles.verifiedCheck}>✓</Text>
                          <Text style={styles.verifiedLabel}>Verified Medical Council</Text>
                        </View>
                      )}
                    </View>

                    <Image
                      source={results.featured.doctor.profileImage}
                      style={styles.featuredPortrait}
                      resizeMode="cover"
                    />

                    <View style={styles.featuredMetaBlock}>
                      <Text style={styles.featuredName}>{results.featured.doctor.fullName}</Text>
                      <Text style={styles.featuredSpeciality}>
                        {results.featured.doctor.specialityTitle}
                      </Text>

                      {/* Concise Qualifications Line */}
                      <Text style={styles.featuredQualLine} numberOfLines={1}>
                        {results.featured.doctor.qualifications.join(' • ')}
                      </Text>

                      <Text style={styles.featuredExpLine}>
                        {results.featured.doctor.experienceYears} Years Clinical Experience •{' '}
                        {results.featured.doctor.clinic.locality}
                      </Text>

                      {/* Reason / Relevant Expertise */}
                      <View style={styles.featuredExpertiseBox}>
                        <Text style={styles.featuredReasonText}>
                          {results.featured.matchReason}
                        </Text>
                        <View style={styles.expertisePillRow}>
                          {results.featured.relevantExpertise.map((exp, idx) => (
                            <View key={idx} style={styles.miniExpertisePill}>
                              <Text style={styles.miniExpertiseText}>{exp}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Fee and Consultation Format */}
                      <View style={styles.featuredFeeRow}>
                        <View>
                          <Text style={styles.feeKicker}>CONSULTATION FEE</Text>
                          <Text style={styles.feeAmount}>
                            ₹{results.featured.doctor.onlineFee} (Online) / ₹
                            {results.featured.doctor.inClinicFee} (In-Clinic)
                          </Text>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.featuredActionsRow}>
                        <TouchableOpacity
                          style={styles.viewProfileBtn}
                          activeOpacity={0.88}
                          onPress={() => onSelectDoctor(results.featured!.doctor)}>
                          <Text style={styles.viewProfileBtnText}>View Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.bookSlotBtn}
                          activeOpacity={0.88}
                          onPress={() => onBookDoctor(results.featured!.doctor)}>
                          <Text style={styles.bookSlotBtnText}>Book Slot →</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* TWO ADDITIONAL RECOMMENDATIONS — EDITORIAL CARDS */}
                  {results.secondary.length > 0 && (
                    <View style={styles.secondarySection}>
                      <Text style={styles.secondarySectionTitle}>ADDITIONAL SPECIALISTS</Text>
                      {results.secondary.map(item => (
                        <View key={item.doctor.id} style={styles.secondaryCard}>
                          <Image
                            source={item.doctor.profileImage}
                            style={styles.secondaryAvatar}
                            resizeMode="cover"
                          />
                          <View style={styles.secondaryCol}>
                            <Text style={styles.secondaryName}>{item.doctor.fullName}</Text>
                            <Text style={styles.secondarySpeciality}>
                              {item.doctor.specialityTitle}
                            </Text>
                            <Text style={styles.secondaryMeta}>
                              {item.doctor.experienceYears} Yrs Exp • {item.doctor.clinic.locality}
                            </Text>
                            <Text style={styles.secondaryReason} numberOfLines={2}>
                              {item.matchReason}
                            </Text>

                            <View style={styles.secondaryActionRow}>
                              <Text style={styles.secondaryFee}>
                                From ₹{item.doctor.onlineFee}
                              </Text>
                              <View style={styles.secondaryBtnGroup}>
                                <TouchableOpacity
                                  style={styles.secondaryViewProfile}
                                  onPress={() => onSelectDoctor(item.doctor)}>
                                  <Text style={styles.secondaryViewProfileText}>Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.secondaryBook}
                                  onPress={() => onBookDoctor(item.doctor)}>
                                  <Text style={styles.secondaryBookText}>Book →</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    paddingTop: Platform.OS === 'android' ? 42 : 0,
  },
  flexOne: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
    backgroundColor: '#FFFDF9',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackIcon: {
    fontSize: 16,
    color: '#16281E',
    fontWeight: '700',
  },
  headerCenterCol: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  headerKicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 2,
  },
  headerTagline: {
    fontSize: 12,
    color: '#5E7A63',
    fontStyle: 'italic',
  },
  stepIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EAF2EC',
  },
  stepIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C4035',
  },
  headerActionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FAF4EB',
  },
  headerActionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C86D51',
  },
  introScrollContent: {
    paddingBottom: 20,
  },
  introHeroWrap: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  introHeroImg: {
    width: '100%',
    height: '100%',
  },
  introHeroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 40, 30, 0.22)',
  },
  introPillTag: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  introPillTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#16281E',
  },
  introContentBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  introHeadline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 10,
    lineHeight: 36,
  },
  introSupporting: {
    fontSize: 15,
    color: '#5E7A63',
    lineHeight: 22,
    marginBottom: 24,
  },
  introFeatureList: {
    gap: 12,
  },
  introFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introFeatureCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C4035',
    marginRight: 10,
  },
  introFeatureText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  questionScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  questionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 4,
  },
  questionHeadline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
    lineHeight: 30,
  },
  questionSubtext: {
    fontSize: 13,
    color: '#5E7A63',
    lineHeight: 18,
    marginBottom: 20,
  },
  recipientGrid: {
    gap: 14,
  },
  recipientCard: {
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
    height: 104,
  },
  recipientCardActive: {
    borderColor: '#16281E',
    backgroundColor: '#F8F6F1',
  },
  recipientImg: {
    width: 104,
    height: '100%',
  },
  recipientMeta: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  recipientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recipientTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  recipientTitleActive: {
    color: '#16281E',
  },
  selectedPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C86D51',
  },
  recipientTagline: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  careTilesGrid: {
    gap: 10,
    marginBottom: 20,
  },
  careTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#ECE6DC',
  },
  careTileActive: {
    borderColor: '#16281E',
    backgroundColor: '#F8F6F1',
  },
  careTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  careTileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
  },
  careTileTitleActive: {
    color: '#16281E',
  },
  tileRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileRadioCircleActive: {
    borderColor: '#16281E',
  },
  tileRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16281E',
  },
  careTileSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  optionalNoteBox: {
    marginTop: 6,
    backgroundColor: '#FAF4EB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  optionalNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#8C6239',
    marginBottom: 6,
  },
  optionalNoteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#16281E',
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
  },
  modalityCardImg: {
    width: 110,
    height: '100%',
  },
  modalityContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  modalityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  modalityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modalityTitleActive: {
    color: '#16281E',
  },
  modalityDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C4035',
    marginBottom: 2,
  },
  modalitySub: {
    fontSize: 11,
    color: '#777',
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
  transitionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF2EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseIcon: {
    fontSize: 32,
  },
  transitionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
    textAlign: 'center',
  },
  transitionSub: {
    fontSize: 13,
    color: '#5E7A63',
    textAlign: 'center',
  },
  resultsScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  resultsHeaderBlock: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 13,
    color: '#5E7A63',
  },
  urgentWarningCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF2F0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8A398',
    marginBottom: 16,
    alignItems: 'center',
  },
  urgentIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  urgentText: {
    flex: 1,
    fontSize: 12,
    color: '#8A2B18',
    lineHeight: 16,
    fontWeight: '600',
  },
  whySpecialistsBox: {
    backgroundColor: '#FAF4EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE2D2',
  },
  whySpecialistsLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8C6239',
    marginBottom: 4,
  },
  whySpecialistsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 2,
  },
  whySpecialistsSub: {
    fontSize: 11,
    color: '#5E7A63',
  },
  noMatchCard: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#FAF4EB',
    borderRadius: 16,
  },
  noMatchIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noMatchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 8,
  },
  noMatchDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  noMatchAction: {
    backgroundColor: '#16281E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  noMatchActionText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '700',
  },
  recommendationsContainer: {
    gap: 20,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F1E9',
  },
  featuredTagPill: {
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8C6239',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedCheck: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    marginRight: 4,
  },
  verifiedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  featuredPortrait: {
    width: '100%',
    height: 220,
  },
  featuredMetaBlock: {
    padding: 18,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 2,
  },
  featuredSpeciality: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5E7A63',
    marginBottom: 6,
  },
  featuredQualLine: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  featuredExpLine: {
    fontSize: 11,
    color: '#555',
    marginBottom: 12,
  },
  featuredExpertiseBox: {
    backgroundColor: '#FBF9F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0ECE4',
  },
  featuredReasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C4035',
    marginBottom: 8,
    lineHeight: 16,
  },
  expertisePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniExpertisePill: {
    backgroundColor: '#EAF2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniExpertiseText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C4035',
  },
  featuredFeeRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0ECE4',
    marginBottom: 14,
  },
  feeKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#999',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  featuredActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
  },
  bookSlotBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#16281E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookSlotBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  secondarySection: {
    gap: 12,
  },
  secondarySectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 4,
  },
  secondaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE6DC',
  },
  secondaryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#F0ECE4',
  },
  secondaryCol: {
    flex: 1,
  },
  secondaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  secondarySpeciality: {
    fontSize: 11,
    color: '#5E7A63',
    fontWeight: '600',
    marginBottom: 2,
  },
  secondaryMeta: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  secondaryReason: {
    fontSize: 11,
    color: '#444',
    lineHeight: 15,
    marginBottom: 8,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  secondaryFee: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16281E',
  },
  secondaryBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  secondaryViewProfile: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#16281E',
  },
  secondaryViewProfileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16281E',
  },
  secondaryBook: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#16281E',
  },
  secondaryBookText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 48 : 16,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    alignItems: 'center',
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
  bottomSubtext: {
    fontSize: 12,
    color: '#8C6239',
    marginTop: 8,
    fontWeight: '600',
  },
});
