import React, { useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BengaluruLocality,
  CareMatchingOutput,
  CareQuestionnaireAnswers,
  CareRecipientType,
  ChildCareDetails,
  ModalityPreference,
  MotherCareDetails,
  NewbornCareDetails,
  PregnancyCareDetails,
} from '../../../types/careQuestionnaire.types';
import { DoctorMatchingService } from '../../../services/doctorMatching.service';

interface Props {
  visible: boolean;
  onClose: () => void;
  onComplete: (output: CareMatchingOutput, answers: CareQuestionnaireAnswers) => void;
}

export const CareQuestionnaireModal: React.FC<Props> = ({
  visible,
  onClose,
  onComplete,
}) => {
  // Navigation steps: 1: Recipient, 2: Branch Details, 3: Modality & Locality, 4: Summary Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [recipient, setRecipient] = useState<CareRecipientType>('NEWBORN');

  // Mother state
  const [motherDetails, setMotherDetails] = useState<MotherCareDetails>({
    supportArea: 'postpartum_recovery',
    deliveryTimeline: 'under_6_weeks',
    postpartumFocus: ['pelvic_floor', 'physical_recovery'],
  });

  // Pregnancy state
  const [pregnancyDetails, setPregnancyDetails] = useState<PregnancyCareDetails>({
    gestationStage: 'second_trimester',
    supportNeeded: 'routine_checkup',
  });

  // Newborn state
  const [newbornDetails, setNewbornDetails] = useState<NewbornCareDetails>({
    ageGroup: '1_to_4_weeks',
    careNeeded: 'feeding_latch',
  });

  // Child state
  const [childDetails, setChildDetails] = useState<ChildCareDetails>({
    ageGroup: '2_to_5_years',
    concern: 'general_fever',
  });

  // Modality & Locality
  const [modality, setModality] = useState<ModalityPreference>('ANY');
  const [locality, setLocality] = useState<BengaluruLocality>('ANY');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete
      const answers: CareQuestionnaireAnswers = {
        recipient,
        motherDetails: recipient === 'MYSELF' ? motherDetails : undefined,
        pregnancyDetails: recipient === 'PREGNANCY' ? pregnancyDetails : undefined,
        newbornDetails: recipient === 'NEWBORN' ? newbornDetails : undefined,
        childDetails: recipient === 'CHILD' ? childDetails : undefined,
        modalityPreference: modality,
        localityPreference: locality,
      };

      const output = DoctorMatchingService.matchDoctors(answers);
      onComplete(output, answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const togglePostpartumFocus = (item: string) => {
    const current = motherDetails.postpartumFocus || [];
    if (current.includes(item)) {
      setMotherDetails({
        ...motherDetails,
        postpartumFocus: current.filter((x: string) => x !== item),
      });
    } else {
      setMotherDetails({
        ...motherDetails,
        postpartumFocus: [...current, item],
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.headerIconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.headerIconText}>
              {currentStep === 1 ? '✕' : '←'}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerKicker}>APPUGE CARE MATCHING</Text>
            <Text style={styles.headerTitle}>Let's find the right care.</Text>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step {currentStep}/4</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentStep / 4) * 100}%` },
            ]}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* STEP 1: RECIPIENT */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepIntro}>
                A few simple questions will help us find healthcare professionals
                suited to your exact needs.
              </Text>
              <Text style={styles.questionTitle}>
                Who are you looking for care for?
              </Text>

              {/* Option 1: Myself / Mother */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  recipient === 'MYSELF' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setRecipient('MYSELF')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>🌸</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>Myself / Mother</Text>
                  <Text style={styles.optionDesc}>
                    Postpartum recovery, pelvic healing, breastfeeding support & maternal vitality.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    recipient === 'MYSELF' && styles.radioCircleActive,
                  ]}>
                  {recipient === 'MYSELF' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Option 2: Pregnancy */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  recipient === 'PREGNANCY' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setRecipient('PREGNANCY')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>🤰</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>My pregnancy</Text>
                  <Text style={styles.optionDesc}>
                    Trimester growth scans, high-risk consultation & compassionate antenatal care.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    recipient === 'PREGNANCY' && styles.radioCircleActive,
                  ]}>
                  {recipient === 'PREGNANCY' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Option 3: Newborn */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  recipient === 'NEWBORN' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setRecipient('NEWBORN')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>👶</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>My newborn</Text>
                  <Text style={styles.optionDesc}>
                    First 40 days, gentle colic relief, feeding latch, jaundice & weight tracking.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    recipient === 'NEWBORN' && styles.radioCircleActive,
                  ]}>
                  {recipient === 'NEWBORN' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Option 4: Child */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  recipient === 'CHILD' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setRecipient('CHILD')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>🧒</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>My child</Text>
                  <Text style={styles.optionDesc}>
                    Seasonal fever, nutrition, speech milestones & comprehensive pediatric care.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    recipient === 'CHILD' && styles.radioCircleActive,
                  ]}>
                  {recipient === 'CHILD' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: BRANCH SPECIFIC DETAILS */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              {/* BRANCH A: MOTHER */}
              {recipient === 'MYSELF' && (
                <View>
                  <Text style={styles.questionTitle}>
                    What kind of maternal support do you need?
                  </Text>

                  <View style={styles.chipGrid}>
                    {[
                      { key: 'postpartum_recovery', label: 'Postpartum recovery' },
                      { key: 'womens_health', label: "Women's health" },
                      { key: 'breastfeeding_lactation', label: 'Breastfeeding & lactation' },
                      { key: 'nutrition_energy', label: 'Nutrition & energy' },
                      { key: 'skin_hair', label: 'Skin & hair restoration' },
                      { key: 'general_wellness', label: 'General family wellness' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          motherDetails.supportArea === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setMotherDetails({
                            ...motherDetails,
                            supportArea: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            motherDetails.supportArea === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.questionTitle, { marginTop: 24 }]}>
                    When was your delivery?
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'currently_pregnant', label: 'Currently pregnant' },
                      { key: 'under_6_weeks', label: 'Less than 6 weeks ago' },
                      { key: '6_weeks_to_3_months', label: '6 weeks to 3 months ago' },
                      { key: '3_to_6_months', label: '3 to 6 months ago' },
                      { key: 'over_6_months', label: 'More than 6 months ago' },
                      { key: 'not_applicable', label: 'Not applicable' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          motherDetails.deliveryTimeline === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setMotherDetails({
                            ...motherDetails,
                            deliveryTimeline: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            motherDetails.deliveryTimeline === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.questionTitle, { marginTop: 24 }]}>
                    Specific postpartum focus areas:
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'pelvic_floor', label: 'Pelvic floor / healing' },
                      { key: 'mood_emotional', label: 'Mood & emotional support' },
                      { key: 'physical_recovery', label: 'Physical recovery & incision' },
                      { key: 'breastfeeding', label: 'Breastfeeding & latch' },
                      { key: 'not_sure', label: 'Not sure / General advice' },
                    ].map(item => {
                      const isSel = (motherDetails.postpartumFocus || []).includes(item.key);
                      return (
                        <TouchableOpacity
                          key={item.key}
                          style={[styles.chipButton, isSel && styles.chipButtonActive]}
                          onPress={() => togglePostpartumFocus(item.key)}>
                          <Text style={[styles.chipText, isSel && styles.chipTextActive]}>
                            {isSel ? '✓ ' : '+ '}
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* BRANCH B: PREGNANCY */}
              {recipient === 'PREGNANCY' && (
                <View>
                  <Text style={styles.questionTitle}>
                    Which stage of pregnancy are you in?
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'planning', label: 'Planning pregnancy' },
                      { key: 'first_trimester', label: 'First trimester (wks 1–12)' },
                      { key: 'second_trimester', label: 'Second trimester (wks 13–27)' },
                      { key: 'third_trimester', label: 'Third trimester (wks 28+)' },
                      { key: 'not_sure', label: 'Not sure / General' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          pregnancyDetails.gestationStage === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setPregnancyDetails({
                            ...pregnancyDetails,
                            gestationStage: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            pregnancyDetails.gestationStage === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.questionTitle, { marginTop: 24 }]}>
                    What kind of pregnancy care is needed?
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'routine_checkup', label: 'Routine antenatal check-up' },
                      { key: 'nutrition_diet', label: 'Nutrition & diet planning' },
                      { key: 'ultrasound_scans', label: 'Ultrasound & scans review' },
                      { key: 'pregnancy_concerns', label: 'Pregnancy concerns / symptoms' },
                      { key: 'high_risk', label: 'High-risk pregnancy consultation' },
                      { key: 'general_guidance', label: 'General birth guidance' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          pregnancyDetails.supportNeeded === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setPregnancyDetails({
                            ...pregnancyDetails,
                            supportNeeded: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            pregnancyDetails.supportNeeded === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* BRANCH C: NEWBORN */}
              {recipient === 'NEWBORN' && (
                <View>
                  {/* Emergency notice card */}
                  <View style={styles.emergencyCard}>
                    <Text style={styles.emergencyIcon}>⚠️</Text>
                    <View style={styles.emergencyTextCol}>
                      <Text style={styles.emergencyTitle}>EMERGENCY SAFETY NOTICE</Text>
                      <Text style={styles.emergencyDesc}>
                        If your baby has acute difficulty breathing, high fever, or is unresponsive,
                        please seek emergency care immediately by dialing 112 or 108.
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.questionTitle}>How old is your baby?</Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: '0_to_7_days', label: '0 to 7 days' },
                      { key: '1_to_4_weeks', label: '1 to 4 weeks' },
                      { key: '1_to_3_months', label: '1 to 3 months' },
                      { key: '3_to_6_months', label: '3 to 6 months' },
                      { key: '6_to_12_months', label: '6 to 12 months' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          newbornDetails.ageGroup === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setNewbornDetails({
                            ...newbornDetails,
                            ageGroup: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            newbornDetails.ageGroup === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.questionTitle, { marginTop: 24 }]}>
                    What care or support do you need?
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'newborn_checkup', label: 'Newborn check-up' },
                      { key: 'feeding_latch', label: 'Feeding / latch issues' },
                      { key: 'sleep_patterns', label: 'Sleep patterns & settling' },
                      { key: 'skin_rash', label: 'Skin rash / cradle cap' },
                      { key: 'growth_weight', label: 'Growth & weight gain' },
                      { key: 'vaccination', label: 'Vaccination schedule' },
                      { key: 'general_pediatric', label: 'General pediatric care' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          newbornDetails.careNeeded === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setNewbornDetails({
                            ...newbornDetails,
                            careNeeded: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            newbornDetails.careNeeded === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* BRANCH D: CHILD */}
              {recipient === 'CHILD' && (
                <View>
                  <Text style={styles.questionTitle}>How old is your child?</Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: '1_to_2_years', label: '1 to 2 years' },
                      { key: '2_to_5_years', label: '2 to 5 years' },
                      { key: '6_to_10_years', label: '6 to 10 years' },
                      { key: 'over_10_years', label: 'Older than 10 years' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          childDetails.ageGroup === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setChildDetails({
                            ...childDetails,
                            ageGroup: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            childDetails.ageGroup === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.questionTitle, { marginTop: 24 }]}>
                    What is your primary concern?
                  </Text>
                  <View style={styles.chipGrid}>
                    {[
                      { key: 'general_fever', label: 'General illness / fever' },
                      { key: 'nutrition_eating', label: 'Nutrition & picky eating' },
                      { key: 'skin_conditions', label: 'Skin conditions / allergies' },
                      { key: 'development_speech', label: 'Development & speech milestones' },
                      { key: 'routine_vaccination', label: 'Routine vaccination' },
                      { key: 'specialist_eval', label: 'Specialist evaluation' },
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.chipButton,
                          childDetails.concern === item.key && styles.chipButtonActive,
                        ]}
                        onPress={() =>
                          setChildDetails({
                            ...childDetails,
                            concern: item.key as any,
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            childDetails.concern === item.key && styles.chipTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* STEP 3: MODALITY & LOCALITY */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.questionTitle}>
                How would you prefer to consult?
              </Text>

              {/* Online Video */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  modality === 'ONLINE' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setModality('ONLINE')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>💻</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>Online video consultation</Text>
                  <Text style={styles.optionDesc}>
                    Secure, comfortable video appointment from home with digital prescription.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    modality === 'ONLINE' && styles.radioCircleActive,
                  ]}>
                  {modality === 'ONLINE' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* In-Clinic */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  modality === 'IN_CLINIC' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setModality('IN_CLINIC')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>🏥</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>In-clinic visit</Text>
                  <Text style={styles.optionDesc}>
                    Face-to-face consultation at our calm, sanitized partner clinics in Bengaluru.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    modality === 'IN_CLINIC' && styles.radioCircleActive,
                  ]}>
                  {modality === 'IN_CLINIC' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Either */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  modality === 'ANY' && styles.optionCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setModality('ANY')}>
                <View style={styles.optionIconCircle}>
                  <Text style={styles.optionEmoji}>🌿</Text>
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionHeading}>No preference / Either</Text>
                  <Text style={styles.optionDesc}>
                    Show me the best matching doctors for both online and in-person care.
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    modality === 'ANY' && styles.radioCircleActive,
                  ]}>
                  {modality === 'ANY' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Locality Selector */}
              <Text style={[styles.questionTitle, { marginTop: 28 }]}>
                Preferred Bengaluru clinic location:
              </Text>
              <View style={styles.chipGrid}>
                {[
                  { key: 'Indiranagar', label: 'Indiranagar' },
                  { key: 'Koramangala', label: 'Koramangala' },
                  { key: 'Whitefield', label: 'Whitefield' },
                  { key: 'HSR Layout', label: 'HSR Layout' },
                  { key: 'ANY', label: 'Any Bengaluru Location' },
                ].map(item => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.chipButton,
                      locality === item.key && styles.chipButtonActive,
                    ]}
                    onPress={() => setLocality(item.key as any)}>
                    <Text
                      style={[
                        styles.chipText,
                        locality === item.key && styles.chipTextActive,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* STEP 4: SUMMARY REVIEW */}
          {currentStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.summaryBadge}>REVIEW & CONFIRM</Text>
              <Text style={styles.summaryTitle}>Your care preferences</Text>
              <Text style={styles.summaryDesc}>
                Review your selections before we match you with verified specialists.
              </Text>

              <View style={styles.summaryCard}>
                {/* Row 1: Who */}
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryLabel}>WHO NEEDS CARE</Text>
                    <Text style={styles.summaryValue}>
                      {recipient === 'MYSELF'
                        ? 'Mother / Myself'
                        : recipient === 'PREGNANCY'
                        ? 'Pregnancy Journey'
                        : recipient === 'NEWBORN'
                        ? 'Newborn Baby'
                        : 'Child'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => jumpToStep(1)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.summaryDivider} />

                {/* Row 2: Clinical Area */}
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryLabel}>CLINICAL FOCUS</Text>
                    <Text style={styles.summaryValue}>
                      {recipient === 'MYSELF'
                        ? motherDetails.supportArea.replace(/_/g, ' ')
                        : recipient === 'PREGNANCY'
                        ? pregnancyDetails.supportNeeded.replace(/_/g, ' ')
                        : recipient === 'NEWBORN'
                        ? newbornDetails.careNeeded.replace(/_/g, ' ')
                        : childDetails.concern.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => jumpToStep(2)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.summaryDivider} />

                {/* Row 3: Format & Location */}
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryLabel}>CONSULTATION FORMAT</Text>
                    <Text style={styles.summaryValue}>
                      {modality === 'ONLINE'
                        ? 'Online Video'
                        : modality === 'IN_CLINIC'
                        ? 'In-Clinic Visit'
                        : 'Online or In-Clinic'}
                      {' • '}
                      {locality === 'ANY' ? 'Any Location' : locality}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => jumpToStep(3)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.reassuranceBox}>
                <Text style={styles.reassuranceIcon}>🛡️</Text>
                <Text style={styles.reassuranceText}>
                  Appuge will only recommend verified medical council registered
                  specialists tailored to your specific selections.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.88}
            onPress={handleNext}>
            <Text style={styles.primaryBtnText}>
              {currentStep === 4 ? 'Find My Doctors →' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>
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
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
    color: '#16281E',
    fontWeight: '700',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerKicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8C6239',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EAF2EC',
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C4035',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: '#F0ECE4',
    width: '100%',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#C86D51',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepIntro: {
    fontSize: 13,
    color: '#5E7A63',
    lineHeight: 19,
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 16,
    lineHeight: 28,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EAE5DB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#C86D51',
    backgroundColor: '#FFF9F5',
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionTextCol: {
    flex: 1,
  },
  optionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16281E',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleActive: {
    borderColor: '#C86D51',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C86D51',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2DCD2',
  },
  chipButtonActive: {
    backgroundColor: '#16281E',
    borderColor: '#16281E',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C4035',
  },
  chipTextActive: {
    color: '#FFFDF9',
  },
  emergencyCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF2F0',
    borderWidth: 1,
    borderColor: '#E8A398',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  emergencyTextCol: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#C86D51',
    marginBottom: 4,
  },
  emergencyDesc: {
    fontSize: 12,
    color: '#8A2B18',
    lineHeight: 17,
    fontWeight: '500',
  },
  summaryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#8C6239',
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
  },
  summaryDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE5D8',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8C6239',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16281E',
    textTransform: 'capitalize',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F3EFE6',
    marginVertical: 4,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FAF4EB',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C6239',
  },
  reassuranceBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF2EC',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  reassuranceIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  reassuranceText: {
    flex: 1,
    fontSize: 12,
    color: '#2C4035',
    lineHeight: 17,
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 28 : 16,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  primaryBtn: {
    backgroundColor: '#16281E',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.5,
  },
});
