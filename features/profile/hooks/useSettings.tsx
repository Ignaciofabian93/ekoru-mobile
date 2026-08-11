import { UPDATE_SELLER_PREFERENCES } from "@/graphql/auth/profile";
import { showError, showSuccess } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import type { SellerPreferences } from "@/types/user";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function useSettings() {
  const router = useRouter();
  const { t } = useTranslation("profile");
  const setBiometricEnabled = useAuthStore((s) => s.setBiometricEnabled);
  const [sellerPreferences, setSellerPreferences] = useState<
    Partial<SellerPreferences>
  >({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableLoginAlerts: true,
    enableTwoFactorAuth: false,
    showMySocials: false,
    showMyAddress: false,
  });

  // Keep a ref so onCompleted (captured in closure) always sees the latest value
  const twoFactorAuthRef = useRef(sellerPreferences.enableTwoFactorAuth);
  twoFactorAuthRef.current = sellerPreferences.enableTwoFactorAuth;

  const onCompleted = async () => {
    // Persist the biometric preference locally so the gate activates on next app open
    await setBiometricEnabled(twoFactorAuthRef.current ?? false);
    showSuccess({
      title: t("settings.savedTitle"),
      message: t("settings.savedMessage"),
    });
    router.back();
  };

  const onError = (error: Error) => {
    showError({
      title: t("settings.errorTitle"),
      message: error.message,
    });
  };

  const [updateSellerPreferences, { loading: loadingPreferences }] =
    useMutation(UPDATE_SELLER_PREFERENCES, {
      fetchPolicy: "no-cache",
      onError,
      onCompleted,
    });

  const handleSellerPreferences = ({
    preference,
    value,
  }: {
    preference: keyof SellerPreferences;
    value: string | boolean;
  }) => {
    setSellerPreferences((prev) => ({ ...prev, [preference]: value }));
  };

  const submitSellerPreferences = async () => {
    await updateSellerPreferences({
      // Only the fields `UpdateSellerPreferencesInput` declares. The seller is
      // taken from the session server-side, so `sellerId` is not sent — passing
      // it made the whole mutation fail validation.
      variables: {
        input: {
          enableEmailNotifications: sellerPreferences.enableEmailNotifications,
          enablePushNotifications: sellerPreferences.enablePushNotifications,
          enableLoginAlerts: sellerPreferences.enableLoginAlerts,
          enableTwoFactorAuth: sellerPreferences.enableTwoFactorAuth,
          showMySocials: sellerPreferences.showMySocials,
          showMyAddress: sellerPreferences.showMyAddress,
        },
      },
    });
  };

  return {
    sellerPreferences,
    handleSellerPreferences,
    submitSellerPreferences,
    loadingPreferences,
  };
}
