import i18n from "@/i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

const NAMESPACE = "profile";

i18n.addResourceBundle("en", NAMESPACE, en);
i18n.addResourceBundle("es", NAMESPACE, es);
i18n.addResourceBundle("fr", NAMESPACE, fr);

export { NAMESPACE };
