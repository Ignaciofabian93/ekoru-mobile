import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import {
  Droplets,
  Globe,
  Info,
  Layers,
  Leaf,
  Recycle,
  Repeat,
  ShoppingCart,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NAMESPACE } from "../i18n";
import Header from "../ui/environmentalImpact/Header";
import MetricsSummary from "../ui/environmentalImpact/MetricsSummary";

// ─── Palette extras (not in tokens) ───────────────────────────────────────────

const VIOLET = "#7c3aed";
const VIOLET_BG = "#f5f3ff";

// ─── Placeholder data — replace with real API data ────────────────────────────

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

const MONTHS = [
  { m: "Nov", co2: 14 },
  { m: "Dec", co2: 22 },
  { m: "Jan", co2: 18 },
  { m: "Feb", co2: 28 },
  { m: "Mar", co2: 35 },
  { m: "Apr", co2: 31 },
];

const MATERIALS = [
  { name: "Recycled wool", pct: 34, color: colors.primary },
  { name: "Organic cotton", pct: 28, color: colors.secondaryDark },
  { name: "Recycled steel", pct: 19, color: VIOLET },
  { name: "Natural clay", pct: 12, color: "#f59e0b" },
  { name: "Other", pct: 7, color: colors.foregroundTertiary },
];

type Metric = "co2" | "water" | "waste";

// ─── MetricTile ───────────────────────────────────────────────────────────────

// ─── SectionHead ─────────────────────────────────────────────────────────────

function SectionHead({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub?: string }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionHeadIconWrap}>
        <Icon size={14} color={colors.primary} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionHeadTitle}>{title}</Text>
        {sub ? <Text style={styles.sectionHeadSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

// ─── MetricToggle ─────────────────────────────────────────────────────────────

function MetricToggle({
  active,
  onChange,
  labels,
}: {
  active: Metric;
  onChange: (m: Metric) => void;
  labels: Record<Metric, string>;
}) {
  const opts: Metric[] = ["co2", "water", "waste"];
  return (
    <View style={styles.toggle}>
      {opts.map((o) => (
        <Pressable
          key={o}
          style={[styles.toggleBtn, active === o && styles.toggleBtnActive]}
          onPress={() => onChange(o)}
        >
          <Text style={[styles.toggleBtnText, active === o && styles.toggleBtnTextActive]}>{labels[o]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── ActivityRow ──────────────────────────────────────────────────────────────

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
      <View style={{ flex: 1, gap: 4 }}>
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

// ─── BarChart ─────────────────────────────────────────────────────────────────

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
              style={[styles.barTopLabel, isLast && { color: colors.primary, fontFamily: fontFamily.bold }]}
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
                isLast && { color: colors.primary, fontFamily: fontFamily.bold },
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

// ─── MaterialsBar ─────────────────────────────────────────────────────────────

function MaterialsBar() {
  return (
    <View style={{ gap: 10 }}>
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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EnvironmentalImpactScreen() {
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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <Header />

      {/* ── Pull-up metric cards ─────────────────────────────────────── */}
      <MetricsSummary />

      {/* ── Activity breakdown ───────────────────────────────────────── */}
      <View style={[styles.card, { marginHorizontal: spacing[4] }]}>
        <SectionHead
          icon={Layers as LucideIcon}
          title={t("impact.impactByActivity")}
          sub={t("impact.tapToCompare")}
        />
        <MetricToggle active={metric} onChange={setMetric} labels={metricLabels} />
        <View style={{ marginTop: 14, gap: 12 }}>
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

      {/* ── Monthly CO₂ trend ────────────────────────────────────────── */}
      <View style={[styles.card, { marginHorizontal: spacing[4] }]}>
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

      {/* ── Sustainable materials ────────────────────────────────────── */}
      <View style={[styles.card, { marginHorizontal: spacing[4] }]}>
        <SectionHead
          icon={Layers as LucideIcon}
          title={t("impact.sustainableMaterials")}
          sub={t("impact.acrossYourProducts")}
        />
        <MaterialsBar />
      </View>

      {/* ── Real-world equivalents ───────────────────────────────────── */}
      <LinearGradient
        colors={[colors.primaryDark, "#2d6a0f", colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.equivCard, { marginHorizontal: spacing[4], marginBottom: spacing[10] }]}
      >
        <View style={[styles.heroBubble, { width: 150, height: 150, top: -40, right: -40 }]} />
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

      {/* ── How it's calculated ─────────────────────────────────────── */}
      <View style={[styles.infoCard, { marginHorizontal: spacing[4], marginBottom: spacing[4] }]}>
        <View style={styles.infoHeader}>
          <Info size={16} color={colors.primary} strokeWidth={2} />
          <Text style={styles.infoTitle}>{t("impact.howCalculated")}</Text>
        </View>
        <Text style={styles.infoBody}>{t("impact.calculationExplanation")}</Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  container: {
    gap: spacing[3],
    paddingBottom: spacing[4],
  },

  // ── Hero ────────────────────────────────────────────────────────────
  hero: {
    paddingTop: spacing[6],
    paddingBottom: 44,
    paddingHorizontal: spacing[5],
    overflow: "hidden",
    gap: spacing[2],
  },
  heroBubble: {
    position: "absolute",
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroBubbleTR: {
    width: 220,
    height: 220,
    top: -60,
    right: -50,
  },
  heroBubbleBL: {
    width: 120,
    height: 120,
    bottom: -30,
    left: -30,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEyebrow: {
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroSince: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
  },
  heroHeadline: {
    fontSize: fontSize["2xl"],
    fontFamily: fontFamily.bold,
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroBody: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: spacing[1],
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
  },
  heroBadgeText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },

  // ── Pull-up card ────────────────────────────────────────────────────
  pullUp: {
    marginTop: -20,
    marginHorizontal: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pullUpEyebrow: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    color: colors.foregroundTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
  },

  // ── Metric tile ─────────────────────────────────────────────────────
  metricTile: {
    flex: 1,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 14,
    borderWidth: 1,
    overflow: "hidden",
    gap: 0,
  },
  metricCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    top: -28,
    right: -28,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 9,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 3,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    marginTop: 6,
    lineHeight: 15,
  },
  metricSub: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    marginTop: 2,
    lineHeight: 14,
  },

  // ── Card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Section head ────────────────────────────────────────────────────
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionHeadIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sectionHeadTitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  sectionHeadSub: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    marginTop: 1,
  },

  // ── Metric toggle ───────────────────────────────────────────────────
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: colors.foregroundTertiary,
  },
  toggleBtnTextActive: {
    color: "#fff",
  },

  // ── Activity row ────────────────────────────────────────────────────
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activityIconWrap: {
    width: 32,
    height: 32,
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
    fontSize: 13,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
  },
  activityValue: {
    fontSize: 13,
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
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },

  // ── Bar chart ───────────────────────────────────────────────────────
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 96,
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barTopLabel: {
    fontSize: 9,
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
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barBottomLabel: {
    fontSize: 9,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  trendFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  trendFooterLabel: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryLightBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryHover,
  },
  trendPillText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    color: colors.primaryActive,
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
    gap: 8,
    rowGap: 4,
  },
  materialsLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  materialsDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },
  materialsLegendText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  equivCard: {
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  equivHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  equivTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  equivRow: {
    flexDirection: "row",
    gap: 8,
  },
  equivItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
  },
  equivValue: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: "#fff",
    lineHeight: 20,
  },
  equivLabel: {
    fontSize: 9,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 13,
  },
  infoCard: {
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
