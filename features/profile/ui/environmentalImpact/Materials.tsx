import { Text } from "@/components/Primitives/Text/Text";
import { colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { Layers, type LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";
import SectionHead from "./SectionHead";

const VIOLET = "#7c3aed";

const MATERIALS = [
  { name: "Recycled wool", pct: 34, color: colors.primary },
  { name: "Organic cotton", pct: 28, color: colors.secondaryDark },
  { name: "Recycled steel", pct: 19, color: VIOLET },
  { name: "Natural clay", pct: 12, color: "#f59e0b" },
  { name: "Other", pct: 7, color: colors.foregroundTertiary },
];

function MaterialsBar() {
  return (
    <View style={{ gap: spacing[2.5] }}>
      <View style={styles.materialsTrack}>
        {MATERIALS.map((m) => (
          <View key={m.name} style={{ flex: m.pct, backgroundColor: m.color }} />
        ))}
      </View>
      <View style={styles.materialsLegend}>
        {MATERIALS.map((m) => (
          <View key={m.name} style={styles.materialsLegendItem}>
            <View style={[styles.materialsDot, { backgroundColor: m.color }]} />
            <Text style={styles.materialsLegendText}>
              {m.name} <Text style={{ color: colors.foregroundTertiary }}>{m.pct}%</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function Materials() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.container}>
      <SectionHead
        icon={Layers as LucideIcon}
        title={t("impact.sustainableMaterials")}
        sub={t("impact.acrossYourProducts")}
      />
      <MaterialsBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
  },
  materialsTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  materialsLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    rowGap: spacing[1],
  },
  materialsLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1.5] - 1,
  },
  materialsDot: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: 2,
    flexShrink: 0,
  },
  materialsLegendText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
});
