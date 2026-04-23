import { UPDATE_SELLER_PREFERENCES } from "@/graphql/auth/profile";
import { showError, showSuccess } from "@/lib/toast";
import useBiometricAuth from "@/hooks/useBiometricAuth";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export default function useTwoFactorAuth() {
  const { t } = useTranslation(NAMESPACE);
  const { seller } = useAuthStore();
  const biometricEnabled = useAuthStore((s) => s.biometricEnabled);
  const setBiometricEnabled = useAuthStore((s) => s.setBiometricEnabled);
  const { isAvailable, supportedTypes, authenticate } = useBiometricAuth();

  // Mirror store state locally so the toggle reflects persisted value on mount
  const [isEnabled, setIsEnabled] = useState(biometricEnabled);

  useEffect(() => {
    setIsEnabled(biometricEnabled);
  }, [biometricEnabled]);

  const [updateSellerPreferences, { loading }] = useMutation(
    UPDATE_SELLER_PREFERENCES,
    {
      onError: () => {
        showError({
          title: t("settingsErrorTitle"),
          message: t("twoFaError"),
        });
      },
    },
  );

  /**
   * Toggle 2FA on or off.
   * Enabling requires a successful biometric prompt first so the user confirms
   * the device supports it before we persist the preference.
   */
  const toggle = async () => {
    const next = !isEnabled;

    if (next) {
      // Ask user to authenticate before enabling
      const success = await authenticate(t("twoFaEnableTitle"));
      if (!success) return;
    }

    try {
      await updateSellerPreferences({
        variables: {
          input: {
            sellerId: seller?.id ?? "",
            twoFactorAuth: next,
          },
        },
      });

      await setBiometricEnabled(next);
      setIsEnabled(next);

      showSuccess({
        title: next ? t("twoFaActivated") : t("twoFaDeactivated"),
        message: next ? t("twoFaActivatedMessage") : t("twoFaDeactivatedMessage"),
      });
    } catch {
      // error already handled by onError above
    }
  };

  return {
    isEnabled,
    isAvailable,
    supportedTypes,
    loading,
    toggle,
  };
}
