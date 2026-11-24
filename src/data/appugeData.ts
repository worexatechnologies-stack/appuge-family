import type { ImageSourcePropType } from 'react-native';

export interface ServiceItem {
  id: string;
  category: 'mother' | 'baby' | 'combined' | 'specialist' | 'nutrition';
  title: string;
  tagline: string;
  desc: string;
  highlights: string[];
  duration?: string;
  popular?: boolean;
  image?: any;
  rating?: number;
  reviewsCount?: number;
}

export interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  role: string;
  quote: string;
  rating: number;
  service: string;
}

export const APPUGE_INFO = {
  name: 'Appuge',
  tagline: 'Heartbeats Wrapped With Love',
  subtitle: 'Nurturing the woman who holds her world.',
  quote: 'She gave life, now let us care for her.',
  description:
    'We bridge ancestral wisdom with modern healthcare standards to provide a safe, restorative sanctuary for mothers and newborns in Bangalore.',
  phone: '+919187232968',
  phoneDisplay: '+91 91872 32968',
  email: 'appuge.official@gmail.com',
  location: 'Bangalore, Karnataka, India',
  instagram: 'https://www.instagram.com/appuge.official',
  facebook: 'https://www.facebook.com/share/1BuAMhdr5P/',
  website: 'https://appuge.com',
  areasCovered: [
    'Indiranagar',
    'Koramangala',
    'HSR Layout',
    'Whitefield',
    'Jayanagar',
    'JP Nagar',
    'Electronic City',
    'Hebbal',
    'Yelahanka',
    'Malleshwaram',
    'Sarjapur Road',
    'Bellandur',
  ],
};

export const QUICK_CATEGORIES = [
  { id: 'c1', label: 'Mother Care', tab: 'services', icon: 'mother' },
  { id: 'c2', label: 'Baby Care', tab: 'services', icon: 'baby' },
  { id: 'c3', label: 'Ayurvedic Food', tab: 'nutrition', icon: 'soup' },
  { id: 'c4', label: 'Specialist Doctors', tab: 'doctors', icon: 'doctor' },
  { id: 'c5', label: 'Help & FAQs', tab: 'faqs', icon: 'chat' },
];

