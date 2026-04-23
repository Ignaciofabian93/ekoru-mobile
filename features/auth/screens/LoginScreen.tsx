import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
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
import LoginForm from "../ui/LoginForm";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const { top, bottom } = useSafeAreaInsets();

  const EKORU_LOGO = require("@/assets/images/logo.png");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <Image source={EKORU_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headline}>{t("headline")}</Text>
          <Text style={styles.subtitle}>{t("loginSubtitle")}</Text>
        </View>

        <LoginForm />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("or")}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("noAccount")}</Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerLink}> {t("signUp")}</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{t("goBackHome")}</Text>
        </Pressable>
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

  // Logo & branding
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
    color: Colors.primary,
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

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e4ea",
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#a0a8b8",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#2c2c2c",
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
  },
  backButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#5c5c5c",
  },
});
