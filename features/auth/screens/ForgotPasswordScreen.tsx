import { colors } from "@/design/tokens";
import useAppRouter from "@/hooks/useAppRouter";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../i18n";
import ForgotPasswordForm from "../ui/ForgotPasswordForm";

/**
 * Requests the reset link. The link in the email opens the web app, which is
 * where the new password is actually set — the app never handles the token.
 */
export default function ForgotPasswordScreen() {
  const { back } = useAppRouter();
  const { t } = useTranslation("auth");
  const { top, bottom } = useSafeAreaInsets();

  const EKORU_LOGO = require("@/assets/images/logo.png");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoSection}>
          <Image source={EKORU_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headline}>{t("headline")}</Text>
          <Text style={styles.subtitle}>{t("forgotSubtitle")}</Text>
        </View>

        <ForgotPasswordForm />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("hasAccount")}</Text>
          <Pressable onPress={() => back("/(auth)")}>
            <Text style={styles.footerLink}> {t("signIn")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 44,
  },
  logo: {
    width: 240,
    height: 80,
    marginBottom: 10,
  },
  headline: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: colors.primary,
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#2c2c2c",
    marginTop: 6,
    letterSpacing: 0.1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#2c2c2c",
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: colors.primary,
  },
});
