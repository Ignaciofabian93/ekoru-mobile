import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { Droplets, Globe, Leaf, type LucideIcon, Recycle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export default function RealExamples() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <LinearGradient
      colors={[colors.primaryDark, "#2d6a0f", colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.equivCard}
    >
      <View style={styles.heroBubble} />
      <View style={styles.equivHeader}>
        <Globe size={16} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
        <Text style={styles.equivTitle}>{t("impact.realWorldEquivalents")}</Text>
      </View>
      <View style={styles.equivRow}>
        {[
          { icon: Leaf as LucideIcon, value: "14", label: t("impact.equivTrees") },
          { icon: Droplets as LucideIcon, value: "2,547", label: t("impact.equivWaterDays") },
          { icon: Recycle as LucideIcon, value: "24.6", label: t("impact.equivWasteKg") },
        ].map((e) => {
          const EIcon = e.icon;
          return (
            <View key={e.label} style={styles.equivItem}>
              <EIcon size={20} color="#fff" strokeWidth={1.5} />
              <Text style={styles.equivValue}>{e.value}</Text>
              <Text style={styles.equivLabel}>{e.label}</Text>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroBubble: {
    position: "absolute",
    width: 150,
    height: 150,
    top: -40,
    right: -40,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  equivCard: {
    marginTop: spacing[6],
    borderRadius: borderRadius["2xl"],
    padding: spacing[4],
    overflow: "hidden",
  },
  equivHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[3.5],
  },
  equivTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  equivRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  equivItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[2],
    alignItems: "center",
    gap: spacing[1.5],
  },
  equivValue: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: "#fff",
    lineHeight: 20,
  },
  equivLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 13,
  },
});
