import { UPDATE_PASSWORD } from "@/graphql/auth/profile";
import { showError, showSuccess } from "@/lib/toast";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export default function useChangePassword() {
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD, {
    onCompleted: () => {
      showSuccess({
        title: t("settingsSavedTitle"),
        message: t("changePasswordSuccess"),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    },
    onError: () => {
      showError({
        title: t("settingsErrorTitle"),
        message: t("changePasswordError"),
      });
    },
  });

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError({ title: "Error", message: t("error_fillFields") });
      return;
    }
    if (newPassword !== confirmPassword) {
      showError({ title: "Error", message: t("error_passwordMismatch") });
      return;
    }

    await updatePassword({
      variables: { currentPassword, newPassword },
    });
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
}
