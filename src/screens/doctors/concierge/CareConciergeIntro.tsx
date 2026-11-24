import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  onBegin: () => void;
}

export const CareConciergeIntro: React.FC<Props> = ({ onBegin }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Full-width editorial photography */}
        <View style={styles.heroWrap}>
          <Image
            source={require('../../../assets/images/01.jpg')}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <View style={styles.scrim} />
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>PERSONALIZED CARE DISCOVERY</Text>
          </View>
        </View>

        {/* Text narrative block */}
        <View style={styles.contentBlock}>
          <Text style={styles.headline}>Let's find the care you need.</Text>
          <Text style={styles.supporting}>
            A few simple choices will help us find the right specialists for your family.
          </Text>

          <View style={styles.highlightList}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightCheck}>✓</Text>
              <Text style={styles.highlightText}>
                Strictly verified medical council practitioners
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightCheck}>✓</Text>
              <Text style={styles.highlightText}>
                Matched to your specific maternal or child milestone
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightCheck}>✓</Text>
              <Text style={styles.highlightText}>
                Both unhurried video & local Bengaluru clinic visits
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.88}
          onPress={onBegin}>
          <Text style={styles.primaryBtnText}>Begin your journey</Text>
          <Text style={styles.primaryBtnArrow}>→</Text>
        </TouchableOpacity>
        <Text style={styles.bottomSubtext}>Takes less than a minute.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroWrap: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 40, 30, 0.22)',
  },
  pillBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#16281E',
  },
  contentBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#16281E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 10,
    lineHeight: 36,
  },
  supporting: {
    fontSize: 15,
    color: '#5E7A63',
    lineHeight: 22,
    marginBottom: 24,
  },
  highlightList: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C4035',
    marginRight: 10,
  },
  highlightText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 48 : 16,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#16281E',
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.5,
  },
  primaryBtnArrow: {
    fontSize: 16,
    color: '#FFFDF9',
    fontWeight: '700',
  },
  bottomSubtext: {
    fontSize: 12,
    color: '#8C6239',
    marginTop: 8,
    fontWeight: '600',
  },
});
