import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Colors, { Fonts } from '../theme/colors';

interface CareDiscoveryProps {
  onNavigateTab: (tab: 'home' | 'services' | 'nutrition' | 'doctors' | 'faqs') => void;
}

const tiles = [
  {
    num: '01',
    title: 'Mother Care',
    category: 'Post-Pregnancy',
    tab: 'services' as const,
    image: require('../assets/images/04.jpg'),
    height: 175,
  },
  {
    num: '02',
    title: 'Baby Care',
    category: 'Newborn Wellness',
    tab: 'services' as const,
    image: require('../assets/images/05.jpg'),
    height: 150,
  },
  {
    num: '03',
    title: 'Ayurvedic\nNutrition',
    category: 'Healing Kitchen',
    tab: 'nutrition' as const,
    image: require('../assets/images/nutrition_hero.png'),
    height: 155,
  },
  {
    num: '04',
    title: 'Expert Doctors',
    category: 'Clinical Care',
    tab: 'doctors' as const,
    image: require('../assets/images/03.jpg'),
    height: 170,
  },
];

export const CareDiscovery: React.FC<CareDiscoveryProps> = ({ onNavigateTab }) => {
  const animValues = useRef(
    tiles.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(16),
    }))
  ).current;

  useEffect(() => {
    const animations = animValues.map((anim) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(80, animations).start();
  }, []);

  const renderTile = (index: number) => {
    const tile = tiles[index];
    if (!tile) return null;

    return (
      <Animated.View
        key={tile.num}
        style={[
          styles.tileAnimatedWrap,
          {
            opacity: animValues[index].opacity,
            transform: [{ translateY: animValues[index].translateY }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onNavigateTab(tile.tab)}
          style={[styles.tile, { height: tile.height }]}
        >
          {/* Background Image */}
          <Image
            source={tile.image}
            style={styles.tileImage}
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <View style={styles.overlayOuter}>
            <View style={styles.overlayInner} />
          </View>

          {/* Top-left: editorial number */}
          <Text style={styles.tileNumber}>{tile.num}</Text>

          {/* Top-right: category label */}
          <Text style={styles.tileCategory}>{tile.category}</Text>

          {/* Bottom content */}
          <View style={styles.tileBottom}>
            <Text style={styles.tileTitle}>{tile.title}</Text>
            <Text style={styles.tileArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.overline}>OUR OFFERINGS</Text>
      <Text style={styles.heading}>{'Care, in your\nown rhythm.'}</Text>

      {/* 2x2 Grid */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          {renderTile(0)}
          {renderTile(1)}
        </View>
        <View style={styles.gridRow}>
          {renderTile(2)}
          {renderTile(3)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cream,
    paddingTop: 0,
  },
  overline: {
    color: Colors.sage,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.forestDark,
    lineHeight: 32,
    marginBottom: 20,
  },
  grid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  tileAnimatedWrap: {
    flex: 1,
  },
  tile: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  tileImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlayOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: '#0D1A11',
    opacity: 0.4,
    justifyContent: 'flex-end',
  },
  overlayInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0D1A11',
    opacity: 0.6,
  },
  tileNumber: {
    position: 'absolute',
    top: 10,
    left: 12,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tileCategory: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#FFFFFF',
    fontSize: 8,
    letterSpacing: 1.2,
    fontWeight: '600',
    opacity: 0.9,
    textTransform: 'uppercase',
    maxWidth: 70,
    textAlign: 'right',
  },
  tileBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  tileTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.serif,
    lineHeight: 19,
  },
  tileArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
});

export default CareDiscovery;
