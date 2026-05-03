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
        title: t("settings.savedTitle"),
        message: t("password.successMessage"),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    },
    onError: () => {
      showError({
        title: t("settings.errorTitle"),
        message: t("password.errorMessage"),
      });
    },
  });

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError({ title: "Error", message: t("password.error_fillFields") });
      return;
    }
    if (newPassword !== confirmPassword) {
      showError({ title: "Error", message: t("password.error_passwordMismatch") });
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
