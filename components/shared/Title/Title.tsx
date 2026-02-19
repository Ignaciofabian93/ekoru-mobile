import Colors from "@/constants/Colors";
import React from "react";
import { type TextStyle } from "react-native";
import Animated from "react-native-reanimated";

// ─── Variant types (mirrors the web API) ─────────────────────────────────────

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Weight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
type TitleColor =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning";
type Align = "left" | "center" | "right";

// ─── Props ────────────────────────────────────────────────────────────────────

type AnimatedTextProps = React.ComponentPropsWithRef<typeof Animated.Text>;

export interface TitleProps extends Omit<AnimatedTextProps, "style"> {
  level?: Level;
  weight?: Weight;
  color?: TitleColor;
  align?: Align;
  style?: TextStyle | TextStyle[];
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

// Scaled for mobile — mirrors the h1→h6 hierarchy from the web component
const LEVEL_MAP: Record<Level, number> = {
  h1: 36,
  h2: 30,
  h3: 26,
  h4: 22,
  h5: 19,
  h6: 17,
};

// Cabin doesn't have an 800/900 weight, so extrabold maps to the heaviest available
const WEIGHT_MAP: Record<Weight, string> = {
  normal: "Cabin_400Regular",
  medium: "Cabin_500Medium",
  semibold: "Cabin_600SemiBold",
  bold: "Cabin_700Bold",
  extrabold: "Cabin_700Bold",
};

const COLOR_MAP: Record<TitleColor, string> = {
  default: Colors.foreground,
  primary: Colors.primary,
  secondary: Colors.foregroundSecondary,
  tertiary: Colors.foregroundTertiary,
  error: Colors.danger,
  success: Colors.success,
  warning: Colors.warning,
};

// ─── Component ────────────────────────────────────────────────────────────────

const Title = React.forwardRef<React.ComponentRef<typeof Animated.Text>, TitleProps>(
  (
    {
      level = "h1",
      weight = "bold",
      color = "default",
      align = "left",
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const computed: TextStyle = {
      fontFamily: WEIGHT_MAP[weight],
      fontSize: LEVEL_MAP[level],
      color: COLOR_MAP[color],
      textAlign: align,
      letterSpacing: -0.4,
      lineHeight: LEVEL_MAP[level] * 1.2,
    };

    const flatStyle = [computed, ...(Array.isArray(style) ? style : style ? [style] : [])];

    return (
      <Animated.Text ref={ref} style={flatStyle} {...props}>
        {children}
      </Animated.Text>
    );
  },
);

Title.displayName = "Title";

export { Title };
