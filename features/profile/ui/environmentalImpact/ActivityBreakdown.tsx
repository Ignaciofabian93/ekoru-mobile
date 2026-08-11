import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { Layers, Repeat, ShoppingCart, Tag, type LucideIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";
import SectionHead from "./SectionHead";

type Metric = "co2" | "water" | "waste";

const VIOLET = "#7c3aed";
const VIOLET_BG = "#f5f3ff";

const ACTIVITIES = [
  {
    id: "purchases",
    icon: ShoppingCart as LucideIcon,
    color: colors.primary,
    bg: `${colors.primary}15`,
    co2: 62.1,
    water: 1540,
    waste: 9.2,
    count: 18,
  },
  {
    id: "selling",
    icon: Tag as LucideIcon,
    color: colors.secondaryDark,
    bg: `${colors.secondaryDark}15`,
    co2: 54.8,
    water: 1620,
    waste: 11.3,
    count: 12,
  },
  {
    id: "exchanges",
    icon: Repeat as LucideIcon,
    color: VIOLET,
    bg: VIOLET_BG,
    co2: 31.5,
    water: 660,
    waste: 4.1,
    count: 7,
  },
];

const METRICS: Metric[] = ["co2", "water", "waste"];

function MetricToggle({
  active,
  onChange,
  labels,
}: {
  active: Metric;
  onChange: (m: Metric) => void;
  labels: Record<Metric, string>;
}) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    const idx = METRICS.indexOf(active);
    Animated.spring(slideAnim, {
      toValue: idx * tabWidth,
      useNativeDriver: true,
      tension: 180,
      friction: 18,
    }).start();
  }, [active, tabWidth, slideAnim]);

  return (
    <View style={styles.toggle} onLayout={(e) => setTabWidth((e.nativeEvent.layout.width - 6) / 3)}>
      <Animated.View
        style={[styles.togglePill, { width: tabWidth, transform: [{ translateX: slideAnim }] }]}
      />
      {METRICS.map((o) => (
        <Pressable key={o} style={styles.toggleBtn} onPress={() => onChange(o)}>
          <Text style={[styles.toggleBtnText, active === o ? styles.toggleBtnTextActive : {}]}>
            {labels[o]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ActivityRow({
  item,
  metric,
  label,
  transactionLabel,
}: {
  item: (typeof ACTIVITIES)[number];
  metric: Metric;
  label: string;
  transactionLabel: string;
}) {
  const maxVal = Math.max(...ACTIVITIES.map((a) => a[metric]));
  const pct = (item[metric] / maxVal) * 100;
  const fmt =
    metric === "co2"
      ? `${item.co2} kg`
      : metric === "water"
        ? `${item.water.toLocaleString()} L`
        : `${item.waste} kg`;
  const Icon = item.icon;

  return (
    <View style={styles.activityRow}>
      <View style={[styles.activityIconWrap, { backgroundColor: item.bg }]}>
        <Icon size={15} color={item.color} strokeWidth={2} />
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <View style={styles.activityLabelRow}>
          <Text style={styles.activityLabel}>{label}</Text>
          <Text style={[styles.activityValue, { color: item.color }]}>{fmt}</Text>
        </View>
        <View style={styles.activityBarTrack}>
          <View
            style={[
              styles.activityBarFill,
              { width: `${pct}%` as `${number}%`, backgroundColor: item.color },
            ]}
          />
        </View>
        <Text style={styles.activityCount}>{transactionLabel}</Text>
      </View>
    </View>
  );
}

export default function ActivityBreakdown() {
  const { t } = useTranslation(NAMESPACE);

  const [metric, setMetric] = useState<Metric>("co2");

  const metricLabels: Record<Metric, string> = {
    co2: t("impact.metricCO2"),
    water: t("impact.metricWater"),
    waste: t("impact.metricWaste"),
  };

  const activityLabels: Record<string, string> = {
    purchases: t("impact.activity_purchases"),
    selling: t("impact.activity_selling"),
    exchanges: t("impact.activity_exchanges"),
  };
  return (
    <View style={styles.container}>
      <SectionHead
        icon={Layers as LucideIcon}
        title={t("impact.impactByActivity")}
        sub={t("impact.tapToCompare")}
      />
      <MetricToggle active={metric} onChange={setMetric} labels={metricLabels} />
      <View style={{ marginTop: spacing[3.5], gap: spacing[3] }}>
        {ACTIVITIES.map((item) => (
          <ActivityRow
            key={item.id}
            item={item}
            metric={metric}
            label={activityLabels[item.id]}
            transactionLabel={t("impact.transactions_other", { count: item.count })}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  togglePill: {
    position: "absolute",
    top: 3,
    left: 3,
    bottom: 3,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.sm,
  },
  toggleBtnText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    color: colors.foregroundTertiary,
  },
  toggleBtnTextActive: {
    color: "#fff",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2.5],
  },
  activityIconWrap: {
    width: spacing[8],
    height: spacing[8],
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activityLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
  },
  activityValue: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
  },
  activityBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.backgroundTertiary,
    overflow: "hidden",
  },
  activityBarFill: {
    height: 6,
    borderRadius: 3,
  },
  activityCount: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
});