export interface HeroSlideData {
  id: string;
  category: string;
  headline: string;
  description: string;
  image: ImageSourcePropType;
  imageLabel: string;
  layout: 'imageTopTall' | 'imageTop' | 'imageTopCompact' | 'imageBottom';
  alignment: 'left' | 'center' | 'right';
  theme: 'warm' | 'sage' | 'earth' | 'ivory';
  exploreLabel: string;
  targetTab: 'services' | 'nutrition' | 'doctors';
  serviceTitle: string;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'mother-care',
    category: 'MOTHER CARE',
    headline: 'Care that embraces every new beginning.',
    description:
      'Thoughtful postnatal support inspired by generations of Indian wisdom.',
    image: require('../assets/images/hero_newborn.jpg'),
    imageLabel: 'A mother cradles her newborn in traditional Indian cotton',
    layout: 'imageTopTall',
    alignment: 'left',
    theme: 'warm',
    exploreLabel: 'Explore mother care',
    targetTab: 'services',
    serviceTitle: 'Post-Pregnancy Recovery (Mother Care)',
  },
  {
    id: 'newborn-care',
    category: 'NEWBORN CARE',
    headline: 'Tiny beginnings deserve the gentlest care.',
    description:
      'Thoughtful newborn support, hygiene and nurturing attention.',
    image: require('../assets/images/hero_newborn_daylight.jpg'),
    imageLabel: 'A mother cradling her newborn in a sunlit home',
    layout: 'imageTop',
    alignment: 'center',
    theme: 'sage',
    exploreLabel: 'Explore newborn care',
    targetTab: 'services',
    serviceTitle: 'Newborn Care',
  },
  {
    id: 'nutrition',
    category: 'NOURISHMENT',
    headline: 'Nourishment, rooted in tradition.',
    description:
      'Thoughtfully prepared traditional meals for the journey ahead.',
    image: require('../assets/images/nutrition_hero.png'),
    imageLabel: 'A traditional Indian meal with fresh herbs and spices',
    layout: 'imageTopCompact',
    alignment: 'right',
    theme: 'earth',
    exploreLabel: 'Explore nutrition',
    targetTab: 'nutrition',
    serviceTitle: 'Postpartum Nutrition',
  },
  {
    id: 'clinical-care',
    category: 'CLINICAL CARE',
    headline: 'Expert guidance, closer to home.',
    description:
      'Connect with qualified healthcare professionals for maternal and newborn care.',
    image: require('../assets/images/hero_clinical.jpg'),
    imageLabel: 'A doctor consulting with a mother and her child at home',
    layout: 'imageBottom',
    alignment: 'left',
    theme: 'ivory',
    exploreLabel: 'Find a specialist',
    targetTab: 'doctors',
    serviceTitle: 'Maternal and Newborn Care Consultation',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'mother-care',
    category: 'mother',
    title: 'Post-Pregnancy Recovery (Mother Care)',
    tagline: 'Restoring Strength & Uterine Healing',
    desc: 'Dedicated support for physical and emotional healing after childbirth through sacred maternal recovery traditions.',
    image: require('../assets/images/04.jpg'),
    rating: 4.95,
    reviewsCount: 142,
    highlights: [
      'Postnatal Abhyanga: Therapeutic warm herbal oil massage to boost circulation & uterine involution',
      'Herbal Bath (Snana): Boiled with medicinal leaves to soothe sore muscles & prevent infection',
      'Traditional Belly Wrapping: Breathable cotton cloth binding to assist abdominal muscle recovery',
      'Lactation Support: Expert latch assistance, posture guidance & herbal galactagogue teas',
      'Emotional Wellness: Compassionate listening & peaceful presence to ease postpartum blues',
    ],
    duration: '21 to 45 Days',
    popular: true,
  },
  {
    id: 'baby-care',
    category: 'baby',
    title: 'Newborn Baby Care',
    tagline: 'Gentle, Hygienic & Loving Hands',
    desc: 'Specialized handling, traditional oil massage, hygiene baths, and sleep support for your newborn.',
    image: require('../assets/images/05.jpg'),
    rating: 4.98,
    reviewsCount: 186,
    highlights: [
      'Traditional Baby Abhyanga: Gentle massage with warm virgin coconut or sweet almond oil',
      'Hygienic Herbal Baby Bath: Temperature-controlled, soothing bath to nurture sensitive skin',
      'Umbilical Cord & Skin Hygiene: Sterile, careful monitoring of healing cord and skin folds',
      'Colic & Gas Relief: Gentle tummy strokes and bicycle exercises to alleviate infant discomfort',
      'Sleep & Burping Support: Establishing soothing day & night sleep rhythms for your baby',
    ],
    duration: 'Flexible (Day Care or 24/7)',
    popular: true,
  },
  {
    id: 'combined-care',
    category: 'combined',
    title: 'Mother & Baby Dual Sanctuary',
    tagline: 'Complete Family Harmony at Home',
    desc: 'Our signature holistic program seamlessly caring for both recovering mama and her newborn.',
    image: require('../assets/images/01.jpg'),
    rating: 5.0,
    reviewsCount: 210,
    highlights: [
      'Complete daily recovery rituals for mother (massage, herbal steam bath, belly wrap)',
      'Dedicated newborn hygiene, massage, swaddling & burping routines',
      'Nutritional guidance and assistance in preparing postpartum kashayams',
      'Night-time sleep assistance allowing mother to get restorative sleep',
      'Sanitized, background-checked and medically screened caregivers',
    ],
    duration: '30, 45 or 60 Days',
    popular: true,
  },
  {
    id: 'doctor-care',
    category: 'specialist',
    title: 'Specialist Doctor Consultation',
    tagline: 'Direct Clinical Guidance at Your Home',
    desc: 'Direct access to experienced maternal and pediatric specialists for clinical reassurance.',
    image: require('../assets/images/03.jpg'),
    rating: 4.92,
    reviewsCount: 88,
    highlights: [
      'Experienced pediatricians for newborn health check-ups and milestone reviews',
      'Obstetricians & Gynecologists for post-delivery healing assessment',
      'Certified International Board Lactation Consultants (IBCLC)',
      'Postpartum mental health & wellness counselors',
      'Tele-consultation or home visits across Bangalore',
    ],
    duration: 'On-Demand / Scheduled Slots',
  },
  {
    id: 'nutrition-care',
    category: 'nutrition',
    title: 'Nutritional Food Delivery',
    tagline: 'Ayurvedic Healing Meals & Kashayams',
    desc: 'Daily warm delivery of traditional postpartum meals, galactagogue porridges, kashayams, and fresh desi eggs crafted by Ayurvedic wisdom.',
    image: require('../assets/images/nutrition_hero.png'),
    rating: 4.96,
    reviewsCount: 164,
    highlights: [
      'Postpartum Healing Kashayams: Herbal infusions of dry ginger, cumin, ajwain to rekindle digestive fire (Agni)',
      'Galactagogue Porridges & Halwas: Methi, gondh, garden cress seeds & almonds cooked in pure A2 Desi Ghee',
      'Ayurvedic Lunch Thalis: Iron-rich lentil broths, moringa leaves, garlic rasam, and cumin red rice',
      'Free-Range Desi Eggs Pack: Country chicken eggs rich in choline, DHA, and bioavailable protein',
      'Warm Insulated Delivery: Delivered fresh to your home daily across all Bangalore localities',
    ],
    duration: 'Daily / 30 to 45 Days Plan',
    popular: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Ananya S.',
    location: 'Indiranagar, Bangalore',
    role: 'First-Time Mother',
    quote:
      'Appuge’s postpartum abhyanga and herbal baths brought so much peace to my first 40 days. My caregiver Shylaja was like a mother to me.',
    rating: 5,
    service: 'Mother & Baby Dual Sanctuary',
  },
  {
    id: 't2',
    author: 'Deepa & Rohit M.',
    location: 'Whitefield, Bangalore',
    role: 'Parents of Baby Ryan',
    quote:
      'Finding a medically trained newborn nurse in Bangalore who also respects our traditional customs seemed impossible until we found Appuge.',
    rating: 5,
    service: 'Newborn Baby Care',
  },
  {
    id: 't3',
    author: 'Priya K.',
    location: 'HSR Layout, Bangalore',
    role: 'Mother of Two',
    quote:
      'The Ayurvedic lactation food delivery and belly wrapping helped me heal so quickly after my C-section. Highly recommend to every new mama!',
    rating: 5,
    service: 'Post-Pregnancy Recovery',
  },
];

