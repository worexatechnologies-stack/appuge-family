import { ImageSourcePropType } from 'react-native';
import { DoctorProfile } from '../data/doctorsData';

export type ConciergeRecipient = 'MYSELF' | 'PREGNANCY' | 'NEWBORN' | 'CHILD';

export type ConciergeModality = 'ONLINE' | 'IN_CLINIC' | 'EITHER';

export type ConciergeLocality =
  | 'Indiranagar'
  | 'Koramangala'
  | 'Whitefield'
  | 'HSR Layout'
  | 'ANY';

export interface CareOptionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

export interface CareConciergeState {
  recipient: ConciergeRecipient | null;
  careNeedId: string | null;
  careNeedTitle: string | null;
  optionalNote: string;
  modality: ConciergeModality | null;
  locality: ConciergeLocality;
}

export interface RecommendedDoctor {
  doctor: DoctorProfile;
  matchReason: string;
  relevantExpertise: string[];
  isFeatured: boolean;
}

export interface ConciergeResultsData {
  featured: RecommendedDoctor | null;
  secondary: RecommendedDoctor[];
  additionalCount: number;
  whyExplanation: string;
  recipientLabel: string;
  careNeedLabel: string;
  modalityLabel: string;
  hasUrgentWarning: boolean;
  urgentWarningMessage?: string;
}
