import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { Info } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export default function InfoSection() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Info size={16} color={colors.primary} strokeWidth={2} />
        <Text style={styles.infoTitle}>{t("impact.howCalculated")}</Text>
      </View>
      <Text style={styles.infoBody}>{t("impact.calculationExplanation")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
    backgroundColor: colors.primaryLightBg,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.primaryHover,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  infoTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.primaryDark,
  },
  infoBody: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    lineHeight: 18,
  },
});
