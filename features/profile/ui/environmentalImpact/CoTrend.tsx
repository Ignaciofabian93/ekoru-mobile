import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { type LucideIcon, TrendingUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";
import SectionHead from "./SectionHead";

const MONTHS = [
  { m: "Nov", co2: 14 },
  { m: "Dec", co2: 22 },
  { m: "Jan", co2: 18 },
  { m: "Feb", co2: 28 },
  { m: "Mar", co2: 35 },
  { m: "Apr", co2: 31 },
];

function BarChart() {
  const maxVal = Math.max(...MONTHS.map((m) => m.co2));
  return (
    <View style={styles.barChart}>
      {MONTHS.map((m, i) => {
        const isLast = i === MONTHS.length - 1;
        const heightPct = (m.co2 / maxVal) * 56;
        return (
          <View key={m.m} style={styles.barCol}>
            <Text
              style={[
                styles.barTopLabel,
                isLast ? { color: colors.primary, fontFamily: fontFamily.bold } : {},
              ]}
            >
              {m.co2}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: heightPct,
                    backgroundColor: isLast ? colors.primary : `${colors.primary}44`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.barBottomLabel,
                isLast ? { color: colors.primary, fontFamily: fontFamily.bold } : {},
              ]}
            >
              {m.m}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function CoTrend() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.container}>
      <SectionHead
        icon={TrendingUp as LucideIcon}
        title={t("impact.co2Trend")}
        sub={t("impact.kgSavedPerMonth")}
      />
      <BarChart />
      <View style={styles.trendFooter}>
        <Text style={styles.trendFooterLabel}>{t("impact.lastSixMonths")}</Text>
        <View style={styles.trendPill}>
          <TrendingUp size={11} color={colors.primaryActive} strokeWidth={2.5} />
          <Text style={styles.trendPillText}>{t("impact.trendVsLastMonth", { pct: 11 })}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing[1.5],
    height: spacing[24],
    paddingHorizontal: spacing[1],
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: spacing[1],
  },
  barTopLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  barTrack: {
    width: "100%",
    height: 60,
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderTopLeftRadius: borderRadius.none + 4,
    borderTopRightRadius: borderRadius.none + 4,
  },
  barBottomLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  trendFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing[2.5],
  },
  trendFooterLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    backgroundColor: colors.primaryLightBg,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryHover,
  },
  trendPillText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    color: colors.primaryActive,
  },
});
