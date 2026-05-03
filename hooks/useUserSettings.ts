import {
  CURRENCY_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  PUSH_NOTIFICATIONS_STORAGE_KEY,
  TWO_FACTOR_AUTH_STORAGE_KEY,
  type SupportedLanguage,
} from "@/constants/settings";
import { storageGet } from "@/lib/storage";

export default function useUserSettings() {
  const storedLanguage = storageGet<SupportedLanguage>(LANGUAGE_STORAGE_KEY);
  const storedCurrency = storageGet<string>(CURRENCY_STORAGE_KEY);
  const storedPushNotifications = storageGet<boolean>(PUSH_NOTIFICATIONS_STORAGE_KEY);
  const storedTwoFactorAuth = storageGet<boolean>(TWO_FACTOR_AUTH_STORAGE_KEY);

  return {
    storedLanguage,
    storedCurrency,
    storedPushNotifications,
    storedTwoFactorAuth,
  };
}
