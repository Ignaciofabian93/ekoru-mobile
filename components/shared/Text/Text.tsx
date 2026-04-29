import { colors } from "@/design/tokens";
import React from "react";
import { Platform, StyleSheet, Text as RNText, View, type TextStyle } from "react-native";

// ─── Variant types (mirrors the web API) ─────────────────────────────────────

type Variant = "p" | "span" | "label" | "blockquote" | "small" | "code";
type Size = "xs" | "sm" | "base" | "lg" | "xl";
type Weight = "normal" | "medium" | "semibold" | "bold";
type TextColor =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "muted";
type Align = "left" | "center" | "right" | "justify";

// ─── Props ────────────────────────────────────────────────────────────────────

// Usa plain Text de RN — no se necesita Animated.Text porque ningún caller
// pasa entering/exiting/layout a este componente, y evitar Animated.Text
// elimina registros innecesarios en el layer nativo de Reanimated.
type RNTextProps = React.ComponentPropsWithRef<typeof RNText>;

export interface TextProps extends Omit<RNTextProps, "style"> {
  variant?: Variant;
  size?: Size;
  weight?: Weight;
  color?: TextColor;
  align?: Align;
  style?: TextStyle | TextStyle[];
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<Size, number> = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
};

// Maps to the Cabin font family loaded in app/_layout.tsx
const WEIGHT_MAP: Record<Weight, string> = {
  normal: "Cabin_400Regular",
  medium: "Cabin_500Medium",
  semibold: "Cabin_600SemiBold",
  bold: "Cabin_700Bold",
};

const COLOR_MAP: Record<TextColor, string> = {
  default: colors.foreground,
  primary: colors.primary,
  secondary: colors.foregroundSecondary,
  tertiary: colors.foregroundTertiary,
  muted: colors.foregroundMuted,
  error: colors.danger,
  success: colors.success,
  warning: colors.warning,
};

// Each variant can override size / weight defaults
const VARIANT_DEFAULTS: Partial<Record<Variant, { size?: Size; weight?: Weight }>> = {
  label: { weight: "medium" },
  small: { size: "xs" },
  code: { size: "sm" },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
  (
    {
      variant = "p",
      size,
      weight,
      color = "default",
      align = "left",
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const defaults = VARIANT_DEFAULTS[variant] ?? {};
    const resolvedSize = size ?? defaults.size ?? "base";
    const resolvedWeight = weight ?? defaults.weight ?? "normal";

    const computed: TextStyle = {
      fontFamily: WEIGHT_MAP[resolvedWeight],
      fontSize: SIZE_MAP[resolvedSize],
      color: COLOR_MAP[color],
      textAlign: align,
      // Variant-specific overrides
      ...(variant === "blockquote" && { fontStyle: "italic", paddingLeft: 12 }),
      ...(variant === "code" && {
        fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
        overflow: "hidden",
      }),
    };

    const flatStyle = [computed, ...(Array.isArray(style) ? style : style ? [style] : [])];

    // Blockquote needs a View wrapper to render the left accent border
    if (variant === "blockquote") {
      return (
        <View style={styles.blockquoteWrapper}>
          <View style={styles.blockquoteBorder} />
          <RNText ref={ref} style={flatStyle} {...props}>
            {children}
          </RNText>
        </View>
      );
    }

    return (
      <RNText ref={ref} style={flatStyle} {...props}>
        {children}
      </RNText>
    );
  },
);

Text.displayName = "Text";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  blockquoteWrapper: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    paddingVertical: 2,
  },
  blockquoteBorder: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export { Text };
