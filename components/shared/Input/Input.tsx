import { colors } from "@/design/tokens";
import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Width = "sm" | "md" | "lg" | "full";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<RNTextInputProps, "onChange"> {
  label?: string;
  name?: string;
  /** Icon component (from lucide-react-native) to show on the left */
  leftIcon?: LucideIcon;
  errorMessage?: string;
  /** Controls input height */
  size?: Size;
  /** Controls container width */
  width?: Width;
  variant?: Variant;
  type?: "text" | "email" | "password" | "number" | "search";
  /** Alias for errorMessage presence */
  hasError?: boolean;
  /** Backward-compat alias for hasError */
  isInvalid?: boolean;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<Size, { height: number; fontSize: number; iconSize: number; px: number }> = {
  sm: { height: 36, fontSize: 14, iconSize: 16, px: 10 },
  md: { height: 44, fontSize: 16, iconSize: 18, px: 12 },
  lg: { height: 56, fontSize: 18, iconSize: 20, px: 14 },
};

const WIDTH_MAP: Record<Width, `${number}%` | "100%"> = {
  sm: "33%",
  md: "50%",
  lg: "66%",
  full: "100%",
};

interface VariantStyle {
  bg: string;
  borderColor: string;
  borderWidth: number;
  focusedBg: string;
  focusedBorderColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  default: {
    bg: colors.inputBg,
    borderColor: colors.inputBorder,
    borderWidth: 2,
    focusedBg: colors.inputBg,
    focusedBorderColor: colors.inputBorderFocus,
  },
  filled: {
    bg: colors.backgroundSecondary,
    borderColor: "transparent",
    borderWidth: 2,
    focusedBg: colors.inputBg,
    focusedBorderColor: colors.inputBorderFocus,
  },
  outline: {
    bg: "transparent",
    borderColor: colors.primary,
    borderWidth: 2,
    focusedBg: `${colors.primary}0D`,
    focusedBorderColor: colors.primaryActive,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Input = React.forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      name: _name,
      leftIcon: LeftIcon,
      errorMessage,
      size = "md",
      width = "full",
      variant = "default",
      type = "text",
      hasError,
      isInvalid,
      placeholder,
      maxLength = 50,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const showError = hasError || isInvalid || !!errorMessage;

    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const keyboardType: RNTextInputProps["keyboardType"] =
      type === "email"
        ? "email-address"
        : type === "number"
          ? "numeric"
          : type === "search"
            ? "web-search"
            : "default";

    // ── Eye-toggle animation (RN Animated — no Reanimated) ──────────────────
    const eyeOpacity = useRef(new Animated.Value(1)).current;
    const eyeScale = useRef(new Animated.Value(1)).current;
    const eyeStyle = { opacity: eyeOpacity, transform: [{ scale: eyeScale }] };

    const togglePassword = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(eyeOpacity, { toValue: 0, duration: 80, useNativeDriver: true }),
          Animated.timing(eyeScale, { toValue: 0.8, duration: 80, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(eyeOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(eyeScale, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]),
      ]).start();
      // flip state mid-animation
      setTimeout(() => setShowPassword((p) => !p), 80);
    };

    // ── Dynamic input styles ─────────────────────────────────────────────────
    const bg = focused ? v.focusedBg : v.bg;
    const resolvedBorderColor = showError ? colors.danger : focused ? v.focusedBorderColor : v.borderColor;

    const iconColor = showError ? colors.danger : focused ? colors.primary : colors.foregroundTertiary;

    return (
      <View style={[styles.container, { width: WIDTH_MAP[width] as any }]}>
        {/* Label */}
        {label && <Text style={styles.label}>{label}</Text>}

        {/* Input wrapper */}
        <View style={[styles.wrapper, { height: s.height }]}>
          {LeftIcon && (
            <View style={styles.leftIconWrap}>
              <LeftIcon size={s.iconSize} color={iconColor} strokeWidth={2} />
            </View>
          )}

          <RNTextInput
            ref={ref}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={type === "email" ? "none" : "sentences"}
            autoCorrect={type !== "email" && type !== "password"}
            maxLength={maxLength}
            placeholder={placeholder}
            placeholderTextColor={colors.inputPlaceholder}
            scrollEnabled={false}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[
              styles.input,
              {
                fontSize: s.fontSize,
                paddingHorizontal: s.px,
                paddingVertical: 0,
                backgroundColor: bg,
                borderWidth: v.borderWidth,
                borderColor: resolvedBorderColor,
                paddingLeft: LeftIcon ? s.px + s.iconSize + 8 : s.px,
                paddingRight: isPassword ? s.px + s.iconSize + 8 : s.px,
              },
              // includeFontPadding was removed from TextInputProps types in RN 0.74+
              // but still works at runtime on Android via the style object.
              // It removes the extra vertical font metric padding that gives
              // Android's EditText internal scroll room.
              Platform.OS === "android" && ({ includeFontPadding: false } as object),
            ]}
            {...rest}
          />

          {/* Eye toggle */}
          {isPassword && (
            <Pressable onPress={togglePassword} style={styles.rightIconWrap} hitSlop={8}>
              <Animated.View style={eyeStyle}>
                {showPassword ? (
                  <EyeOff size={s.iconSize} color={colors.foregroundTertiary} strokeWidth={2} />
                ) : (
                  <Eye size={s.iconSize} color={colors.foregroundTertiary} strokeWidth={2} />
                )}
              </Animated.View>
            </Pressable>
          )}
        </View>

        {/* Error message */}
        {errorMessage && (
          <View style={styles.errorMessageWrap}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 1,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: colors.foreground,
  },
  wrapper: {
    position: "relative",
    justifyContent: "center",
  },
  leftIconWrap: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  rightIconWrap: {
    position: "absolute",
    right: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontFamily: "Cabin_400Regular",
    color: colors.inputText,
    borderRadius: 10,
    textAlignVertical: "center",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: colors.danger,
  },
  errorMessageWrap: {
    position: "absolute",
    bottom: -18,
  },
});

export default Input;
export { Input };
