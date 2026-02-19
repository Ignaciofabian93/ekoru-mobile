import colors from "tailwindcss/colors";

// Brand
const primary = colors.lime[600];
const primaryDark = colors.lime[800];
const primaryHover = colors.lime[400];
const primaryActive = colors.lime[700];

const secondary = colors.cyan[400];
const secondaryDark = colors.cyan[700];
const secondaryHover = colors.cyan[300];

const accent = colors.amber[500];
const accentHover = colors.amber[400];

// Feedback
const danger = colors.red[500];
const dangerHover = colors.red[400];
const success = colors.green[500];
const warning = colors.yellow[500];
const info = colors.blue[500];

export default {
  // Brand
  primary,
  primaryDark,
  primaryHover,
  primaryActive,
  secondary,
  secondaryDark,
  secondaryHover,
  accent,
  accentHover,

  // Feedback
  danger,
  dangerHover,
  success,
  warning,
  info,

  // Backgrounds
  background: "#fdfffc",
  backgroundSecondary: colors.gray[50],
  backgroundTertiary: colors.gray[100],
  backgroundPrimaryLight: colors.lime[50],

  // Surfaces
  surface: "#ffffff",
  surfaceHover: colors.gray[50],
  surfaceActive: colors.gray[100],

  // Text / Foreground
  foreground: colors.gray[800],
  foregroundSecondary: colors.gray[600],
  foregroundTertiary: colors.gray[400],
  foregroundMuted: colors.gray[300],

  // Borders
  border: "#a8a8a8",
  borderLight: colors.gray[100],
  borderStrong: colors.gray[300],
  borderFocus: colors.lime[500],

  // Inputs
  inputBg: "#ffffff",
  inputBorder: colors.gray[300],
  inputBorderHover: colors.gray[400],
  inputBorderFocus: colors.lime[500],
  inputText: colors.gray[800],
  inputPlaceholder: colors.gray[400],
  inputDisabled: colors.gray[100],

  // Navbar
  navbar: colors.lime[200],
  navbarHover: colors.lime[300],
  navbarDark: colors.lime[800],

  // Theme variants (kept for Themed.tsx compatibility)
  light: {
    text: colors.gray[800],
    background: "#fdfffc",
    tint: primary,
    tabIconDefault: "#ccc",
    tabIconSelected: primary,
    header: primary,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: primary,
    tabIconDefault: "#ccc",
    tabIconSelected: primary,
    header: primary,
  },
};
