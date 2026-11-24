import React from 'react';
import {
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { Colors, Fonts } from '../theme/colors';
import {
  COMMITMENT_DETAILS,
  CommitmentDetailId,
} from '../data/commitmentDetails';
import { useAppInsets } from '../theme/responsive';

interface CommitmentDetailScreenProps {
  detailId: CommitmentDetailId;
  onClose: () => void;
}

export const CommitmentDetailScreen: React.FC<CommitmentDetailScreenProps> = ({
  detailId,
  onClose,
}) => {
  const { bottom: bottomInset } = useAppInsets();
  const { width } = useWindowDimensions();
  const entrance = useRef(new Animated.Value(0)).current;
  const detail = COMMITMENT_DETAILS[detailId];

  useEffect(() => {
    entrance.setValue(0);
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    });
    animation.start();

    return () => animation.stop();
  }, [entrance]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onClose();
        return true;
      },
    );

    return () => subscription.remove();
  }, [onClose]);

  return (
    <Animated.View
      style={[
        styles.screen,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          onPress={onClose}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>
        <Text style={styles.brandLabel}>APPUGE · OUR COMMITMENT</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          width >= 768 ? styles.scrollContentWide : styles.scrollContentNarrow,
          {
            paddingBottom: bottomInset + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.eyebrow}>THE CARE BEHIND THE PROMISE</Text>
          <Text style={[styles.title, width >= 768 && styles.titleWide]}>
            {detail.title}
          </Text>
          <Text style={styles.introduction}>{detail.introduction}</Text>

          <View style={styles.overview}>
            <Text style={styles.sectionEyebrow}>OUR APPROACH</Text>
            <Text style={styles.overviewText}>{detail.overview}</Text>
          </View>

          <View style={styles.detailSections}>
            {detail.sections.map((section, index) => (
              <View key={section.title} style={styles.detailSection}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  {section.description}
                </Text>
                <View style={styles.steps}>
                  {section.steps.map(step => (
                    <View key={step} style={styles.stepRow}>
                      <View style={styles.stepDot} />
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.benefits}>
            <Text style={styles.sectionEyebrow}>WHAT THIS MEANS FOR YOU</Text>
            <Text style={styles.benefitsTitle}>
              Confidence in every detail.
            </Text>
            {detail.familyBenefits.map(benefit => (
              <View key={benefit} style={styles.benefitRow}>
                <Text style={styles.benefitCheck}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.homeButtonPressed,
            ]}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
            <Text style={styles.homeButtonArrow}>↑</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  topBar: {
    minHeight: 72,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.creamLight,
  },
  backButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 30,
    color: Colors.forestDark,
    marginRight: 6,
  },
  backButtonText: {
    color: Colors.forestDark,
    fontSize: 13,
    fontWeight: '600',
  },
  pressedButton: {
    opacity: 0.65,
  },
  brandLabel: {
    color: Colors.sage,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 32,
  },
  scrollContentWide: {
    paddingHorizontal: 32,
  },
  scrollContentNarrow: {
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  eyebrow: {
    color: Colors.terracotta,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 12,
  },
  title: {
    color: Colors.forestDark,
    fontFamily: Fonts.serif,
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 14,
  },
  titleWide: {
    fontSize: 48,
    lineHeight: 56,
  },
  introduction: {
    maxWidth: 720,
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 28,
  },
  overview: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingVertical: 22,
    marginBottom: 4,
  },
  sectionEyebrow: {
    color: Colors.sage,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  overviewText: {
    color: Colors.forest,
    fontSize: 15,
    lineHeight: 24,
  },
  detailSections: {
    marginTop: 8,
  },
  detailSection: {
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectionNumber: {
    color: Colors.terracotta,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 5,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    color: Colors.forestDark,
    fontFamily: Fonts.serif,
    fontSize: 23,
    lineHeight: 30,
  },
  sectionDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 13,
  },
  steps: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 2,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.terracotta,
    marginTop: 8,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  benefits: {
    backgroundColor: Colors.sageTint,
    padding: 20,
    borderRadius: 14,
    marginTop: 26,
  },
  benefitsTitle: {
    color: Colors.forestDark,
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 31,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  benefitCheck: {
    color: Colors.sageDark,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  benefitText: {
    flex: 1,
    color: Colors.forest,
    fontSize: 13,
    lineHeight: 20,
  },
  homeButton: {
    minHeight: 52,
    maxWidth: 360,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.forestDark,
    borderRadius: 8,
    paddingHorizontal: 22,
    marginTop: 26,
  },
  homeButtonPressed: {
    opacity: 0.8,
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  homeButtonArrow: {
    color: Colors.white,
    fontSize: 17,
    marginLeft: 10,
  },
});