export const NUTRITION_PROGRAM = {
  title: 'Traditional Ayurvedic Postpartum Nutrition',
  headline: 'Restore Strength. Heal From Within.',
  description:
    'Custom-prepared, traditional meals designed according to Ayurvedic wisdom to boost recovery, balance hormones, and enrich breast milk supply.',
  pillars: [
    { title: 'Ayurvedic Approved', desc: 'Time-tested recipes handed down through generations of grandmothers' },
    { title: 'Warm Home Delivery', desc: 'Freshly prepared, insulated delivery directly to your door in Bangalore' },
    { title: 'Galactagogue Rich', desc: 'Loaded with fenugreek, garlic, cumin, dill, and moringa to fuel lactation' },
    { title: 'Postpartum Healing', desc: 'Pure A2 Desi ghee, medicinal roots, and iron-dense grains for tissue repair' },
  ],
  meals: [
    {
      id: 'm1',
      title: 'Postpartum Healing Kashayams & Soups',
      category: 'Lactation & Digestion',
      desc: 'Herbal infusions with dry ginger, cumin, ajwain, and peppercorns to kindle digestive fire (Agni) and reduce bloating.',
      benefits: ['Aids digestion', 'Expels post-delivery gas', 'Relieves body chills'],
      icon: 'tea',
    },
    {
      id: 'm2',
      title: 'Galactagogue Porridges & Halwas',
      category: 'Breast Milk Booster',
      desc: 'Nourishing preparations of methi (fenugreek), gondh (edible gum), garden cress seeds, and almonds cooked in pure desi ghee.',
      benefits: ['Substantially boosts milk supply', 'Strengthens pelvic bones', 'Provides slow-burning energy'],
      icon: 'soup',
    },
    {
      id: 'm3',
      title: 'Ayurvedic Healing Lunch Thali',
      category: 'Tissue Repair',
      desc: 'Easily digestible khichdi, garlic rasam, moringa leaf sabzi, iron-rich lentil broths, and cumin-infused red rice.',
      benefits: ['Rapid iron restoration', 'High fiber prevents constipation', 'Safe for sensitive stomachs'],
      icon: 'bowl',
    },
    {
      id: 'm4',
      title: 'Farm Fresh Desi Eggs Pack',
      category: 'Protein & Micro-Nutrients',
      desc: 'Free-range country chicken eggs loaded with choline, omega-3, and protein, highly recommended in traditional postpartum diets.',
      benefits: ['Crucial for infant brain development via milk', 'Supports muscle and wound healing', 'Natural Vitamin B12'],
      icon: 'nutrition',
    },
  ],
};

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Compassionate Consultation',
    desc: 'We understand your family dynamics, health condition, delivery method (C-section or normal), and recovery goals.',
  },
  {
    step: '02',
    title: 'Thoughtful Matching',
    desc: 'We pair you with a certified, police-verified caregiver whose personality and expertise align with your home.',
  },
  {
    step: '03',
    title: 'In-Home Integration',
    desc: 'Your caregiver establishes a gentle, restorative rhythm of maternal rituals, newborn hygiene, and warm care.',
  },
  {
    step: '04',
    title: 'Continuous Nurturing',
    desc: 'Regular doctor check-ins, routine assessments, and our 24/7 dedicated support team ensure total peace of mind.',
  },
];

