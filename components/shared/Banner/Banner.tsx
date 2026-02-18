import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

type Variant = "primary" | "secondary" | "outlined" | "ghost";

interface BannerProps {
  title: string;
  description: string;
  variant?: Variant;
  showDots?: boolean;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantConfig = {
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
};

function Dot({ color, delay, animated }: { color: string; delay: number; animated: boolean }) {
  const dot = (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );

  if (!animated) return dot;

  return (
    <Animated.View entering={ZoomIn.delay(delay).springify()}>
      {dot}
    </Animated.View>
  );
}

export default function Banner({
  title,
  description,
  variant = "primary",
  showDots = true,
  animated = true,
  style,
}: BannerProps) {
  const config = variantConfig[variant];

  const content = (
    <>
      <View style={styles.titleRow}>
        {showDots && <Dot color={config.dotColor} delay={200} animated={animated} />}
        <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
        {showDots && <Dot color={config.dotColor} delay={400} animated={animated} />}
      </View>
      {animated ? (
        <Animated.View entering={FadeIn.delay(500)}>
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
    config.borderWidth > 0 && {
      borderWidth: config.borderWidth,
      borderColor: config.borderColor,
    },
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
    >
      {content}
    </LinearGradient>
  ) : (
    <View style={containerStyle}>{content}</View>
  );

  if (!animated) return inner;

  return (
    <Animated.View entering={FadeInDown.duration(600)}>
      {inner}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    width: "95%",
    alignSelf: "center",
    overflow: "hidden",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
