import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import { borderRadius, colors, spacing } from "@/design/tokens";
import { Sprout } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useChangePassword from "../../hooks/useChangePassword";
import { NAMESPACE } from "./i18n";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

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
        <View style={styles.newPasswordGroup}>
          <Input
            label={t("new")}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("newPlaceholder")}
            type="password"
          />
          <PasswordStrengthMeter password={newPassword} />
        </View>
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
        rightIcon={Sprout}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[8],
    gap: spacing[3],
    width: "100%",
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  newPasswordGroup: {
    gap: spacing[2],
  },
  button: {
    width: "100%",
  },
});
