import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { LANGUAGES_SUPPORTED } from "@/config/languages";
import Colors from "@/constants/Colors";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export default function LanguagesSection() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const currentLanguage = i18n.language;
  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("language")}
      </Title>
      <View style={styles.card}>
        {LANGUAGES_SUPPORTED.map((lang, index) => (
          <Pressable
            key={lang.code}
            style={[
              styles.row,
              index < LANGUAGES_SUPPORTED.length - 1 && styles.rowBorder,
            ]}
            onPress={() => i18n.changeLanguage(lang.code)}
          >
            <Text>{lang.label}</Text>
            {currentLanguage === lang.code && <Text style={styles.check}>✓</Text>}
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
    color: Colors.primary,
  },
});
