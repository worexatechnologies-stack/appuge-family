import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

declare const process: any;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2800,
}) => {
  const isTest = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'test';
  const useNativeDriver = !isTest;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(isTest ? 1 : 0)).current;
  const logoScale = useRef(new Animated.Value(isTest ? 1 : 0.85)).current;
  const logoOpacity = useRef(new Animated.Value(isTest ? 1 : 0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(isTest ? 1 : 0)).current;
  const textSlide = useRef(new Animated.Value(isTest ? 0 : 20)).current;
  const progressAnim = useRef(new Animated.Value(isTest ? 1 : 0)).current;
  const auraScale = useRef(new Animated.Value(0.9)).current;
  const auraOpacity = useRef(new Animated.Value(0.3)).current;

  const entranceAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const floatLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const auraLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const exitAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    if (isTest) {
      // In tests, avoid running unbounded node timers or native driver animations
      fadeAnim.setValue(1);
      logoScale.setValue(1);
      logoOpacity.setValue(1);
      textFade.setValue(1);
      textSlide.setValue(0);
      progressAnim.setValue(1);
      return () => {
        mounted.current = false;
      };
    }

    // 1. Entrance animation sequence
    const entrance = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver,
      }),
      // Delayed text reveal
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(textFade, {
            toValue: 1,
            duration: 800,
            useNativeDriver,
          }),
          Animated.timing(textSlide, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver,
          }),
        ]),
      ]),
      // Smooth progress bar fill
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: Math.max(duration - 400, 100),
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
    ]);
    entranceAnimRef.current = entrance;
    entrance.start();

    // 2. Gentle breathing/floating animation for the logo
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 4,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    floatLoopRef.current = floatLoop;
    floatLoop.start();

    // 3. Ambient aura pulse
    const auraLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(auraScale, {
            toValue: 1.15,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.6,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(auraScale, {
            toValue: 0.95,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.3,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    auraLoopRef.current = auraLoop;
    auraLoop.start();

    // 4. Timer to trigger exit
    timerRef.current = setTimeout(() => {
      if (!mounted.current) return;
      const exitAnim = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      });
      exitAnimRef.current = exitAnim;
      exitAnim.start(({ finished }) => {
        if (finished && mounted.current) onFinish?.();
      });
    }, duration);

    return () => {
      mounted.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      entranceAnimRef.current?.stop();
      floatLoopRef.current?.stop();
      auraLoopRef.current?.stop();
      exitAnimRef.current?.stop();
      [
        fadeAnim,
        logoScale,
        logoOpacity,
        logoFloat,
        textFade,
        textSlide,
        progressAnim,
        auraScale,
        auraOpacity,
      ].forEach(value => value.stopAnimation());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isTest, onFinish, useNativeDriver]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative ambient background elements */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.topDecorativeBlob} />
        <View style={styles.bottomDecorativeBlob} />
        <Animated.View
          style={[
            styles.auraCircle,
            {
              transform: [{ scale: auraScale }],
              opacity: auraOpacity,
            },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Central Brand Illustration & Logo */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { translateY: logoFloat },
                ],
              },
            ]}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
              accessible
              accessibilityLabel="Appuge - Mother holding baby"
            />
          </Animated.View>

          {/* Typography & Brand Tagline */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textFade,
                transform: [{ translateY: textSlide }],
              },
            ]}>
            {/* Elegant botanical divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.tagline}>NURTURING EVERY MOMENT</Text>
            <Text style={styles.subTagline}>
              Pure Care & Comfort For Mother & Child
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Loading Indicator & Footer */}
        <View style={styles.footerSection}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>

          <Text style={styles.footerBadge}>APPUGE • CARE ESSENTIALS</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // Ambient background rings
  topDecorativeBlob: {
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.35,
    left: -SCREEN_WIDTH * 0.25,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: SCREEN_WIDTH * 0.425,
    backgroundColor: '#EAF2EC',
    opacity: 0.6,
  },
  bottomDecorativeBlob: {
    position: 'absolute',
    bottom: -SCREEN_WIDTH * 0.3,
    right: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    backgroundColor: '#FCEFE6',
    opacity: 0.6,
  },
  auraCircle: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3,
    left: SCREEN_WIDTH * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FDEEE2',
  },
  // Center Section
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoWrapper: {
    width: Math.min(SCREEN_WIDTH * 0.82, 340),
    height: Math.min(SCREEN_WIDTH * 0.82, 340),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A3B32',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    width: 36,
    height: 1.5,
    backgroundColor: '#D1DDD3',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#53715C',
    marginHorizontal: 8,
  },
  tagline: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3.5,
    color: '#4B6754',
    textAlign: 'center',
    marginBottom: 6,
  },
  subTagline: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8A998E',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Bottom section
  footerSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 28,
  },
  progressBarTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5ECE6',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4B6754',
    borderRadius: 2,
  },
  footerBadge: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#A8B5AB',
  },
});

export default SplashScreen;
