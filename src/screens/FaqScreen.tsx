import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { APPUGE_INFO, FAQS } from '../data/appugeData';
import { AppIcon } from '../components/common/AppIcon';

const categories = [
  'All',
  'About Appuge',
  'Postpartum Care',
  'Baby & Newborn Care',
  'Nutrition & Food',
  'Doctor Consultation',
  'Getting Started',
];

export const FaqScreen: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(
    () =>
      FAQS.filter(faq => {
        const categoryMatches =
          selectedCategory === 'All' || faq.category === selectedCategory;
        const query = searchQuery.trim().toLowerCase();
        const queryMatches =
          query.length === 0 ||
          faq.q.toLowerCase().includes(query) ||
          faq.a.toLowerCase().includes(query);
        return categoryMatches && queryMatches;
      }),
    [searchQuery, selectedCategory],
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Unable to open this link', 'Please try again or contact Appuge directly.'),
    );
  };

  const contactLinks = [
    { label: 'WhatsApp', symbol: '↗', url: `https://wa.me/${APPUGE_INFO.phone}` },
    { label: 'Call us', symbol: '↗', url: `tel:${APPUGE_INFO.phone}` },
    { label: 'Email', symbol: '↗', url: `mailto:${APPUGE_INFO.email}` },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>A LITTLE CLARITY, WHEN YOU NEED IT</Text>
        <Text style={styles.title}>
          Here for every{'\n'}
          <Text style={styles.titleItalic}>little question.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Start wherever you are. We’ll take it one question at a time.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchSymbol}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a question or topic"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={value => {
            setSearchQuery(value);
            setExpandedIndex(null);
          }}
          accessibilityLabel="Search help questions"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
            <Text style={styles.clearSearch}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRail}>
        {categories.map(category => {
          const active = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setExpandedIndex(null);
              }}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              activeOpacity={0.75}>
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Questions, answered.</Text>
        <Text style={styles.resultCount}>{String(filteredFaqs.length).padStart(2, '0')}</Text>
      </View>

      <View style={styles.faqList}>
        {filteredFaqs.length === 0 ? (
          <View style={styles.emptyState}>
            <AppIcon name="sparkle" size={24} color={Colors.sage} />
            <Text style={styles.emptyTitle}>Nothing by that name, yet.</Text>
            <Text style={styles.emptyBody}>
              Try a different phrase, or send us your question directly.
            </Text>
          </View>
        ) : (
          filteredFaqs.map((faq, index) => {
            const expanded = expandedIndex === index;
            return (
              <View style={styles.faqItem} key={`${faq.q}-${index}`}>
                <TouchableOpacity
                  style={styles.questionRow}
                  onPress={() => setExpandedIndex(expanded ? null : index)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}>
                  <View style={styles.questionCopy}>
                    <Text style={styles.questionCategory}>{faq.category}</Text>
                    <Text style={styles.question}>{faq.q}</Text>
                  </View>
                  <Text style={[styles.questionToggle, expanded && styles.questionToggleOpen]}>
                    {expanded ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expanded && (
                  <View style={styles.answerWrap}>
                    <Text style={styles.answer}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteEyebrow}>A NOTE FROM APPUGE</Text>
        <Text style={styles.quote}>
          “She gave life,{'\n'}
          <Text style={styles.quoteItalic}>now let us care for her.”</Text>
        </Text>
        <Text style={styles.quoteMark}>APPUGE · HEARTBEATS WRAPPED WITH LOVE</Text>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactEyebrow}>STILL WONDERING ABOUT SOMETHING?</Text>
        <Text style={styles.contactTitle}>We’re listening.</Text>
        <Text style={styles.contactBody}>
          A real person from our Bengaluru care team is happy to help.
        </Text>
        <View style={styles.contactRow}>
          {contactLinks.map(link => (
            <TouchableOpacity
              key={link.label}
              style={styles.contactAction}
              onPress={() => openLink(link.url)}
              activeOpacity={0.75}>
              <Text style={styles.contactSymbol}>{link.symbol}</Text>
              <Text style={styles.contactLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.contactFoot}>{APPUGE_INFO.phoneDisplay} · Bengaluru, India</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.creamLight },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 110 },
  intro: { marginBottom: 18 },
  eyebrow: {
    color: Colors.sage,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 9,
  },
  title: {
    color: Colors.forestDark,
    fontFamily: 'Georgia',
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  titleItalic: { color: Colors.forest, fontStyle: 'italic' },
  subtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 9, lineHeight: 17 },
  searchBox: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.creamLight,
  },
  searchSymbol: { color: Colors.sage, fontSize: 24, marginRight: 8, lineHeight: 27 },
  searchInput: { flex: 1, color: Colors.forestDark, fontSize: 11, paddingVertical: 0 },
  clearSearch: { color: Colors.forest, fontSize: 20, paddingHorizontal: 4 },
  categoryRail: { gap: 7, paddingVertical: 14 },
  categoryChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryChipActive: { backgroundColor: Colors.forestDark, borderColor: Colors.forestDark },
  categoryText: { color: Colors.forest, fontSize: 9, fontWeight: '600' },
  categoryTextActive: { color: Colors.creamLight },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  listTitle: { color: Colors.forestDark, fontFamily: 'Georgia', fontSize: 20 },
  resultCount: { color: Colors.terracotta, fontFamily: 'Georgia', fontSize: 16 },
  faqList: { marginBottom: 24 },
  faqItem: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.cardBorder },
  questionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  questionCopy: { flex: 1, paddingRight: 14 },
  questionCategory: {
    color: Colors.sage,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  question: { color: Colors.forestDark, fontFamily: 'Georgia', fontSize: 15, lineHeight: 20 },
  questionToggle: { color: Colors.terracotta, fontSize: 22, width: 23, textAlign: 'center' },
  questionToggleOpen: { color: Colors.sage },
  answerWrap: { paddingRight: 28, paddingBottom: 16 },
  answer: { color: Colors.textSecondary, fontSize: 11, lineHeight: 17 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 15,
    backgroundColor: Colors.sagePale,
    marginTop: 14,
  },
  emptyMark: { color: Colors.terracotta, fontSize: 24 },
  emptyTitle: { color: Colors.forestDark, fontFamily: 'Georgia', fontSize: 17, marginTop: 6 },
  emptyBody: { color: Colors.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 5 },
  quoteCard: {
    padding: 21,
    backgroundColor: Colors.forestDark,
    borderTopLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 22,
  },
  quoteEyebrow: { color: Colors.sageLight, fontSize: 8, fontWeight: '700', letterSpacing: 1.2 },
  quote: { color: Colors.creamLight, fontFamily: 'Georgia', fontSize: 26, lineHeight: 30, marginTop: 13 },
  quoteItalic: { color: Colors.blush, fontStyle: 'italic' },
  quoteMark: { color: 'rgba(255,253,249,0.55)', fontSize: 7, fontWeight: '700', letterSpacing: 1, marginTop: 17 },
  contactCard: {
    padding: 19,
    backgroundColor: Colors.sagePale,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
  },
  contactEyebrow: { color: Colors.sage, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  contactTitle: { color: Colors.forestDark, fontFamily: 'Georgia', fontSize: 23, marginTop: 5 },
  contactBody: { color: Colors.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 5 },
  contactRow: { flexDirection: 'row', gap: 8, marginTop: 15 },
  contactAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.creamLight,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  contactSymbol: { color: Colors.terracotta, fontSize: 16, marginBottom: 3 },
  contactLabel: { color: Colors.forestDark, fontSize: 9, fontWeight: '700' },
  contactFoot: { color: Colors.textMuted, fontSize: 8, marginTop: 14, textAlign: 'center' },
});
