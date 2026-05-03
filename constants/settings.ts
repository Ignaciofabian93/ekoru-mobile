export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const LANGUAGE_STORAGE_KEY = "app_language";
export const CURRENCY_STORAGE_KEY = "app_currency";
export const PUSH_NOTIFICATIONS_STORAGE_KEY = "app_push_notifications";
export const TWO_FACTOR_AUTH_STORAGE_KEY = "app_two_factor_auth";
