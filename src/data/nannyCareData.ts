import { ImageSourcePropType } from 'react-native';

export type ChildAgeGroup =
  | 'Newborn (0 - 3 months)'
  | 'Infant (3 - 12 months)'
  | 'Toddler (1 - 3 years)'
  | 'Pre-school (3 - 5 years)';

export type NannySkill =
  | 'Infant First Aid & CPR'
  | 'Newborn Abhyanga Massage'
  | 'Gentle Sleep Routine'
  | 'Baby Weaning & Nutrition'
  | 'Developmental Sensory Play'
  | 'Postpartum Mother Assistance'
  | 'Sterilization & Hygiene Protocol'
  | 'Twins & Multiples Care';

export type VerificationState =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type BookingStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'PENDING_NANNY'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'DISPUTED';

export interface VerificationDocument {
  docType: 'Govt ID' | 'Police Clearance' | 'CPR Certificate' | 'Health Checkup';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  verifierNote?: string;
}

export interface NannyReview {
  id: string;
  parentName: string;
  childAge: string;
  locality: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking: boolean;
}

export interface NannyProfile {
  id: string;
  fullName: string;
  photo: ImageSourcePropType;
  headline: string;
  bio: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  minimumHours: number;
  supportedAgeGroups: ChildAgeGroup[];
  skills: NannySkill[];
  certifications: string[];
  languages: string[];
  serviceAreas: string[];
  verificationState: VerificationState;
  verifiedBadges: {
    policeBackgroundCheck: boolean;
    govtIdentityVerified: boolean;
    cprCertified: boolean;
    medicalHealthScreened: boolean;
  };
  reviews: NannyReview[];
  isDemoProfile: boolean;
}

export interface NannyBooking {
  id: string;
  bookingNumber: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  nannyId: string;
  nannyName: string;
  nannyPhoto: ImageSourcePropType;
  childAgeGroup: ChildAgeGroup;
  serviceArea: string;
  serviceAddress: string;
  startDateText: string;
  dailyHours: number;
  daysCount: number;
  hourlyRateApplied: number;
  subtotal: number;
  platformServiceFee: number;
  taxes: number;
  totalAmount: number;
  status: BookingStatus;
  statusColor: string;
  notes?: string;
  createdAt: string;
  sessionCheckIn?: string;
  sessionCheckOut?: string;
  attendanceVerifiedByParent?: boolean;
}

export interface VerificationQueueItem {
  id: string;
  nannyId: string;
  nannyName: string;
  appliedDate: string;
  documents: VerificationDocument[];
  currentStatus: VerificationState;
  reviewNotes?: string;
}

export interface NannyIncident {
  id: string;
  bookingNumber: string;
  reportedBy: 'Parent' | 'Nanny';
  severity: 'Low' | 'Medium' | 'High';
  title: string;
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  timestamp: string;
}

// Local image references
const imgCaregiver = require('../assets/images/caregiver_hero.png');
const imgMother = require('../assets/images/04.jpg');
const imgDual = require('../assets/images/01.jpg');
const imgRitual = require('../assets/images/care_ritual_4.jpg');

