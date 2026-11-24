import { Platform } from 'react-native';

export const Fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif' }) || 'serif',
};

export const Colors = {
  // Primary Palette
  cream: '#FAF4EB',
  creamLight: '#FFFDF9',
  creamDark: '#F2E8DC',
  surfaceCard: '#FFFFFF',
  surfaceMuted: '#F7F3EB',
  
  // Greens / Botanical
  forestDark: '#16281E',
  forest: '#2C4035',
  forestMedium: '#385244',
  sageDark: '#3A5A40',
  sage: '#5E7A63',
  sageLight: '#CAD2C5',
  sagePale: '#EAF2EC',
  sageTint: '#F0F6F2',

  // Warm Accents
  blush: '#D4A373',
  blushLight: '#FDF2E9',
  blushPale: '#FCEFE6',
  terracotta: '#C86D51',
  terracottaLight: '#FCECE8',
  goldWarm: '#E8A020',
  goldPale: '#FDF6E8',

  // Text Hierarchy
  textPrimary: '#18241D',
  textDark: '#18241D',
  textSecondary: '#475C50',
  textMuted: '#748A7D',
  textLight: '#9EAEA4',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  cardBorder: '#EDE5D8',
  cardBorderLight: '#F3EDE2',
  divider: '#E5DDCF',
  
  // Status
  success: '#38A169',
  successLight: '#E6FFFA',
  warning: '#DD6B20',

  white: '#FFFFFF',
  black: '#000000',
};

export default Colors;
