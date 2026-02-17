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

type Variant = "filled" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface MainButtonProps {
  text: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizeConfig: Record<Size, { py: number; px: number; fontSize: number; iconSize: number; gap: number; radius: number }> = {
  sm: { py: 8, px: 16, fontSize: 14, iconSize: 16, gap: 6, radius: 8 },
  md: { py: 12, px: 24, fontSize: 16, iconSize: 18, gap: 8, radius: 10 },
  lg: { py: 16, px: 32, fontSize: 16, iconSize: 20, gap: 10, radius: 14 },
};

function getVariantStyles(variant: Variant, isDisabled: boolean) {
  const opacity = isDisabled ? 0.5 : 1;

  switch (variant) {
    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: Colors.primary,
          opacity,
        },
        text: { color: Colors.primary },
        spinnerColor: Colors.primary,
        iconColor: Colors.primary,
      };
    case "ghost":
      return {
        container: {
          backgroundColor: "transparent",
          opacity,
        },
        text: { color: Colors.primary },
        spinnerColor: Colors.primary,
        iconColor: Colors.primary,
      };
    case "filled":
    default:
      return {
        container: {
          backgroundColor: Colors.primary,
          opacity,
        },
        text: { color: "#fff" },
        spinnerColor: "#fff",
        iconColor: "#fff",
      };
  }
}

export default function MainButton({
  text,
  onPress,
  variant = "filled",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  style: customStyle,
}: MainButtonProps) {
  const s = sizeConfig[size];
  const isDisabled = disabled || loading;
  const v = getVariantStyles(variant, isDisabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: s.radius,
          gap: s.gap,
        },
        v.container,
        fullWidth && styles.fullWidth,
        customStyle,
      ]}
    >
      {/* Always render content to preserve height */}
      <View style={[styles.content, { gap: s.gap, opacity: loading ? 0 : 1 }]}>
        {LeftIcon && (
          <LeftIcon size={s.iconSize} color={v.iconColor} strokeWidth={2} />
        )}
        <Text
          style={[
            styles.text,
            { fontSize: s.fontSize },
            v.text,
          ]}
        >
          {text}
        </Text>
        {RightIcon && (
          <RightIcon size={s.iconSize} color={v.iconColor} strokeWidth={2} />
        )}
      </View>
      {loading && (
        <ActivityIndicator
          color={v.spinnerColor}
          size="small"
          style={styles.spinner}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  },
  content: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  spinner: {
    position: "absolute" as const,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "700",
    textAlign: "center",
  },
});