export const DEMO_NANNIES: NannyProfile[] = [
  {
    id: 'nan-lakshmi',
    fullName: 'Lakshmi Devi R.',
    photo: imgCaregiver,
    headline: 'Certified Newborn & Infant Specialist',
    bio: 'Over 8 years dedicated to newborn care and gentle postpartum transition in Bengaluru. Certified in Infant CPR & First Aid, traditional baby abhyanga, and soothing sleep routines.',
    experienceYears: 8,
    rating: 4.95,
    reviewsCount: 38,
    hourlyRate: 350,
    halfDayRate: 1400,
    fullDayRate: 2600,
    minimumHours: 4,
    supportedAgeGroups: ['Newborn (0 - 3 months)', 'Infant (3 - 12 months)'],
    skills: [
      'Infant First Aid & CPR',
      'Newborn Abhyanga Massage',
      'Gentle Sleep Routine',
      'Sterilization & Hygiene Protocol',
    ],
    certifications: [
      'St. John Ambulance Certified First Aider (2025)',
      'Ayurvedic Infant Care & Abhyanga Training',
    ],
    languages: ['Kannada', 'English', 'Hindi', 'Tamil'],
    serviceAreas: ['Indiranagar', 'Koramangala', 'Domlur', 'HSR Layout'],
    verificationState: 'VERIFIED',
    verifiedBadges: {
      policeBackgroundCheck: true,
      govtIdentityVerified: true,
      cprCertified: true,
      medicalHealthScreened: true,
    },
    reviews: [
      {
        id: 'rev-1',
        parentName: 'Ananya & Rohan K.',
        childAge: '2 months old',
        locality: 'Indiranagar',
        rating: 5,
        date: '12 Nov 2026',
        comment:
          'Lakshmi was an absolute blessing during our first month home. Calm, hygiene-conscious, and our baby slept so peacefully in her care.',
        verifiedBooking: true,
      },
      {
        id: 'rev-2',
        parentName: 'Dr. Meera S.',
        childAge: '5 months old',
        locality: 'Koramangala',
        rating: 5,
        date: '28 Oct 2026',
        comment:
          'Her infant massage techniques are gentle and authentic. As a pediatrician, I felt 100% confident with her safety standards.',
        verifiedBooking: true,
      },
    ],
    isDemoProfile: true,
  },
  {
    id: 'nan-priya',
    fullName: 'Priya Sundaram',
    photo: imgMother,
    headline: 'Montessori Infant Guide & Toddler Specialist',
    bio: 'ECE graduate with 6 years of experience working with infants and toddlers. Specializes in baby-led weaning, developmental sensory play, and creating calming daily rhythms.',
    experienceYears: 6,
    rating: 4.9,
    reviewsCount: 24,
    hourlyRate: 400,
    halfDayRate: 1600,
    fullDayRate: 3000,
    minimumHours: 4,
    supportedAgeGroups: [
      'Infant (3 - 12 months)',
      'Toddler (1 - 3 years)',
      'Pre-school (3 - 5 years)',
    ],
    skills: [
      'Infant First Aid & CPR',
      'Baby Weaning & Nutrition',
      'Developmental Sensory Play',
      'Gentle Sleep Routine',
    ],
    certifications: [
      'Early Childhood Care & Education (ECCE) Diploma',
      'Pediatric Red Cross First Aid Certification',
    ],
    languages: ['English', 'Tamil', 'Kannada'],
    serviceAreas: ['Whitefield', 'HSR Layout', 'Bellandur', 'Sarjapur Road'],
    verificationState: 'VERIFIED',
    verifiedBadges: {
      policeBackgroundCheck: true,
      govtIdentityVerified: true,
      cprCertified: true,
      medicalHealthScreened: true,
    },
    reviews: [
      {
        id: 'rev-3',
        parentName: 'Sunita V.',
        childAge: '14 months old',
        locality: 'Whitefield',
        rating: 5,
        date: '03 Nov 2026',
        comment:
          'Priya engaged my son with lovely sensory activities and helped him eat independently. Very punctual and warm.',
        verifiedBooking: true,
      },
    ],
    isDemoProfile: true,
  },
  {
    id: 'nan-sarala',
    fullName: 'Sarala Kumari V.',
    photo: imgRitual,
    headline: 'Experienced Twins & Newborn Night Caregiver',
    bio: '10 years experience supporting families with twins, triplets, and postpartum nighttime routine stabilization. Highly trusted across Bangalore for patient, attentive care.',
    experienceYears: 10,
    rating: 4.88,
    reviewsCount: 42,
    hourlyRate: 450,
    halfDayRate: 1800,
    fullDayRate: 3400,
    minimumHours: 6,
    supportedAgeGroups: ['Newborn (0 - 3 months)', 'Infant (3 - 12 months)'],
    skills: [
      'Twins & Multiples Care',
      'Newborn Abhyanga Massage',
      'Postpartum Mother Assistance',
      'Sterilization & Hygiene Protocol',
    ],
    certifications: [
      'Appuge Certified Senior Postpartum Nanny',
      'Registered Health & Hygiene Practitioner',
    ],
    languages: ['Kannada', 'Telugu', 'Hindi'],
    serviceAreas: ['Jayanagar', 'JP Nagar', 'Banashankari', 'Basavanagudi'],
    verificationState: 'VERIFIED',
    verifiedBadges: {
      policeBackgroundCheck: true,
      govtIdentityVerified: true,
      cprCertified: false,
      medicalHealthScreened: true,
    },
    reviews: [
      {
        id: 'rev-4',
        parentName: 'Divya & Karthik',
        childAge: 'Twin boys (3m)',
        locality: 'Jayanagar',
        rating: 5,
        date: '19 Oct 2026',
        comment:
          'Handling twins is challenging, but Sarala made it feel seamless. Her patience and deep care gave us restful nights.',
        verifiedBooking: true,
      },
    ],
    isDemoProfile: true,
  },
  {
    id: 'nan-deepa',
    fullName: 'Deepa Hegde',
    photo: imgDual,
    headline: 'Gentle Toddler Companion & Language Tutor',
    bio: 'Dedicated caregiver passionate about story reading, wholesome food preparation, and positive discipline for toddlers and young children.',
    experienceYears: 4,
    rating: 4.82,
    reviewsCount: 16,
    hourlyRate: 320,
    halfDayRate: 1300,
    fullDayRate: 2400,
    minimumHours: 4,
    supportedAgeGroups: ['Toddler (1 - 3 years)', 'Pre-school (3 - 5 years)'],
    skills: [
      'Developmental Sensory Play',
      'Baby Weaning & Nutrition',
      'Gentle Sleep Routine',
    ],
    certifications: ['Certified Nursery Assistant'],
    languages: ['Kannada', 'English', 'Hindi'],
    serviceAreas: ['Indiranagar', 'Frazer Town', 'Malleshwaram'],
    verificationState: 'PENDING',
    verifiedBadges: {
      policeBackgroundCheck: false,
      govtIdentityVerified: true,
      cprCertified: false,
      medicalHealthScreened: true,
    },
    reviews: [],
    isDemoProfile: true,
  },
];

