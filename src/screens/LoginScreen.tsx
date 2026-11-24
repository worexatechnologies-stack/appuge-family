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

interface LoginScreenProps {
  onLoginSuccess: (userData: { name: string; phone: string }) => void;
  onNavigateToRegister: () => void;
  onSkip: () => void;
  redirectMessage?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onSkip,
  redirectMessage,
}) => {
  const { bottom: bottomInset } = useAppInsets();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!phoneOrEmail.trim()) {
      Alert.alert('Required Field', 'Please enter your mobile number or email address.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Required Field', 'Please enter your password.');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Invalid Password', 'Password must be at least 4 characters long.');
      return;
    }

    // Login successful
    onLoginSuccess({
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Parent',
      phone: phoneOrEmail,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top Navigation bar */}
        <View style={styles.navBar}>
          <View style={styles.placeholder} />
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Explore as Guest →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(36, bottomInset + 24) },
          ]}
          showsVerticalScrollIndicator={false}>
          {redirectMessage && (
            <View style={styles.redirectBanner}>
              <AppIcon name="lock" size={14} color={Colors.sageDark} style={{ marginRight: 6 }} />
              <Text style={styles.redirectBannerText}>{redirectMessage}</Text>
            </View>
          )}

          {/* Logo & Greeting */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>appuge</Text>
            <Text style={styles.greetingTitle}>Welcome to Sanctuary</Text>
            <Text style={styles.greetingSubtitle}>
              Sign in to manage your in-home maternity rituals, newborn care,
              and Ayurvedic nutrition in Bangalore.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Mobile / Email Field */}
            <Text style={styles.fieldLabel}>Mobile Number or Email *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. 9876543210 or name@example.com"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={phoneOrEmail}
                onChangeText={setPhoneOrEmail}
              />
            </View>

            {/* Password Field */}
            <View style={styles.passwordSection}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password *</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Reset Password',
                      'Password reset instructions have been sent to your registered contact.',
                    )
                  }>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel="Toggle password visibility">
                  <AppIcon
                    name={showPassword ? 'eye' : 'lock'}
                    size={18}
                    color={Colors.sage}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.85}>
              <View style={styles.submitBtnContent}>
                <Text style={styles.submitButtonText}>Sign In</Text>
                <Text style={styles.submitArrow}>↗</Text>
              </View>
            </TouchableOpacity>

            {/* WhatsApp Quick Login option */}
            <TouchableOpacity
              style={styles.whatsAppButton}
              onPress={() => {
                onLoginSuccess({
                  name: 'Ananya (Mother)',
                  phone: '+91 91872 32968',
                });
              }}
              activeOpacity={0.85}>
              <View style={styles.whatsAppBtnContent}>
                <AppIcon name="whatsapp" size={16} color={Colors.forestDark} />
                <Text style={styles.whatsAppButtonText}>
                  Quick Sign-In via WhatsApp
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Switch to Register Screen */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>New to Appuge?</Text>
            <TouchableOpacity
              onPress={onNavigateToRegister}
              style={styles.registerLink}>
              <Text style={styles.registerLinkText}> Create an Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.privacyNote}>
            By signing in, you agree to Appuge Care Terms of Service & Privacy
            Policy. Dedicated in-home postpartum care across Bangalore.
          </Text>
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
  placeholder: {
    width: 40,
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
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  redirectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blushLight,
    borderWidth: 1,
    borderColor: Colors.terracotta,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    marginTop: 4,
  },
  redirectBannerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  redirectBannerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.forestDark,
    lineHeight: 17,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 90,
    height: 90,
  },
  brandTitle: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Colors.forestDark,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  greetingTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.forestDark,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.forestDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.forestDark,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textDark,
  },
  passwordSection: {
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    color: Colors.sageDark,
    fontWeight: '600',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 14,
  },
  passwordInput: {
    paddingVertical: 12,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  eyeIcon: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.sageDark,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: Colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  submitArrow: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  whatsAppButton: {
    backgroundColor: Colors.sagePale,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  whatsAppBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsAppButtonText: {
    color: Colors.forestDark,
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerPrompt: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  registerLink: {
    paddingVertical: 4,
  },
  registerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.sageDark,
  },
  privacyNote: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

export default LoginScreen;