export const CAREGIVER_PLEDGE = [
  {
    icon: 'shield',
    title: 'Multi-Stage Police Verification',
    desc: 'Complete criminal background checks, address verification, and government ID validation.',
  },
  {
    icon: 'stethoscope',
    title: 'Medical Health Screenings',
    desc: 'Routine physical health checks, infectious disease screenings, and strict vaccination compliance.',
  },
  {
    icon: 'book',
    title: 'Clinical & Pediatric Training',
    desc: 'Trained under the direct guidance of obstetricians and pediatricians in modern hygiene and baby safety.',
  },
  {
    icon: 'heart',
    title: 'Empathetic Family Disposition',
    desc: 'Deeply respectful of household privacy, gentle with infants, and nurturing towards healing mothers.',
  },
];

export const FAQS: FaqItem[] = [
  {
    category: 'About Appuge',
    q: 'What is Appuge?',
    a: 'Appuge is an all-inclusive postpartum care and maternal wellness service provider based in Bangalore. We ensure the health and peace of mothers and newborns through expert care, ancestral rituals, nutritious food, and clinical wellness services at home.',
  },
  {
    category: 'About Appuge',
    q: 'Why should I choose Appuge over casual caregivers?',
    a: 'Unlike unverified domestic help, Appuge caregivers undergo rigorous multi-stage police verification, medical health examinations, and formal clinical training supervised by pediatricians and gynecologists. We combine ancestral healing with modern medical standards.',
  },
  {
    category: 'Postpartum Care',
    q: 'Why is traditional postpartum care essential?',
    a: 'The initial 40 days following childbirth are critical for uterine recovery, pelvic realignment, hormonal stabilization, and mental wellness. Our abhyanga (massage), herbal snana, and belly wrapping actively aid recovery and prevent chronic post-delivery back pain.',
  },
  {
    category: 'Postpartum Care',
    q: 'Are your services tailored for both C-Section and Normal deliveries?',
    a: 'Yes. For C-section deliveries, our caregivers follow strict doctor-advised protocols, waiting until stitches heal before performing gentle abdominal wraps, while offering specialized support for mobility and lactation.',
  },
  {
    category: 'Baby & Newborn Care',
    q: 'What baby care services are included?',
    a: 'Services include daily gentle oil massage, traditional hygienic warm baths, umbilical cord care, skin-folds hygiene, sleep cycle shaping, burping support, and colic relief strokes.',
  },
  {
    category: 'Doctor Consultation',
    q: 'How does the doctor consultation service work?',
    a: 'Through Appuge, mothers and families are connected to experienced and qualified healthcare professionals in Bangalore—including pediatricians, gynecologists, and lactation specialists—for home visits or prompt tele-consultations.',
  },
  {
    category: 'Nutrition & Food',
    q: 'What is the Appuge Nutrition Program?',
    a: 'The program includes carefully crafted traditional postpartum meals, healing kashayams, and lactation-boosting recipes developed by Ayurvedic doctors to rebuild strength and nurture breast milk quality.',
  },
  {
    category: 'Nutrition & Food',
    q: 'Why do you recommend desi eggs in postpartum recovery?',
    a: 'Farm-fresh desi (country) eggs provide bioavailable protein, iron, choline, and healthy fats essential for tissue regeneration and infant brain development during breastfeeding.',
  },
  {
    category: 'Getting Started',
    q: 'How can I schedule a consultation or book a caregiver?',
    a: 'You can easily request a consultation directly through this app, call us at +91 91872 32968, or chat with our care coordinator on WhatsApp. We typically recommend booking 4 to 8 weeks before your expected delivery date.',
  },
  {
    category: 'Getting Started',
    q: 'Which areas in Bangalore do you provide home services in?',
    a: 'We cover all major localities across Bangalore including Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, JP Nagar, Electronic City, Hebbal, Yelahanka, Sarjapur Road, and Malleshwaram.',
  },
];

