import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { APPUGE_INFO } from '../data/appugeData';
import { AppIcon } from '../components/common/AppIcon';
import { NutritionPillarDetailScreen } from './NutritionPillarDetailScreen';

interface NutritionScreenProps {
  onOpenBooking: (serviceTitle?: string) => void;
}

const NUTRITION_ITEMS = [
  {
    id: 'thali',
    number: '01',
    name: 'Traditional Healing Thali',
    subtitle: 'Digestive Comfort & Tissue Repair',
    desc: 'Easily digestible khichdi, iron-rich lentil broths, moringa leaves, garlic rasam, and cumin red rice seasoned with authentic A2 Desi Ghee.',
    image: require('../assets/images/01.jpg'),
    badge: 'Daily Lunch',
    notes: ['Aids postpartum digestion', 'High iron & fiber', 'Safe for sensitive stomachs'],
  },
  {
    id: 'porridge',
    number: '02',
    name: 'Ragi Porridge & Gondh Halwa',
    subtitle: 'Sustained Energy & Calcium Restoration',
    desc: 'Sprouted ragi (finger millet) porridge simmered with dry fruits, paired with traditional edible gum (gondh) halwa slow-cooked in cow ghee.',
    image: require('../assets/images/nutrition_hero.png'),
    badge: 'Morning Ritual',
    notes: ['Calcium for bone density', 'Slow-burning natural energy', 'Warm pelvic strengthening'],
  },
  {
    id: 'kashayam',
    number: '03',
    name: 'Healing Herbal Kashayams & Soups',
    subtitle: 'Digestive Fire & Gas Relief',
    desc: 'Traditional warm decoctions steeped with dry ginger (shunti), cumin, ajwain, and dill seeds to balance Vata dosha and prevent postpartum chills.',
    image: require('../assets/images/care_ritual_4.jpg'),
    badge: 'Twice Daily',
    notes: ['Relieves abdominal gas', 'Kindles digestive Agni', 'Soothes throat and chest'],
  },
  {
    id: 'eggs',
    number: '04',
    name: 'Farm-Fresh Free-Range Desi Eggs',
    subtitle: 'Clean Bioavailable Protein & Choline',
    desc: 'Pasture-raised country chicken eggs rich in omega-3, choline, and natural Vitamin B12, recommended across traditional postpartum culinary wisdom.',
    image: require('../assets/images/desi_eggs.jpg'),
    badge: 'Weekly Pack',
    notes: ['Crucial for infant brain health via milk', 'Accelerates wound repair', 'Pure pasture-raised source'],
  },
];

const PILLARS = [
  {
    id: 'ayurvedic-approved',
    title: 'Ayurvedic Approved',
    desc: 'Time-tested grandmother recipes tailored for postpartum digestive fire.',
    icon: 'tea',
  },
  {
    id: 'warm-delivery',
    title: 'Warm Delivery',
    desc: 'Cooked fresh every morning and delivered warm in food-grade insulated tiffins.',
    icon: 'delivery',
  },
  {
    id: 'galactagogue-rich',
    title: 'Galactagogue Rich',
    desc: 'Prepared with fenugreek, cumin, dill, and moringa to support natural lactation.',
    icon: 'leaf',
  },
  {
    id: 'pure-a2-desi-ghee',
    title: 'Pure A2 Desi Ghee',
    desc: 'Cooked exclusively in pure country cow ghee for deep tissue healing.',
    icon: 'sparkle',
  },
];

