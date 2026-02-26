import { UPDATE_SELLER_PREFERENCES } from "@/graphql/auth/profile";
import { showError, showSuccess } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import { SellerPreferences } from "@/types/user";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function useSettings() {
  const router = useRouter();
  const { t } = useTranslation("profile");
  const { seller } = useAuthStore();
  const setBiometricEnabled = useAuthStore((s) => s.setBiometricEnabled);
  const [sellerPreferences, setSellerPreferences] = useState<
    Partial<SellerPreferences>
  >({
    preferredLanguage: "es",
    currency: "CLP",
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    communityUpdates: true,
    securityAlerts: true,
    weeklySummary: true,
    twoFactorAuth: false,
  });

  // Keep a ref so onCompleted (captured in closure) always sees the latest value
  const twoFactorAuthRef = useRef(sellerPreferences.twoFactorAuth);
  twoFactorAuthRef.current = sellerPreferences.twoFactorAuth;

  const onCompleted = async () => {
    // Persist the biometric preference locally so the gate activates on next app open
    await setBiometricEnabled(twoFactorAuthRef.current ?? false);
    showSuccess({
      title: t("successTitle"),
      message: t("registerSuccess"),
    });
    router.back();
  };

  const onError = (error: Error) => {
    showError({
      title: t("errorTitle"),
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
      variables: {
        input: {
          sellerId: seller?.id || "",
          preferredLanguage: sellerPreferences.preferredLanguage,
          currency: sellerPreferences.currency,
          emailNotifications: sellerPreferences.emailNotifications,
          pushNotifications: sellerPreferences.pushNotifications,
          orderUpdates: sellerPreferences.orderUpdates,
          communityUpdates: sellerPreferences.communityUpdates,
          securityAlerts: sellerPreferences.securityAlerts,
          weeklySummary: sellerPreferences.weeklySummary,
          twoFactorAuth: sellerPreferences.twoFactorAuth,
        },
      },
    });
  };

  console.log("Seller Pref:: ", sellerPreferences);

  return {
    sellerPreferences,
    handleSellerPreferences,
    submitSellerPreferences,
    loadingPreferences,
  };
}
