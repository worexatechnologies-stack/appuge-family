import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { AppIcon } from '../components/common/AppIcon';
import { useAppInsets } from '../theme/responsive';

interface RegisterScreenProps {
  onRegisterSuccess: (userData: {
    name: string;
    phone: string;
    stage: string;
    location: string;
  }) => void;
  onNavigateToLogin: () => void;
  onSkip: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onSkip,
}) => {
  const { bottom: bottomInset } = useAppInsets();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('Expecting Mother');
  const [location, setLocation] = useState('Indiranagar');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const stages = [
    'Expecting Mother',
    'Newborn (0-3 Months)',
    'Postpartum Recovery',
    'Father / Family Member',
  ];

  const bangaloreLocations = [
    'Indiranagar',
    'Koramangala',
    'HSR Layout',
    'Whitefield',
    'Jayanagar',
    'JP Nagar',
    'Electronic City',
    'Hebbal / North BLR',
    'Sarjapur Road',
  ];

  const handleRegister = () => {
    if (!fullName.trim()) {
      Alert.alert('Required', "Please enter mother's or parent's name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Password Required', 'Password must be at least 6 characters long.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Agreement', 'Please agree to the privacy policy to continue.');
      return;
    }

    onRegisterSuccess({
      name: fullName,
      phone,
      stage,
      location,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onNavigateToLogin} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Explore as Guest →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(40, bottomInset + 24) },
          ]}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Join Appuge Sanctuary</Text>
            <Text style={styles.headerSubtitle}>
              Personalized in-home postnatal care, newborn baby nursing, and
              Ayurvedic nutrition in Bangalore.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Full Name */}
            <Text style={styles.fieldLabel}>Mother's / Parent's Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ananya Sharma"
              placeholderTextColor={Colors.textLight}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Mobile Number */}
            <Text style={styles.fieldLabel}>Mobile Number (+91) *</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>+91</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="98765 43210"
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Email Address */}
            <Text style={styles.fieldLabel}>Email Address (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="ananya@example.com"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Stage / Journey */}
            <Text style={styles.fieldLabel}>Your Current Journey Stage *</Text>
            <View style={styles.chipsWrap}>
              {stages.map(st => (
                <TouchableOpacity
                  key={st}
                  style={[styles.chip, stage === st && styles.chipActive]}
                  onPress={() => setStage(st)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.chipText,
                      stage === st && styles.chipTextActive,
                    ]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bangalore Area */}
            <Text style={styles.fieldLabel}>Bangalore Neighborhood *</Text>
            <View style={styles.chipsWrap}>
              {bangaloreLocations.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.chip, location === loc && styles.chipActive]}
                  onPress={() => setLocation(loc)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.chipText,
                      location === loc && styles.chipTextActive,
                    ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Password */}
            <Text style={styles.fieldLabel}>Create Password *</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textLight}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}>
                <AppIcon
                  name={showPassword ? 'eye' : 'lock'}
                  size={18}
                  color={Colors.sage}
                />
              </TouchableOpacity>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}>
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <AppIcon name="check" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to Appuge's compassionate care guidelines, privacy
                policy & terms of service.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.85}>
              <View style={styles.registerBtnContent}>
                <Text style={styles.registerButtonText}>
                  Create Account & Begin Journey
                </Text>
                <Text style={styles.registerArrow}>↗</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLinkText}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  keyboardView: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.sageDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  headerLogo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    color: Colors.textDark,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  prefixBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.cardBorder,
    borderRightWidth: 1,
    borderRightColor: Colors.cardBorder,
  },
  prefixText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.forestDark,
  },
  phoneInput: {
    borderWidth: 0,
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: Colors.sageDark,
    borderColor: Colors.sageDark,
  },
  chipText: {
    fontSize: 11.5,
    color: Colors.forest,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eyeIcon: {
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.sageDark,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.sageDark,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11.5,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  registerButton: {
    backgroundColor: Colors.sageDark,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  registerBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  registerArrow: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.sageDark,
  },
});

export default RegisterScreen;
