import { UPDATE_PASSWORD } from "@/graphql/auth/profile";
import useUserSettings from "@/hooks/useUserSettings";
import { showError, showSuccess } from "@/lib/toast";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../ui/changePassword/i18n";

export default function useChangePassword() {
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);
  const { storedLanguage } = useUserSettings();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD, {
    onCompleted: () => {
      showSuccess({
        title: t("savedTitle"),
        message: t("successMessage"),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    },
    onError: (e) => {
      console.error("[Error while updating password]: ", e);
      showError({
        title: t("errorTitle"),
        message: t("errorMessage"),
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
      variables: { currentPassword, newPassword, language: storedLanguage?.toUpperCase() ?? "ES" },
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
