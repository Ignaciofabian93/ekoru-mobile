import Colors from "@/constants/Colors";
import { Check } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<ViewProps, "style"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Alias for onCheckedChange (backward compat) */
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<Size, { box: number; icon: number; radius: number }> = {
  sm: { box: 18, icon: 12, radius: 4 },
  md: { box: 22, icon: 16, radius: 5 },
  lg: { box: 26, icon: 20, radius: 6 },
};

// Unchecked border / background per variant
const VARIANT_IDLE: Record<Variant, { borderColor: string; bg: string }> = {
  default: { borderColor: Colors.inputBorder,      bg: "#fff" },
  filled:  { borderColor: "transparent",           bg: Colors.backgroundSecondary },
  outline: { borderColor: Colors.primary,          bg: "transparent" },
};

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Checkbox = React.forwardRef<View, CheckboxProps>(
  (
    {
      checked = false,
      onCheckedChange,
      onChange,
      label,
      description,
      errorMessage,
      variant = "default",
      size = "md",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const idle = VARIANT_IDLE[variant];

    // ── Press scale ──────────────────────────────────────────────────────────
    const pressScale = useSharedValue(1);
    const pressStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    const handlePressIn = () => {
      if (!disabled) pressScale.value = withSpring(0.9, { stiffness: 400, damping: 17 });
    };
    const handlePressOut = () => {
      pressScale.value = withSpring(1, { stiffness: 400, damping: 17 });
    };

    // ── Check icon animation ─────────────────────────────────────────────────
    const checkScale = useSharedValue(checked ? 1 : 0.5);
    const checkOpacity = useSharedValue(checked ? 1 : 0);

    useEffect(() => {
      checkScale.value = withTiming(checked ? 1 : 0.5, { duration: 200 });
      checkOpacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
    }, [checked]);

    const checkStyle = useAnimatedStyle(() => ({
      opacity: checkOpacity.value,
      transform: [{ scale: checkScale.value }],
    }));

    // ── Handler ──────────────────────────────────────────────────────────────
    const handlePress = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onChange?.(!checked);
    };

    const hasLabel = label || description;
    const labelColor = errorMessage
      ? Colors.danger
      : disabled
        ? Colors.foregroundTertiary
        : Colors.foreground;

    return (
      <View ref={ref} style={styles.wrapper} {...props}>
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[styles.row, disabled && styles.disabled]}
        >
          {/* Box */}
          <Animated.View
            style={[
              styles.box,
              {
                width: s.box,
                height: s.box,
                borderRadius: s.radius,
                borderColor: checked ? Colors.primary : idle.borderColor,
                backgroundColor: checked ? Colors.primary : idle.bg,
              },
              pressStyle,
            ]}
          >
            <Animated.View style={checkStyle}>
              <Check size={s.icon} color="#fff" strokeWidth={3} />
            </Animated.View>
          </Animated.View>

          {/* Label + description */}
          {hasLabel && (
            <View style={styles.textContainer}>
              {label && (
                <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
              )}
              {description && (
                <Text style={styles.description}>{description}</Text>
              )}
            </View>
          )}
        </AnimatedPressable>

        {/* Error message */}
        {errorMessage && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            style={styles.errorRow}
          >
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Animated.View>
        )}
      </View>
    );
  },
);

Checkbox.displayName = "Checkbox";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
  },
  description: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 18,
  },
  errorRow: {
    paddingLeft: 34, // aligns under label (box width + gap)
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.danger,
  },
});

export default Checkbox;
export { Checkbox };
