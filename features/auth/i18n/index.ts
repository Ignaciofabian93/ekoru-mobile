import i18n from "@/i18n";
import enUS from "./locales/en-US.json";
import esCL from "./locales/es-CL.json";
import frCA from "./locales/fr-CA.json";

const NAMESPACE = "auth";

i18n.addResourceBundle("en", NAMESPACE, enUS);
i18n.addResourceBundle("es", NAMESPACE, esCL);
i18n.addResourceBundle("fr", NAMESPACE, frCA);

export { NAMESPACE };
