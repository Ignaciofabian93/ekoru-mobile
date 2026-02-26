import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import { SettingsSectionProps } from "../screens/SettingsScreen";

export default function CurrencySection({
  sellerPreferences,
}: SettingsSectionProps) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("currency")}
      </Title>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text>{t("detectedCurrency")}</Text>
          <Text style={{ color: "#9ca3af" }}>{sellerPreferences.currency}</Text>
        </View>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
});
