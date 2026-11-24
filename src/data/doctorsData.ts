import { ImageSourcePropType } from 'react-native';

export type ConsultationType = 'ONLINE' | 'IN_CLINIC';

export type DoctorSpecialityId =
  | 'pediatrician'
  | 'gynecologist'
  | 'obstetrician'
  | 'lactation'
  | 'dermatologist'
  | 'nutritionist'
  | 'development'
  | 'physician';

export type DoctorAppointmentStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'PENDING_DOCTOR'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'DISPUTED';

export interface DoctorSpeciality {
  id: DoctorSpecialityId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  doctorCount: number;
  bgTone: string;
  image?: ImageSourcePropType;
  editorialTag?: string;
  accentColor?: string;
}

export interface FamilyJourneyNeed {
  id: string;
  title: string;
  subtitle: string;
  kicker: string;
  specialityId: DoctorSpecialityId;
  image: ImageSourcePropType;
  badge: string;
}

export interface DoctorReview {
  id: string;
  parentName: string;
  consultationType: ConsultationType;
  patientType: string;
  rating: number;
  date: string;
  comment: string;
  verifiedAppointment: boolean;
}

export interface DoctorAvailabilitySlot {
  date: string; // '2026-11-25'
  displayDate: string; // 'Wed, 25 Nov'
  dayLabel: string; // 'Tomorrow' | 'Wed' | 'Thu'
  slots: {
    time: string; // '09:30 AM'
    period: 'Morning' | 'Afternoon' | 'Evening';
    available: boolean;
  }[];
}

export interface DoctorClinic {
  name: string;
  address: string;
  locality: string;
  city: string;
  consultationHours: string;
  directionsNote?: string;
  isVerified: boolean;
}

export interface DoctorProfile {
  id: string;
  fullName: string;
  profileImage: ImageSourcePropType;
  specialityId: DoctorSpecialityId;
  specialityTitle: string;
  biography: string;
  experienceYears: number;
  qualifications: string[];
  medicalRegistration: {
    council: string;
    registrationNumber: string;
    isVerified: boolean;
    verificationDate?: string;
  };
  languages: string[];
  areasOfExpertise: string[];
  consultationTypes: ConsultationType[];
  onlineFee: number;
  inClinicFee: number;
  clinic: DoctorClinic;
  rating: number;
  reviewsCount: number;
  reviews: DoctorReview[];
  availability: DoctorAvailabilitySlot[];
  isDemo: boolean;
}

