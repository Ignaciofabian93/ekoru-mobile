import { button as buttonSizes, colors, fontFamily, spacing } from "@/design/tokens";
import type { LucideIcon } from "lucide-react-native";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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
    py: spacing[2],
    px: buttonSizes.sm.paddingHorizontal,
    fontSize: buttonSizes.sm.fontSize,
    iconSize: buttonSizes.sm.iconSize,
    gap: spacing[1],
    radius: buttonSizes.sm.borderRadius,
    minHeight: buttonSizes.sm.minHeight,
  },
  md: {
    py: spacing[3],
    px: buttonSizes.md.paddingHorizontal,
    fontSize: buttonSizes.md.fontSize,
    iconSize: buttonSizes.md.iconSize,
    gap: spacing[2],
    radius: buttonSizes.md.borderRadius,
    minHeight: buttonSizes.md.minHeight,
  },
  lg: {
    py: spacing[4],
    px: buttonSizes.lg.paddingHorizontal,
    fontSize: buttonSizes.lg.fontSize,
    iconSize: buttonSizes.lg.iconSize,
    gap: spacing[2],
    radius: buttonSizes.lg.borderRadius,
    minHeight: buttonSizes.lg.minHeight,
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
    bg: colors.primary,
    border: colors.primary,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
  filled: {
    bg: colors.primary,
    border: colors.primary,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
  secondary: {
    bg: colors.secondary,
    border: colors.secondary,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
  secondary_outline: {
    bg: colors.surface,
    border: colors.secondary,
    textColor: colors.secondary,
    spinnerColor: colors.secondary,
    iconColor: colors.secondary,
  },
  outline: {
    bg: colors.surface,
    border: colors.primary,
    textColor: colors.primary,
    spinnerColor: colors.primary,
    iconColor: colors.primary,
  },
  ghost: {
    bg: "transparent",
    border: "transparent",
    textColor: colors.primary,
    spinnerColor: colors.primary,
    iconColor: colors.primary,
  },
  success: {
    bg: colors.success,
    border: colors.success,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
  warning: {
    bg: colors.warning,
    border: colors.warning,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
  error: {
    bg: colors.danger,
    border: colors.danger,
    textColor: colors.onPrimary,
    spinnerColor: colors.onPrimary,
    iconColor: colors.onPrimary,
  },
};

// ─── Helper: render icon ──────────────────────────────────────────────────────

function renderIcon(icon: LucideIcon | React.ReactElement, size: number, color: string): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

    // ── Press animation (RN Animated — no Reanimated) ─────────────────────────
    const scale = useRef(new Animated.Value(1)).current;
    const animatedStyle = { transform: [{ scale }] };

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }).start();
    };

    const hasBorder = variant === "outline" || variant === "secondary_outline" || variant === "ghost";

    return (
      <Animated.View ref={ref} style={[animatedStyle, fullWidth && styles.fullWidth]}>
        <Pressable
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
          <View style={[styles.content, { gap: s.gap, opacity: loading ? 0 : 1 }]}>
            {leftIcon && renderIcon(leftIcon, s.iconSize, v.iconColor)}
            <Text style={[styles.text, { fontSize: s.fontSize, color: v.textColor }]}>{label}</Text>
            {rightIcon && renderIcon(rightIcon, s.iconSize, v.iconColor)}
          </View>

          {/* Spinner overlay */}
          {loading && <ActivityIndicator color={v.spinnerColor} size="small" style={styles.spinner} />}
        </Pressable>
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
    fontFamily: fontFamily.bold,
    textAlign: "center",
  },
});

export default MainButton;
export { MainButton };
