import { ImageSourcePropType } from 'react-native';

export type CommerceCategory =
  | 'All'
  | 'Mother Care'
  | 'Baby Care'
  | 'Meals & Food'
  | 'Doctor Consults'
  | 'Skincare & Oils'
  | 'Gift Kits';

export interface CommerceItem {
  id: string;
  title: string;
  brand: string;
  category: CommerceCategory;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: ImageSourcePropType;
  durationOrWeight: string;
  description: string;
  benefits: string[];
  inclusions?: string[];
  deliveryTag: string;
  isPopular?: boolean;
  isBestseller?: boolean;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  type: 'Home' | 'Work' | 'Other';
  addressLine: string;
  locality: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  itemId: string;
  title: string;
  price: number;
  quantity: number;
  image: ImageSourcePropType;
  durationOrWeight: string;
}

export interface OrderTrackingStep {
  title: string;
  desc: string;
  time?: string;
  completed: boolean;
  active: boolean;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  status: 'In Transit' | 'Confirmed' | 'Delivered';
  statusColor: string;
  deliveryDateText: string;
  deliveryAddress: string;
  trackingSteps: OrderTrackingStep[];
}

// Images
const imgMother = require('../assets/images/04.jpg');
const imgBaby = require('../assets/images/05.jpg');
const imgDual = require('../assets/images/01.jpg');
const imgFood = require('../assets/images/nutrition_hero.png');
const imgCare = require('../assets/images/care_ritual_4.jpg');
const imgDoctor = require('../assets/images/hero_clinical.jpg');
const imgEggs = require('../assets/images/desi_eggs.jpg');
const imgNewborn = require('../assets/images/hero_newborn.jpg');

export const COMMERCE_CATEGORIES: {
  name: CommerceCategory;
  label: string;
  icon: string;
  image: ImageSourcePropType;
  description: string;
}[] = [
  {
    name: 'All',
    label: 'All Items',
    icon: '✨',
    image: imgDual,
    description: 'Explore full sanctuary collection',
  },
  {
    name: 'Mother Care',
    label: 'Mother Care',
    icon: '🤱',
    image: imgMother,
    description: 'Postpartum recovery & healing rituals',
  },
  {
    name: 'Baby Care',
    label: 'Baby Care',
    icon: '👶',
    image: imgBaby,
    description: 'Newborn abhyanga, hygiene & comfort',
  },
  {
    name: 'Meals & Food',
    label: 'Warm Meals',
    icon: '🍲',
    image: imgFood,
    description: 'Daily Ayurvedic postpartum tiffin & ladoos',
  },
  {
    name: 'Doctor Consults',
    label: 'Doctors',
    icon: '🩺',
    image: imgDoctor,
    description: 'Lactation IBCLC & pediatric specialists',
  },
  {
    name: 'Skincare & Oils',
    label: 'Herbal Oils',
    icon: '🌿',
    image: imgCare,
    description: 'Cold-pressed virgin baby & mother oils',
  },
  {
    name: 'Gift Kits',
    label: 'Gift Hampers',
    icon: '🎁',
    image: imgNewborn,
    description: 'Thoughtful packages for new mothers',
  },
];

/** Strictly validates physical commerce items. Excludes any legacy service packages or doctor consult records. */
export const isShopProduct = (item: CommerceItem): boolean =>
  Boolean(
    item &&
      typeof item.id === 'string' &&
      !item.id.startsWith('pkg-') &&
      !item.id.startsWith('doc-') &&
      item.category !== 'Doctor Consults',
  );

