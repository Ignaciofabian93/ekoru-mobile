import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { appLanguage } from "@/lib/locale";

import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: appLanguage,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