export interface ServiceDetailData {
  id: string;
  category: 'mother' | 'baby' | 'combined' | 'specialist' | 'nutrition';
  title: string;
  tagline: string;
  subtitle: string;
  heroImage: any;
  duration: string;
  format: string;
  suitableStage: string;
  overview: string;
  inclusions: { title: string; desc: string; icon: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetailData> = {
  'mother-care': {
    id: 'mother-care',
    category: 'mother',
    title: 'Post-Pregnancy Recovery',
    tagline: 'Restoring Strength & Sacred Healing',
    subtitle: 'Dedicated daily recovery rituals for the sacred first 40 days',
    heroImage: require('../assets/images/04.jpg'),
    duration: '21 to 45 Days Sanctuary Program',
    format: 'In-Home Caregiver in Bangalore',
    suitableStage: 'Expecting Mothers & Immediate Postpartum',
    overview:
      'In traditional Indian postpartum care, the initial 40 days determine a woman’s health for the next 40 years. Our hospital-screened caregivers combine time-honoured restorative rituals—such as warm herbal abhyanga, medicinal decoction baths (snana), and breathable belly binding—with contemporary hygiene standards, helping your body rebuild vitality, balance hormones, and ease recovery from both normal and C-section deliveries.',
    inclusions: [
      {
        icon: 'leaf',
        title: 'Postnatal Herbal Abhyanga',
        desc: 'Therapeutic warm medicated oil massage to stimulate blood circulation, relieve lower back strain, and accelerate uterine involution.',
      },
      {
        icon: 'tea',
        title: 'Medicinal Herbal Snana',
        desc: 'Warm bath boiled with aromatic medicinal leaves and bark decoctions to soothe sore muscles, relieve joints, and prevent infection.',
      },
      {
        icon: 'shield',
        title: 'Traditional Belly Wrapping',
        desc: 'Breathable organic cotton cloth binding to gently support separated abdominal muscles (diastasis recti) and restore core posture.',
      },
      {
        icon: 'mother',
        title: 'Lactation & Posture Guidance',
        desc: 'Hands-on latch assistance, feeding position adjustment, mastitis prevention, and soothing lactation herbal teas.',
      },
      {
        icon: 'heart',
        title: 'Emotional Well-Being & Rest',
        desc: 'Gentle, reassuring companionship to navigate postpartum emotional shifts, hormonal dips, and sleep deprivation in privacy.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Consultation & Delivery Assessment',
        desc: 'We review your delivery type (C-section or normal), delivery date, recovery priorities, and home preferences.',
      },
      {
        step: '02',
        title: 'Thoughtful Caregiver Matching',
        desc: 'A background-checked, medically screened maternity caregiver is matched to your household values and language.',
      },
      {
        step: '03',
        title: 'Daily In-Home Sanctuary',
        desc: 'Caregiver arrives each morning to conduct therapeutic rituals, prepare restorative kashayams, and nurture your body.',
      },
      {
        step: '04',
        title: 'Clinical Follow-Up & Milestones',
        desc: 'Ongoing check-ins with our clinical coordinators ensure your physical healing and abdominal recovery stay on track.',
      },
    ],
    faqs: [
      {
        q: 'How soon after delivery can Post-Pregnancy care begin?',
        a: 'For normal vaginal delivery, care usually begins 3 to 7 days post-birth. For C-section deliveries, gentle rituals begin around day 10–14 once doctor stitches have healed safely.',
      },
      {
        q: 'Are your caregivers police verified and medically screened?',
        a: 'Yes. Every Appuge caregiver undergoes multi-stage police verification, government ID validation, infectious disease screenings, and clinical newborn training.',
      },
      {
        q: 'Do you provide the herbal oils and bath preparations?',
        a: 'Yes, our team brings or guides you on authentic cold-pressed herbal oils, medicinal bath herbs, and organic cotton wrapping cloth.',
      },
    ],
  },
  'baby-care': {
    id: 'baby-care',
    category: 'baby',
    title: 'Newborn Baby Care',
    tagline: 'Gentle, Hygienic & Loving Hands',
    subtitle: 'Specialized handling, traditional massage & serene infant sleep routines',
    heroImage: require('../assets/images/05.jpg'),
    duration: 'Flexible Daytime or 24/7 Night Support',
    format: 'In-Home Dedicated Baby Doula in Bangalore',
    suitableStage: 'Newborn (0 to 3 Months)',
    overview:
      'A newborn child requires gentle, sterile handling and patient nurturing. Appuge newborn baby care specialists are trained under pediatric guidelines to manage every facet of your infant’s daily hygiene—from traditional oil abhyanga and temperature-monitored baths to sterile umbilical cord care, colic relief strokes, burping postures, and calming sleep shaping.',
    inclusions: [
      {
        icon: 'baby',
        title: 'Newborn Baby Abhyanga',
        desc: 'Gentle, rhythmic strokes using warm virgin coconut or sweet almond oil to foster neuromotor development, weight gain, and muscle tone.',
      },
      {
        icon: 'sparkle',
        title: 'Warm Hygienic Baby Bath',
        desc: 'Safe, temperature-tested water bath using mild hypoallergenic or traditional herbal wash powders that protect delicate infant skin.',
      },
      {
        icon: 'stethoscope',
        title: 'Umbilical Cord & Skin Hygiene',
        desc: 'Sterile daily inspection and dry care of the healing cord stump, along with thorough cleansing of delicate neck and thigh folds.',
      },
      {
        icon: 'baby',
        title: 'Colic & Reflux Relief Strokes',
        desc: 'Pediatrician-approved abdominal massage, clockwise tummy circles, and bicycle leg motions to dispel trapped gas and soothe colic.',
      },
      {
        icon: 'moon',
        title: 'Burping & Sleep Rhythm Shaping',
        desc: 'Proper upright burping after every feed, gentle swaddling, and setting predictable day/night sleep associations.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Infant Health Consultation',
        desc: 'We understand your baby’s birth weight, feeding style (breastfed, formula, or mixed), and sleep schedule.',
      },
      {
        step: '02',
        title: 'Trained Baby Nurse Assignment',
        desc: 'A verified, medically screened infant specialist trained in hygienic handling is assigned to your home.',
      },
      {
        step: '03',
        title: 'Calm Daily Routine',
        desc: 'Daily infant massage, bath, skin-fold hygiene, diaper changes, and burping support handled with patience.',
      },
      {
        step: '04',
        title: 'Night Sleep Assistance (Optional)',
        desc: 'Caregiver oversees midnight soothing, feeds, and diapering so parents enjoy uninterrupted restorative sleep.',
      },
    ],
    faqs: [
      {
        q: 'What oils are used for newborn massage?',
        a: 'We recommend pure cold-pressed coconut oil, virgin almond oil, or traditional baby olive oil without synthetic fragrances.',
      },
      {
        q: 'Can the caregiver help during the night?',
        a: 'Yes. We provide 24/7 live-in or dedicated 12-hour night shifts so new parents can get uninterrupted restorative sleep.',
      },
      {
        q: 'How does the caregiver handle umbilical cord care?',
        a: 'Strictly sterile, keeping the stump dry and clean in compliance with pediatric clinical hygiene guidelines until it naturally falls off.',
      },
    ],
  },
  'combined-care': {
    id: 'combined-care',
    category: 'combined',
    title: 'Mother & Baby Dual Sanctuary',
    tagline: 'Complete Family Harmony at Home',
    subtitle: 'Our signature program seamlessly caring for both recovering mother and newborn',
    heroImage: require('../assets/images/01.jpg'),
    duration: '30, 45, or 60 Days Complete Care',
    format: 'In-Home Caregiver in Bangalore',
    suitableStage: 'Expecting Mothers & Immediate Postpartum (0-3 Months)',
    overview:
      'Our most beloved comprehensive care offering. Appuge Dual Sanctuary provides dedicated simultaneous care for both the recovering mother and her newborn infant under one unified, peaceful rhythm. While the mother rests during her postnatal massage and restorative snana, her baby is gently bathed, swaddled, and soothed by trusted, medically trained hands.',
    inclusions: [
      {
        icon: 'mother',
        title: 'Full Maternal Recovery Suite',
        desc: 'Daily postnatal abhyanga, herbal steam bath, organic belly wrapping, and recovery meal coordination.',
      },
      {
        icon: 'baby',
        title: 'Complete Infant Care Suite',
        desc: 'Daily baby massage, bath, cord hygiene, colic relief strokes, burping routines, and swaddling.',
      },
      {
        icon: 'tea',
        title: 'Postnatal Herbal Preparations',
        desc: 'Assistance in preparing freshly brewed traditional digestive kashayams and lactation-boosting recipes.',
      },
      {
        icon: 'moon',
        title: 'Nighttime Newborn Hand-Off',
        desc: 'Caregiver assists with nighttime soothing and diaper changes so the mother enjoys uninterrupted sleep cycles.',
      },
      {
        icon: 'stethoscope',
        title: 'Doctor Oversight & Clinical Concierge',
        desc: 'Direct priority tele-consultation access with our network of Bangalore pediatricians and lactation consultants.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Personalized Sanctuary Plan',
        desc: 'We map out a customized care calendar aligned with your estimated delivery date and household preferences.',
      },
      {
        step: '02',
        title: 'Caregiver Introduction & Orientation',
        desc: 'Meet your verified caregiver prior to birth to establish rapport, comfort, and safety protocols.',
      },
      {
        step: '03',
        title: 'Seamless In-Home Integration',
        desc: 'Your caregiver creates a calm, hygienic rhythm that restores mother’s energy and calms the baby.',
      },
      {
        step: '04',
        title: 'Continuous Family Support',
        desc: '24/7 care coordination support and check-ins throughout your 30, 45, or 60 day recovery window.',
      },
    ],
    faqs: [
      {
        q: 'Why choose Dual Sanctuary over booking separately?',
        a: 'Dual Sanctuary creates a synchronized, calm rhythm where the mother’s rest time is completely protected while the baby is lovingly nurtured.',
      },
      {
        q: 'Can the duration be extended beyond 45 days?',
        a: 'Yes, programs can be seamlessly extended in 15 or 30-day increments based on family preference and recovery needs.',
      },
    ],
  },
  'doctor-care': {
    id: 'doctor-care',
    category: 'specialist',
    title: 'Specialist Doctor Consultation',
    tagline: 'Direct Clinical Guidance at Home',
    subtitle: 'Connecting Bangalore families with qualified pediatricians, OB/GYNs, and lactation experts',
    heroImage: require('../assets/images/03.jpg'),
    duration: 'Scheduled Slots / In-Home or Tele-Consult',
    format: 'Bangalore In-Home Visits & Video Consult',
    suitableStage: 'All Stages (Pregnancy to 1 Year)',
    overview:
      'Clinical reassurance without hospital waiting rooms. Appuge connects mothers and newborns directly with certified healthcare professionals in Bangalore—including pediatricians, obstetricians & gynecologists, International Board Certified Lactation Consultants (IBCLC), and postpartum mental health counselors.',
    inclusions: [
      {
        icon: 'stethoscope',
        title: 'Neonatologists & Pediatricians',
        desc: 'Comprehensive newborn growth assessment, milestone monitoring, physiological jaundice evaluation, and umbilical healing check.',
      },
      {
        icon: 'doctor',
        title: 'Obstetricians & Gynecologists',
        desc: 'Post-delivery incision examination (C-section stitches and episiotomy healing), lochia evaluation, and pelvic recovery review.',
      },
      {
        icon: 'mother',
        title: 'Certified Lactation Consultants (IBCLC)',
        desc: 'Hands-on latch assessment, nipple trauma management, inverted nipple correction, and milk supply optimization.',
      },
      {
        icon: 'heart',
        title: 'Postnatal Emotional Counselors',
        desc: 'Empathetic, confidential counseling to support new mothers through emotional shifts, fatigue, and postpartum blues.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Request Specialist Focus',
        desc: 'Choose pediatric, gynecological, lactation, or emotional wellness guidance based on current symptoms.',
      },
      {
        step: '02',
        title: 'Choose Consultation Format',
        desc: 'Select a comfortable home visit in Bangalore or an immediate video consultation from your room.',
      },
      {
        step: '03',
        title: 'Clinical Examination & Care Plan',
        desc: 'The specialist provides personalized medical advice, prescriptions where appropriate, and lifestyle guidance.',
      },
      {
        step: '04',
        title: 'Caregiver Protocol Alignment',
        desc: 'Our in-home caregivers are debriefed on the doctor’s recommendations to support treatment at home.',
      },
    ],
    faqs: [
      {
        q: 'Which doctors are in the Appuge clinical network?',
        a: 'Our network includes verified MD/DNB pediatricians, MS/DGO gynecologists, and certified IBCLC lactation specialists practicing in Bangalore.',
      },
      {
        q: 'Can a pediatrician visit my home in Whitefield or Indiranagar?',
        a: 'Yes, in-home doctor visits are arranged across prime Bangalore localities for newborn checkups and lactation assistance.',
      },
    ],
  },
  'nutrition-care': {
    id: 'nutrition-care',
    category: 'nutrition',
    title: 'Nutritional Food Delivery',
    tagline: 'Ayurvedic Healing Meals & Kashayams',
    subtitle: 'Daily warm delivery of traditional postpartum meals crafted by Ayurvedic wisdom',
    heroImage: require('../assets/images/nutrition_hero.png'),
    duration: 'Daily Delivery / 30 or 45-Day Packages',
    format: 'Insulated Warm Home Delivery in Bangalore',
    suitableStage: 'First 40 Days Postpartum Recovery',
    overview:
      'In Ayurvedic tradition, food is sacred medicine. A woman’s digestive fire (Agni) is sensitive after delivery, requiring light, warm, freshly prepared meals enriched with natural herbs, pure A2 Desi Ghee, and galactagogues. Appuge delivers customized postpartum meals daily to your doorstep across Bangalore, rebuilding stamina and enriching breast milk quality.',
    inclusions: [
      {
        icon: 'tea',
        title: 'Healing Herbal Kashayams',
        desc: 'Traditional warm infusions of dry ginger, ajwain, cumin, and pippali to reignite digestive Agni and reduce abdominal bloating.',
      },
      {
        icon: 'soup',
        title: 'Galactagogue Porridges & Halwas',
        desc: 'Wholesome preparations of methi (fenugreek), edible gondh gum, garden cress seeds, and almonds slow-cooked in A2 Desi Ghee.',
      },
      {
        icon: 'bowl',
        title: 'Postnatal Healing Lunch Thali',
        desc: 'Easy-to-digest khichdi, iron-rich lentil stews, moringa leaf preparations, garlic rasam, and cumin red rice.',
      },
      {
        icon: 'nutrition',
        title: 'Farm-Fresh Free-Range Desi Eggs',
        desc: 'Sustainable country chicken eggs loaded with choline, DHA, and pure bioavailable protein for wound healing.',
      },
      {
        icon: 'delivery',
        title: 'Insulated Temperature-Safe Delivery',
        desc: 'Cooked fresh each morning in our hygienic Bangalore kitchen and delivered warm in food-grade insulated containers.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Dietary Consultation',
        desc: 'We map your delivery date, dietary restrictions (vegetarian or non-vegetarian), and recovery goals.',
      },
      {
        step: '02',
        title: 'Daily Fresh Preparation',
        desc: 'Meals and kashayams are prepared early every morning following authentic grandmother recipes.',
      },
      {
        step: '03',
        title: 'Warm Bangalore Delivery',
        desc: 'Delivered directly to your door in hygienic, insulated packaging ready to be enjoyed.',
      },
      {
        step: '04',
        title: 'Weekly Menu Evolution',
        desc: 'Menu transitions week-by-week from gentle digestive broths to tissue-building strengthening foods.',
      },
    ],
    faqs: [
      {
        q: 'Can the meal plan accommodate vegetarian households?',
        a: 'Yes, we provide 100% vegetarian plans with high-protein lentils, nuts, seeds, and A2 Desi Ghee, as well as egg-inclusive plans.',
      },
      {
        q: 'Which areas in Bangalore receive meal delivery?',
        a: 'We deliver warm across Indiranagar, Koramangala, HSR Layout, Whitefield, Jayanagar, JP Nagar, Hebbal, and surrounding areas.',
      },
    ],
  },
};

