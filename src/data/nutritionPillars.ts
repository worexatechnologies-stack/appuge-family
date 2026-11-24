import { ImageSourcePropType } from 'react-native';

export interface PillarIngredient {
  name: string;
  regionalName?: string;
  culinaryUse: string;
  nutritionalProfile: string;
  howUsed: string;
  precaution?: string;
  image?: ImageSourcePropType;
}

export interface PillarTimelineStep {
  step: string;
  title: string;
  time: string;
  desc: string;
}

export interface PillarMealItem {
  title: string;
  subtitle: string;
  desc: string;
  highlight: string;
}

export interface NutritionPillar {
  id: string;
  title: string;
  subtitle: string;
  heroHeading: string;
  heroSubtitle: string;
  heroImage: ImageSourcePropType;
  cardDesc: string;
  icon: string;
  ctaText: string;
  ctaService: string;

  // Editorial Sections
  philosophyTitle: string;
  philosophyDesc: string[];

  ingredientsTitle?: string;
  ingredientsSubtitle?: string;
  ingredients?: PillarIngredient[];

  whyIngredientsTitle?: string;
  whyIngredientsList?: { title: string; desc: string }[];

  kitchenApproachTitle?: string;
  kitchenApproachSteps?: { title: string; desc: string; icon: string }[];

  timelineTitle?: string;
  timelineSubtitle?: string;
  timeline?: PillarTimelineStep[];

  packagingTitle?: string;
  packagingPoints?: { title: string; desc: string }[];

  mealInspirationTitle?: string;
  mealInspirationItems?: PillarMealItem[];

  nutritionalProfileTitle?: string;
  nutritionalProfileDesc?: string;
  nutritionalPoints?: { label: string; value: string; desc: string }[];

  qualityTitle?: string;
  qualityPoints?: { title: string; desc: string }[];

  importantNoticeTitle: string;
  importantNoticeText: string;

  relatedPillarIds: string[];
}

