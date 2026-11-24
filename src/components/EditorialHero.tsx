import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { HERO_SLIDES, type HeroSlideData } from '../data/appugeData';
import { AppIcon } from './common/AppIcon';

const AUTOPLAY_DELAY = 5000;
const RESUME_DELAY = 4500;

const themeColors = {
  warm: {
    background: '#FAF4EB',
    headline: '#2C4035',
    body: '#5D655B',
    accent: '#B65F45',
  },
  sage: {
    background: '#F1F4EE',
    headline: '#243A2F',
    body: '#58665B',
    accent: '#5E7A63',
  },
  earth: {
    background: '#F5EEE4',
    headline: '#493A2C',
    body: '#6A594A',
    accent: '#9B6845',
  },
  ivory: {
    background: Colors.creamLight,
    headline: Colors.forestDark,
    body: Colors.textSecondary,
    accent: Colors.forest,
  },
} as const;

interface EditorialHeroProps {
  onOpenBooking: (service?: string) => void;
  onExploreServices: (tab: 'services' | 'nutrition' | 'doctors') => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onOpenBooking,
  onExploreServices,
}) => {
  const { width, height: windowHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [appIsActive, setAppIsActive] = useState(
    AppState.currentState === null || AppState.currentState === 'active',
  );
  const activeIndexRef = useRef(0);
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideHeight = Math.min(
    460,
    Math.max(390, Math.round(Math.min(width * 1.02, windowHeight * 0.58))),
  );

  const goToSlide = useCallback(
    (index: number, animated = true) => {
      const nextIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated,
      });
    },
    [width],
  );

  const pauseAutoplay = useCallback(() => {
    setAutoplayPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const resumeAutoplayAfterDelay = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setAutoplayPaused(false);
    }, RESUME_DELAY);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      const isActive = state === 'active';
      setAppIsActive(isActive);
      if (!isActive) {
        pauseAutoplay();
      } else {
        setAutoplayPaused(false);
      }
    });

    return () => {
      subscription.remove();
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [pauseAutoplay]);

  useEffect(() => {
    if (!appIsActive || autoplayPaused) {
      return;
    }

    const timer = setTimeout(() => {
      goToSlide(activeIndexRef.current + 1);
    }, AUTOPLAY_DELAY);

    return () => clearTimeout(timer);
  }, [activeIndex, appIsActive, autoplayPaused, goToSlide]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: activeIndexRef.current * width,
      animated: false,
    });
  }, [width]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index >= 0 && index < HERO_SLIDES.length && index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const getPhotoHeight = (layout: HeroSlideData['layout']) => {
    const ratios = {
      imageTopTall: width < 360 ? 0.31 : width < 390 ? 0.36 : 0.43,
      imageTop: width < 360 ? 0.26 : width < 390 ? 0.3 : 0.37,
      imageTopCompact: width < 360 ? 0.24 : width < 390 ? 0.28 : 0.33,
      imageBottom: width < 360 ? 0.29 : width < 390 ? 0.33 : 0.38,
    };

    return Math.round(slideHeight * ratios[layout]);
  };

  const renderContent = (slide: HeroSlideData, index: number) => {
    const colors = themeColors[slide.theme];
    const alignmentStyle =
      slide.alignment === 'center'
        ? styles.copyCentered
        : slide.alignment === 'right'
          ? styles.copyRight
          : styles.copyLeft;
    const linksAlignmentStyle =
      slide.alignment === 'center'
        ? styles.linksCentered
        : slide.alignment === 'right'
          ? styles.linksRight
          : styles.linksLeft;

    return (
      <View style={[styles.copy, alignmentStyle]}>
        <Text style={[styles.category, { color: colors.accent }]}>
          {String(index + 1).padStart(2, '0')} / {slide.category}
        </Text>
        <View style={[styles.accentRule, { backgroundColor: colors.accent }]} />
        <Text
          style={[
            styles.headline,
            width < 360 ? styles.headlineSmall : styles.headlineRegular,
            { color: colors.headline, textAlign: slide.alignment },
          ]}>
          {slide.headline}
        </Text>
        <Text
          style={[
            styles.description,
            { color: colors.body, textAlign: slide.alignment },
          ]}>
          {slide.description}
        </Text>
        <View style={[styles.links, linksAlignmentStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={slide.exploreLabel}
            onPressIn={pauseAutoplay}
            onPressOut={resumeAutoplayAfterDelay}
            onPress={() => onExploreServices(slide.targetTab)}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={[styles.secondaryBtnText, { color: colors.headline }]}>
              {slide.exploreLabel}
            </Text>
            <View
              style={[
                styles.secondaryIconCircle,
                { backgroundColor: colors.accent + '1A' },
              ]}>
              <AppIcon name="arrow-up-right" size={11} color={colors.accent} />
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Book Care"
            onPressIn={pauseAutoplay}
            onPressOut={resumeAutoplayAfterDelay}
            onPress={() => onOpenBooking(slide.serviceTitle)}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.primaryBtnText}>Book Care</Text>
            <View style={styles.primaryIconCircle}>
              <AppIcon name="arrow-up-right" size={11} color={Colors.white} />
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderSlide = (slide: HeroSlideData, index: number) => {
    const colors = themeColors[slide.theme];
    const photoHeight = getPhotoHeight(slide.layout);
    const image = (
      <Image
        source={slide.image}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel={slide.imageLabel}
        style={[styles.image, { height: photoHeight }]}
      />
    );
    const copy = (
      <View
        style={[
          styles.copyArea,
          { backgroundColor: colors.background },
        ]}>
        {renderContent(slide, index)}
      </View>
    );

    return (
      <View
        key={slide.id}
        style={[
          styles.slide,
          {
            width,
            height: slideHeight,
            backgroundColor: colors.background,
          },
        ]}>
        {slide.layout === 'imageBottom' ? (
          <>
            {copy}
            {image}
          </>
        ) : (
          <>
            {image}
            {copy}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={pauseAutoplay}
        onScrollEndDrag={resumeAutoplayAfterDelay}
        onMomentumScrollEnd={event => {
          handleScroll(event);
          resumeAutoplayAfterDelay();
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={{ width, height: slideHeight }}>
        {HERO_SLIDES.map(renderSlide)}
      </ScrollView>

      <View style={styles.paginationRow}>
        {HERO_SLIDES.map((slide, index) => (
          <Pressable
            key={slide.id}
            accessibilityRole="button"
            accessibilityLabel={`Go to slide ${index + 1}: ${slide.category}`}
            accessibilityState={{ selected: activeIndex === index }}
            onPressIn={pauseAutoplay}
            onPressOut={resumeAutoplayAfterDelay}
            onPress={() => goToSlide(index)}
            style={styles.indicatorTarget}>
            <View
              style={[
                styles.indicator,
                activeIndex === index ? styles.indicatorActive : styles.indicatorInactive,
                { backgroundColor: activeIndex === index ? themeColors[slide.theme].accent : Colors.sageLight },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
  },
  slide: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    backgroundColor: Colors.creamDark,
  },
  copyArea: {
    flex: 1,
    justifyContent: 'center',
  },
  copy: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  copyLeft: {
    alignItems: 'flex-start',
  },
  copyCentered: {
    alignItems: 'center',
  },
  copyRight: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.7,
    marginBottom: 8,
  },
  accentRule: {
    width: 28,
    height: 2,
    marginBottom: 10,
  },
  headline: {
    width: '100%',
    maxWidth: 620,
    fontFamily: Fonts.serif,
    letterSpacing: -0.5,
    marginBottom: 8,
    flexShrink: 1,
  },
  headlineRegular: {
    fontSize: 32,
    lineHeight: 38,
  },
  headlineSmall: {
    fontSize: 29,
    lineHeight: 35,
  },
  description: {
    width: '100%',
    maxWidth: 560,
    fontSize: 13.5,
    lineHeight: 20,
    flexShrink: 1,
  },
  links: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  linksLeft: {
    justifyContent: 'flex-start',
  },
  linksCentered: {
    justifyContent: 'center',
  },
  linksRight: {
    justifyContent: 'flex-end',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(22, 40, 30, 0.14)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.terracotta,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 22,
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  indicatorTarget: {
    width: 36,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: 5,
    borderRadius: 3,
  },
  indicatorActive: {
    width: 22,
  },
  indicatorInactive: {
    width: 6,
  },
});
