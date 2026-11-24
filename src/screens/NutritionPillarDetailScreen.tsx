import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors } from '../theme/colors';
import { NUTRITION_PILLARS, NutritionPillar } from '../data/nutritionPillars';
import { AppIcon } from '../components/common/AppIcon';
import { useAppInsets } from '../theme/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NutritionPillarDetailScreenProps {
  visible: boolean;
  pillarId: string | null;
  onClose: () => void;
  onSelectPillar: (pillarId: string) => void;
  onOpenBooking: (serviceTitle?: string) => void;
}

export const NutritionPillarDetailScreen: React.FC<NutritionPillarDetailScreenProps> = ({
  visible,
  pillarId,
  onClose,
  onSelectPillar,
  onOpenBooking,
}) => {
  const { top: topInset, bottom: bottomInset } = useAppInsets();
  const scrollRef = useRef<any>(null);

  // Scroll to top whenever pillarId changes
  useEffect(() => {
    if (visible && pillarId) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [pillarId, visible]);

  if (!pillarId) return null;

  const pillar: NutritionPillar | undefined = NUTRITION_PILLARS[pillarId];
  if (!pillar) return null;

  const relatedPillars = (pillar.relatedPillarIds || [])
    .map(id => NUTRITION_PILLARS[id])
    .filter(Boolean);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          {...({ translucent: true, backgroundColor: 'transparent' } as any)}
        />

        {/* 1. STICKY TOP NAVIGATION BAR */}
        <View style={[styles.topBar, { paddingTop: topInset + 6, paddingBottom: 12 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            activeOpacity={0.75}
            accessibilityLabel="Back to Nutrition">
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarBrand}>APPUGE NUTRITION</Text>
            <Text style={styles.topBarTitle} numberOfLines={1}>
              {pillar.title}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.75}
            accessibilityLabel="Close">
            <AppIcon name="close" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* 2. EDITORIAL SCROLL VIEW */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 100 }]}
          showsVerticalScrollIndicator={false}>
          {/* HERO IMAGE BANNER */}
          <View style={styles.heroContainer}>
            <Image
              source={pillar.heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
              <View style={styles.pillarTagBadge}>
                <AppIcon name="sparkle" size={12} color={Colors.goldWarm} />
                <Text style={styles.pillarTagText}>NUTRITIONAL PILLAR</Text>
              </View>
              <Text style={styles.heroHeadline}>{pillar.heroHeading}</Text>
              <Text style={styles.heroSubtitle}>{pillar.heroSubtitle}</Text>
            </View>
          </View>

          {/* META ATTRIBUTE BAR */}
          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>PILLAR</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {pillar.title}
              </Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>TRADITION</Text>
              <Text style={styles.metaValue}>Sutika Ahara</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>SERVICE</Text>
              <Text style={styles.metaValue}>Warm Delivery</Text>
            </View>
          </View>

          {/* A. OUR FOOD PHILOSOPHY */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.accentBar} />
              <View>
                <Text style={styles.sectionOverline}>PHILOSOPHY & ESSENCE</Text>
                <Text style={styles.sectionTitle}>{pillar.philosophyTitle}</Text>
              </View>
            </View>

            <View style={styles.philosophyCard}>
              {pillar.philosophyDesc.map((para, pIdx) => (
                <Text key={pIdx} style={styles.philosophyParagraph}>
                  {para}
                </Text>
              ))}
            </View>
          </View>

          {/* B. TRADITIONAL INGREDIENTS (IF PRESENT) */}
          {pillar.ingredients && pillar.ingredients.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionOverline}>MEDICINAL BOTANICALS & GRAINS</Text>
                  <Text style={styles.sectionTitle}>{pillar.ingredientsTitle}</Text>
                  {pillar.ingredientsSubtitle && (
                    <Text style={styles.sectionSubtitle}>{pillar.ingredientsSubtitle}</Text>
                  )}
                </View>
              </View>

              <View style={styles.ingredientsList}>
                {pillar.ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientCard}>
                    <View style={styles.ingredientHeader}>
                      <View style={styles.ingredientTitleRow}>
                        <View style={styles.ingredientDot} />
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                      </View>
                      {ing.regionalName && (
                        <View style={styles.regionalBadge}>
                          <Text style={styles.regionalBadgeText}>{ing.regionalName}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.ingDetailBlock}>
                      <Text style={styles.ingDetailLabel}>CULINARY USE:</Text>
                      <Text style={styles.ingDetailVal}>{ing.culinaryUse}</Text>
                    </View>

                    <View style={styles.ingDetailBlock}>
                      <Text style={styles.ingDetailLabel}>NUTRITIONAL ATTRIBUTES:</Text>
                      <Text style={styles.ingDetailVal}>{ing.nutritionalProfile}</Text>
                    </View>

                    <View style={styles.ingDetailBlock}>
                      <Text style={styles.ingDetailLabel}>HOW APPUGE USES IT:</Text>
                      <Text style={styles.ingDetailVal}>{ing.howUsed}</Text>
                    </View>

                    {ing.precaution && (
                      <View style={styles.precautionBox}>
                        <AppIcon name="shield" size={13} color={Colors.terracotta} />
                        <Text style={styles.precautionText}>{ing.precaution}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* C. WHY THESE INGREDIENTS / WHY WARM MEALS / GHEE APPLICATION */}
          {pillar.whyIngredientsList && pillar.whyIngredientsList.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>EVIDENCE & RATIONALE</Text>
                  <Text style={styles.sectionTitle}>{pillar.whyIngredientsTitle}</Text>
                </View>
              </View>

              <View style={styles.whyList}>
                {pillar.whyIngredientsList.map((item, idx) => (
                  <View key={idx} style={styles.whyCard}>
                    <View style={styles.whyHeaderRow}>
                      <View style={styles.whyIndexBadge}>
                        <Text style={styles.whyIndexText}>0{idx + 1}</Text>
                      </View>
                      <Text style={styles.whyTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.whyDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* D. KITCHEN APPROACH / BILONA CRAFTING PROCESS */}
          {pillar.kitchenApproachSteps && pillar.kitchenApproachSteps.length > 0 && (
            <View style={[styles.section, styles.darkForestSection]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.accentBar, { backgroundColor: Colors.goldWarm }]} />
                <View>
                  <Text style={[styles.sectionOverline, { color: Colors.goldPale }]}>
                    INTEGRITY & CRAFTSMANSHIP
                  </Text>
                  <Text style={[styles.sectionTitle, { color: Colors.creamLight }]}>
                    {pillar.kitchenApproachTitle}
                  </Text>
                </View>
              </View>

              <View style={styles.kitchenStepsList}>
                {pillar.kitchenApproachSteps.map((step, idx) => (
                  <View key={idx} style={styles.kitchenStepCard}>
                    <View style={styles.kitchenIconBox}>
                      <AppIcon name={step.icon} size={20} color={Colors.forestDark} />
                    </View>
                    <View style={styles.kitchenStepContent}>
                      <Text style={styles.kitchenStepTitle}>{step.title}</Text>
                      <Text style={styles.kitchenStepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* E. 4-STEP DELIVERY TIMELINE (WARM DELIVERY) */}
          {pillar.timeline && pillar.timeline.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionOverline}>FRESHNESS JOURNEY</Text>
                  <Text style={styles.sectionTitle}>{pillar.timelineTitle}</Text>
                  {pillar.timelineSubtitle && (
                    <Text style={styles.sectionSubtitle}>{pillar.timelineSubtitle}</Text>
                  )}
                </View>
              </View>

              <View style={styles.timelineList}>
                {pillar.timeline.map((item, idx) => (
                  <View key={idx} style={styles.timelineRow}>
                    <View style={styles.timelineLeftCol}>
                      <View style={styles.timelineBadge}>
                        <Text style={styles.timelineStepNumber}>{item.step}</Text>
                      </View>
                      {idx < pillar.timeline!.length - 1 && (
                        <View style={styles.timelineConnectingLine} />
                      )}
                    </View>

                    <View style={styles.timelineRightCol}>
                      <View style={styles.timelineCard}>
                        <View style={styles.timelineCardHeader}>
                          <Text style={styles.timelineCardTitle}>{item.title}</Text>
                          <View style={styles.timelineTimeBadge}>
                            <AppIcon name="clock" size={11} color={Colors.terracotta} />
                            <Text style={styles.timelineTimeText}>{item.time}</Text>
                          </View>
                        </View>
                        <Text style={styles.timelineCardDesc}>{item.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* F. PACKAGING STANDARDS */}
          {pillar.packagingPoints && pillar.packagingPoints.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>SAFETY & HYGIENE</Text>
                  <Text style={styles.sectionTitle}>{pillar.packagingTitle}</Text>
                </View>
              </View>

              <View style={styles.packagingGrid}>
                {pillar.packagingPoints.map((pkg, idx) => (
                  <View key={idx} style={styles.packagingCard}>
                    <View style={styles.packagingDot} />
                    <Text style={styles.packagingCardTitle}>{pkg.title}</Text>
                    <Text style={styles.packagingCardDesc}>{pkg.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* G. NUTRITIONAL PROFILE (PURE A2 GHEE) */}
          {pillar.nutritionalPoints && pillar.nutritionalPoints.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>BIOCHEMISTRY & WHOLE FOODS</Text>
                  <Text style={styles.sectionTitle}>{pillar.nutritionalProfileTitle}</Text>
                </View>
              </View>

              {pillar.nutritionalProfileDesc && (
                <Text style={styles.nutritionalDesc}>{pillar.nutritionalProfileDesc}</Text>
              )}

              <View style={styles.nutritionalGrid}>
                {(() => {
                  const points = pillar.nutritionalPoints || [];
                  return Array.from({ length: Math.ceil(points.length / 2) }).map((_, rowIdx) => {
                    const pt1 = points[rowIdx * 2];
                    const pt2 = points[rowIdx * 2 + 1];
                    return (
                      <View key={rowIdx} style={styles.nutritionalRow}>
                        <View style={styles.nutritionStatCard}>
                          <Text style={styles.nutritionStatVal}>{pt1.value}</Text>
                          <Text style={styles.nutritionStatLabel}>{pt1.label}</Text>
                          <Text style={styles.nutritionStatDesc}>{pt1.desc}</Text>
                        </View>
                        {pt2 ? (
                          <View style={styles.nutritionStatCard}>
                            <Text style={styles.nutritionStatVal}>{pt2.value}</Text>
                            <Text style={styles.nutritionStatLabel}>{pt2.label}</Text>
                            <Text style={styles.nutritionStatDesc}>{pt2.desc}</Text>
                          </View>
                        ) : (
                          <View style={[styles.nutritionStatCard, { opacity: 0 }]} />
                        )}
                      </View>
                    );
                  });
                })()}
              </View>
            </View>
          )}

          {/* H. QUALITY & SOURCING */}
          {pillar.qualityPoints && pillar.qualityPoints.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>TRANSPARENCY & PURITY</Text>
                  <Text style={styles.sectionTitle}>{pillar.qualityTitle}</Text>
                </View>
              </View>

              <View style={styles.qualityList}>
                {pillar.qualityPoints.map((q, idx) => (
                  <View key={idx} style={styles.qualityCard}>
                    <View style={styles.qualityHeaderRow}>
                      <AppIcon name="verified" size={16} color={Colors.forestMedium} />
                      <Text style={styles.qualityCardTitle}>{q.title}</Text>
                    </View>
                    <Text style={styles.qualityCardDesc}>{q.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* I. MEAL INSPIRATIONS */}
          {pillar.mealInspirationItems && pillar.mealInspirationItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>APPUGE KITCHEN SPECIALTIES</Text>
                  <Text style={styles.sectionTitle}>{pillar.mealInspirationTitle}</Text>
                </View>
              </View>

              <View style={styles.mealInspirationsList}>
                {pillar.mealInspirationItems.map((meal, idx) => (
                  <View key={idx} style={styles.mealCard}>
                    <View style={styles.mealCardTop}>
                      <View style={styles.mealTitleBlock}>
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                        <Text style={styles.mealSubtitle}>{meal.subtitle}</Text>
                      </View>
                      <View style={styles.mealHighlightBadge}>
                        <Text style={styles.mealHighlightText}>{meal.highlight}</Text>
                      </View>
                    </View>
                    <Text style={styles.mealDesc}>{meal.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* J. IMPORTANT CLINICAL / DIETARY ADVISORY */}
          <View style={styles.section}>
            <View style={styles.noticeBox}>
              <View style={styles.noticeHeaderRow}>
                <View style={styles.noticeIconBox}>
                  <AppIcon name="shield" size={18} color={Colors.terracotta} />
                </View>
                <Text style={styles.noticeTitle}>{pillar.importantNoticeTitle}</Text>
              </View>
              <Text style={styles.noticeBody}>{pillar.importantNoticeText}</Text>
            </View>
          </View>

          {/* K. RELATED CONTENT: "YOU MAY ALSO LIKE" */}
          {relatedPillars.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <View>
                  <Text style={styles.sectionOverline}>EXPLORE THE FOUNDATIONS</Text>
                  <Text style={styles.sectionTitle}>You May Also Like</Text>
                </View>
              </View>
              <Text style={styles.relatedSubtitle}>
                Discover how our four pillars unite to form complete maternal postpartum restoration.
              </Text>

              <View style={styles.relatedGrid}>
                {relatedPillars.map(rp => (
                  <TouchableOpacity
                    key={rp.id}
                    style={styles.relatedCard}
                    activeOpacity={0.88}
                    onPress={() => onSelectPillar(rp.id)}>
                    <Image
                      source={rp.heroImage}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.relatedOverlay} />
                    <View style={styles.relatedContent}>
                      <View style={styles.relatedPillarBadge}>
                        <Text style={styles.relatedPillarBadgeText}>PILLAR</Text>
                      </View>
                      <Text style={styles.relatedCardTitle}>{rp.title}</Text>
                      <Text style={styles.relatedCardDesc} numberOfLines={2}>
                        {rp.cardDesc}
                      </Text>
                      <View style={styles.exploreLinkRow}>
                        <Text style={styles.exploreLinkText}>Explore Pillar</Text>
                        <AppIcon name="arrow-right" size={13} color={Colors.goldPale} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* 3. STICKY BOTTOM FLOATING BAR WITH CTA */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(bottomInset, 16) }]}>
          <View style={styles.bottomBarLeft}>
            <Text style={styles.bottomBarOverline}>POSTPARTUM CARE SANCTUARY</Text>
            <Text style={styles.bottomBarTitle} numberOfLines={1}>
              {pillar.title}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryCtaBtn}
            activeOpacity={0.85}
            onPress={() => onOpenBooking(pillar.ctaService)}>
            <Text style={styles.primaryCtaBtnText}>{pillar.ctaText} ›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.forestDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.forestDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 20,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backBtnText: {
    color: Colors.creamLight,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  topBarCenter: {
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH * 0.52,
  },
  topBarBrand: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.goldPale,
    textTransform: 'uppercase',
  },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.creamLight,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // HERO BANNER
  heroContainer: {
    position: 'relative',
    height: 340,
    width: '100%',
    backgroundColor: Colors.forestDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 20, 14, 0.52)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
  },
  pillarTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(22, 40, 30, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    marginBottom: 10,
  },
  pillarTagText: {
    color: Colors.goldPale,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroHeadline: {
    fontSize: 27,
    fontFamily: 'serif',
    fontWeight: '700',
    color: Colors.creamLight,
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: 'rgba(255, 253, 249, 0.88)',
    lineHeight: 20,
  },

  // META BAR
  metaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.creamLight,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  metaCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestDark,
    textAlign: 'center',
  },

  // SECTION LAYOUTS
  section: {
    marginTop: 28,
    paddingHorizontal: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  accentBar: {
    width: 3.5,
    height: 32,
    backgroundColor: Colors.terracotta,
    borderRadius: 2,
    marginTop: 2,
  },
  sectionOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.sageDark,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: Colors.forestDark,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: Colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  // PHILOSOPHY CARD
  philosophyCard: {
    backgroundColor: Colors.creamLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 12,
  },
  philosophyParagraph: {
    fontSize: 13.5,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontFamily: 'serif',
  },

  // INGREDIENTS LIST
  ingredientsList: {
    gap: 12,
  },
  ingredientCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 8,
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamDark,
    paddingBottom: 10,
    marginBottom: 4,
  },
  ingredientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.terracotta,
  },
  ingredientName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  regionalBadge: {
    backgroundColor: Colors.sageLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  regionalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  ingDetailBlock: {
    gap: 2,
  },
  ingDetailLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.sageDark,
    letterSpacing: 0.8,
  },
  ingDetailVal: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  precautionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F0',
    borderLeftWidth: 3,
    borderLeftColor: Colors.terracotta,
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  precautionText: {
    flex: 1,
    fontSize: 11.5,
    color: '#9C3A1D',
    lineHeight: 16,
  },

  // WHY LIST
  whyList: {
    gap: 10,
  },
  whyCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 6,
  },
  whyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  whyIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.forestDark,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.forestDark,
    flex: 1,
  },
  whyDesc: {
    fontSize: 12.5,
    lineHeight: 19,
    color: Colors.textSecondary,
    paddingLeft: 36,
  },

  // KITCHEN DARK SECTION
  darkForestSection: {
    backgroundColor: Colors.forestDark,
    marginHorizontal: 0,
    paddingHorizontal: 18,
    paddingVertical: 26,
  },
  kitchenStepsList: {
    gap: 12,
  },
  kitchenStepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
  },
  kitchenIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitchenStepContent: {
    flex: 1,
    gap: 4,
  },
  kitchenStepTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.creamLight,
  },
  kitchenStepDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: 'rgba(255, 253, 249, 0.78)',
  },

  // TIMELINE
  timelineList: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeftCol: {
    width: 44,
    alignItems: 'center',
  },
  timelineBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineStepNumber: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.goldPale,
  },
  timelineConnectingLine: {
    width: 2,
    flex: 1,
    minHeight: 48,
    backgroundColor: Colors.sageLight,
    marginVertical: 4,
  },
  timelineRightCol: {
    flex: 1,
    paddingBottom: 16,
    paddingLeft: 8,
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 6,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.forestDark,
    flex: 1,
  },
  timelineTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timelineTimeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  timelineCardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  // PACKAGING
  packagingGrid: {
    gap: 10,
  },
  packagingCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.creamDark,
  },
  packagingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.forestMedium,
    marginBottom: 6,
  },
  packagingCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  packagingCardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  // NUTRITIONAL PROFILE
  nutritionalDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 14,
    fontFamily: 'serif',
  },
  nutritionalGrid: {
    gap: 10,
  },
  nutritionalRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  nutritionStatCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 3,
  },
  nutritionStatVal: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.terracotta,
  },
  nutritionStatLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  nutritionStatDesc: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // QUALITY LIST
  qualityList: {
    gap: 10,
  },
  qualityCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 6,
  },
  qualityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  qualityCardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  // MEAL INSPIRATION
  mealInspirationsList: {
    gap: 10,
  },
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    gap: 6,
  },
  mealCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  mealTitleBlock: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  mealSubtitle: {
    fontSize: 11.5,
    color: Colors.sageDark,
    fontWeight: '600',
    marginTop: 2,
  },
  mealHighlightBadge: {
    backgroundColor: Colors.sageLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mealHighlightText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  mealDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  // NOTICE BOX
  noticeBox: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(200, 109, 81, 0.35)',
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  noticeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noticeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.terracotta,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    flex: 1,
  },
  noticeBody: {
    fontSize: 12,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  // RELATED PILLARS
  relatedSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  relatedGrid: {
    gap: 14,
  },
  relatedCard: {
    position: 'relative',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.forestDark,
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 28, 20, 0.65)',
  },
  relatedContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  relatedPillarBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 160, 32, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.5)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  relatedPillarBadgeText: {
    color: Colors.goldPale,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  relatedCardTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '700',
    color: Colors.creamLight,
    marginBottom: 3,
  },
  relatedCardDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: 'rgba(255, 253, 249, 0.82)',
    marginBottom: 8,
  },
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  exploreLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.goldPale,
  },

  // BOTTOM FLOATING BAR
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.forestDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 30,
  },
  bottomBarLeft: {
    flex: 1,
    marginRight: 12,
  },
  bottomBarOverline: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.goldPale,
    letterSpacing: 1,
  },
  bottomBarTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.creamLight,
    marginTop: 2,
  },
  primaryCtaBtn: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryCtaBtnText: {
    color: Colors.white,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
