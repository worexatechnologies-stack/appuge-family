import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';

interface SacredFortyDaysProps {
  onOpenBooking: (service?: string) => void;
  onExploreCare: () => void;
  scrollY: Animated.Value;
  scrollTop: number | null;
  viewportHeight: number;
}

export const SacredFortyDays: React.FC<SacredFortyDaysProps> = ({
  onOpenBooking,
  onExploreCare,
  scrollY,
  scrollTop,
  viewportHeight,
}) => {
  const { width } = useWindowDimensions();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const imageWidth = Math.min(width - 36, 720);
  const imageHeight = Math.min(imageWidth / 0.84, 520);
  const isInitiallyVisible =
    scrollTop === null || viewportHeight === 0 || scrollTop <= viewportHeight;
  const entranceOpacity = scrollY.interpolate({
    inputRange: isInitiallyVisible
      ? [0, 1]
      : [scrollTop - viewportHeight, scrollTop - viewportHeight * 0.55],
    outputRange: isInitiallyVisible ? [1, 1] : [0, 1],
    extrapolate: 'clamp',
  });
  const entranceTranslateY = entranceOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const animateButton = (toValue: number) => {
    Animated.spring(buttonScale, {
      toValue,
      useNativeDriver: true,
      speed: 28,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: entranceOpacity,
          transform: [{ translateY: entranceTranslateY }],
        },
      ]}>
      <Animated.View
        style={[
          styles.imageFrame,
          {
            width: imageWidth,
            height: imageHeight,
            opacity: entranceOpacity,
          },
        ]}>
        <Image
          source={require('../assets/images/03.jpg')}
          resizeMode="cover"
          style={styles.image}
          accessible
          accessibilityLabel="An Indian mother holding her baby at home"
        />
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>THE APPUGE PHILOSOPHY</Text>
        <Text style={styles.heading}>
          The first 40 days{'\n'}
          deserve something{'\n'}
          <Text style={styles.headingItalic}>extraordinary.</Text>
        </Text>
        <Text style={styles.description}>
          A gentler beginning, rooted in generations of Indian wisdom and
          thoughtfully supported by modern care.
        </Text>

        <View style={styles.editorialLabels}>
          <View style={styles.editorialPill}>
            <AppIcon name="leaf" size={12} color={Colors.sageDark} />
            <Text style={styles.editorialLabelText}>Traditional Wisdom</Text>
          </View>
          <View style={styles.editorialDividerDot} />
          <View style={styles.editorialPill}>
            <AppIcon name="shield" size={12} color={Colors.sageDark} />
            <Text style={styles.editorialLabelText}>Thoughtful Care</Text>
          </View>
          <View style={styles.editorialDividerDot} />
          <View style={styles.editorialPill}>
            <AppIcon name="baby" size={12} color={Colors.sageDark} />
            <Text style={styles.editorialLabelText}>Mother & Baby</Text>
          </View>
        </View>

        <Animated.View
          style={[styles.ctaAnimatedWrap, { transform: [{ scale: buttonScale }] }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Discover the Appuge Sanctuary"
            onPress={() => onOpenBooking('Mother & Baby Dual Sanctuary')}
            onPressIn={() => animateButton(0.98)}
            onPressOut={() => animateButton(1)}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}>
            <View style={styles.ctaLeftGroup}>
              <View style={styles.ctaSparkleBox}>
                <AppIcon name="sparkle" size={14} color={Colors.goldWarm} />
              </View>
              <Text style={styles.ctaText}>Discover the Appuge Sanctuary</Text>
            </View>
            <View style={styles.ctaIconCircle}>
              <AppIcon name="arrow-up-right" size={12} color={Colors.goldWarm} />
            </View>
          </Pressable>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explore Our Care"
          onPress={onExploreCare}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}>
          <View style={styles.secondaryLeftGroup}>
            <View style={styles.secondaryHeartBox}>
              <AppIcon name="heart" size={13} color={Colors.terracotta} />
            </View>
            <Text style={styles.secondaryButtonText}>Explore Our Care Sanctuaries</Text>
          </View>
          <View style={styles.secondaryIconCircle}>
            <AppIcon name="arrow-right" size={11} color={Colors.terracotta} />
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    paddingTop: 18,
    paddingBottom: 34,
  },
  imageFrame: {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: Colors.creamDark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 650,
    paddingHorizontal: 26,
    paddingTop: 34,
    alignItems: 'flex-start',
  },
  eyebrow: {
    color: Colors.sage,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 14,
  },
  heading: {
    color: Colors.forestDark,
    fontFamily: Fonts.serif,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  headingItalic: {
    color: Colors.forest,
    fontStyle: 'italic',
  },
  description: {
    maxWidth: 520,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  editorialLabels: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7EFE4',
    borderWidth: 1,
    borderColor: '#ECE2D3',
    borderRadius: 14,
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 22,
  },
  editorialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editorialDividerDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: Colors.sageLight,
  },
  editorialLabelText: {
    color: Colors.forestDark,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaAnimatedWrap: {
    width: '100%',
  },
  ctaButton: {
    minHeight: 56,
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    backgroundColor: Colors.forestDark,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaButtonPressed: {
    backgroundColor: Colors.forest,
    transform: [{ scale: 0.985 }],
  },
  ctaLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ctaSparkleBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(232, 160, 32, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: Colors.creamLight,
    fontFamily: Fonts.serif,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ctaIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(232, 160, 32, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 109, 81, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 26,
    marginTop: 12,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
    backgroundColor: '#FAF5EE',
  },
  secondaryLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondaryHeartBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCECE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.forestDark,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCECE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