export const NutritionScreen: React.FC<NutritionScreenProps> = ({ onOpenBooking }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      'Hi Appuge Kitchen! I would like to enquire about your daily postpartum meal and kashayam delivery in Bangalore.',
    );
    Linking.openURL(`https://wa.me/${APPUGE_INFO.phone}?text=${text}`).catch(() => {
      Alert.alert('Unable to open WhatsApp', 'Please contact Appuge at ' + APPUGE_INFO.phoneDisplay);
    });
  };

  const renderPillarCard = (p: typeof PILLARS[0]) => (
    <TouchableOpacity
      key={p.id}
      style={styles.pillarCard}
      onPress={() => setSelectedPillarId(p.id)}
      activeOpacity={0.8}
      accessibilityLabel={`${p.title} detail`}>
      <View style={styles.pillarIconBox}>
        <AppIcon name={p.icon} size={22} color={Colors.forestDark} />
      </View>
      <Text style={styles.pillarTitle}>{p.title}</Text>
      <Text style={styles.pillarDesc}>{p.desc}</Text>
      <View style={styles.pillarExploreRow}>
        <Text style={styles.pillarExploreText}>Explore Pillar</Text>
        <AppIcon name="arrow-right" size={10} color={Colors.terracotta} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 1. EDITORIAL HEADER */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FROM OUR KITCHEN · WITH LOVE</Text>
          <Text style={styles.title}>
            Food as sacred{'\n'}
            <Text style={styles.titleItalic}>medicine.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Old recipes that remind the body how to heal and feel at home.
            Prepared fresh every morning and delivered warm across Bangalore.
          </Text>
        </View>

        {/* 2. HERO IMAGE BANNER */}
        <View style={styles.heroWrapper}>
          <Image
            source={require('../assets/images/nutrition_hero.png')}
            style={styles.heroPhoto}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>✦ THE POSTPARTUM TABLE</Text>
            <Text style={styles.heroHeadline}>Nourishing the Mother Who Gives Life</Text>
            <Text style={styles.heroSub}>Delivered warm in insulated boxes across Bangalore</Text>
          </View>
        </View>

        {/* 3. THE 4 NUTRITIONAL PILLARS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>OUR POSTNATAL PRINCIPLES</Text>
          <Text style={styles.sectionTitle}>The 4 Nutritional Pillars</Text>
        </View>

        <View style={styles.pillarsGrid}>
          <View style={styles.pillarsRow}>
            {renderPillarCard(PILLARS[0])}
            {renderPillarCard(PILLARS[1])}
          </View>
          <View style={styles.pillarsRow}>
            {renderPillarCard(PILLARS[2])}
            {renderPillarCard(PILLARS[3])}
          </View>
        </View>

      {/* 4. HEALING OFFERINGS SHOWCASE */}
      <View style={styles.sectionHeader}>
        <Text style={styles.eyebrow}>HEALING RITUALS</Text>
        <Text style={styles.sectionTitle}>Curated Postpartum Menu</Text>
      </View>

      <View style={styles.foodCardsList}>
        {NUTRITION_ITEMS.map(item => (
          <View key={item.id} style={styles.foodCard}>
            <View style={styles.foodImageContainer}>
              <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
              <View style={styles.foodOverlay} />
              <View style={styles.foodTopRow}>
                <View style={styles.foodIndexBadge}>
                  <Text style={styles.foodIndexText}>{item.number}</Text>
                </View>
                <View style={styles.foodBadge}>
                  <Text style={styles.foodBadgeText}>{item.badge}</Text>
                </View>
              </View>
              <View style={styles.foodBottomTitle}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodSubtitle}>{item.subtitle}</Text>
              </View>
            </View>

            <View style={styles.foodBody}>
              <Text style={styles.foodDesc}>{item.desc}</Text>

              {/* Notes pills */}
              <View style={styles.notesRow}>
                {item.notes.map((note, idx) => (
                  <View key={idx} style={styles.noteChip}>
                    <Text style={styles.noteChipText}>✓ {note}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 5. DELIVERY DETAILS & ENQUIRY BOX */}
      <View style={styles.deliveryCard}>
        <Text style={styles.deliveryEyebrow}>BANGALORE WARM DELIVERY</Text>
        <Text style={styles.deliveryTitle}>Custom Postnatal Kitchen Plans</Text>
        <Text style={styles.deliveryDesc}>
          Whether you need a 30-day complete recovery lunch program, morning
          galactagogue porridges, or fresh desi egg packs, our kitchen tailors
          preparations to your delivery date and dietary preferences.
        </Text>

        <View style={styles.deliveryActions}>
          <TouchableOpacity
            style={styles.bookMealBtn}
            onPress={() => onOpenBooking('Nutritional Food Delivery')}
            activeOpacity={0.88}>
            <View style={styles.bookMealBtnContent}>
              <Text style={styles.bookMealBtnText}>
                Enquire for Meal Delivery
              </Text>
              <View style={styles.bookMealBtnIconCircle}>
                <AppIcon name="arrow-up-right" size={11} color={Colors.terracotta} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsAppKitchenBtn}
            onPress={handleWhatsAppEnquiry}
            activeOpacity={0.8}>
            <View style={styles.whatsAppKitchenRow}>
              <AppIcon name="whatsapp" size={16} color={Colors.creamLight} />
              <Text style={styles.whatsAppKitchenText}>
                Chat with Kitchen Coordinator
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

    {/* Full-Page Interactive Editorial Detail Screen */}
    <NutritionPillarDetailScreen
      visible={!!selectedPillarId}
      pillarId={selectedPillarId}
      onClose={() => setSelectedPillarId(null)}
      onSelectPillar={id => setSelectedPillarId(id)}
      onOpenBooking={serviceTitle => {
        setSelectedPillarId(null);
        onOpenBooking(serviceTitle);
      }}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: Colors.creamLight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  eyebrow: {
    color: Colors.sage,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  titleItalic: {
    fontStyle: 'italic',
    color: Colors.forest,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  heroWrapper: {
    marginHorizontal: 16,
    marginTop: 18,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroTag: {
    color: Colors.goldWarm,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroHeadline: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSub: {
    color: 'rgba(255, 253, 249, 0.85)',
    fontSize: 12,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
  },
  pillarsGrid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  pillarsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  pillarCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  pillarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillarTitle: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  pillarDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  pillarExploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  pillarExploreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  foodCardsList: {
    paddingHorizontal: 16,
    gap: 18,
  },
  foodCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  foodImageContainer: {
    height: 170,
    position: 'relative',
    backgroundColor: Colors.forestDark,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 40, 30, 0.45)',
  },
  foodTopRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodIndexText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  foodBadge: {
    backgroundColor: Colors.goldWarm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  foodBadgeText: {
    color: Colors.forestDark,
    fontSize: 9.5,
    fontWeight: '800',
  },
  foodBottomTitle: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
  },
  foodName: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '700',
  },
  foodSubtitle: {
    color: 'rgba(255, 253, 249, 0.85)',
    fontSize: 11.5,
  },
  foodBody: {
    padding: 14,
  },
  foodDesc: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  noteChip: {
    backgroundColor: Colors.sagePale,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noteChipText: {
    color: Colors.forest,
    fontSize: 10.5,
    fontWeight: '600',
  },
  deliveryCard: {
    marginHorizontal: 16,
    marginTop: 28,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.forestDark,
  },
  deliveryEyebrow: {
    color: Colors.goldWarm,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  deliveryTitle: {
    color: Colors.creamLight,
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 8,
  },
  deliveryDesc: {
    color: 'rgba(255, 253, 249, 0.8)',
    fontSize: 12.5,
    lineHeight: 19,
    marginBottom: 20,
  },
  deliveryActions: {
    gap: 10,
  },
  bookMealBtn: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 24,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 4,
  },
  bookMealBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookMealBtnText: {
    color: Colors.white,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bookMealBtnIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsAppKitchenBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsAppKitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsAppKitchenText: {
    color: Colors.creamLight,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
