import { Text } from "@/components/Primitives/Text/Text";
import { colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { PackageSearch } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export default function EmptyState() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.container}>
      <PackageSearch size={52} color={colors.foregroundMuted} strokeWidth={1.5} />
      <Text style={styles.title}>{t("empty.title")}</Text>
      <Text style={styles.subtitle}>{t("empty.subtitle")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: spacing[20],
    paddingHorizontal: spacing[6],
    gap: spacing[2.5],
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    textAlign: "center",
    lineHeight: 20,
  },
});
