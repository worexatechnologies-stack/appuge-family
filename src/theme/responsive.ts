import { Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const { height: SCREEN_REAL_HEIGHT } = Dimensions.get('screen');

export const SCREEN_WIDTH = WINDOW_WIDTH;
export const SCREEN_HEIGHT = WINDOW_HEIGHT;

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

/**
 * Responsive scale utility based on standard 375pt mobile layout
 */
export const scale = (size: number) => (SCREEN_WIDTH / 375) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * Returns normalized safe area insets guaranteed to work on both Android & iOS,
 * accounting for status bar, notches, camera punch-holes, Dynamic Island,
 * 3-button navigation bars, and gesture indicators.
 */
export function useAppInsets() {
  const insets = useSafeAreaInsets();
  const initInsets = initialWindowMetrics?.insets;

  // On Android, modern cutout / punch-hole status bar is at least 32dp
  const androidStatusBarHeight = Math.max(StatusBar.currentHeight || 28, 32);

  const top = Math.max(
    insets.top || 0,
    initInsets?.top || 0,
    Platform.OS === 'android' ? androidStatusBarHeight : (Platform.OS === 'ios' ? 44 : 24),
  );

  // On Android, respect device insets provided by react-native-safe-area-context.
  // When system buttons are rendered outside the window (standard mode), insets.bottom is 0,
  // so we keep a clean, elegant baseline (12dp) without creating awkward dead whitespace.
  const androidBottom = insets.bottom > 0 ? insets.bottom : (initInsets?.bottom || 12);

  const iosBottom = insets.bottom > 0 ? insets.bottom : (initInsets?.bottom || 20);

  const bottom = Platform.OS === 'android' ? androidBottom : iosBottom;

  return {
    top,
    bottom,
    left: insets.left || initInsets?.left || 0,
    right: insets.right || initInsets?.right || 0,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  };
}
