import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "outlined" | "ghost";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BannerProps {
  title: string;
  description: string;
  variant?: Variant;
  showDots?: boolean;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG = {
  primary: {
    gradient: [Colors.primaryDark, Colors.primary, Colors.primaryDark] as const,
    textColor: "#fff",
    dotColor: "#fff",
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  secondary: {
    gradient: [Colors.secondaryDark, Colors.secondary, Colors.secondaryDark] as const,
    textColor: "#fff",
    dotColor: "#fff",
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  outlined: {
    gradient: null,
    textColor: Colors.foreground,
    dotColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadow: true,
  },
  ghost: {
    gradient: null,
    textColor: Colors.foreground,
    dotColor: Colors.foregroundSecondary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: false,
  },
} as const;

// ─── Dot sub-component ────────────────────────────────────────────────────────

function Dot({ color, delay, animated }: { color: string; delay: number; animated: boolean }) {
  const dot = <View style={[styles.dot, { backgroundColor: color }]} />;
  if (!animated) return dot;
  return (
    <Animated.View entering={ZoomIn.delay(delay).duration(300)}>
      {dot}
    </Animated.View>
  );
}

// ─── Shimmer sub-component ────────────────────────────────────────────────────

function Shimmer({ width }: { width: number }) {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    if (width === 0) return;
    translateX.value = -width;
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 15000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0.1)", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const Banner = React.forwardRef<View, BannerProps>(
  (
    {
      title,
      description,
      variant = "primary",
      showDots = true,
      animated = true,
      style,
    },
    ref,
  ) => {
    const config = VARIANT_CONFIG[variant];
    const [bannerWidth, setBannerWidth] = useState(0);

    const handleLayout = (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && w !== bannerWidth) setBannerWidth(w);
    };

    const content = (
      <>
        {/* Shimmer sweep — primary only */}
        {animated && variant === "primary" && bannerWidth > 0 && (
          <Shimmer width={bannerWidth} />
        )}

        {/* Title row */}
        <View style={styles.titleRow}>
          {showDots && <Dot color={config.dotColor} delay={200} animated={animated} />}

          {animated ? (
            <Animated.Text
              entering={FadeIn.delay(300).duration(300)}
              style={[styles.title, { color: config.textColor }]}
            >
              {title}
            </Animated.Text>
          ) : (
            <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
          )}

          {showDots && <Dot color={config.dotColor} delay={400} animated={animated} />}
        </View>

        {/* Description */}
        {animated ? (
          <Animated.View entering={FadeIn.delay(500).duration(300)}>
            <Text style={[styles.description, { color: config.textColor }]}>
              {description}
            </Text>
          </Animated.View>
        ) : (
          <Text style={[styles.description, { color: config.textColor }]}>
            {description}
          </Text>
        )}
      </>
    );

    const containerStyle = [
      styles.container,
      config.shadow && styles.shadow,
      config.borderWidth > 0 && { borderWidth: config.borderWidth, borderColor: config.borderColor },
      !config.gradient && {
        backgroundColor: variant === "ghost" ? "rgba(255,255,255,0.5)" : Colors.background,
      },
      style,
    ];

    const inner = config.gradient ? (
      <LinearGradient
        colors={[...config.gradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={containerStyle}
        onLayout={handleLayout}
      >
        {content}
      </LinearGradient>
    ) : (
      <View style={containerStyle} onLayout={handleLayout}>
        {content}
      </View>
    );

    if (!animated) {
      return <View ref={ref}>{inner}</View>;
    }

    return (
      <Animated.View ref={ref} entering={FadeInDown.duration(600)}>
        {inner}
      </Animated.View>
    );
  },
);

Banner.displayName = "Banner";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "Cabin_700Bold",
    textAlign: "center",
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
  },
});

export default Banner;
export { Banner };