export interface AppointmentEvent {
  status: DoctorAppointmentStatus;
  title: string;
  desc: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

export interface DoctorAppointment {
  id: string;
  appointmentReference: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage: ImageSourcePropType;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentTime: string;
  patientType: 'Mother' | 'Baby' | 'Child' | 'Family';
  patientName: string;
  patientAgeOrDob: string;
  reasonForVisit: string;
  clinicName?: string;
  clinicAddress?: string;
  consultationFee: number;
  platformFee: number;
  taxes: number;
  totalAmount: number;
  status: DoctorAppointmentStatus;
  statusColor: string;
  timeline: AppointmentEvent[];
  createdAt: string;
  onlinePrepNote?: string;
}

// Local image references
const imgClinical = require('../assets/images/hero_clinical.jpg');
const imgCaregiver = require('../assets/images/caregiver_hero.png');
const imgMother = require('../assets/images/04.jpg');
const imgDual = require('../assets/images/01.jpg');
const imgRitual = require('../assets/images/care_ritual_4.jpg');
const imgBaby = require('../assets/images/hero_newborn_daylight.jpg');

export const DOCTOR_SPECIALITIES: DoctorSpeciality[] = [
  {
    id: 'pediatrician',
    title: 'Pediatrician',
    subtitle: 'Infant & child health',
    description: 'Growth monitoring, newborn colic, fever care, and immunization guidance.',
    iconName: 'baby',
    doctorCount: 4,
    bgTone: '#EAF2EC',
    image: imgBaby,
    editorialTag: 'INFANT HEALTH',
    accentColor: '#2C4035',
  },
  {
    id: 'gynecologist',
    title: 'Gynecologist',
    subtitle: 'Women & maternal wellness',
    description: 'Postpartum recovery, pelvic health, hormonal balance, and maternal screening.',
    iconName: 'mother',
    doctorCount: 3,
    bgTone: '#FAF4EB',
    image: imgMother,
    editorialTag: 'MATERNAL RECOVERY',
    accentColor: '#C86D51',
  },
  {
    id: 'obstetrician',
    title: 'Obstetrician',
    subtitle: 'Pregnancy & delivery care',
    description: 'Antenatal consultations, high-risk pregnancy oversight, and birth planning.',
    iconName: 'heart',
    doctorCount: 3,
    bgTone: '#F3E7DC',
    image: require('../assets/images/03.jpg'),
    editorialTag: 'PREGNANCY & BIRTH',
    accentColor: '#16281E',
  },
  {
    id: 'lactation',
    title: 'Lactation Consultant',
    subtitle: 'Breastfeeding & milk supply',
    description: 'Gentle latch coaching, nipple healing, engorgement relief, and weaning.',
    iconName: 'sparkle',
    doctorCount: 3,
    bgTone: '#E8EDE0',
    image: imgDual,
    editorialTag: 'FEEDING RITUALS',
    accentColor: '#5E7A63',
  },
  {
    id: 'dermatologist',
    title: 'Pediatric Dermatologist',
    subtitle: 'Sensitive baby skin care',
    description: 'Cradle cap, infantile eczema, diaper dermatitis, and gentle barrier care.',
    iconName: 'shield',
    doctorCount: 2,
    bgTone: '#EEEADF',
    image: imgRitual,
    editorialTag: 'BABY SKIN CARE',
    accentColor: '#8C6239',
  },
  {
    id: 'nutritionist',
    title: 'Maternal & Baby Nutritionist',
    subtitle: 'Wholesome weaning & healing',
    description: 'Postpartum nourishment, traditional galactagogues, and baby-led weaning.',
    iconName: 'leaf',
    doctorCount: 2,
    bgTone: '#EAF2EC',
    image: require('../assets/images/nutrition_hero.png'),
    editorialTag: 'NOURISHMENT & WEANING',
    accentColor: '#2E7D32',
  },
  {
    id: 'development',
    title: 'Child Development Specialist',
    subtitle: 'Motor & speech milestones',
    description: 'Early milestone tracking, sensory development, and gentle parent coaching.',
    iconName: 'star',
    doctorCount: 2,
    bgTone: '#FAF4EB',
    image: require('../assets/images/hero_newborn.jpg'),
    editorialTag: 'GROWTH MILESTONES',
    accentColor: '#D4A373',
  },
  {
    id: 'physician',
    title: 'Family Physician',
    subtitle: 'Everyday family wellness',
    description: 'Seasonal ailments, preventative check-ups, and home healthcare oversight.',
    iconName: 'stethoscope',
    doctorCount: 3,
    bgTone: '#F2E9E4',
    image: imgClinical,
    editorialTag: 'FAMILY WELLNESS',
    accentColor: '#16281E',
  },
];

export const FAMILY_JOURNEY_NEEDS: FamilyJourneyNeed[] = [
  {
    id: 'journey-newborn',
    title: 'The First 40 Days',
    subtitle: 'Gentle colic, jaundice, and newborn transition care.',
    kicker: 'NEWBORN TRANQUILITY',
    specialityId: 'pediatrician',
    image: require('../assets/images/hero_newborn.jpg'),
    badge: '0–3 Months',
  },
  {
    id: 'journey-postpartum',
    title: 'Sacred Postpartum Recovery',
    subtitle: 'Pelvic health, incision healing, and maternal restore.',
    kicker: 'MATERNAL SANCTUARY',
    specialityId: 'gynecologist',
    image: imgMother,
    badge: 'Post-Delivery',
  },
  {
    id: 'journey-breastfeeding',
    title: 'Gentle Latch & Lactation',
    subtitle: 'Nipple healing, supply confidence, and weaning.',
    kicker: 'FEEDING RITUALS',
    specialityId: 'lactation',
    image: imgDual,
    badge: 'Certified IBCLC',
  },
  {
    id: 'journey-pregnancy',
    title: 'Antenatal & Trimester Care',
    subtitle: 'Growth scans, high-risk screening, and birth planning.',
    kicker: 'PREGNANCY JOURNEY',
    specialityId: 'obstetrician',
    image: require('../assets/images/03.jpg'),
    badge: 'Trimesters 1–3',
  },
  {
    id: 'journey-skin',
    title: 'Sensitive Baby Skin Care',
    subtitle: 'Cradle cap, eczema, heat rashes, and barrier rituals.',
    kicker: 'PEDIATRIC DERMATOLOGY',
    specialityId: 'dermatologist',
    image: imgRitual,
    badge: 'Safe Formulations',
  },
  {
    id: 'journey-nutrition',
    title: 'First Solids & Child Nutrition',
    subtitle: 'Traditional nourishing broths, galactagogues, and weight gain.',
    kicker: 'HOLISTIC NUTRITION',
    specialityId: 'nutritionist',
    image: require('../assets/images/nutrition_hero.png'),
    badge: 'Baby-Led Weaning',
  },
];

export const DEMO_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-radhika',
    fullName: 'Dr. Radhika Menon',
    profileImage: imgClinical,
    specialityId: 'pediatrician',
    specialityTitle: 'Senior Pediatrician & Neonatal Care Specialist',
    biography:
      'With over 14 years of dedicated clinical practice at premier pediatric hospitals in Bengaluru, Dr. Radhika focuses on empathetic newborn transition, infant allergy management, and gentle developmental milestones. She believes healthcare should feel calm, supportive, and reassuring for parents.',
    experienceYears: 14,
    qualifications: ['MBBS (Bangalore Medical College)', 'MD - Pediatrics (NIMHANS/RGUHS)', 'Fellowship in Neonatology'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-54219',
      isVerified: true,
      verificationDate: '12 Oct 2026',
    },
    languages: ['English', 'Kannada', 'Hindi', 'Malayalam'],
    areasOfExpertise: [
      'Newborn Growth Tracking',
      'Infant Colic & Reflux',
      'Childhood Immunization',
      'Allergy & Eczema Management',
      'Sleep & Weaning Guidance',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 850,
    inClinicFee: 1100,
    clinic: {
      name: 'Appuge Mother & Child Sanctuary Clinic',
      address: 'Suite 204, 100 Feet Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      consultationHours: 'Mon - Sat: 9:30 AM - 1:30 PM & 4:30 PM - 7:30 PM',
      directionsNote: 'Next to 12th Main junction, valet parking available.',
      isVerified: true,
    },
    rating: 4.96,
    reviewsCount: 42,
    reviews: [
      {
        id: 'rev-r1',
        parentName: 'Ananya Sharma',
        consultationType: 'IN_CLINIC',
        patientType: 'Baby (3 months)',
        rating: 5,
        date: '18 Nov 2026',
        comment:
          'Dr. Radhika was remarkably patient with our 3-month-old daughter. She listened to all our anxiety about feeding and gave gentle, practical advice without rush.',
        verifiedAppointment: true,
      },
      {
        id: 'rev-r2',
        parentName: 'Rohan Deshmukh',
        consultationType: 'ONLINE',
        patientType: 'Baby (6 months)',
        rating: 5,
        date: '10 Nov 2026',
        comment:
          'The online consultation was crystal clear and reassuring. She walked us through baby-led weaning step by step.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '11:00 AM', period: 'Morning', available: true },
          { time: '11:30 AM', period: 'Morning', available: false },
          { time: '02:30 PM', period: 'Afternoon', available: true },
          { time: '03:15 PM', period: 'Afternoon', available: true },
          { time: '05:00 PM', period: 'Evening', available: true },
          { time: '06:00 PM', period: 'Evening', available: true },
        ],
      },
      {
        date: '2026-11-26',
        displayDate: 'Thu, 26 Nov',
        dayLabel: 'Thu',
        slots: [
          { time: '09:30 AM', period: 'Morning', available: true },
          { time: '10:30 AM', period: 'Morning', available: true },
          { time: '02:00 PM', period: 'Afternoon', available: true },
          { time: '04:30 PM', period: 'Evening', available: true },
        ],
      },
      {
        date: '2026-11-27',
        displayDate: 'Fri, 27 Nov',
        dayLabel: 'Fri',
        slots: [
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '11:00 AM', period: 'Morning', available: true },
          { time: '05:00 PM', period: 'Evening', available: true },
        ],
      },
    ],
    isDemo: true,
  },
  {
    id: 'doc-meera',
    fullName: 'Dr. Meera Nambiar',
    profileImage: imgMother,
    specialityId: 'obstetrician',
    specialityTitle: 'Senior Obstetrician & Maternal Health Specialist',
    biography:
      'Dr. Meera has spent 16 years providing compassionate antenatal, birthing, and fourth-trimester postpartum recovery care. Her clinical ethos centers on empowering mothers with evidence-based guidance, pelvic health restoration, and emotional well-being after delivery.',
    experienceYears: 16,
    qualifications: ['MBBS (KMC Manipal)', 'MS - Obstetrics & Gynaecology (AIIMS)', 'DNB (OBG)'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-41872',
      isVerified: true,
      verificationDate: '04 Aug 2026',
    },
    languages: ['English', 'Kannada', 'Hindi', 'Tamil'],
    areasOfExpertise: [
      'High-Risk Pregnancy Oversight',
      'C-Section & Natural Birth Recovery',
      'Postpartum Pelvic Floor Health',
      'Hormonal Health & Lactation Alignment',
      'Preconception Counseling',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 900,
    inClinicFee: 1250,
    clinic: {
      name: 'Nambiar Maternal Wellness Center',
      address: 'Plot 18, 14th Main, 4th Block, Koramangala',
      locality: 'Koramangala',
      city: 'Bengaluru',
      consultationHours: 'Tue - Sun: 10:00 AM - 2:00 PM & 5:00 PM - 8:00 PM',
      directionsNote: 'Opposite Sony World signal, lift access available.',
      isVerified: true,
    },
    rating: 4.98,
    reviewsCount: 38,
    reviews: [
      {
        id: 'rev-m1',
        parentName: 'Divya Balakrishnan',
        consultationType: 'IN_CLINIC',
        patientType: 'Mother (Postpartum 6 weeks)',
        rating: 5,
        date: '14 Nov 2026',
        comment:
          'Dr. Meera checked my C-section scar healing with such gentle thoroughness and gave me real confidence about resuming physical mobility.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '10:30 AM', period: 'Morning', available: true },
          { time: '11:45 AM', period: 'Morning', available: true },
          { time: '05:30 PM', period: 'Evening', available: true },
          { time: '06:30 PM', period: 'Evening', available: true },
        ],
      },
      {
        date: '2026-11-26',
        displayDate: 'Thu, 26 Nov',
        dayLabel: 'Thu',
        slots: [
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '04:00 PM', period: 'Afternoon', available: true },
        ],
      },
    ],
    isDemo: true,
  },
  {
    id: 'doc-aravind',
    fullName: 'Dr. Aravind Swaminathan',
    profileImage: imgCaregiver,
    specialityId: 'pediatrician',
    specialityTitle: 'Consultant Pediatrician & Child Nutritionist',
    biography:
      'Trained at Christian Medical College (CMC) Vellore, Dr. Aravind specializes in infant gut health, toddler growth faltering, and preventative pediatric medicine. He brings warmth and clarity to every consultation.',
    experienceYears: 11,
    qualifications: ['MBBS (CMC Vellore)', 'DCH (Pediatrics)', 'Fellow of Royal College of Pediatrics (UK)'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-69104',
      isVerified: true,
      verificationDate: '19 Sep 2026',
    },
    languages: ['English', 'Tamil', 'Kannada'],
    areasOfExpertise: [
      'Infant Nutrition & Weaning',
      'Recurrent Cough & Respiratory Care',
      'Growth Faltering & Milestones',
      'Fever Protocols for Infants',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 750,
    inClinicFee: 950,
    clinic: {
      name: 'Swaminathan Child Clinic & Childcare',
      address: '22, 17th Cross, Sector 4, HSR Layout',
      locality: 'HSR Layout',
      city: 'Bengaluru',
      consultationHours: 'Mon - Fri: 9:00 AM - 1:00 PM & 4:00 PM - 7:00 PM',
      directionsNote: 'Near BDA Complex, ground floor clinic.',
      isVerified: true,
    },
    rating: 4.92,
    reviewsCount: 29,
    reviews: [
      {
        id: 'rev-a1',
        parentName: 'Kavita Rao',
        consultationType: 'ONLINE',
        patientType: 'Baby (9 months)',
        rating: 5,
        date: '02 Nov 2026',
        comment:
          'Excellent guidance on finger foods and iron-rich meals for our baby. Very approachable and knowledgeable.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '09:00 AM', period: 'Morning', available: true },
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '04:30 PM', period: 'Evening', available: true },
        ],
      },
      {
        date: '2026-11-26',
        displayDate: 'Thu, 26 Nov',
        dayLabel: 'Thu',
        slots: [
          { time: '11:00 AM', period: 'Morning', available: true },
          { time: '05:00 PM', period: 'Evening', available: true },
        ],
      },
    ],
    isDemo: true,
  },
  {
    id: 'doc-sneha',
    fullName: 'Dr. Sneha Hegde',
    profileImage: imgDual,
    specialityId: 'lactation',
    specialityTitle: 'IBCLC Lactation Specialist & Pediatric Nurse Fellow',
    biography:
      'Certified by the International Board of Lactation Consultant Examiners (IBCLC), Dr. Sneha has guided over 2,000 mothers through the early hurdles of breastfeeding, tongue-tie identification, natural supply enhancement, and pain-free positioning.',
    experienceYears: 10,
    qualifications: ['MBBS (RGUHS)', 'IBCLC Certified Lactation Consultant', 'Fellowship in Infant Feeding'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-78321',
      isVerified: true,
      verificationDate: '15 Jul 2026',
    },
    languages: ['English', 'Kannada', 'Hindi', 'Konkani'],
    areasOfExpertise: [
      'Pain-Free Latch Coaching',
      'Low Milk Supply Optimization',
      'Mastitis & Engorgement Protocol',
      'Pumping & Return-to-Work Planning',
      'Infant Oral Assessment',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 800,
    inClinicFee: 1100,
    clinic: {
      name: 'Appuge Sanctuary Lactation Suites',
      address: 'Suite 102, 12th Main Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      consultationHours: 'Mon - Sat: 10:00 AM - 3:00 PM',
      directionsNote: 'Private mother-infant lactation nursing suites.',
      isVerified: true,
    },
    rating: 4.97,
    reviewsCount: 35,
    reviews: [
      {
        id: 'rev-s1',
        parentName: 'Pooja Venkatesh',
        consultationType: 'IN_CLINIC',
        patientType: 'Mother & Newborn (2 weeks)',
        rating: 5,
        date: '12 Nov 2026',
        comment:
          'She completely saved our breastfeeding journey. In just 45 minutes, she corrected my latch angle and the pain was gone. Truly a blessing.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '11:30 AM', period: 'Morning', available: true },
          { time: '01:30 PM', period: 'Afternoon', available: true },
        ],
      },
    ],
    isDemo: true,
  },
  {
    id: 'doc-kavita',
    fullName: 'Dr. Kavita Kulkarni',
    profileImage: imgRitual,
    specialityId: 'dermatologist',
    specialityTitle: 'Pediatric Dermatologist & Newborn Barrier Specialist',
    biography:
      'Specialized in delicate newborn skin biology, Dr. Kavita brings gentle, non-irritating diagnostic care for infant eczema, cradle cap, viral exanthems, and maternal postpartum dermatological changes.',
    experienceYears: 12,
    qualifications: ['MBBS (BMCRI)', 'MD - Dermatology & Venereology (PGIMER Chandigarh)'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-60293',
      isVerified: true,
      verificationDate: '28 Aug 2026',
    },
    languages: ['English', 'Kannada', 'Marathi', 'Hindi'],
    areasOfExpertise: [
      'Infantile Atopic Dermatitis',
      'Stubborn Diaper Rash & Fungal Care',
      'Cradle Cap Gentle Protocols',
      'Postpartum Melasma & Skin Recovery',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 850,
    inClinicFee: 1150,
    clinic: {
      name: 'DermaCare Mother & Baby Skin Clinic',
      address: '74, Whitefield Main Road, Palm Meadows Zone',
      locality: 'Whitefield',
      city: 'Bengaluru',
      consultationHours: 'Wed - Sun: 11:00 AM - 3:00 PM & 5:00 PM - 8:00 PM',
      directionsNote: 'Opposite Forum Neighbourhood Mall.',
      isVerified: true,
    },
    rating: 4.91,
    reviewsCount: 22,
    reviews: [
      {
        id: 'rev-k1',
        parentName: 'Tanvi Agarwal',
        consultationType: 'ONLINE',
        patientType: 'Baby (4 months)',
        rating: 5,
        date: '08 Nov 2026',
        comment:
          'Her formulation recommendations cleared my daughter’s facial eczema within 48 hours without harsh steroids.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '11:00 AM', period: 'Morning', available: true },
          { time: '12:00 PM', period: 'Afternoon', available: true },
          { time: '05:30 PM', period: 'Evening', available: true },
        ],
      },
    ],
    isDemo: true,
  },
  {
    id: 'doc-arun',
    fullName: 'Dr. Arun Kumar S.',
    profileImage: imgBaby,
    specialityId: 'physician',
    specialityTitle: 'Family Physician & Postpartum Home Care Doctor',
    biography:
      'Dr. Arun provides holistic, unhurried care for young families in Bengaluru. He oversees post-discharge clinical checks, routine maternal blood pressure monitoring, seasonal viral management, and preventative health guidance.',
    experienceYears: 13,
    qualifications: ['MBBS (MS Ramaiah Medical College)', 'DNB - Family Medicine'],
    medicalRegistration: {
      council: 'Karnataka Medical Council',
      registrationNumber: 'KMC-57812',
      isVerified: true,
      verificationDate: '02 Jun 2026',
    },
    languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
    areasOfExpertise: [
      'Postnatal Maternal Wellness',
      'Infant Fever & Respiratory Check',
      'Family Preventative Health',
      'Diagnostic Lab Result Reviews',
    ],
    consultationTypes: ['ONLINE', 'IN_CLINIC'],
    onlineFee: 650,
    inClinicFee: 850,
    clinic: {
      name: 'Family Wellness Clinic Indiranagar',
      address: '412, 6th Main, Defence Colony, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      consultationHours: 'Mon - Sat: 8:30 AM - 12:30 PM & 4:30 PM - 8:00 PM',
      directionsNote: 'Near Defence Colony park.',
      isVerified: true,
    },
    rating: 4.89,
    reviewsCount: 31,
    reviews: [
      {
        id: 'rev-ar1',
        parentName: 'Varun Pillai',
        consultationType: 'IN_CLINIC',
        patientType: 'Mother & Infant',
        rating: 5,
        date: '17 Nov 2026',
        comment:
          'Very calm and reassuring doctor. Took his time explaining symptoms and avoided unnecessary prescriptions.',
        verifiedAppointment: true,
      },
    ],
    availability: [
      {
        date: '2026-11-25',
        displayDate: 'Wed, 25 Nov',
        dayLabel: 'Tomorrow',
        slots: [
          { time: '09:00 AM', period: 'Morning', available: true },
          { time: '10:00 AM', period: 'Morning', available: true },
          { time: '05:00 PM', period: 'Evening', available: true },
        ],
      },
    ],
    isDemo: true,
  },
];

