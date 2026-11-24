import { ConsultationType, DoctorProfile, DoctorSpecialityId } from '../data/doctorsData';

export type CareRecipientType = 'MYSELF' | 'PREGNANCY' | 'NEWBORN' | 'CHILD';

export type ModalityPreference = 'ONLINE' | 'IN_CLINIC' | 'ANY';

export type BengaluruLocality =
  | 'Indiranagar'
  | 'Koramangala'
  | 'Whitefield'
  | 'HSR Layout'
  | 'ANY';

export interface MotherCareDetails {
  supportArea:
    | 'postpartum_recovery'
    | 'womens_health'
    | 'breastfeeding_lactation'
    | 'nutrition_energy'
    | 'skin_hair'
    | 'general_wellness';
  deliveryTimeline:
    | 'currently_pregnant'
    | 'under_6_weeks'
    | '6_weeks_to_3_months'
    | '3_to_6_months'
    | 'over_6_months'
    | 'not_applicable';
  postpartumFocus: string[]; // ['pelvic_floor', 'mood_emotional', 'physical_recovery', 'breastfeeding', 'not_sure']
}

export interface PregnancyCareDetails {
  gestationStage:
    | 'planning'
    | 'first_trimester'
    | 'second_trimester'
    | 'third_trimester'
    | 'not_sure';
  supportNeeded:
    | 'routine_checkup'
    | 'nutrition_diet'
    | 'ultrasound_scans'
    | 'pregnancy_concerns'
    | 'high_risk'
    | 'general_guidance';
}

export interface NewbornCareDetails {
  ageGroup:
    | '0_to_7_days'
    | '1_to_4_weeks'
    | '1_to_3_months'
    | '3_to_6_months'
    | '6_to_12_months';
  careNeeded:
    | 'newborn_checkup'
    | 'feeding_latch'
    | 'sleep_patterns'
    | 'skin_rash'
    | 'growth_weight'
    | 'vaccination'
    | 'general_pediatric';
}

export interface ChildCareDetails {
  ageGroup:
    | '1_to_2_years'
    | '2_to_5_years'
    | '6_to_10_years'
    | 'over_10_years';
  concern:
    | 'general_fever'
    | 'nutrition_eating'
    | 'skin_conditions'
    | 'development_speech'
    | 'routine_vaccination'
    | 'specialist_eval';
}

export interface CareQuestionnaireAnswers {
  recipient: CareRecipientType;
  motherDetails?: MotherCareDetails;
  pregnancyDetails?: PregnancyCareDetails;
  newbornDetails?: NewbornCareDetails;
  childDetails?: ChildCareDetails;
  modalityPreference: ModalityPreference;
  localityPreference: BengaluruLocality;
}

export interface DoctorMatchResult {
  doctor: DoctorProfile;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  primaryHighlight: string;
}

export interface CareMatchingOutput {
  matches: DoctorMatchResult[];
  answersSummary: {
    recipientLabel: string;
    focusLabel: string;
    stageOrAgeLabel: string;
    modalityLabel: string;
    localityLabel: string;
  };
  hasEmergencyNotice: boolean;
}
