import { getLocales } from "expo-localization";

import { storageGet, storageSet } from "@/lib/storage";

export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const LANGUAGE_STORAGE_KEY = "app_language";

/**
 * Resolves the app language on startup:
 *
 *  1. Read any previously stored language from MMKV (user may have changed it later).
 *  2. If none, detect the device locale via expo-localization.
 *  3. If the device locale is not in the supported set, fall back to DEFAULT_LANGUAGE.
 *  4. Persist the resolved language to MMKV so it's available synchronously on
 *     every subsequent access (e.g. for API headers, analytics, etc.).
 *
 * This function is synchronous and runs at module-load time — before the first
 * React render — so the splash screen is still visible when it executes.
 * No flicker, no async wait.
 */
function resolveLanguage(): SupportedLanguage {
  // 1. Respect a previously stored preference (e.g. manual language switch)
  const stored = storageGet<SupportedLanguage>(LANGUAGE_STORAGE_KEY);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored;
  }

  // 2. Detect device locale — getLocales() is synchronous
  const deviceCode = getLocales()[0]?.languageCode ?? "";

  // 3. Validate against supported set; default to "es" if not found
  const resolved = (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceCode)
    ? (deviceCode as SupportedLanguage)
    : DEFAULT_LANGUAGE;

  // 4. Persist — MMKV write is synchronous, no await needed
  storageSet(LANGUAGE_STORAGE_KEY, resolved);

  return resolved;
}

/**
 * The resolved app language for this session.
 * Computed once at module-load time and reused everywhere.
 */
export const appLanguage: SupportedLanguage = resolveLanguage();
