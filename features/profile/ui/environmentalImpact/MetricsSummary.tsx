import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, spacing } from "@/design/tokens";
import { CloudOff, Droplets, Recycle, type LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

interface MetricRowProps {
  icon: LucideIcon;
  color: string;
  bg: string;
  value: string;
  unit: string;
  label: string;
  sub: string;
  isLast?: boolean;
}

function MetricRow({ icon: Icon, color, bg, value, unit, label, sub, isLast }: MetricRowProps) {
  return (
    <View style={[styles.metricRow, !isLast && styles.metricRowBorder]}>
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon size={18} color={color} strokeWidth={2} />
      </View>

      <View style={styles.metricBody}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricSub}>{sub}</Text>
      </View>

      <View style={styles.metricRight}>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        <Text style={[styles.metricUnit, { color }]}>{unit}</Text>
      </View>
    </View>
  );
}

export default function MetricsSummary() {
  const { t } = useTranslation(NAMESPACE);

  const TOTALS = { co2: 148.4, water: 3820, waste: 24.6 };
  const VIOLET = "#7c3aed";

  return (
    <View style={styles.container}>
      <Text variant="label" weight="semibold" size="base" style={styles.eyebrow}>
        {t("yourTotalImpact")}
      </Text>

      <View style={styles.list}>
        <MetricRow
          icon={CloudOff as LucideIcon}
          color={colors.primary}
          bg={`${colors.primary}18`}
          value={TOTALS.co2.toString()}
          unit={t("co2Unit")}
          label={t("carbonSaved")}
          sub={t("co2Sub", { trees: 14 })}
        />
        <MetricRow
          icon={Droplets as LucideIcon}
          color={colors.secondaryDark}
          bg={`${colors.secondaryDark}18`}
          value={TOTALS.water.toLocaleString()}
          unit={t("waterUnit")}
          label={t("waterSaved")}
          sub={t("waterSub", { days: "2,547" })}
        />
        <MetricRow
          icon={Recycle as LucideIcon}
          color={VIOLET}
          bg={`${VIOLET}18`}
          value={TOTALS.waste.toString()}
          unit={t("wasteUnit")}
          label={t("wasteDiverted")}
          sub={t("wasteSub")}
          isLast
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[1],
  },
  eyebrow: {
    color: colors.foregroundTertiary,
    marginBottom: spacing[4],
  },
  list: {
    gap: 0,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  metricRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border ?? "#e5e7eb",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  metricBody: {
    flex: 1,
    gap: 3,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    lineHeight: 18,
  },
  metricSub: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    lineHeight: 15,
  },
  metricRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  metricValue: {
    fontSize: 22,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  metricUnit: {
    fontSize: 9,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
