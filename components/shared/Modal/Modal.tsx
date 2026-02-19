import Colors from "@/constants/Colors";
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
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
        onPress={closeOnOverlayClick ? onClose : undefined}
      >
        {/* Modal sheet — stop propagation so taps inside don't close */}
        <Animated.View
          entering={SlideInDown.duration(300).springify().damping(26).stiffness(260)}
          exiting={SlideOutDown.duration(220)}
          style={[styles.sheet, { maxWidth: SIZE_MAP[size] }, style]}
        >
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
                    <X size={20} color={Colors.foregroundSecondary} strokeWidth={2} />
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
        </Animated.View>
      </AnimatedPressable>
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
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
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
  },
  closeButton: {
    padding: 4,
    borderRadius: 8,
  },
  body: {
    padding: 20,
  },
});
