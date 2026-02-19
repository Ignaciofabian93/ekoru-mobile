import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// ─── Variant types (mirrors the web API) ─────────────────────────────────────

type Variant = "primary" | "secondary" | "outlined" | "ghost";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AdBannerProps extends Omit<ViewProps, "style"> {
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title?: string;
  description?: string;
  cta: React.ReactNode;
  variant?: Variant;
  /** Fade-in on mount */
  animated?: boolean;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const GRADIENT_COLORS: Record<"primary" | "secondary", readonly [string, string, string]> = {
  primary: [Colors.primaryDark, Colors.primary, Colors.primaryDark],
  secondary: [Colors.secondaryDark, Colors.secondary, Colors.secondaryDark],
};

// Icon container background for each variant
const ICON_BG: Record<Variant, string> = {
  primary: "rgba(255,255,255,0.15)",
  secondary: "rgba(255,255,255,0.15)",
  outlined: Colors.backgroundPrimaryLight,
  ghost: Colors.backgroundPrimaryLight,
};

// Icon color for each variant
const ICON_COLOR: Record<Variant, string> = {
  primary: "#ffffff",
  secondary: "#ffffff",
  outlined: Colors.primary,
  ghost: Colors.primary,
};

// Title / description color for each variant
const TEXT_COLOR: Record<Variant, string> = {
  primary: "#ffffff",
  secondary: "#ffffff",
  outlined: Colors.foreground,
  ghost: Colors.foreground,
};

const TEXT_MUTED: Record<Variant, string> = {
  primary: "rgba(255,255,255,0.75)",
  secondary: "rgba(255,255,255,0.75)",
  outlined: Colors.foregroundSecondary,
  ghost: Colors.foregroundSecondary,
};

// ─── Component ────────────────────────────────────────────────────────────────

const AdBanner = React.forwardRef<View, AdBannerProps>(
  (
    {
      icon: Icon,
      title,
      description,
      cta,
      variant = "primary",
      animated = true,
      ...props
    },
    ref,
  ) => {
    const isGradient = variant === "primary" || variant === "secondary";

    const content = (
      <View style={styles.inner}>
        {/* Left: icon + text */}
        <View style={styles.left}>
          {Icon && (
            <View style={[styles.iconBadge, { backgroundColor: ICON_BG[variant] }]}>
              <Icon size={36} color={ICON_COLOR[variant]} strokeWidth={1.75} />
            </View>
          )}
          {title && (
            <Text style={[styles.title, { color: TEXT_COLOR[variant] }]} numberOfLines={2}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={[styles.description, { color: TEXT_MUTED[variant] }]} numberOfLines={3}>
              {description}
            </Text>
          )}
        </View>

        {/* Right: CTA */}
        <View style={styles.cta}>{cta}</View>
      </View>
    );

    const containerStyle = [
      styles.banner,
      variant === "outlined" && styles.outlined,
      variant === "ghost" && styles.ghost,
    ];

    const entering = animated ? FadeIn.duration(450) : undefined;

    if (isGradient) {
      return (
        <Animated.View ref={ref} entering={entering} {...props}>
          <LinearGradient
            colors={GRADIENT_COLORS[variant as "primary" | "secondary"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={containerStyle}
          >
            {content}
          </LinearGradient>
        </Animated.View>
      );
    }

    return (
      <Animated.View ref={ref} entering={entering} style={containerStyle} {...props}>
        {content}
      </Animated.View>
    );
  },
);

AdBanner.displayName = "AdBanner";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
    overflow: "hidden",
  },
  outlined: {
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 12,
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderColor: Colors.borderLight,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Cabin_700Bold",
  },
  description: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    lineHeight: 18,
  },
  cta: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});

export default AdBanner;
