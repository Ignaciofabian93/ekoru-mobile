import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { LANGUAGES_SUPPORTED } from "@/config/languages";
import { LANGUAGE_STORAGE_KEY } from "@/constants/settings";
import { colors } from "@/design/tokens";
import useUserSettings from "@/hooks/useUserSettings";
import { storageSet } from "@/lib/storage";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../../i18n";

export default function LanguagesSection() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { storedLanguage } = useUserSettings();

  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("settings.language")}
      </Title>
      <View style={styles.card}>
        {LANGUAGES_SUPPORTED.map((lang, index) => (
          <Pressable
            key={lang.code}
            style={[styles.row, index < LANGUAGES_SUPPORTED.length - 1 && styles.rowBorder]}
            onPress={() => {
              i18n.changeLanguage(lang.code);
              storageSet(LANGUAGE_STORAGE_KEY, lang.code);
            }}
          >
            <Text>{lang.label}</Text>
            {storedLanguage === lang.code && <Text style={styles.check}>✓</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  check: {
    fontSize: 16,
    fontFamily: "Cabin_700Bold",
    color: colors.primary,
  },
});
