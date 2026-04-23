import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import { KeyRound } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import useChangePassword from "../hooks/useChangePassword";
import { NAMESPACE } from "../i18n";

export default function ChangePasswordScreen() {
  const { t } = useTranslation(NAMESPACE);
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  } = useChangePassword();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <KeyRound size={40} color="#6b7280" strokeWidth={1.5} />
      </View>
      <Text style={styles.hint}>{t("passwordHint")}</Text>

      <View style={styles.card}>
        <Input
          label={t("currentPassword")}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t("enterCurrentPassword")}
          type="password"
        />
        <Input
          label={t("newPassword")}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t("enterNewPassword")}
          type="password"
        />
        <Input
          label={t("confirmNewPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t("confirmNewPasswordPlaceholder")}
          type="password"
        />
      </View>

      <MainButton
        text={t("updatePassword")}
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  iconWrap: {
    marginTop: 16,
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});
