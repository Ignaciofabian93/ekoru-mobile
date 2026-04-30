import { colors, fontFamily, fontSize } from "@/design/tokens";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

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
  default: { borderColor: colors.inputBorder,      bg: colors.surface },
  filled:  { borderColor: "transparent",           bg: colors.backgroundSecondary },
  outline: { borderColor: colors.primary,          bg: "transparent" },
};

// ─── Component ────────────────────────────────────────────────────────────────

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

    // ── Handler ──────────────────────────────────────────────────────────────
    const handlePress = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onChange?.(!checked);
    };

    const hasLabel = label || description;
    const labelColor = errorMessage
      ? colors.danger
      : disabled
        ? colors.foregroundTertiary
        : colors.foreground;

    return (
      <View ref={ref} style={styles.wrapper} {...props}>
        <Pressable
          onPress={handlePress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.row,
            disabled && styles.disabled,
            pressed && { opacity: 0.7 },
          ]}
        >
          {/* Box */}
          <View
            style={[
              styles.box,
              {
                width: s.box,
                height: s.box,
                borderRadius: s.radius,
                borderColor: checked ? colors.primary : idle.borderColor,
                backgroundColor: checked ? colors.primary : idle.bg,
              },
            ]}
          >
            {/* Check icon — hidden when unchecked */}
            <View style={{ opacity: checked ? 1 : 0 }}>
              <Check size={s.icon} color={colors.onPrimary} strokeWidth={3} />
            </View>
          </View>

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
        </Pressable>

        {/* Error message */}
        {errorMessage && (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
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
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
  },
  description: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    lineHeight: 18,
  },
  errorRow: {
    paddingLeft: 34, // aligns under label (box width + gap)
  },
  errorText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.danger,
  },
});

export default Checkbox;
export { Checkbox };
