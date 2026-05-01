import { borderRadius, colors, fontFamily, fontSize, shadows, spacing } from "@/design/tokens";
import { useSeller } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import {
  Car,
  Droplets,
  Info,
  Leaf,
  Recycle,
  TreePine,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NAMESPACE } from "../i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: string;
  unit: string;
  labelKey: string;
}

// ─── Placeholder data — replace with real API data ────────────────────────────

const CO2_KG = 12.4;
const WATER_LT = 340;

const STATS: StatConfig[] = [
  {
    icon: Leaf,
    iconColor: colors.success,
    iconBg: `${colors.success}20`,
    value: CO2_KG.toFixed(1),
    unit: "kg",
    labelKey: "co2Saved",
  },
  {
    icon: Recycle,
    iconColor: colors.info,
    iconBg: `${colors.info}20`,
    value: "8",
    unit: "items",
    labelKey: "itemsRecycled",
  },
  {
    icon: Droplets,
    iconColor: colors.secondary,
    iconBg: `${colors.secondary}20`,
    value: WATER_LT.toString(),
    unit: "L",
    labelKey: "waterSaved",
  },
  {
    icon: TreePine,
    iconColor: colors.primaryDark,
    iconBg: `${colors.primaryDark}20`,
    value: "0.5",
    unit: "trees",
    labelKey: "equivalentTrees",
  },
];

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ stat, label }: { stat: StatConfig; label: string }) {
  const Icon = stat.icon;
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
        <Icon size={24} color={stat.iconColor} strokeWidth={1.8} />
      </View>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statUnit}> {stat.unit}</Text>
      </View>
      <Text style={styles.statLabel} numberOfLines={2}>{label}</Text>
    </View>
  );
}

// ─── EquivalenceCard ──────────────────────────────────────────────────────────

interface EquivalenceCardProps {
  icon: LucideIcon;
  accentColor: string;
  title: string;
  value: string;
  unit: string;
  equivalence: string;
}

function EquivalenceCard({
  icon: Icon,
  accentColor,
  title,
  value,
  unit,
  equivalence,
}: EquivalenceCardProps) {
  return (
    <View style={[styles.equivCard, { borderLeftColor: accentColor }]}>
      <View style={[styles.equivIconWrap, { backgroundColor: `${accentColor}18` }]}>
        <Icon size={20} color={accentColor} strokeWidth={1.8} />
      </View>
      <View style={styles.equivBody}>
        <Text style={styles.equivTitle}>{title}</Text>
        <View style={styles.equivValueRow}>
          <Text style={[styles.equivValue, { color: accentColor }]}>{value}</Text>
          <Text style={styles.equivUnit}> {unit}</Text>
        </View>
        <Text style={styles.equivSub}>{equivalence}</Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EnvironmentalImpactScreen() {
  const seller = useSeller();
  const { t } = useTranslation(NAMESPACE);

  const displayName = seller?.profile
    ? seller.profile.__typename === "PersonProfile"
      ? seller.profile.firstName
      : seller.profile.businessName
    : t("account");

  const co2KmEquiv = (CO2_KG * 4.5).toFixed(1);
  const waterShowersEquiv = (WATER_LT / 8).toFixed(0);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circleTR]} />
        <View style={[styles.circle, styles.circleBL]} />

        <View style={styles.heroContent}>
          <View style={styles.heroIconWrap}>
            <Leaf size={30} color={colors.onPrimary} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>{t("yourGreenImpact")}</Text>
          <Text style={styles.heroSubtitle}>
            {t("greenImpactSubtitle_other", { name: displayName })}
          </Text>
        </View>
      </LinearGradient>

      {/* ── Stats 2 × 2 grid ────────────────────────────────────────── */}
      <View style={styles.grid}>
        {STATS.map((stat) => (
          <StatCard key={stat.labelKey} stat={stat} label={t(stat.labelKey)} />
        ))}
      </View>

      {/* ── Real-world equivalences ─────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("realWorldEquivalences")}</Text>
        </View>

        <EquivalenceCard
          icon={Car}
          accentColor={colors.success}
          title={t("co2EquivalenceLabel")}
          value={`${CO2_KG.toFixed(1)} kg CO₂`}
          unit=""
          equivalence={t("co2EquivalenceText", { km: co2KmEquiv })}
        />

        <EquivalenceCard
          icon={Droplets}
          accentColor={colors.info}
          title={t("waterEquivalenceLabel")}
          value={`${WATER_LT} L`}
          unit=""
          equivalence={t("waterEquivalenceText", { showers: waterShowersEquiv })}
        />
      </View>

      {/* ── How it's calculated ─────────────────────────────────────── */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Info size={16} color={colors.primary} strokeWidth={2} />
          <Text style={styles.infoTitle}>{t("howCalculated")}</Text>
        </View>
        <Text style={styles.infoBody}>{t("calculationExplanation")}</Text>
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
    gap: spacing[4],
    paddingBottom: spacing[10],
  },

  // ── Hero ────────────────────────────────────────────────────────────
  hero: {
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
    paddingHorizontal: spacing[5],
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circleTR: {
    width: 220,
    height: 220,
    top: -70,
    right: -60,
  },
  circleBL: {
    width: 150,
    height: 150,
    bottom: -55,
    left: -40,
  },
  heroContent: {
    alignItems: "center",
    gap: spacing[3],
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: fontSize["2xl"],
    fontFamily: fontFamily.bold,
    color: colors.onPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  // ── Stats grid ──────────────────────────────────────────────────────
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    width: "47%",
    gap: spacing[2],
    ...shadows.sm,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: spacing[1],
  },
  statValue: {
    fontSize: fontSize["3xl"],
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foregroundSecondary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    lineHeight: 16,
  },

  // ── Section ─────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  // ── Equivalence cards ───────────────────────────────────────────────
  equivCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  equivIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  equivBody: {
    flex: 1,
    gap: 2,
  },
  equivTitle: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  equivValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  equivValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.3,
  },
  equivUnit: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foregroundSecondary,
  },
  equivSub: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    marginTop: 1,
  },

  // ── Info card ───────────────────────────────────────────────────────
  infoCard: {
    marginHorizontal: spacing[4],
    backgroundColor: `${colors.primary}0D`,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[2],
    borderWidth: 1,
    borderColor: `${colors.primary}22`,
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
