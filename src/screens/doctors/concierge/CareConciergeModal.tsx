import React, { useState, useEffect } from 'react';
import {
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
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
} from '../../../types/careConcierge.types';
import { DoctorMatchingService } from '../../../services/doctorMatching.service';
import { DoctorProfile } from '../../../data/doctorsData';
import { CareConciergeIntro } from './CareConciergeIntro';
import { CareRecipientSelection } from './CareRecipientSelection';
import { CareNeedSelection } from './CareNeedSelection';
import { ConsultationPreference } from './ConsultationPreference';
import { CareConciergeResults } from './CareConciergeResults';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
}

type StepType = 'INTRO' | 'Q1_WHO' | 'Q2_CARE' | 'Q3_CONSULT' | 'TRANSITION' | 'RESULTS';

export const CareConciergeModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectDoctor,
  onBookDoctor,
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>('INTRO');

  const [conciergeState, setConciergeState] = useState<CareConciergeState>({
    recipient: null,
    careNeedId: null,
    careNeedTitle: null,
    optionalNote: '',
    modality: null,
    locality: 'ANY',
  });

  const [results, setResults] = useState<ConciergeResultsData | null>(null);

  // Gentle pulse animation for finding transition
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
      }, 1300);

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

  const handleSelectRecipient = (recipient: ConciergeRecipient) => {
    setConciergeState(prev => ({
      ...prev,
      recipient,
      careNeedId: null,
      careNeedTitle: null,
    }));
    setCurrentStep('Q2_CARE');
  };

  const handleSelectCareNeed = (item: CareOptionItem) => {
    setConciergeState(prev => ({
      ...prev,
      careNeedId: item.id,
      careNeedTitle: item.title,
    }));
    setCurrentStep('Q3_CONSULT');
  };

  const handleSelectModality = (modality: ConciergeModality) => {
    setConciergeState(prev => ({
      ...prev,
      modality,
    }));
  };

  const handleSelectLocality = (locality: ConciergeLocality) => {
    setConciergeState(prev => ({
      ...prev,
      locality,
    }));
  };

  const handleSubmit = () => {
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

        {/* Global Concierge Header (except during transition) */}
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

        {/* SCREEN 1: CARE CONCIERGE INTRODUCTION */}
        {currentStep === 'INTRO' && (
          <CareConciergeIntro onBegin={() => setCurrentStep('Q1_WHO')} />
        )}

        {/* QUESTION 1: WHO NEEDS CARE? */}
        {currentStep === 'Q1_WHO' && (
          <CareRecipientSelection
            selectedRecipient={conciergeState.recipient}
            onSelect={handleSelectRecipient}
          />
        )}

        {/* QUESTION 2: WHAT KIND OF CARE? */}
        {currentStep === 'Q2_CARE' && conciergeState.recipient && (
          <CareNeedSelection
            recipient={conciergeState.recipient}
            selectedCareNeedId={conciergeState.careNeedId}
            optionalNote={conciergeState.optionalNote}
            onSelectCareNeed={handleSelectCareNeed}
            onChangeOptionalNote={note =>
              setConciergeState(prev => ({ ...prev, optionalNote: note }))
            }
          />
        )}

        {/* QUESTION 3: CONSULTATION PREFERENCE */}
        {currentStep === 'Q3_CONSULT' && (
          <ConsultationPreference
            modality={conciergeState.modality}
            locality={conciergeState.locality}
            onSelectModality={handleSelectModality}
            onSelectLocality={handleSelectLocality}
            onSubmit={handleSubmit}
          />
        )}

        {/* TRANSITION: FINDING YOUR SPECIALIST */}
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

        {/* SCREEN 6: PERSONALIZED DOCTOR RESULTS */}
        {currentStep === 'RESULTS' && results && (
          <CareConciergeResults
            results={results}
            onSelectDoctor={onSelectDoctor}
            onBookDoctor={onBookDoctor}
            onAdjustPreferences={() => setCurrentStep('Q3_CONSULT')}
          />
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
});