export const COMMERCE_ITEMS: CommerceItem[] = [
  {
    id: 'baby-massage-oil',
    title: 'Nourishing Baby Massage Oil',
    brand: 'Appuge Rituals',
    category: 'Skincare & Oils',
    price: 649,
    mrp: 799,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'BESTSELLER',
    image: imgCare,
    durationOrWeight: '100 ml bottle',
    description:
      'Infused with virgin cold-pressed coconut oil, sweet almond oil, and calming country mallow (Bala). Handcrafted for delicate newborn skin to strengthen bones and improve sleep cycles.',
    benefits: [
      'Promotes deep infant sleep and soothes nervous system',
      'Naturally moisturizes without mineral oils or parabens',
      'Strengthens infant muscles and promotes bone density',
    ],
    inclusions: [
      '100% cold-pressed base',
      'No added synthetic fragrances',
      'Ayush-certified manufacturing',
    ],
    deliveryTag: '⚡ Next Day Slot in Bengaluru',
    isBestseller: true,
    isPopular: true,
  },
  {
    id: 'postpartum-recovery-tea',
    title: 'Postpartum Digestive Recovery Tea',
    brand: 'Appuge Kitchen',
    category: 'Meals & Food',
    price: 529,
    mrp: 649,
    discountPercent: 18,
    rating: 4.88,
    reviewsCount: 96,
    badge: 'AYURVEDIC BLEND',
    image: imgFood,
    durationOrWeight: '20 Bio-Sachets',
    description:
      'A warming daily infusion of carom seeds (ajwain), dry ginger (sonth), licorice, and fennel seeds. Formulated to restore agni (digestive fire), reduce colic, and aid uterine recovery.',
    benefits: [
      'Soothes postpartum abdominal bloating & water retention',
      'Passes gentle digestive comfort to baby via breast milk',
      'Caffeine-free and soothing for afternoon restoration',
    ],
    inclusions: [
      '20 unbleached pyramid tea bags',
      '100% natural whole ground herbs',
    ],
    deliveryTag: '⚡ Delivered in 24 Hours',
    isPopular: true,
  },
  {
    id: 'galactagogue-ladoos',
    title: 'Gond & Fenugreek Galactagogue Ladoos',
    brand: 'Appuge Kitchen',
    category: 'Meals & Food',
    price: 680,
    mrp: 850,
    discountPercent: 20,
    rating: 4.95,
    reviewsCount: 172,
    badge: 'LACTATION BOOST',
    image: imgFood,
    durationOrWeight: 'Box of 12 (480g)',
    description:
      'Traditional grandmother recipe made with pure A2 Desi Ghee, edible gum (gond), crushed almonds, methi (fenugreek), and jaggery. Specifically prepared for nursing mothers.',
    benefits: [
      'Naturally stimulates and sustains breast milk supply',
      'High in calcium, iron, and restorative healthy fats',
      'Satisfies postpartum sweet cravings with zero refined sugar',
    ],
    inclusions: [
      'Made fresh daily on order',
      'Prepared in brass vessels with A2 Desi Cow Ghee',
    ],
    deliveryTag: '🍲 Made Fresh • Next Morning Dispatch',
    isBestseller: true,
    isPopular: true,
  },
  {
    id: 'desi-gir-ghee',
    title: 'Pure A2 Desi Gir Cow Ghee',
    brand: 'Appuge Kitchen',
    category: 'Meals & Food',
    price: 890,
    mrp: 1100,
    discountPercent: 19,
    rating: 5.0,
    reviewsCount: 104,
    badge: 'BILONA CHURNED',
    image: imgEggs,
    durationOrWeight: '500 ml Glass Jar',
    description:
      'Cultured from grass-fed Gir cows using the age-old Vedic Bilona method. Golden, aromatic, and rich in butyric acid to heal postpartum joints and soothe delicate tissues.',
    benefits: [
      'Lubricates pelvic joints and accelerates post-birth healing',
      'Enhances absorption of fat-soluble vitamins A, D, E & K',
      'Zero preservatives, additives, or adulterants',
    ],
    inclusions: ['Glass jar packaging', 'Vedic slow-heat curd churned'],
    deliveryTag: '⚡ Same Day Slot Available',
    isPopular: true,
  },
  {
    id: 'postpartum-thali-subscription',
    title: 'Daily Postpartum Healing Thali (Warm Delivery)',
    brand: 'Appuge Kitchen',
    category: 'Meals & Food',
    price: 450,
    mrp: 550,
    discountPercent: 18,
    rating: 4.96,
    reviewsCount: 312,
    badge: 'DAILY WARM TIFFIN',
    image: imgFood,
    durationOrWeight: 'Per Day (Lunch & Dinner)',
    description:
      'Freshly cooked hot Ayurvedic meals delivered in insulated stainless-steel tiffins. Includes digestible mung dal khichdi, seasonal gourd subzi, cumin rasam, digestive kashayam, and ragi malt.',
    benefits: [
      'Tailored for delicate postpartum digestive fire (Mandagni)',
      'Delivered hot and ready to eat right before mealtime',
      'No chili, no heavy spices, zero nightshades in early recovery',
    ],
    inclusions: [
      'Food-grade vacuum insulated container',
      'Hygiene-sealed delivery bag',
      'Fresh morning & evening delivery slots',
    ],
    deliveryTag: '🍲 Delivered Warm 12:30 PM & 7:30 PM',
    isBestseller: true,
  },
  {
    id: 'pkg-21-day-recovery',
    title: '21-Day Post-Pregnancy Sacred Recovery',
    brand: 'Appuge In-Home Care',
    category: 'Mother Care',
    price: 24999,
    mrp: 29999,
    discountPercent: 17,
    rating: 4.95,
    reviewsCount: 142,
    badge: 'MOST CHOSEN CARE',
    image: imgMother,
    durationOrWeight: '21 Days In-Home Care',
    description:
      'Our quintessential in-home maternal healing journey. A verified, compassionate caregiver arrives daily at your home to perform traditional warm oil massage, herbal steam bath, belly binding, and lactation nurturing.',
    benefits: [
      'Full-body Postnatal Abhyanga for uterine involution & pain relief',
      'Herbal bath (Snana) boiled with neem, turmeric & eucalyptus leaves',
      'Breathable organic cotton belly wrapping for core support',
      'Emotional companionship to prevent postpartum baby blues',
    ],
    inclusions: [
      'Police verified & medically health-screened caregiver',
      'Complimentary Appuge herbal oil & bath kit included',
      'Dedicated care manager & supervisor check-ins',
    ],
    deliveryTag: '📍 In-Home Service Across Bangalore',
    isBestseller: true,
    isPopular: true,
  },
  {
    id: 'pkg-45-day-sanctuary',
    title: '45-Day Complete Sanctuary Care (Mother & Baby)',
    brand: 'Appuge In-Home Care',
    category: 'Mother Care',
    price: 48000,
    mrp: 56000,
    discountPercent: 14,
    rating: 5.0,
    reviewsCount: 210,
    badge: 'FULL 40-DAY TRADITION',
    image: imgDual,
    durationOrWeight: '45 Days Complete Care',
    description:
      'The gold standard of ancient Indian Jaapa care. Complete holistic coverage honoring the sacred 40 days of postpartum seclusion, encompassing comprehensive mother recovery rituals and gentle newborn massage.',
    benefits: [
      'Complete maternal healing rituals daily for 45 full days',
      'Gentle baby massage, herbal sponge/bath, and sunning assistance',
      'Daily preparation of digestive postpartum kashayams and teas',
      'Night-time guidance and peaceful sleep support for parents',
    ],
    inclusions: [
      'Senior experienced postnatal caregiver',
      'Doctor tele-consultation included',
      'Zero booking cancellation penalty',
    ],
    deliveryTag: '📍 In-Home Service Across Bangalore',
    isPopular: true,
  },
  {
    id: 'pkg-newborn-care',
    title: 'Newborn Baby Care (Daytime or 24/7)',
    brand: 'Appuge In-Home Care',
    category: 'Baby Care',
    price: 18500,
    mrp: 21000,
    discountPercent: 12,
    rating: 4.98,
    reviewsCount: 186,
    badge: 'EXPERT JAAPA NANNY',
    image: imgBaby,
    durationOrWeight: 'Monthly Subscription',
    description:
      'Gentle, hygienic, and highly trained hands for your precious newborn. Specialized in traditional oil massage, soothing baths, umbilical cord hygiene, burping, swaddling, and colic soothing.',
    benefits: [
      'Trained in sterile cord care and infant skin hygiene',
      'Bicycle tummy exercises and gentle burping to relieve colic',
      'Supports parents with peaceful day or nighttime nursery shifts',
    ],
    inclusions: [
      'Background verified with police verification certificate',
      'CPR & infant emergency care certified',
      'Flexible replacement guarantee',
    ],
    deliveryTag: '📍 Available in All Bangalore Localities',
    isPopular: true,
  },
  {
    id: 'doc-lactation-consult',
    title: 'Certified Lactation Consultant (IBCLC)',
    brand: 'Appuge Clinical Care',
    category: 'Doctor Consults',
    price: 1200,
    mrp: 1500,
    discountPercent: 20,
    rating: 4.92,
    reviewsCount: 94,
    badge: 'HOME / ONLINE',
    image: imgDoctor,
    durationOrWeight: '45-Min Session',
    description:
      'One-on-one consultation with an International Board Certified Lactation Consultant. Diagnosis and hands-on guidance for painless latching, engorgement relief, low milk supply, and feeding postures.',
    benefits: [
      'Painless latch assessment and correction',
      'Management of nipple soreness, clogged ducts & mastitis',
      'Personalized breast milk boosting plan',
    ],
    inclusions: [
      'Home visit or high-definition private video consult',
      '7 days follow-up WhatsApp messaging support included',
    ],
    deliveryTag: '🩺 Slots Available Tomorrow',
    isPopular: true,
  },
  {
    id: 'doc-pediatrician-consult',
    title: 'Senior Pediatrician & Neonatologist Consult',
    brand: 'Appuge Clinical Care',
    category: 'Doctor Consults',
    price: 950,
    mrp: 1200,
    discountPercent: 21,
    rating: 4.94,
    reviewsCount: 112,
    badge: 'DOCTOR CHOICE',
    image: imgDoctor,
    durationOrWeight: '30-Min Session',
    description:
      'Compassionate clinical check for your newborn baby. Covers physiological jaundice monitoring, weight gain tracking, umbilical cord review, and infant reflux management.',
    benefits: [
      'Expert evaluation by senior pediatric consultant',
      'Clear newborn roadmap with feeding & sleep milestones',
      'Instant digital prescription & care report',
    ],
    inclusions: ['Home visit or Tele-consult', 'Digital prescription issued'],
    deliveryTag: '🩺 Same Day Slots Available',
    isPopular: true,
  },
  {
    id: 'tear-free-baby-wash',
    title: 'Tear-Free Botanical Baby Wash',
    brand: 'Little Rituals',
    category: 'Skincare & Oils',
    price: 399,
    mrp: 475,
    discountPercent: 16,
    rating: 4.75,
    reviewsCount: 214,
    badge: 'DERMA TESTED',
    image: imgBaby,
    durationOrWeight: '200 ml Dispenser',
    description:
      'A ultra-mild, pH 5.5 balanced hair and body wash made for tender newborn skin. Enriched with oat kernel extract, calendula, and plant-derived glycerin to cleanse without stripping natural oils.',
    benefits: [
      '100% tear-free and hypoallergenic formulation',
      'Gentle on newborn cradle cap and sensitive skin folds',
      'Dermatologically tested and certified pediatrician safe',
    ],
    inclusions: ['Recyclable pump bottle', 'Free from SLS, parabens, dyes'],
    deliveryTag: '⚡ Delivered in 24 Hours',
  },
  {
    id: 'restoring-body-butter',
    title: 'Restoring Botanical Belly Butter',
    brand: 'Appuge Rituals',
    category: 'Skincare & Oils',
    price: 749,
    mrp: 899,
    discountPercent: 17,
    rating: 4.82,
    reviewsCount: 78,
    badge: '100% BOTANICAL',
    image: imgMother,
    durationOrWeight: '150 g Jar',
    description:
      'Rich, velvety whipped butter combining African shea, Indian kokum butter, and cold-pressed rosehip seed oil. Intensively nourishes stretched postpartum skin, improving elasticity and soothing itchiness.',
    benefits: [
      'Relieves intense itching associated with stretching skin',
      'Deeply restores natural skin barrier lipid balance',
      'Non-greasy finish with delicate neroli and vanilla aroma',
    ],
    inclusions: ['Whipped butter in amber glass jar', 'Zero synthetic fragrance'],
    deliveryTag: '⚡ Delivered in 24 Hours',
  },
  {
    id: 'newborn-sanctuary-kit',
    title: 'Newborn First Days Sanctuary Kit (6-in-1)',
    brand: 'Appuge Edit',
    category: 'Gift Kits',
    price: 1899,
    mrp: 2299,
    discountPercent: 17,
    rating: 4.94,
    reviewsCount: 51,
    badge: 'GIFT READY',
    image: imgNewborn,
    durationOrWeight: '6 Luxury Essentials',
    description:
      'A gorgeous presentation hamper curated for welcoming the newborn. Contains: Baby Massage Oil (100ml), Botanical Baby Wash (200ml), Organic Cotton Swaddle, Soft Muslin Wipes (pack of 3), Teething Ring, and Mother Recovery Tea.',
    benefits: [
      'Everything required for baby’s first 14 days at home',
      'Pre-washed GOTS-certified organic cotton swaddle cloths',
      'Presented in a premium handmade keepsake gift basket',
    ],
    inclusions: [
      'Woven keepsake storage basket',
      'Handwritten congratulatory calligraphy card',
      'Complimentary gift wrapping',
    ],
    deliveryTag: '🎁 Free Luxury Gift Packaging • Next Day Slot',
    isPopular: true,
  },
  {
    id: 'nursing-essentials-set',
    title: 'Soft Organic Cotton Nursing Essentials Set',
    brand: 'Appuge Edit',
    category: 'Mother Care',
    price: 1299,
    mrp: 1499,
    discountPercent: 13,
    rating: 4.65,
    reviewsCount: 64,
    badge: 'ORGANIC COTTON',
    image: imgDual,
    durationOrWeight: 'Set of 3 Essentials',
    description:
      'Designed by nursing mothers for ultimate postpartum ease. Contains 1 breathable 100% cotton nursing apron with structured neckline, 2 pairs of washable bamboo nursing breast pads, and a thermal gel pack.',
    benefits: [
      'Structured neckline allows continuous eye-contact with baby',
      'Ultra-absorbent, hypoallergenic organic bamboo nursing pads',
      'Soothes tenderness and milk letdown with warm/cool gel pack',
    ],
    inclusions: ['Breathable organic cotton weave', 'Machine washable'],
    deliveryTag: '⚡ Delivered in 24 Hours',
  },
];

