import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors, { Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';
import { CommitmentDetailId } from '../data/commitmentDetails';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AppugePromiseProps {
  onOpenDetail: (detailId: CommitmentDetailId) => void;
}

interface PromiseCard {
  id: CommitmentDetailId;
  icon: string;
  title: string;
  desc: string;
}

const CARDS: PromiseCard[] = [
  {
    id: 'background-checks',
    icon: 'shield',
    title: 'Thorough Background Checks',
    desc: 'Every caregiver is verified before placement.',
  },
  {
    id: 'health-screened',
    icon: 'stethoscope',
    title: 'Health Screened',
    desc: 'Regular medical examinations and hygiene standards.',
  },
  {
    id: 'professionally-trained',
    icon: 'book',
    title: 'Professionally Trained',
    desc: 'Trained under maternal and newborn care guidelines.',
  },
  {
    id: 'compassionately-matched',
    icon: 'heart',
    title: 'Compassionately Matched',
    desc: 'Personally matched to your household and preferences.',
  },
];

const CARD_BACKGROUNDS = [
  Colors.sageTint ?? '#F0F6F2',
  Colors.sagePale ?? '#EAF2EC',
  Colors.sagePale ?? '#EAF2EC',
  Colors.sageTint ?? '#F0F6F2',
];

const STAGGER_DELAY = 120;
const ANIMATION_DURATION = 400;

export const AppugePromise: React.FC<AppugePromiseProps> = ({
  onOpenDetail,
}) => {
  const animatedValues = useRef<Animated.Value[]>(
    CARDS.map(() => new Animated.Value(0)),
  ).current;
  const pressScales = useRef<Animated.Value[]>(
    CARDS.map(() => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        delay: index * STAGGER_DELAY,
        useNativeDriver: true,
      }),
    );

    Animated.stagger(STAGGER_DELAY, animations).start();
  }, [animatedValues]);

  const renderCard = (index: number) => {
    const card = CARDS[index];
    if (!card) return null;

    const animatedStyle = {
      opacity: animatedValues[index],
      transform: [
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
        { scale: pressScales[index] },
      ],
    };

    const animateScale = (toValue: number) => {
      Animated.spring(pressScales[index], {
        toValue,
        useNativeDriver: true,
        speed: 24,
        bounciness: 4,
      }).start();
    };

    return (
      <AnimatedPressable
        key={card.id}
        style={[
          styles.card,
          { backgroundColor: CARD_BACKGROUNDS[index] },
          animatedStyle,
        ]}
        onPress={() => onOpenDetail(card.id)}
        onPressIn={() => animateScale(0.985)}
        onPressOut={() => animateScale(1)}
        onHoverIn={() => animateScale(1.015)}
        onHoverOut={() => animateScale(1)}
        accessibilityRole="button"
        accessibilityLabel={`${card.title}. ${card.desc}`}
        accessibilityHint="Opens detailed information about this commitment."
      >
        <View style={styles.iconCircle}>
          <AppIcon name={card.icon} size={22} color={Colors.forestDark} />
        </View>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardDesc}>{card.desc}</Text>
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.overline}>OUR COMMITMENT</Text>
        <Text style={styles.heading}>Care you can feel{'\n'}confident in.</Text>
        <Text style={styles.subtext} numberOfLines={2}>
          Every caregiver we place is carefully selected, trained, and
          personally matched to your family.
        </Text>
      </View>

      {/* 2×2 Grid */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          {renderCard(0)}
          {renderCard(1)}
        </View>
        <View style={styles.gridRow}>
          {renderCard(2)}
          {renderCard(3)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder ?? '#EDE5D8',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  header: {
    marginBottom: 20,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: '#5E7A63',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: '#16281E',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: Colors.textSecondary ?? '#475C50',
    lineHeight: 20,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 253, 249, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(22, 40, 30, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16281E',
    flexWrap: 'wrap',
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textSecondary ?? '#475C50',
    lineHeight: 16,
    marginTop: 4,
    flexWrap: 'wrap',
  },
});
