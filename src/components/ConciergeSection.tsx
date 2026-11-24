import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Colors, { Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';

interface ConciergeSectionProps {
  user?: { name: string; phone: string } | null;
}

export const ConciergeSection: React.FC<ConciergeSectionProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      {/* Decorative Ornament */}
      <View style={styles.ornamentRow}>
        <View style={styles.ornamentLine} />
        <Text style={styles.ornamentDiamond}>◆</Text>
        <View style={styles.ornamentLine} />
      </View>

      {/* Overline */}
      <Text style={styles.overline}>YOUR CARE PARTNER</Text>

      {/* Heading */}
      <Text style={styles.heading}>{"You're not alone\non this journey."}</Text>

      {/* Subtext */}
      <Text style={styles.subtext}>
        {"Let's find the right care for your family. Our team is here to listen and guide you, every step of the way."}
      </Text>

      {/* Contact Detail */}
      <View style={styles.contactRow}>
        <AppIcon name="location" size={13} color={Colors.sage} />
        <Text style={styles.contactDetail}>Bangalore, Karnataka · +91 91872 32968</Text>
      </View>

      {/* Call Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => Linking.openURL('tel:+919187232968')}
        activeOpacity={0.85}
      >
        <View style={styles.btnContentRow}>
          <AppIcon name="phone" size={16} color={Colors.forestDark} />
          <Text style={styles.primaryButtonText}>Speak With Our Care Team</Text>
        </View>
      </TouchableOpacity>

      {/* Gap */}
      <View style={styles.buttonGap} />

      {/* WhatsApp Button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          Linking.openURL(
            'https://wa.me/919187232968?text=Hi%20Appuge%20Care!%20I%20would%20like%20to%20enquire%20about%20your%20maternal%20care%20services.'
          )
        }
        activeOpacity={0.85}
      >
        <View style={styles.btnContentRow}>
          <AppIcon name="whatsapp" size={16} color={Colors.creamLight} />
          <Text style={styles.secondaryButtonText}>WhatsApp Concierge</Text>
        </View>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footerNote}>Typically responds within 2 hours</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 44,
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  ornamentLine: {
    width: 24,
    height: 1,
    backgroundColor: Colors.sage,
    opacity: 0.4,
  },
  ornamentDiamond: {
    color: Colors.goldWarm,
    fontSize: 10,
    marginHorizontal: 8,
  },
  overline: {
    color: Colors.sage,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.creamLight,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    color: 'rgba(255,253,249,0.72)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  contactDetail: {
    color: Colors.sage,
    fontSize: 12,
    textAlign: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.creamLight,
    borderRadius: 26,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.forestDark,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonGap: {
    height: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,253,249,0.35)',
    borderRadius: 26,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.creamLight,
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    color: Colors.sage,
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
});