export const SHOP_ITEMS = COMMERCE_ITEMS.filter(isShopProduct);

export const SHOP_CATEGORIES = COMMERCE_CATEGORIES.filter(category =>
  category.name === 'All' || SHOP_ITEMS.some(item => item.category === category.name),
);

export const INITIAL_ORDERS: CommerceOrder[] = [
  {
    id: 'ord-98421',
    orderNumber: 'OD-APG98421B',
    orderDate: 'Today, 20 Nov 2026',
    items: [
      {
        itemId: 'baby-massage-oil',
        title: 'Nourishing Baby Massage Oil',
        price: 649,
        quantity: 1,
        image: imgCare,
        durationOrWeight: '100 ml bottle',
      },
      {
        itemId: 'galactagogue-ladoos',
        title: 'Gond & Fenugreek Galactagogue Ladoos',
        price: 680,
        quantity: 1,
        image: imgFood,
        durationOrWeight: 'Box of 12 (480g)',
      },
    ],
    totalAmount: 1329,
    discountAmount: 220,
    status: 'In Transit',
    statusColor: '#C86D51',
    deliveryDateText: 'Arriving Today by 5:30 PM',
    deliveryAddress: 'Flat 402, Shanthi Niketan, 12th Main, Indiranagar, Bengaluru - 560038',
    trackingSteps: [
      {
        title: 'Order Placed & Confirmed',
        desc: 'Payment received via UPI • Order verified',
        time: '9:15 AM',
        completed: true,
        active: false,
      },
      {
        title: 'Freshly Prepared & Quality Checked',
        desc: 'Ladoos crafted fresh in brass kitchen',
        time: '11:30 AM',
        completed: true,
        active: false,
      },
      {
        title: 'Out for Delivery',
        desc: 'Bengaluru Express Courier • Partner Rajesh K.',
        time: '1:45 PM',
        completed: false,
        active: true,
      },
      {
        title: 'Delivery to Doorstep',
        desc: 'Expected before 5:30 PM',
        time: 'Pending',
        completed: false,
        active: false,
      },
    ],
  },
];

export const BENGALURU_LOCALITIES = [
  { name: 'Indiranagar', pincode: '560038', zone: 'East Bangalore', eta: '25-35 mins' },
  { name: 'Koramangala', pincode: '560034', zone: 'South Bangalore', eta: '20-30 mins' },
  { name: 'HSR Layout', pincode: '560102', zone: 'South-East Bangalore', eta: '30-40 mins' },
  { name: 'Whitefield', pincode: '560066', zone: 'East Bangalore', eta: '35-45 mins' },
  { name: 'Jayanagar', pincode: '560041', zone: 'South Bangalore', eta: '25-35 mins' },
  { name: 'JP Nagar', pincode: '560078', zone: 'South Bangalore', eta: '30-40 mins' },
  { name: 'Bellandur / Sarjapur', pincode: '560103', zone: 'East Bangalore', eta: '30-40 mins' },
  { name: 'Malleshwaram', pincode: '560003', zone: 'North Bangalore', eta: '30-40 mins' },
  { name: 'Hebbal', pincode: '560024', zone: 'North Bangalore', eta: '35-45 mins' },
  { name: 'Electronic City', pincode: '560100', zone: 'South Bangalore', eta: '40-50 mins' },
];

