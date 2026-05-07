import useKeyboardPadding from "@/hooks/useKeyboardPadding";
import { Lock } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NAMESPACE } from "../ui/changePassword/i18n";
import ChangePasswordForm from "../ui/changePassword/Form";

export default function ChangePasswordScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { top, bottom } = useSafeAreaInsets();
  const keyboardPadding = useKeyboardPadding();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottom + 40 + keyboardPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconWrap}>
          <Lock size={40} color="#6b7280" strokeWidth={1.5} />
        </View>
        <Text style={styles.hint}>{t("hint")}</Text>
        <ChangePasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconWrap: {
    marginBottom: 12,
    alignItems: "center",
  },
  hint: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});
