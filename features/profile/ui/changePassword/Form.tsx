import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import { Save } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useChangePassword from "../../hooks/useChangePassword";
import { NAMESPACE } from "./i18n";

export default function ChangePasswordForm() {
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
    <Fragment>
      <View style={styles.card}>
        <Input
          label={t("current")}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t("currentPlaceholder")}
          type="password"
        />
        <Input
          label={t("new")}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t("newPlaceholder")}
          type="password"
        />
        <Input
          label={t("confirm")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t("confirmPlaceholder")}
          type="password"
          isInvalid={confirmPassword.length > 0 && newPassword !== confirmPassword}
          errorMessage={
            confirmPassword.length > 0 && newPassword !== confirmPassword
              ? t("confirmPasswordError")
              : undefined
          }
        />
      </View>

      <MainButton
        text={t("update")}
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
        rightIcon={Save}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
