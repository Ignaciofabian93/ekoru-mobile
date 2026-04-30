import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "outlined" | "ghost";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BannerProps {
  title: string;
  description: string;
  variant?: Variant;
  showDots?: boolean;
  /** Kept for API compatibility — no longer triggers animation */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG = {
  primary: {
    gradient: [colors.primaryDark, colors.primary, colors.primaryDark] as const,
    textColor: colors.onPrimary,
    dotColor: colors.onPrimary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  secondary: {
    gradient: [colors.secondaryDark, colors.secondary, colors.secondaryDark] as const,
    textColor: colors.onPrimary,
    dotColor: colors.onPrimary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  outlined: {
    gradient: null,
    textColor: colors.foreground,
    dotColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
    shadow: true,
  },
  ghost: {
    gradient: null,
    textColor: colors.foreground,
    dotColor: colors.foregroundSecondary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: false,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

const Banner = React.forwardRef<View, BannerProps>(
  (
    {
      title,
      description,
      variant = "primary",
      showDots = true,
      animated: _animated,
      style,
    },
    ref,
  ) => {
    const config = VARIANT_CONFIG[variant];

    const content = (
      <>
        {/* Title row */}
        <View style={styles.titleRow}>
          {showDots && (
            <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
          )}
          <Text style={[styles.title, { color: config.textColor }]}>
            {title}
          </Text>
          {showDots && (
            <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
          )}
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: config.textColor }]}>
          {description}
        </Text>
      </>
    );

    const containerStyle = [
      styles.container,
      config.shadow && styles.shadow,
      config.borderWidth > 0 && { borderWidth: config.borderWidth, borderColor: config.borderColor },
      !config.gradient && {
        backgroundColor: variant === "ghost" ? "rgba(255,255,255,0.5)" : colors.background,
      },
      style,
    ];

    if (config.gradient) {
      return (
        <View ref={ref}>
          <LinearGradient
            colors={[...config.gradient]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={containerStyle}
          >
            {content}
          </LinearGradient>
        </View>
      );
    }

    return (
      <View ref={ref} style={containerStyle}>
        {content}
      </View>
    );
  },
);

Banner.displayName = "Banner";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
  },
  shadow: {
    ...shadows.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    textAlign: "center",
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  description: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.sm,
  },
});

export default Banner;
export { Banner };
