import Colors from "@/constants/Colors";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// ─── Variant / Size types ─────────────────────────────────────────────────────

type Variant =
  | "primary"
  | "secondary"
  | "secondary_outline"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "error"
  // legacy alias kept for backward compatibility
  | "filled";

type Size = "sm" | "md" | "lg";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MainButtonProps {
  text: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  /** Icon component (from lucide-react-native) or a JSX element */
  leftIcon?: LucideIcon | React.ReactElement;
  /** Icon component (from lucide-react-native) or a JSX element */
  rightIcon?: LucideIcon | React.ReactElement;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<
  Size,
  {
    py: number;
    px: number;
    fontSize: number;
    iconSize: number;
    gap: number;
    radius: number;
    minHeight: number;
  }
> = {
  sm: {
    py: 8,
    px: 16,
    fontSize: 14,
    iconSize: 16,
    gap: 6,
    radius: 8,
    minHeight: 36,
  },
  md: {
    py: 12,
    px: 24,
    fontSize: 16,
    iconSize: 18,
    gap: 8,
    radius: 10,
    minHeight: 44,
  },
  lg: {
    py: 16,
    px: 32,
    fontSize: 16,
    iconSize: 20,
    gap: 10,
    radius: 14,
    minHeight: 56,
  },
};

// ─── Variant style map ────────────────────────────────────────────────────────

interface VariantStyle {
  bg: string;
  border?: string;
  textColor: string;
  spinnerColor: string;
  iconColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  primary: {
    bg: Colors.primary,
    border: Colors.primary,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
  filled: {
    bg: Colors.primary,
    border: Colors.primary,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
  secondary: {
    bg: Colors.secondary,
    border: Colors.secondary,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
  secondary_outline: {
    bg: "#fff",
    border: Colors.secondary,
    textColor: Colors.secondary,
    spinnerColor: Colors.secondary,
    iconColor: Colors.secondary,
  },
  outline: {
    bg: "#fff",
    border: Colors.primary,
    textColor: Colors.primary,
    spinnerColor: Colors.primary,
    iconColor: Colors.primary,
  },
  ghost: {
    bg: "transparent",
    border: "transparent",
    textColor: Colors.primary,
    spinnerColor: Colors.primary,
    iconColor: Colors.primary,
  },
  success: {
    bg: Colors.success,
    border: Colors.success,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
  warning: {
    bg: Colors.warning,
    border: Colors.warning,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
  error: {
    bg: Colors.danger,
    border: Colors.danger,
    textColor: "#fff",
    spinnerColor: "#fff",
    iconColor: "#fff",
  },
};

// ─── Helper: render icon ──────────────────────────────────────────────────────

function renderIcon(
  icon: LucideIcon | React.ReactElement,
  size: number,
  color: string,
): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MainButton = React.forwardRef<View, MainButtonProps>(
  (
    {
      text,
      onPress,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      style: customStyle,
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const isDisabled = disabled || loading;
    const label = loading && loadingText ? loadingText : text;

    // ── Press animation ───────────────────────────────────────────────────────
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.96, { stiffness: 400, damping: 17 });
    };
    const handlePressOut = () => {
      scale.value = withSpring(1, { stiffness: 400, damping: 17 });
    };

    const hasBorder =
      variant === "outline" ||
      variant === "secondary_outline" ||
      variant === "ghost";

    return (
      <Animated.View
        ref={ref}
        style={[animatedStyle, fullWidth && styles.fullWidth]}
      >
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={[
            styles.base,
            {
              paddingVertical: s.py,
              paddingHorizontal: s.px,
              borderRadius: s.radius,
              minHeight: s.minHeight,
              backgroundColor: v.bg,
              borderWidth: hasBorder ? 2 : 0,
              borderColor: v.border,
              opacity: isDisabled ? 0.5 : 1,
            },
            fullWidth && styles.fullWidth,
            customStyle,
          ]}
        >
          {/* Content row — hidden behind spinner while loading */}
          <View
            style={[styles.content, { gap: s.gap, opacity: loading ? 0 : 1 }]}
          >
            {leftIcon && renderIcon(leftIcon, s.iconSize, v.iconColor)}
            <Text
              style={[
                styles.text,
                { fontSize: s.fontSize, color: v.textColor },
              ]}
            >
              {label}
            </Text>
            {rightIcon && renderIcon(rightIcon, s.iconSize, v.iconColor)}
          </View>

          {/* Spinner overlay */}
          {loading && (
            <ActivityIndicator
              color={v.spinnerColor}
              size="small"
              style={styles.spinner}
            />
          )}
        </AnimatedPressable>
      </Animated.View>
    );
  },
);

MainButton.displayName = "MainButton";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    position: "absolute",
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontFamily: "Cabin_700Bold",
    textAlign: "center",
  },
});

export default MainButton;
export { MainButton };