export const NUTRITION_PILLARS: Record<string, NutritionPillar> = {
  'ayurvedic-approved': {
    id: 'ayurvedic-approved',
    title: 'Ayurvedic Approved',
    subtitle: 'Ancestral Postnatal Culinary Wisdom',
    heroHeading: 'Tradition, thoughtfully nourished.',
    heroSubtitle:
      'Generations of culinary wisdom, thoughtfully brought into everyday nourishment.',
    heroImage: require('../assets/images/01.jpg'),
    cardDesc:
      'Time-tested grandmother recipes tailored for delicate postpartum digestive fire.',
    icon: 'tea',
    ctaText: 'Explore Our Nutrition',
    ctaService: 'Nutritional Food Delivery',

    philosophyTitle: 'OUR FOOD PHILOSOPHY',
    philosophyDesc: [
      'In classical Indian maternal traditions, particularly Sutika Paricharya and Pathiya Samayal, postpartum food is considered sacred medicine (Ahara eva Mahabheshajam). The first 40 to 60 days following childbirth represent a distinct biological window where the body naturally seeks to rebuild deep tissues, recover lost blood, and balance Vata dosha.',
      'During birth, maternal Agni (digestive fire) is naturally compromised. Our culinary philosophy centers on light, deeply assimilable nourishment that comforts without taxing the digestive tract. We honor traditional South Indian and pan-Indian grandmother recipes, strictly prepared fresh each dawn using whole spices, cold-pressed oils, and pure A2 cow ghee.',
    ],

    ingredientsTitle: 'TRADITIONAL INGREDIENTS',
    ingredientsSubtitle:
      'Whole, unadulterated spices and grains hand-selected for maternal restoration.',
    ingredients: [
      {
        name: 'Fenugreek (Methi)',
        regionalName: 'Menthya / Vendhayam',
        culinaryUse: 'Slow-roasted in pure ghee to reduce bitterness and unlock natural aroma.',
        nutritionalProfile: 'Rich in soluble fiber, iron, calcium, and plant saponins.',
        howUsed: 'Simmered in morning porridges, postpartum kanji, and roasted seed powders.',
        precaution: 'Used in balanced traditional quantities to maintain gentle maternal digestion.',
      },
      {
        name: 'Cumin (Jeera)',
        regionalName: 'Jeerige / Seeragam',
        culinaryUse: 'Lightly dry-toasted and cracked to release volatile carminative oils.',
        nutritionalProfile: 'High natural bioavailable iron, carminative thymol, and potassium.',
        howUsed: 'Infused into hot daily drinking water (Jeera neer) and daily warm lentil broths.',
      },
      {
        name: 'Dill Seeds (Shepu)',
        regionalName: 'Sabbasige / Shatapushpa',
        culinaryUse: 'Steeped in healing broths and light vegetable sautés.',
        nutritionalProfile: 'Abundant in flavonoids, calcium, and natural carminative compounds.',
        howUsed: 'Brewed into digestive teas and folded into soft moong dal khichdi.',
      },
      {
        name: 'Dry Ginger (Shunti)',
        regionalName: 'Chukku / Sukku',
        culinaryUse: 'Pounded into fine powder and simmered in decoctions.',
        nutritionalProfile: 'Contains gingerols and shogaols supporting gentle warmth and digestive fire.',
        howUsed: 'Blended into morning herbal kashayams, panagam, and restorative ladoos.',
      },
      {
        name: 'Garlic (Lahsun)',
        regionalName: 'Bellulli / Poondu',
        culinaryUse: 'Gently braised in cold-pressed sesame oil or cow ghee until sweet and golden.',
        nutritionalProfile: 'Rich in allicin, organosulfur compounds, and natural Vitamin B6.',
        howUsed: 'Steeped into traditional garlic pepper rasam and restorative postpartum dals.',
      },
      {
        name: 'Sprouted Ragi (Finger Millet)',
        regionalName: 'Nachni / Kezhvaragu',
        culinaryUse: 'Soaked, sun-sprouted, roasted, and milled into a fine bioavailable flour.',
        nutritionalProfile: 'Exceptionally high in natural plant calcium (344mg/100g), iron, and amino acids.',
        howUsed: 'Cooked into warm morning porridges with A2 milk, dry fruits, and jaggery.',
      },
    ],

    whyIngredientsTitle: 'WHY THESE INGREDIENTS?',
    whyIngredientsList: [
      {
        title: 'Rekindling Maternal Agni (Digestion)',
        desc: 'Childbirth causes an immediate internal drop in metabolic heat. Cumin, ajwain, and dry ginger gently stimulate digestive enzymes without causing acidity or burning.',
      },
      {
        title: 'Calming Postpartum Vata Dosha',
        desc: 'The physical space created in the womb increases Vata (dryness, air, fatigue). Warm porridges, unctuous ghee, and cooked root vegetables provide grounding, peaceful internal stability.',
      },
      {
        title: 'Cellular & Tissue Replenishment',
        desc: 'Bioavailable calcium from sprouted millets and plant iron from drumstick leaves support natural hemoglobin recovery and bone density without synthetic supplements.',
      },
      {
        title: 'Zero Cold or Stale Foods',
        desc: 'Ayurveda strongly advises against raw salads, iced beverages, and refrigerated leftovers during the Sacred 40 Days, as cold qualities paralyze delicate postnatal digestion.',
      },
    ],

    kitchenApproachTitle: 'OUR KITCHEN APPROACH',
    kitchenApproachSteps: [
      {
        title: 'Unadulterated Sourcing',
        desc: 'We use whole unpolished grains, farm-sourced spices, and cold-pressed oils. Zero preservatives, MSG, or artificial coloring agents.',
        icon: 'leaf',
      },
      {
        title: 'Dawn Fresh Preparation',
        desc: 'Cooking begins at 5:00 AM daily in Bangalore. Food is never cooked the previous night or frozen.',
        icon: 'sparkle',
      },
      {
        title: 'Traditional Cookware',
        desc: 'Meals are simmered in heavy-bottomed brass (pital), cast iron, and earthenware to retain natural energetic prana.',
        icon: 'tea',
      },
      {
        title: 'Strict Kitchen Hygiene',
        desc: 'Sterilized equipment, certified food-grade preparation zones, and thorough water filtration for complete clinical peace of mind.',
        icon: 'shield',
      },
    ],

    mealInspirationTitle: 'MEAL INSPIRATION',
    mealInspirationItems: [
      {
        title: 'Traditional Healing Thali',
        subtitle: 'Digestive Comfort & Tissue Repair',
        desc: 'Moong dal khichdi, garlic rasam, moringa stir-fry, cumin red rice, and a drizzle of golden A2 ghee.',
        highlight: 'Balanced Macro & Micro Nutrients',
      },
      {
        title: 'Sprouted Ragi & Almond Porridge',
        subtitle: 'Morning Sustained Vitality',
        desc: 'Fine sprouted ragi slow-cooked with cardamom, crushed almonds, organic jaggery, and warm milk.',
        highlight: 'High Natural Calcium',
      },
      {
        title: 'Shunti & Ajwain Herbal Kashayam',
        subtitle: 'Post-Meal Digestive Elixir',
        desc: 'Gentle golden decoction of dry ginger, carom seeds, coriander, and black pepper for gas relief.',
        highlight: 'Vata Balancing Brew',
      },
      {
        title: 'Traditional Dink (Gondh) & Methi Ladoo',
        subtitle: 'Sacred Postnatal Snack',
        desc: 'Edible acacia gum puffs, roasted fenugreek, dates, and nuts rolled in pure country cow ghee.',
        highlight: 'Deep Spinal & Pelvic Strength',
      },
    ],

    importantNoticeTitle: 'IMPORTANT DIETARY INFORMATION',
    importantNoticeText:
      'Nutritional requirements vary between mothers based on personal constitution, birth method (normal delivery vs. C-section stitch healing), and medical history (such as gestational diabetes or hypertension). Appuge meals are based on traditional food wisdom and do not constitute individual medical prescriptions. Always inform our concierge of personal allergies and consult your doctor or certified clinical nutritionist for clinical medical conditions.',

    relatedPillarIds: ['warm-delivery', 'galactagogue-rich'],
  },

  'warm-delivery': {
    id: 'warm-delivery',
    title: 'Warm Delivery',
    subtitle: 'Fresh Thermal Doorstep Logistics',
    heroHeading: 'Warmth, delivered to your doorstep.',
    heroSubtitle:
      'Freshly prepared nourishment, with thoughtful attention to every detail.',
    heroImage: require('../assets/images/05.jpg'),
    cardDesc:
      'Cooked fresh every morning and delivered warm in food-grade insulated thermal containers.',
    icon: 'delivery',
    ctaText: 'Explore Our Meal Menu',
    ctaService: 'Nutritional Food Delivery',

    philosophyTitle: 'FRESHLY PREPARED WITH LOVE',
    philosophyDesc: [
      'Food that has cooled down and been reheated loses its life-force (Prana) and turns heavy on a new mother’s digestion. In Indian family traditions, postpartum meals were always served steaming fresh from the grandmother’s hearth straight to the mother’s bed.',
      'Appuge replicates this warmth across Bangalore through specialized thermal delivery. We do not operate like typical fast-food delivery apps; our routes are carefully planned so that freshly simmered meals reach your doorstep at optimal eating temperature, ready to nourish you without reheating.',
    ],

    packagingTitle: 'THOUGHTFUL PACKAGING STANDARDS',
    packagingPoints: [
      {
        title: 'Food-Grade Stainless Steel & BPA-Free Inserts',
        desc: 'We never pack steaming hot acidic soups or gravies into cheap single-use plastic containers that leach harmful microplastics and endocrine disruptors.',
      },
      {
        title: 'Triple-Layer Thermal Insulation',
        desc: 'Custom-designed thermal carrier bags retain internal temperature above 60°C throughout transit across Bangalore traffic.',
      },
      {
        title: 'Leak-Proof Hermetic Seals',
        desc: 'Every kashayam, rasam, and dal is vacuum-sealed with food-safe silicone gaskets to prevent leaks, spills, and atmospheric contamination.',
      },
      {
        title: 'Tamper-Evident Sanctuary Seals',
        desc: 'Dispatched with clean security seal bands, assuring families that the food has remained untouched from kitchen to nursery.',
      },
    ],

    timelineTitle: 'FROM OUR KITCHEN TO YOUR HOME',
    timelineSubtitle:
      'A punctual, calm, four-step morning & evening delivery rhythm.',
    timeline: [
      {
        step: '01',
        title: 'Dawn Batch Cooking',
        time: '05:00 AM – 08:30 AM',
        desc: 'Chefs prepare daily menus using freshly chopped seasonal greens, freshly ground spice mixes, and pure A2 cow ghee.',
      },
      {
        step: '02',
        title: 'Quality & Temperature Verification',
        time: '08:30 AM – 09:30 AM',
        desc: 'Each dish undergoes strict temperature testing, taste harmony check, and sterile portioning into thermal containers.',
      },
      {
        step: '03',
        title: 'Insulated Route Dispatch',
        time: '09:30 AM – 11:00 AM',
        desc: 'Dedicated Appuge logistics partners depart in temperature-shielded delivery carriers grouped by Bangalore zones.',
      },
      {
        step: '04',
        title: 'Gentle Doorstep Delivery',
        time: '11:30 AM – 01:00 PM',
        desc: 'Prompt arrival at your home. Choose silent knock, ringless placement, or hand-to-hand delivery to preserve baby’s sleep.',
      },
    ],

    whyIngredientsTitle: 'WHY WARM MEALS MATTER',
    whyIngredientsList: [
      {
        title: 'Soothes the Nervous System',
        desc: 'Warm liquids and freshly cooked warm grains send parasympathetic signals to the vagus nerve, calming postpartum anxiety and promoting restful relaxation.',
      },
      {
        title: 'Optimal Nutrient Absorption',
        desc: 'Warmth keeps fats and fat-soluble vitamins (such as A2 ghee and carotenoids) in a liquid, easily absorbable state, preventing heavy gut sluggishness.',
      },
      {
        title: 'Zero Effort for Exhausted Parents',
        desc: 'New parents and recovering mothers are saved from washing pots, standing over hot stoves, or coordinating kitchen help during the most delicate recovery season.',
      },
    ],

    importantNoticeTitle: 'DELIVERY COVERAGE & LOGISTICS INFORMATION',
    importantNoticeText:
      'Appuge currently delivers across prime residential zones in Bangalore, including Indiranagar, Koramangala, HSR Layout, Whitefield, Jayanagar, JP Nagar, Bellandur, Sarjapur Road, and Hebbal. Meal delivery plans can be paused, rescheduled, or adjusted with 24 hours advance notice via our dedicated WhatsApp concierge.',

    relatedPillarIds: ['ayurvedic-approved', 'pure-a2-desi-ghee'],
  },

  'galactagogue-rich': {
    id: 'galactagogue-rich',
    title: 'Galactagogue Rich',
    subtitle: 'Traditional Lactation Herbs & Nutrients',
    heroHeading: 'Nourishment inspired by tradition.',
    heroSubtitle:
      'Discover traditional ingredients used in lactation-focused Indian cooking.',
    heroImage: require('../assets/images/care_ritual_4.jpg'),
    cardDesc:
      'Prepared with fenugreek, cumin, dill, and moringa to naturally support maternal vitality and lactation.',
    icon: 'leaf',
    ctaText: 'Discover Nourishing Meals',
    ctaService: 'Nutritional Food Delivery',

    philosophyTitle: 'WHAT ARE GALACTAGOGUES?',
    philosophyDesc: [
      'The word galactagogue (derived from the Greek gala, meaning milk, and agein, meaning to lead forth) refers to foods, natural herbs, and culinary spices that have been traditionally recognized across centuries to support maternal lactation and milk letdown.',
      'In traditional Indian household wisdom, newly delivered mothers were nourished with specific kitchen spices—such as methi, jeera, shattered dill seeds, moringa, and garlic. These ingredients provide essential trace minerals, ease digestive spasms, hydrate tissues, and support the endocrine system naturally.',
    ],

    ingredientsTitle: 'TRADITIONAL LACTATION INGREDIENTS',
    ingredientsSubtitle:
      'Time-honored Indian culinary staples evaluated for nutritional safety and taste.',
    ingredients: [
      {
        name: 'Fenugreek (Methi)',
        regionalName: 'Trigonella foenum-graecum',
        culinaryUse: 'Carefully roasted in ghee to remove raw bitterness and incorporated into savory dishes.',
        nutritionalProfile: 'Contains natural plant steroidal saponins, iron, dietary fiber, and choline.',
        howUsed: 'Blended into methi ladoos, boiled red rice congee, and herbal postpartum spice mixes.',
        precaution: 'Should be consumed in culinary moderation; excessive amounts may cause maternal or infant bloating.',
      },
      {
        name: 'Garlic (Lahsun / Poondu)',
        regionalName: 'Allium sativum',
        culinaryUse: 'Slow-simmered whole cloves in traditional pepper-cumin rasam or lentils.',
        nutritionalProfile: 'Abundant in allicin, manganese, selenium, and antioxidant sulfur compounds.',
        howUsed: 'Infused into postpartum Poondu Kuzhambu, soothing garlic broth, and seasoned khichdi.',
        precaution: 'Used in balanced, cooked forms to prevent stomach burning or infant taste aversion.',
      },
      {
        name: 'Cumin Seeds (Jeera)',
        regionalName: 'Cuminum cyminum',
        culinaryUse: 'Tempered in pure cow ghee and crushed into fragrant daily seasoning.',
        nutritionalProfile: 'High plant iron content (over 60mg/100g), carminative volatile oils, and zinc.',
        howUsed: 'Simmered in continuous warm sipping water (Jeera neer) and digestive tempering.',
      },
      {
        name: 'Dill Seeds & Greens (Shepu / Suva)',
        regionalName: 'Anethum graveolens',
        culinaryUse: 'Tender fresh leaves and dried seeds braised with lentils and warm spices.',
        nutritionalProfile: 'Rich in Vitamin C, calcium, iron, and gut-soothing monoterpenes.',
        howUsed: 'Folded into gentle moong dal, roasted seed powders, and evening digestive broths.',
        precaution: 'Avoid raw concentrated extracts; Appuge serves it gently cooked in traditional recipes.',
      },
      {
        name: 'Moringa (Drumstick Leaves)',
        regionalName: 'Moringa oleifera',
        culinaryUse: 'Fresh tender leaves sautéed with grated coconut and cold-pressed oil.',
        nutritionalProfile: 'A natural superfood containing 4x the calcium of milk, high iron, protein, and lutein.',
        howUsed: 'Simmered in gentle postpartum dals, soothing clear soups, and soft vegetable stir-fries.',
      },
    ],

    mealInspirationTitle: 'FOOD INSPIRATION',
    mealInspirationItems: [
      {
        title: 'Moringa & Yellow Moong Soup',
        subtitle: 'Gentle Mineral Infusion',
        desc: 'Tender drumstick leaves simmered with split yellow moong, ginger, and cracked cumin.',
        highlight: 'High Natural Calcium & Iron',
      },
      {
        title: 'Poondu (Garlic) & Pepper Rasam',
        subtitle: 'Traditional Digestive & Lactation Broth',
        desc: 'Braised sweet garlic cloves steeped in tamarind broth, black pepper, and fresh curry leaves.',
        highlight: 'Immunity & Milk Flow Comfort',
      },
      {
        title: 'Methi & Sprouted Rice Congee',
        subtitle: 'Slow-Cooked Morning Comfort',
        desc: 'Creamy rice porridge infused with roasted fenugreek powder, coconut milk, and A2 ghee.',
        highlight: 'Sustained Satiety & Hydration',
      },
      {
        title: 'Almond & Sesame Seeds Ladoo',
        subtitle: 'Healthy Calorie & Fat Density',
        desc: 'Toasted white sesame seeds, crushed raw almonds, and jaggery bound with country cow ghee.',
        highlight: 'Rich in Essential Fatty Acids',
      },
    ],

    importantNoticeTitle: 'IMPORTANT CLINICAL LACTATION ADVISORY',
    importantNoticeText:
      'While traditional galactagogue foods have been embraced for generations, no individual ingredient independently guarantees an increase in breast milk volume. Maternal lactation is primarily driven by neuro-endocrine feedback—frequent and effective infant suckling or pumping, proper skin-to-skin contact, adequate maternal hydration, restorative rest, and emotional support. If you experience persistent difficulties with latching, low milk transfer, or breast pain, we strongly advise consulting a certified Lactation Consultant (IBCLC) or pediatrician. Inform our team if you have thyroid conditions or peanut/sesame allergies before starting your meal program.',

    relatedPillarIds: ['ayurvedic-approved', 'pure-a2-desi-ghee'],
  },

  'pure-a2-desi-ghee': {
    id: 'pure-a2-desi-ghee',
    title: 'Pure A2 Desi Ghee',
    subtitle: 'Traditional Bilona Clarified Butter',
    heroHeading: 'A golden touch of tradition.',
    heroSubtitle:
      'An Indian kitchen essential, thoughtfully selected for traditional recipes.',
    heroImage: require('../assets/images/02.jpg'),
    cardDesc:
      'Cooked exclusively in pure country cow ghee for deep tissue healing, joint flexibility, and vitality.',
    icon: 'sparkle',
    ctaText: 'Explore Our Food Philosophy',
    ctaService: 'Nutritional Food Delivery',

    philosophyTitle: 'WHAT IS A2 DESI GHEE?',
    philosophyDesc: [
      'Ghee (Ghrita) holds the highest seat among healthy unctuous substances (Sneha) in classical Indian health literature. In the postpartum season, pure cow ghee is considered indispensable for pacifying Vata, carrying fat-soluble nutrients into cellular membranes, and lubricating dry tissues.',
      'The term "A2" refers specifically to the beta-casein protein profile produced naturally by indigenous Indian humped cow breeds (Bos indicus, such as Gir, Sahiwal, and Hallikar). Because our ghee is made using the traditional curd-churning (Bilona) method, virtually all milk solids, lactose, and caseins are eliminated, yielding a golden, aromatic, easily digestible fat that even lactose-sensitive mothers tolerate beautifully.',
    ],

    kitchenApproachTitle: 'HOW APPUGE GHEE IS CRAFTED',
    kitchenApproachSteps: [
      {
        title: '1. Whole Native Cow Milk',
        desc: 'Sourced from free-grazing, ethically raised native Indian cows fed natural green pastures and Ayurvedic herbs.',
        icon: 'leaf',
      },
      {
        title: '2. Culturing into Whole Curd',
        desc: 'Milk is boiled in open vessels and naturally cultured overnight into full-cream probiotic curd (dahi).',
        icon: 'tea',
      },
      {
        title: '3. Bidirectional Bilona Churning',
        desc: 'The curd is hand-churned with traditional wooden churners to separate fresh cultured butter (makkhan).',
        icon: 'sparkle',
      },
      {
        title: '4. Slow Simmering & Granulation',
        desc: 'Makkhan is gently simmered over slow low flame until the water evaporates and fragrant golden ghee crystals form.',
        icon: 'shield',
      },
    ],

    nutritionalProfileTitle: 'NUTRITIONAL PROFILE & ATTRIBUTES',
    nutritionalProfileDesc:
      'Pure clarified butter is a clean, stable energy source that supports hormone synthesis and neural cell integrity.',
    nutritionalPoints: [
      {
        label: 'Short-Chain Butyric Acid',
        value: 'Natural Gut Fuel',
        desc: 'Nourishes the intestinal colon cells, helps repair the gut lining, and soothes internal inflammation.',
      },
      {
        label: 'High Smoke Point (250°C)',
        value: 'Thermal Stability',
        desc: 'Does not break down into free radicals or toxic acrolein during spice blooming (tadka).',
      },
      {
        label: 'Vitamins A, D, E & K2',
        value: 'Fat-Soluble Micronutrients',
        desc: 'Assists calcium mobilization to bones and teeth, which is critical during continuous lactation.',
      },
      {
        label: 'Virtually Lactose & Casein Free',
        value: 'Ultra-Pure Clarification',
        desc: 'Gentle on sensitive maternal stomachs that cannot tolerate raw liquid milk or commercial butter.',
      },
    ],

    whyIngredientsTitle: 'HOW APPUGE USES GHEE IN MEALS',
    whyIngredientsList: [
      {
        title: 'Drizzled Fresh Over Soft Porridges',
        desc: 'A spoonful of warm golden ghee folded into ragi congee or broken wheat porridge slows the glucose spike and offers sustained energy.',
      },
      {
        title: 'Binding Herbal Postnatal Ladoos',
        desc: 'Used as the natural binding and preservative medium for Gondh, Methi, and dry-fruit Pinni ladoos without synthetic sugar or palm oil.',
      },
      {
        title: 'Tempering Carminative Healing Spices',
        desc: 'Ghee acts as a lipid carrier (Yogavahi), pulling the lipid-soluble medicinal compounds of cumin, hing, and ajwain deep into digestive tissues.',
      },
    ],

    qualityTitle: 'SOURCING, PACKAGING & PURITY',
    qualityPoints: [
      {
        title: 'Ethical Dairy Partnerships',
        desc: 'Sourced strictly from certified partner gaushalas practicing non-violent (Ahimsa) calf-first milking and organic grazing.',
      },
      {
        title: 'Pure Glass Packaging',
        desc: 'Packed exclusively in sterilised food-grade amber glass jars to protect against sunlight degradation and microplastic contamination.',
      },
      {
        title: 'Storage & Handling',
        desc: 'Store at room temperature in a dry pantry away from moisture. No refrigeration required.',
      },
    ],

    importantNoticeTitle: 'RESPONSIBLE NUTRITIONAL INFORMATION',
    importantNoticeText:
      'Ghee is a calorie-dense healthy fat. While celebrated in Indian tradition for postpartum recovery, consumption should be tailored to individual physical mobility, lipid profiles, and digestive capacity. Ghee does not independently heal surgical wounds or guarantee maternal weight management. Mothers with gallbladder complications, severe hyperlipidemia, or specific medical restrictions should consult their attending physician regarding appropriate dietary fat intake.',

    relatedPillarIds: ['ayurvedic-approved', 'warm-delivery'],
  },
};