export const INITIAL_NANNY_BOOKINGS: NannyBooking[] = [
  {
    id: 'nbk-101',
    bookingNumber: 'APG-CARE-8821',
    parentId: 'usr-parent-1',
    parentName: 'Ananya Sharma',
    parentPhone: '+91 98860 12345',
    nannyId: 'nan-lakshmi',
    nannyName: 'Lakshmi Devi R.',
    nannyPhoto: imgCaregiver,
    childAgeGroup: 'Newborn (0 - 3 months)',
    serviceArea: 'Indiranagar',
    serviceAddress: 'Flat 402, Shanthi Niketan, 12th Main, Indiranagar, Bengaluru - 560038',
    startDateText: 'Tomorrow, 9:00 AM',
    dailyHours: 6,
    daysCount: 3,
    hourlyRateApplied: 350,
    subtotal: 6300,
    platformServiceFee: 350,
    taxes: 332,
    totalAmount: 6982,
    status: 'CONFIRMED',
    statusColor: '#1B5E20',
    notes: 'Please support newborn bath, abhyanga, and soothe before midday nap.',
    createdAt: 'Yesterday, 4:30 PM',
    sessionCheckIn: undefined,
    sessionCheckOut: undefined,
    attendanceVerifiedByParent: false,
  },
  {
    id: 'nbk-102',
    bookingNumber: 'APG-CARE-7714',
    parentId: 'usr-parent-1',
    parentName: 'Ananya Sharma',
    parentPhone: '+91 98860 12345',
    nannyId: 'nan-priya',
    nannyName: 'Priya Sundaram',
    nannyPhoto: imgMother,
    childAgeGroup: 'Infant (3 - 12 months)',
    serviceArea: 'Indiranagar',
    serviceAddress: 'Flat 402, Shanthi Niketan, 12th Main, Indiranagar, Bengaluru - 560038',
    startDateText: 'Completed on 15 Nov',
    dailyHours: 4,
    daysCount: 2,
    hourlyRateApplied: 400,
    subtotal: 3200,
    platformServiceFee: 200,
    taxes: 170,
    totalAmount: 3570,
    status: 'COMPLETED',
    statusColor: '#2E7D32',
    notes: 'Sensory playtime and weaning support.',
    createdAt: '12 Nov 2026',
    sessionCheckIn: '15 Nov, 9:02 AM',
    sessionCheckOut: '15 Nov, 1:05 PM',
    attendanceVerifiedByParent: true,
  },
];

export const INITIAL_VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    id: 'vq-1',
    nannyId: 'nan-deepa',
    nannyName: 'Deepa Hegde',
    appliedDate: '21 Nov 2026',
    documents: [
      { docType: 'Govt ID', status: 'VERIFIED', verifiedAt: '22 Nov 2026' },
      { docType: 'Police Clearance', status: 'PENDING', verifierNote: 'Awaiting station endorsement copy' },
      { docType: 'Health Checkup', status: 'VERIFIED', verifiedAt: '22 Nov 2026' },
    ],
    currentStatus: 'PENDING',
    reviewNotes: 'Initial in-person interview completed. Police verification document in transit.',
  },
  {
    id: 'vq-2',
    nannyId: 'nan-sarala',
    nannyName: 'Sarala Kumari V.',
    appliedDate: '10 Nov 2026',
    documents: [
      { docType: 'Govt ID', status: 'VERIFIED', verifiedAt: '12 Nov 2026' },
      { docType: 'Police Clearance', status: 'VERIFIED', verifiedAt: '13 Nov 2026' },
      { docType: 'Health Checkup', status: 'VERIFIED', verifiedAt: '12 Nov 2026' },
    ],
    currentStatus: 'VERIFIED',
    reviewNotes: 'Senior reference checks verified. Certified with Appuge standard.',
  },
];

export const INITIAL_INCIDENTS: NannyIncident[] = [
  {
    id: 'inc-01',
    bookingNumber: 'APG-CARE-8821',
    reportedBy: 'Parent',
    severity: 'Low',
    title: 'Schedule Time Shift Request',
    description: 'Parent requested to start 30 minutes later tomorrow due to doctor checkup.',
    status: 'Resolved',
    timestamp: 'Today, 11:20 AM',
  },
];

export function calculateNannyBookingPrice(
  hourlyRate: number,
  hoursPerDay: number,
  daysCount: number,
) {
  const subtotal = hourlyRate * hoursPerDay * daysCount;
  const platformServiceFee = Math.round(subtotal * 0.05); // 5% managed platform fee
  const taxes = Math.round((subtotal + platformServiceFee) * 0.05); // 5% GST
  const totalAmount = subtotal + platformServiceFee + taxes;

  return {
    subtotal,
    platformServiceFee,
    taxes,
    totalAmount,
  };
}
