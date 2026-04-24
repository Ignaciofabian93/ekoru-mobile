import MainButton from "@/components/shared/Button/MainButton";
import { Text } from "@/components/shared/Text/Text";
import { colors, fontFamily, fontSize } from "@/design/tokens";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ErrorScreenProps {
  /** Large heading shown to the user */
  title: string;
  /** Supportive message below the title */
  message: string;
  /** When provided, a retry / primary action button is rendered */
  onAction?: () => void;
  /** Label for the primary action button. Defaults to "Try again" */
  actionLabel?: string;
  /** When provided, a secondary "Go home" link is rendered */
  showHomeLink?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ErrorScreen({
  title,
  message,
  onAction,
  actionLabel = "Try again",
  showHomeLink = true,
}: ErrorScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text size="xl" weight="bold" align="center" style={styles.title}>
          {title}
        </Text>

        <Text
          size="base"
          color="secondary"
          align="center"
          style={styles.message}
        >
          {message}
        </Text>

        {onAction && (
          <MainButton
            text={actionLabel}
            onPress={onAction}
            variant="primary"
            size="md"
            style={styles.button}
          />
        )}

        {showHomeLink && (
          <MainButton
            text="Go to home"
            onPress={() => router.replace("/")}
            variant="ghost"
            size="md"
            style={styles.homeButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize["2xl"],
    color: colors.foreground,
    marginBottom: 4,
  },
  message: {
    fontSize: fontSize.base,
    color: colors.foregroundSecondary,
    lineHeight: fontSize.base * 1.5,
    marginBottom: 8,
  },
  button: {
    width: "100%",
  },
  homeButton: {
    width: "100%",
  },
});
