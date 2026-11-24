import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 260;

export interface HeroSlideData {
  id: string;
  tag: string;
  headline: string;
  sub: string;
  badge: string;
  image: any;
}

interface HeroBannerProps {
  slides: HeroSlideData[];
  onOpenBooking?: (serviceTitle?: string) => void;
  onExploreServices: () => void;
  showBookButton?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides,
  onOpenBooking,
  onExploreServices,
  showBookButton = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);
  const isInteracting = useRef(false);

  // Auto-slide every 5 seconds if user is not actively scrolling
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isInteracting.current && slides.length > 1) {
        const nextIndex = (activeIndex + 1) % slides.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * CARD_WIDTH,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex, slides.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    if (index >= 0 && index < slides.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleScrollBegin = () => {
    isInteracting.current = true;
  };

  const handleScrollEnd = () => {
    setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  };

  const scrollToSlide = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}>
        {slides.map(slide => (
          <View key={slide.id} style={styles.cardContainer}>
            <Image
              source={slide.image}
              style={styles.bannerImage}
              resizeMode="cover"
            />

            {/* Clean content overlay floating directly on the photo */}
            <View style={styles.contentOverlay}>
              {/* Top Row: Pure text with shadow */}
              <View style={styles.topRow}>
                <Text style={styles.badgeText}>
                  ✦ {slide.badge.toUpperCase()}
                </Text>
                <Text style={styles.tagText}>{slide.tag}</Text>
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomSection}>
                <Text style={styles.headline}>"{slide.headline}"</Text>
                <Text style={styles.subText} numberOfLines={2}>
                  {slide.sub}
                </Text>

                <View style={styles.bottomRow}>
                  {showBookButton && onOpenBooking && (
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => onOpenBooking(slide.tag)}
                      activeOpacity={0.85}>
                      <Text style={styles.primaryBtnText}>Book Consultation</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.exploreBtn}
                    onPress={onExploreServices}
                    activeOpacity={0.85}>
                    <Text style={styles.exploreBtnText}>
                      Explore Care Offerings ›
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Indicator Dots */}
      <View style={styles.paginationRow}>
        {slides.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => scrollToSlide(i)}
            style={[
              styles.dot,
              activeIndex === i ? styles.dotActive : styles.dotInactive,
            ]}
            accessibilityLabel={`Go to slide ${i + 1}`}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    backgroundColor: Colors.forestDark,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  contentOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: 18,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  bottomSection: {
    backgroundColor: 'transparent',
  },
  headline: {
    fontFamily: 'Georgia',
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 5,
    maxWidth: '70%',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 16,
    marginBottom: 10,
    maxWidth: '70%',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.sageDark,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  exploreBtn: {
    backgroundColor: Colors.sageDark,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.sageDark,
  },
  dotInactive: {
    width: 6,
    backgroundColor: Colors.sageLight,
  },
});