export const INITIAL_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'apt-01',
    appointmentReference: 'APG-DOC-9821',
    doctorId: 'doc-radhika',
    doctorName: 'Dr. Radhika Menon',
    doctorSpeciality: 'Senior Pediatrician',
    doctorImage: imgClinical,
    consultationType: 'IN_CLINIC',
    appointmentDate: 'Tomorrow, 25 Nov',
    appointmentTime: '10:00 AM',
    patientType: 'Baby',
    patientName: 'Aarav (4 months old)',
    patientAgeOrDob: '4 months',
    reasonForVisit: 'Routine milestone assessment and sleep transition advice.',
    clinicName: 'Appuge Mother & Child Sanctuary Clinic',
    clinicAddress: 'Suite 204, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    consultationFee: 1100,
    platformFee: 55, // 5% managed platform fee
    taxes: 58, // 5% GST
    totalAmount: 1213,
    status: 'CONFIRMED',
    statusColor: '#1B5E20',
    timeline: [
      {
        status: 'REQUESTED',
        title: 'Appointment Requested',
        desc: 'Request submitted by parent.',
        timestamp: 'Yesterday, 3:30 PM',
        completed: true,
        active: false,
      },
      {
        status: 'ACCEPTED',
        title: 'Doctor Accepted',
        desc: 'Dr. Radhika Menon confirmed the slot.',
        timestamp: 'Yesterday, 4:15 PM',
        completed: true,
        active: false,
      },
      {
        status: 'CONFIRMED',
        title: 'Platform Confirmed',
        desc: 'In-clinic slot secured at Indiranagar sanctuary.',
        timestamp: 'Yesterday, 4:20 PM',
        completed: true,
        active: true,
      },
      {
        status: 'COMPLETED',
        title: 'Consultation Complete',
        desc: 'Post-consultation summary and prescription.',
        timestamp: 'Scheduled for Tomorrow',
        completed: false,
        active: false,
      },
    ],
    createdAt: '23 Nov 2026',
  },
  {
    id: 'apt-02',
    appointmentReference: 'APG-DOC-7742',
    doctorId: 'doc-sneha',
    doctorName: 'Dr. Sneha Hegde',
    doctorSpeciality: 'IBCLC Lactation Specialist',
    doctorImage: imgDual,
    consultationType: 'ONLINE',
    appointmentDate: 'Thu, 26 Nov',
    appointmentTime: '11:30 AM',
    patientType: 'Mother',
    patientName: 'Ananya Sharma',
    patientAgeOrDob: 'Postpartum 3 weeks',
    reasonForVisit: 'Pain-free latching coaching and natural milk supply optimization.',
    consultationFee: 800,
    platformFee: 40,
    taxes: 42,
    totalAmount: 882,
    status: 'REQUESTED',
    statusColor: '#C86D51',
    timeline: [
      {
        status: 'REQUESTED',
        title: 'Appointment Requested',
        desc: 'Request awaiting clinic scheduling desk verification.',
        timestamp: 'Today, 10:15 AM',
        completed: true,
        active: true,
      },
      {
        status: 'ACCEPTED',
        title: 'Doctor Acceptance',
        desc: 'Dr. Sneha Hegde reviews patient notes.',
        timestamp: 'Pending review',
        completed: false,
        active: false,
      },
      {
        status: 'CONFIRMED',
        title: 'Secure Video Room Ready',
        desc: 'HD private video consultation link issued.',
        timestamp: 'Pending confirmation',
        completed: false,
        active: false,
      },
    ],
    createdAt: '24 Nov 2026',
    onlinePrepNote:
      'Please ensure a quiet, well-lit room with your infant nursing pillow ready. A direct HD video link will activate 15 minutes before your scheduled slot once confirmed.',
  },
  {
    id: 'apt-03',
    appointmentReference: 'APG-DOC-5412',
    doctorId: 'doc-meera',
    doctorName: 'Dr. Meera Nambiar',
    doctorSpeciality: 'Senior Obstetrician',
    doctorImage: imgMother,
    consultationType: 'IN_CLINIC',
    appointmentDate: '14 Nov 2026',
    appointmentTime: '11:45 AM',
    patientType: 'Mother',
    patientName: 'Divya Balakrishnan',
    patientAgeOrDob: 'Postpartum 6 weeks',
    reasonForVisit: 'Six-week postpartum incision check and pelvic healing review.',
    clinicName: 'Nambiar Maternal Wellness Center',
    clinicAddress: 'Plot 18, 14th Main, 4th Block, Koramangala, Bengaluru',
    consultationFee: 1250,
    platformFee: 63,
    taxes: 66,
    totalAmount: 1379,
    status: 'COMPLETED',
    statusColor: '#2E7D32',
    timeline: [
      {
        status: 'REQUESTED',
        title: 'Requested',
        desc: 'Submitted by parent.',
        timestamp: '12 Nov 2026',
        completed: true,
        active: false,
      },
      {
        status: 'CONFIRMED',
        title: 'Confirmed',
        desc: 'Appointment confirmed.',
        timestamp: '13 Nov 2026',
        completed: true,
        active: false,
      },
      {
        status: 'COMPLETED',
        title: 'Completed',
        desc: 'Consultation completed. Verified clinical notes issued.',
        timestamp: '14 Nov 2026, 12:30 PM',
        completed: true,
        active: true,
      },
    ],
    createdAt: '12 Nov 2026',
  },
];

export function calculateDoctorAppointmentPrice(consultationFee: number) {
  const platformFee = Math.round(consultationFee * 0.05); // 5% managed platform fee
  const taxes = Math.round((consultationFee + platformFee) * 0.05); // 5% GST
  const totalAmount = consultationFee + platformFee + taxes;

  return {
    consultationFee,
    platformFee,
    taxes,
    totalAmount,
  };
}
