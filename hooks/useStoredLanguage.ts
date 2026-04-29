import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/constants/locale";
import { storageGet } from "@/lib/storage";

export default function useStoredLanguage() {
  const stored = storageGet<SupportedLanguage>(LANGUAGE_STORAGE_KEY);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored;
  }
}
