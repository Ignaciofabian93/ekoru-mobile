/**
 * EKORU Design Tokens
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for all design values used in:
 *   • React Native StyleSheet  →  import { tokens } from "@/design/tokens"
 *   • NativeWind (Tailwind)    →  tailwind.config.js reads this file
 *
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Color primitives (inlined for RN bundle compatibility) ──────
const raw = {
  lime50:    "#f7fee7",
  lime200:   "#d9f99d",
  lime300:   "#bef264",
  lime400:   "#a3e635",
  lime500:   "#84cc16",
  lime600:   "#65a30d",
  lime700:   "#4d7c0f",
  lime800:   "#365314",

  cyan300:   "#67e8f9",
  cyan400:   "#22d3ee",
  cyan700:   "#0e7490",

  amber400:  "#fbbf24",
  amber500:  "#f59e0b",

  red400:    "#f87171",
  red500:    "#ef4444",
  green500:  "#22c55e",
  yellow500: "#eab308",
  blue500:   "#3b82f6",

  gray50:    "#f9fafb",
  gray100:   "#f3f4f6",
  gray200:   "#e5e7eb",
  gray300:   "#d1d5db",
  gray400:   "#9ca3af",
  gray600:   "#4b5563",
  gray800:   "#1f2937",
} as const;

// ─── Color tokens (semantic) ──────────────────────────────────────
export const colors = {
  // Brand — primary (Lime)
  primary:              raw.lime600,
  primaryHover:         raw.lime400,
  primaryActive:        raw.lime700,
  primaryDark:          raw.lime800,
  primaryLight:         raw.lime500,
  primaryLightBg:       raw.lime50,
  navbar:               raw.lime200,
  navbarHover:          raw.lime300,
  navbarDark:           raw.lime800,

  // Brand — secondary (Cyan)
  secondary:            raw.cyan400,
  secondaryDark:        raw.cyan700,
  secondaryHover:       raw.cyan300,

  // Brand — accent (Amber)
  accent:               raw.amber500,
  accentHover:          raw.amber400,

  // Feedback
  danger:               raw.red500,
  dangerHover:          raw.red400,
  success:              raw.green500,
  warning:              raw.yellow500,
  info:                 raw.blue500,

  // Backgrounds
  background:           "#fdfffc",
  backgroundSecondary:  raw.gray50,
  backgroundTertiary:   raw.gray100,

  // Surfaces
  surface:              "#ffffff",
  surfaceHover:         raw.gray50,
  surfaceActive:        raw.gray100,

  // Foreground / Text
  foreground:           raw.gray800,
  foregroundSecondary:  raw.gray600,
  foregroundTertiary:   raw.gray400,
  foregroundMuted:      raw.gray300,
  onPrimary:            "#ffffff",

  // Borders
  border:               "#a8a8a8",
  borderLight:          raw.gray100,
  borderStrong:         raw.gray300,
  borderFocus:          raw.lime500,

  // Inputs
  inputBg:              "#ffffff",
  inputBorder:          raw.gray300,
  inputBorderHover:     raw.gray400,
  inputBorderFocus:     raw.lime500,
  inputText:            raw.gray800,
  inputPlaceholder:     raw.gray400,
  inputDisabled:        raw.gray100,
} as const;

// ─── Typography ───────────────────────────────────────────────────
export const fontFamily = {
  regular:  "Cabin_400Regular",
  medium:   "Cabin_500Medium",
  semibold: "Cabin_600SemiBold",
  bold:     "Cabin_700Bold",
} as const;

export const fontSize = {
  xs:    11,  // eyebrow labels, captions
  sm:    13,  // secondary labels, tags
  base:  15,  // body copy (default)
  lg:    17,  // large body, list items
  xl:    20,  // h4, card section heads
  "2xl": 24,  // h3
  "3xl": 30,  // hero slide titles
  "4xl": 36,  // display / splash
} as const;

export const lineHeight = {
  tight:   1.1,
  snug:    1.15,
  normal:  1.3,
  relaxed: 1.45,
  loose:   1.6,
} as const;

export const letterSpacing = {
  tight:   -0.5,  // display headings
  snug:    -0.3,
  normal:   0,
  wide:     0.3,  // label pills
  wider:    0.5,  // type badges
  widest:   0.9,  // EYEBROW LABELS (uppercase)
} as const;

// ─── Spacing (8-pt grid) ─────────────────────────────────────────
export const spacing = {
  0:    0,
  px:   1,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  2.5:  10,
  3:    12,
  3.5:  14,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  9:    36,
  10:   40,
  11:   44,  // minimum tap target
  12:   48,
  14:   56,
  16:   64,
  20:   80,
  24:   96,
  28:   112,
  32:   128,
} as const;

// ─── Border radius ────────────────────────────────────────────────
export const borderRadius = {
  none:  0,
  sm:    8,    // sm buttons
  md:    10,   // inputs, md/lg buttons
  lg:    12,   // product cards
  xl:    14,   // store cards, lg buttons
  "2xl": 18,   // category cards, hero cards
  full:  9999, // pills, dots, circle avatars
} as const;

// ─── Shadows (RN shadow + elevation) ─────────────────────────────
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// ─── Icon sizes ───────────────────────────────────────────────────
export const iconSize = {
  xs:    14,
  sm:    16,  // sm buttons
  md:    18,  // md buttons (default)
  lg:    20,  // lg buttons
  xl:    24,  // general UI
  "2xl": 28,  // tab bar icons
  "3xl": 32,
} as const;

export const iconStroke = {
  default:   1.5,  // navigation, decorative
  emphasis:  2.0,  // buttons, interactive
  strong:    2.5,  // arrows, close buttons
} as const;

// ─── Button geometry ──────────────────────────────────────────────
export const button = {
  sm: { paddingVertical: 0, paddingHorizontal: 14, fontSize: fontSize.sm,  iconSize: iconSize.sm,  borderRadius: borderRadius.sm, minHeight: 32 },
  md: { paddingVertical: 0, paddingHorizontal: 20, fontSize: fontSize.base, iconSize: iconSize.md, borderRadius: borderRadius.md, minHeight: 40 },
  lg: { paddingVertical: 0, paddingHorizontal: 24, fontSize: fontSize.base, iconSize: iconSize.lg, borderRadius: borderRadius.md, minHeight: 48 },
} as const;

// ─── Input geometry ───────────────────────────────────────────────
export const input = {
  sm: { height: 36, fontSize: fontSize.xs,   iconSize: iconSize.xs, paddingHorizontal: 10 },
  md: { height: 44, fontSize: fontSize.base,  iconSize: iconSize.sm, paddingHorizontal: 12 },
  lg: { height: 56, fontSize: fontSize.lg,    iconSize: iconSize.md, paddingHorizontal: 14 },
} as const;

// ─── Animation (react-native-reanimated spring config) ───────────
export const animation = {
  pressScale:   0.96,
  pressSpring:  { stiffness: 400, damping: 17 },
  tabSpring:    { damping: 18, stiffness: 200, mass: 0.8 },
  durationFast: 180,
  durationMed:  250,
  durationSlow: 350,
} as const;

// ─── Z-index ─────────────────────────────────────────────────────
export const zIndex = {
  base:     0,
  raised:   1,
  dropdown: 10,
  sticky:   20,
  overlay:  30,
  modal:    40,
  toast:    50,
} as const;

// ─── Barrel export ────────────────────────────────────────────────
const tokens = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  spacing,
  borderRadius,
  shadows,
  iconSize,
  iconStroke,
  button,
  input,
  animation,
  zIndex,
} as const;

export default tokens;
