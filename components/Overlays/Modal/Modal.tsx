import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { X } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

// ─── Variant types (mirrors the web API) ─────────────────────────────────────

type Size = "sm" | "md" | "lg" | "xl" | "full";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  size?: Size;
  style?: ViewStyle;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;

const SIZE_MAP: Record<Size, number> = {
  sm: Math.min(SCREEN_WIDTH - 32, 448),
  md: Math.min(SCREEN_WIDTH - 32, 512),
  lg: Math.min(SCREEN_WIDTH - 32, 672),
  xl: Math.min(SCREEN_WIDTH - 32, 896),
  full: SCREEN_WIDTH - 32,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Modal({
  isOpen = false,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = "md",
  style,
}: ModalProps) {
  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={closeOnOverlayClick ? onClose : undefined}
      >
        {/* Modal sheet — stop propagation so taps inside don't close */}
        <View style={[styles.sheet, { maxWidth: SIZE_MAP[size] }, style]}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.inner}>
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title ? (
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                ) : (
                  <View />
                )}
                {showCloseButton && (
                  <Pressable
                    onPress={onClose}
                    style={({ pressed }) => [
                      styles.closeButton,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                    hitSlop={8}
                  >
                    <X size={20} color={colors.foregroundSecondary} strokeWidth={2} />
                  </Pressable>
                )}
              </View>
            )}

            {/* Body */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.body}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </RNModal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  sheet: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius["2xl"],
    overflow: "hidden",
    ...shadows.xl,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
  },
  closeButton: {
    padding: 4,
    borderRadius: borderRadius.sm,
  },
  body: {
    padding: 20,
  },
});
