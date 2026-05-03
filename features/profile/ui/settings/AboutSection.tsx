import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../../i18n";

export default function AboutSection() {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? "—";

  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("settings.about")}
      </Title>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("settings.version")}</Text>
          <Text style={styles.muted}>{version}</Text>
        </View>
        <Pressable
          style={[styles.row, styles.rowBorder]}
          onPress={() => router.push("/(legal)/terms-and-policies")}
        >
          <Text>{t("settings.termsOfService")}</Text>
          <ChevronRight size={16} color="#9ca3af" strokeWidth={2} />
        </Pressable>
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
  muted: {
    color: "#9ca3af",
  },
});
