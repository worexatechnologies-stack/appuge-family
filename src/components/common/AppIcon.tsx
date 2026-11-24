import React from 'react';
import { View, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';

export type IconName =
  | 'shield'
  | 'stethoscope'
  | 'book'
  | 'heart'
  | 'mother'
  | 'baby'
  | 'nutrition'
  | 'soup'
  | 'tea'
  | 'doctor'
  | 'moon'
  | 'sun'
  | 'leaf'
  | 'sparkle'
  | 'star'
  | 'delivery'
  | 'phone'
  | 'whatsapp'
  | 'chat'
  | 'location'
  | 'calendar'
  | 'check'
  | 'close'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'bell'
  | 'user'
  | 'clock'
  | 'arrow-up-right'
  | 'arrow-right'
  | 'chevron-right'
  | 'verified'
  | string;

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Normalizes input: handles legacy emoji or aliases and maps them
 * to the corresponding luxury vector icon.
 */
function normalizeIconName(name: string): string {
  if (!name) return 'sparkle';
  const raw = name.trim();

  // Direct emoji mappings to clean icon keys
  switch (raw) {
    case '🛡️':
    case '🛡':
      return 'shield';
    case '🩺':
      return 'stethoscope';
    case '📚':
    case '📖':
      return 'book';
    case '❤️':
    case '♥':
      return 'heart';
    case '🌸':
    case '🤱':
    case '🌺':
    case '🪷':
      return 'mother';
    case '👶':
    case '🍼':
      return 'baby';
    case '🍵':
    case '🍲':
    case '🥣':
      return 'soup';
    case '🚗':
    case '🚚':
    case '🚀':
      return 'delivery';
    case '🌱':
    case '🌿':
      return 'leaf';
    case '✨':
    case '✦':
    case '✧':
      return 'sparkle';
    case '🌙':
    case '🌜':
      return 'moon';
    case '☀️':
    case '🌞':
      return 'sun';
    case '📞':
      return 'phone';
    case '💬':
    case '🗨️':
      return 'whatsapp';
    case '📍':
      return 'location';
    case '📅':
      return 'calendar';
    case '👁':
    case '👁️':
      return 'eye';
    case '🔒':
      return 'lock';
    case '🔔':
      return 'bell';
    case '👤':
      return 'user';
    case '✓':
    case '✔':
      return 'check';
    case '✕':
    case '✖':
    case '×':
      return 'close';
    case '★':
    case '⭐':
      return 'star';
    default:
      return raw.toLowerCase();
  }
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = Colors.forestDark,
  style,
}) => {
  const normalized = normalizeIconName(name);
  const stroke = Math.max(1.4, Math.round(size * 0.08 * 10) / 10);

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (normalized) {
    /* ── SHIELD (Police / Background Verification) ── */
    case 'shield':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.95,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.4,
              borderTopRightRadius: size * 0.4,
              borderBottomLeftRadius: size * 0.45,
              borderBottomRightRadius: size * 0.45,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Center Checkmark */}
            <View
              style={{
                width: size * 0.35,
                height: size * 0.2,
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: color,
                transform: [{ rotate: '-45deg' }],
                marginBottom: size * 0.08,
              }}
            />
          </View>
        </View>
      );

    /* ── STETHOSCOPE / CLINICAL SCREENING ── */
    case 'stethoscope':
      return (
        <View style={[containerStyle, style]}>
          {/* Outer circle frame */}
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Medical Cross */}
            <View
              style={{
                width: stroke * 1.4,
                height: size * 0.52,
                backgroundColor: color,
                borderRadius: stroke / 2,
                position: 'absolute',
              }}
            />
            <View
              style={{
                height: stroke * 1.4,
                width: size * 0.52,
                backgroundColor: color,
                borderRadius: stroke / 2,
                position: 'absolute',
              }}
            />
          </View>
        </View>
      );

    /* ── BOOK / PROFESSIONAL TRAINING ── */
    case 'book':
    case 'training':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.9,
              height: size * 0.75,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* Left Page */}
            <View
              style={{
                flex: 1,
                borderWidth: stroke,
                borderColor: color,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                borderRightWidth: stroke * 0.7,
                padding: 2,
                justifyContent: 'space-around',
              }}>
              <View style={{ height: stroke, backgroundColor: color, width: '70%' }} />
              <View style={{ height: stroke, backgroundColor: color, width: '85%' }} />
            </View>
            {/* Right Page */}
            <View
              style={{
                flex: 1,
                borderWidth: stroke,
                borderColor: color,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderLeftWidth: stroke * 0.7,
                padding: 2,
                justifyContent: 'space-around',
                alignItems: 'flex-end',
              }}>
              <View style={{ height: stroke, backgroundColor: color, width: '85%' }} />
              <View style={{ height: stroke, backgroundColor: color, width: '60%' }} />
            </View>
          </View>
        </View>
      );

    /* ── HEART / COMPASSION ── */
    case 'heart':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: size * 0.42,
                height: size * 0.65,
                borderRadius: size * 0.22,
                borderWidth: stroke,
                borderColor: color,
                borderBottomWidth: 0,
                position: 'absolute',
                left: size * 0.06,
                transform: [{ rotate: '-45deg' }],
              }}
            />
            <View
              style={{
                width: size * 0.42,
                height: size * 0.65,
                borderRadius: size * 0.22,
                borderWidth: stroke,
                borderColor: color,
                borderBottomWidth: 0,
                position: 'absolute',
                right: size * 0.06,
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>
        </View>
      );

    /* ── MOTHER / LOTUS / BLOSSOM ── */
    case 'mother':
    case 'lotus':
    case 'flower':
      return (
        <View style={[containerStyle, style]}>
          {/* Central upright petal */}
          <View
            style={{
              width: size * 0.36,
              height: size * 0.78,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.36,
              borderTopRightRadius: size * 0.36,
              borderBottomLeftRadius: size * 0.18,
              borderBottomRightRadius: size * 0.18,
              position: 'absolute',
            }}
          />
          {/* Left petal */}
          <View
            style={{
              width: size * 0.3,
              height: size * 0.6,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.3,
              borderTopRightRadius: size * 0.3,
              borderBottomLeftRadius: size * 0.15,
              borderBottomRightRadius: size * 0.15,
              position: 'absolute',
              left: size * 0.1,
              bottom: size * 0.15,
              transform: [{ rotate: '-35deg' }],
            }}
          />
          {/* Right petal */}
          <View
            style={{
              width: size * 0.3,
              height: size * 0.6,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.3,
              borderTopRightRadius: size * 0.3,
              borderBottomLeftRadius: size * 0.15,
              borderBottomRightRadius: size * 0.15,
              position: 'absolute',
              right: size * 0.1,
              bottom: size * 0.15,
              transform: [{ rotate: '35deg' }],
            }}
          />
        </View>
      );

    /* ── BABY / NEWBORN CARE ── */
    case 'baby':
    case 'cradle':
      return (
        <View style={[containerStyle, style]}>
          {/* Cute baby head outline */}
          <View
            style={{
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: size * 0.3,
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
            {/* Top curl */}
            <View
              style={{
                width: size * 0.14,
                height: size * 0.14,
                borderRadius: size * 0.07,
                borderTopWidth: stroke,
                borderRightWidth: stroke,
                borderColor: color,
                position: 'absolute',
                top: -size * 0.08,
              }}
            />
            {/* Gentle smile curve */}
            <View
              style={{
                width: size * 0.22,
                height: size * 0.12,
                borderBottomWidth: stroke,
                borderColor: color,
                borderRadius: size * 0.1,
                marginTop: size * 0.08,
              }}
            />
          </View>
          {/* Swaddle blanket arc at bottom */}
          <View
            style={{
              width: size * 0.82,
              height: size * 0.3,
              borderBottomWidth: stroke,
              borderLeftWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              borderBottomLeftRadius: size * 0.2,
              borderBottomRightRadius: size * 0.2,
              marginTop: -size * 0.08,
            }}
          />
        </View>
      );

    /* ── NUTRITION / SOUP / AYURVEDIC KITCHEN ── */
    case 'nutrition':
    case 'soup':
    case 'bowl':
      return (
        <View style={[containerStyle, style]}>
          {/* Steam wisps */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: size * 0.12,
              marginBottom: 2,
            }}>
            <View
              style={{
                width: stroke,
                height: size * 0.2,
                backgroundColor: color,
                borderRadius: stroke / 2,
                transform: [{ rotate: '-12deg' }],
              }}
            />
            <View
              style={{
                width: stroke,
                height: size * 0.24,
                backgroundColor: color,
                borderRadius: stroke / 2,
              }}
            />
            <View
              style={{
                width: stroke,
                height: size * 0.2,
                backgroundColor: color,
                borderRadius: stroke / 2,
                transform: [{ rotate: '12deg' }],
              }}
            />
          </View>
          {/* Bowl outline */}
          <View
            style={{
              width: size * 0.88,
              height: size * 0.44,
              borderWidth: stroke,
              borderColor: color,
              borderBottomLeftRadius: size * 0.44,
              borderBottomRightRadius: size * 0.44,
            }}
          />
          {/* Base foot */}
          <View
            style={{
              width: size * 0.38,
              height: stroke,
              backgroundColor: color,
              marginTop: 1,
            }}
          />
        </View>
      );

    /* ── TEA / KASHAYAM CUP ── */
    case 'tea':
    case 'kashayam':
    case 'cup':
      return (
        <View style={[containerStyle, style]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: size * 0.65,
                height: size * 0.6,
                borderWidth: stroke,
                borderColor: color,
                borderBottomLeftRadius: size * 0.25,
                borderBottomRightRadius: size * 0.25,
              }}
            />
            {/* Cup Handle */}
            <View
              style={{
                width: size * 0.2,
                height: size * 0.35,
                borderTopWidth: stroke,
                borderRightWidth: stroke,
                borderBottomWidth: stroke,
                borderColor: color,
                borderTopRightRadius: size * 0.15,
                borderBottomRightRadius: size * 0.15,
                marginLeft: -1,
              }}
            />
          </View>
          <View
            style={{
              width: size * 0.8,
              height: stroke,
              backgroundColor: color,
              marginTop: 2,
            }}
          />
        </View>
      );

    /* ── DOCTOR / SPECIALIST ── */
    case 'doctor':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.9,
              height: size * 0.9,
              borderRadius: 6,
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: stroke * 1.5,
                height: size * 0.5,
                backgroundColor: color,
                borderRadius: stroke / 2,
                position: 'absolute',
              }}
            />
            <View
              style={{
                height: stroke * 1.5,
                width: size * 0.5,
                backgroundColor: color,
                borderRadius: stroke / 2,
                position: 'absolute',
              }}
            />
          </View>
        </View>
      );

    /* ── MOON / NIGHT REST ── */
    case 'moon':
    case 'night':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              borderWidth: stroke,
              borderColor: color,
              borderRightWidth: 0,
              borderBottomWidth: 0,
              transform: [{ rotate: '-40deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderRadius: (size * 0.65) / 2,
                borderRightWidth: stroke,
                borderColor: color,
                marginLeft: size * 0.18,
              }}
            />
          </View>
        </View>
      );

    /* ── SUN / MORNING RITUAL ── */
    case 'sun':
    case 'morning':
      return (
        <View style={[containerStyle, style]}>
          {/* Center disk */}
          <View
            style={{
              width: size * 0.44,
              height: size * 0.44,
              borderRadius: (size * 0.44) / 2,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
          {/* 4 Cardinal Rays */}
          <View
            style={{
              position: 'absolute',
              width: stroke,
              height: size * 0.95,
              backgroundColor: color,
              opacity: 0.8,
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: stroke,
              width: size * 0.95,
              backgroundColor: color,
              opacity: 0.8,
            }}
          />
          {/* Diagonal Rays */}
          <View
            style={{
              position: 'absolute',
              width: stroke,
              height: size * 0.75,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }],
              opacity: 0.6,
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: stroke,
              width: size * 0.75,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }],
              opacity: 0.6,
            }}
          />
        </View>
      );

    /* ── LEAF / BOTANICAL ── */
    case 'leaf':
    case 'herbal':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.6,
              borderBottomRightRadius: size * 0.6,
              transform: [{ rotate: '45deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Center vein */}
            <View
              style={{
                width: stroke,
                height: '75%',
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );

    /* ── DELIVERY / TRANSPORT ── */
    case 'delivery':
    case 'van':
      return (
        <View style={[containerStyle, style]}>
          <View style={{ width: size * 0.9, height: size * 0.6 }}>
            {/* Van body */}
            <View
              style={{
                flex: 1,
                borderWidth: stroke,
                borderColor: color,
                borderTopRightRadius: size * 0.2,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: 3,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 1,
              }}>
              {/* Window */}
              <View
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  borderWidth: stroke * 0.7,
                  borderColor: color,
                  borderTopRightRadius: size * 0.15,
                }}
              />
            </View>
            {/* Wheels */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: size * 0.1,
                marginTop: -size * 0.08,
              }}>
              <View
                style={{
                  width: size * 0.2,
                  height: size * 0.2,
                  borderRadius: size * 0.1,
                  borderWidth: stroke,
                  borderColor: color,
                  backgroundColor: Colors.white,
                }}
              />
              <View
                style={{
                  width: size * 0.2,
                  height: size * 0.2,
                  borderRadius: size * 0.1,
                  borderWidth: stroke,
                  borderColor: color,
                  backgroundColor: Colors.white,
                }}
              />
            </View>
          </View>
        </View>
      );

    /* ── PHONE / CALL CARE TEAM ── */
    case 'phone':
    case 'call':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              transform: [{ rotate: '-35deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: size * 0.38,
                height: size * 0.7,
                borderWidth: stroke,
                borderColor: color,
                borderRadius: size * 0.16,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 2,
              }}>
              <View style={{ width: size * 0.12, height: stroke, backgroundColor: color }} />
              <View
                style={{
                  width: size * 0.12,
                  height: size * 0.12,
                  borderRadius: size * 0.06,
                  borderWidth: stroke * 0.7,
                  borderColor: color,
                }}
              />
            </View>
          </View>
        </View>
      );

    /* ── WHATSAPP / CHAT ── */
    case 'whatsapp':
    case 'chat':
    case 'message':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.75,
              borderWidth: stroke,
              borderColor: color,
              borderRadius: size * 0.35,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
            {/* Chat tail */}
            <View
              style={{
                width: size * 0.18,
                height: size * 0.18,
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: color,
                backgroundColor: Colors.creamLight,
                position: 'absolute',
                bottom: -size * 0.08,
                left: size * 0.16,
                transform: [{ rotate: '45deg' }],
              }}
            />
            {/* 3 Message Dots */}
            <View
              style={{
                flexDirection: 'row',
                gap: size * 0.08,
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: stroke * 1.3,
                  height: stroke * 1.3,
                  borderRadius: stroke,
                  backgroundColor: color,
                }}
              />
              <View
                style={{
                  width: stroke * 1.3,
                  height: stroke * 1.3,
                  borderRadius: stroke,
                  backgroundColor: color,
                }}
              />
              <View
                style={{
                  width: stroke * 1.3,
                  height: stroke * 1.3,
                  borderRadius: stroke,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        </View>
      );

    /* ── LOCATION / PIN ── */
    case 'location':
    case 'pin':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.35,
              borderTopRightRadius: size * 0.35,
              borderBottomLeftRadius: size * 0.35,
              transform: [{ rotate: '-45deg' }],
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -size * 0.1,
            }}>
            <View
              style={{
                width: size * 0.22,
                height: size * 0.22,
                borderRadius: size * 0.11,
                borderWidth: stroke,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );

    /* ── CALENDAR ── */
    case 'calendar':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.8,
              borderWidth: stroke,
              borderColor: color,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
            {/* Header bar */}
            <View
              style={{
                height: size * 0.25,
                backgroundColor: color,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                paddingTop: 1,
              }}>
              <View style={{ width: stroke, height: stroke * 2, backgroundColor: Colors.creamLight }} />
              <View style={{ width: stroke, height: stroke * 2, backgroundColor: Colors.creamLight }} />
            </View>
            {/* Grid dots */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: 2,
              }}>
              {[...Array(6)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: stroke,
                    height: stroke,
                    borderRadius: stroke / 2,
                    backgroundColor: color,
                    margin: 1.5,
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      );

    /* ── CHECK / VERIFIED ── */
    case 'check':
    case 'verified':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.3,
              borderBottomWidth: stroke * 1.3,
              borderLeftWidth: stroke * 1.3,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              marginTop: -size * 0.08,
            }}
          />
        </View>
      );

    /* ── CLOSE / DISMISS ── */
    case 'close':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.7,
              height: stroke * 1.2,
              backgroundColor: color,
              position: 'absolute',
              transform: [{ rotate: '45deg' }],
              borderRadius: stroke / 2,
            }}
          />
          <View
            style={{
              width: size * 0.7,
              height: stroke * 1.2,
              backgroundColor: color,
              position: 'absolute',
              transform: [{ rotate: '-45deg' }],
              borderRadius: stroke / 2,
            }}
          />
        </View>
      );

    /* ── LOCK / SECURITY ── */
    case 'lock':
      return (
        <View style={[containerStyle, style]}>
          {/* Shackle */}
          <View
            style={{
              width: size * 0.44,
              height: size * 0.35,
              borderTopLeftRadius: size * 0.22,
              borderTopRightRadius: size * 0.22,
              borderWidth: stroke,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -1,
            }}
          />
          {/* Lock body */}
          <View
            style={{
              width: size * 0.7,
              height: size * 0.5,
              borderWidth: stroke,
              borderColor: color,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: stroke * 1.4,
                height: stroke * 1.4,
                borderRadius: stroke,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );

    /* ── EYE / PASSWORD VISIBILITY ── */
    case 'eye':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.5,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.45,
              borderBottomRightRadius: size * 0.45,
              borderTopRightRadius: size * 0.1,
              borderBottomLeftRadius: size * 0.1,
              transform: [{ rotate: '-45deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: size * 0.24,
                height: size * 0.24,
                borderRadius: size * 0.12,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );

    case 'eye-off':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.5,
              borderWidth: stroke,
              borderColor: color,
              borderTopLeftRadius: size * 0.45,
              borderBottomRightRadius: size * 0.45,
              borderTopRightRadius: size * 0.1,
              borderBottomLeftRadius: size * 0.1,
              transform: [{ rotate: '-45deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: size * 0.24,
                height: size * 0.24,
                borderRadius: size * 0.12,
                backgroundColor: color,
              }}
            />
          </View>
          {/* Diagonal slash */}
          <View
            style={{
              position: 'absolute',
              width: size * 0.9,
              height: stroke,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );

    /* ── USER / PROFILE ── */
    case 'user':
    case 'profile':
      return (
        <View style={[containerStyle, style]}>
          {/* Head */}
          <View
            style={{
              width: size * 0.38,
              height: size * 0.38,
              borderRadius: (size * 0.38) / 2,
              borderWidth: stroke,
              borderColor: color,
              marginBottom: 1,
            }}
          />
          {/* Shoulders */}
          <View
            style={{
              width: size * 0.72,
              height: size * 0.35,
              borderTopLeftRadius: size * 0.35,
              borderTopRightRadius: size * 0.35,
              borderWidth: stroke,
              borderColor: color,
              borderBottomWidth: 0,
            }}
          />
        </View>
      );

    /* ── BELL / NOTIFICATIONS ── */
    case 'bell':
      return (
        <View style={[containerStyle, style]}>
          {/* Top handle */}
          <View
            style={{
              width: stroke,
              height: stroke * 2,
              backgroundColor: color,
              marginBottom: -1,
            }}
          />
          {/* Bell dome */}
          <View
            style={{
              width: size * 0.65,
              height: size * 0.55,
              borderTopLeftRadius: size * 0.32,
              borderTopRightRadius: size * 0.32,
              borderWidth: stroke,
              borderColor: color,
              borderBottomWidth: 0,
            }}
          />
          {/* Rim */}
          <View
            style={{
              width: size * 0.8,
              height: stroke,
              backgroundColor: color,
            }}
          />
          {/* Clapper */}
          <View
            style={{
              width: size * 0.2,
              height: size * 0.1,
              borderBottomLeftRadius: size * 0.1,
              borderBottomRightRadius: size * 0.1,
              backgroundColor: color,
              marginTop: 1,
            }}
          />
        </View>
      );

    /* ── SPARKLE / LUXURY ACCENT (✦) ── */
    case 'sparkle':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.9,
              color,
              lineHeight: size,
              textAlign: 'center',
            }}>
            ✦
          </Text>
        </View>
      );

    /* ── STAR (★) ── */
    case 'star':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.9,
              color,
              lineHeight: size,
              textAlign: 'center',
            }}>
            ★
          </Text>
        </View>
      );

    /* ── ARROWS ── */
    case 'arrow-up-right':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.9,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            ↗
          </Text>
        </View>
      );

    case 'arrow-right':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.9,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            →
          </Text>
        </View>
      );

    case 'arrow-left':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.9,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            ←
          </Text>
        </View>
      );

    case 'chevron-right':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.95,
              color,
              fontWeight: '600',
              lineHeight: size,
              textAlign: 'center',
            }}>
            ›
          </Text>
        </View>
      );

    case 'chevron-down':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.8,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            ▾
          </Text>
        </View>
      );

    /* ── E-COMMERCE: SEARCH ── */
    case 'search':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.85,
              position: 'relative',
            }}>
            <View
              style={{
                width: size * 0.58,
                height: size * 0.58,
                borderRadius: (size * 0.58) / 2,
                borderWidth: stroke,
                borderColor: color,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: size * 0.35,
                height: stroke,
                backgroundColor: color,
                borderRadius: stroke / 2,
                transform: [{ rotate: '45deg' }],
                transformOrigin: 'left center',
              }}
            />
          </View>
        </View>
      );

    /* ── E-COMMERCE: CART / SHOPPING BAG ── */
    case 'cart':
    case 'bag':
    case 'shopping-bag':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.95,
              alignItems: 'center',
            }}>
            {/* Bag Handle */}
            <View
              style={{
                width: size * 0.38,
                height: size * 0.28,
                borderTopLeftRadius: size * 0.19,
                borderTopRightRadius: size * 0.19,
                borderWidth: stroke,
                borderBottomWidth: 0,
                borderColor: color,
                marginBottom: -1,
              }}
            />
            {/* Bag Body */}
            <View
              style={{
                width: size * 0.8,
                height: size * 0.65,
                borderWidth: stroke,
                borderColor: color,
                borderRadius: 3,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: size * 0.26,
                  height: stroke,
                  backgroundColor: color,
                  opacity: 0.5,
                }}
              />
            </View>
          </View>
        </View>
      );

    /* ── E-COMMERCE: PACKAGE / ORDERS ── */
    case 'package':
    case 'orders':
    case 'box':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.85,
              borderWidth: stroke,
              borderColor: color,
              borderRadius: 3,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Top flap line */}
            <View
              style={{
                position: 'absolute',
                top: size * 0.24,
                left: 0,
                right: 0,
                height: stroke * 0.8,
                backgroundColor: color,
              }}
            />
            {/* Vertical tape */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: size * 0.2,
                borderLeftWidth: stroke * 0.8,
                borderRightWidth: stroke * 0.8,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );

    /* ── E-COMMERCE: TRASH / REMOVE ── */
    case 'trash':
    case 'delete':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.88,
              alignItems: 'center',
            }}>
            {/* Lid */}
            <View
              style={{
                width: size * 0.72,
                height: stroke,
                backgroundColor: color,
                marginBottom: 2,
              }}
            />
            {/* Can Body */}
            <View
              style={{
                width: size * 0.58,
                height: size * 0.65,
                borderWidth: stroke,
                borderTopWidth: 0,
                borderColor: color,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingVertical: 2,
              }}>
              <View style={{ width: stroke * 0.8, height: '70%', backgroundColor: color }} />
              <View style={{ width: stroke * 0.8, height: '70%', backgroundColor: color }} />
            </View>
          </View>
        </View>
      );

    /* ── E-COMMERCE: PLUS / MINUS ── */
    case 'plus':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.95,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            +
          </Text>
        </View>
      );

    case 'minus':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.95,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            −
          </Text>
        </View>
      );

    /* ── E-COMMERCE: TAG / DISCOUNT ── */
    case 'tag':
    case 'discount':
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.85,
              color,
              fontWeight: '700',
              lineHeight: size,
              textAlign: 'center',
            }}>
            🏷
          </Text>
        </View>
      );

    /* ── E-COMMERCE: FILTER ── */
    case 'filter':
      return (
        <View style={[containerStyle, style]}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.7,
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: stroke, backgroundColor: color }} />
              <View
                style={{
                  width: stroke * 3,
                  height: stroke * 3,
                  borderRadius: stroke * 1.5,
                  backgroundColor: color,
                  marginLeft: 4,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: stroke * 3,
                  height: stroke * 3,
                  borderRadius: stroke * 1.5,
                  backgroundColor: color,
                  marginRight: 4,
                }}
              />
              <View style={{ flex: 1, height: stroke, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );

    /* ── FALLBACK ── */
    default:
      return (
        <View style={[containerStyle, style]}>
          <Text
            style={{
              fontSize: size * 0.8,
              color,
              lineHeight: size,
              textAlign: 'center',
            }}>
            ✦
          </Text>
        </View>
      );
  }
};

export default AppIcon;
