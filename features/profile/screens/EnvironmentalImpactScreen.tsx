import Colors from "@/constants/Colors";
import { useSeller } from "@/store/useAuthStore";
import {
  Droplets,
  Leaf,
  Recycle,
  TreePine,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import "../i18n";
import { NAMESPACE } from "../i18n";

interface StatItem {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: string;
  unit: string;
  labelKey: string;
}

// TODO: replace with real API data
const STATS: StatItem[] = [
  { icon: Leaf, iconColor: "#16a34a", iconBg: "#dcfce7", value: "12.4", unit: "kg", labelKey: "co2Saved" },
  { icon: Recycle, iconColor: "#2563eb", iconBg: "#dbeafe", value: "8", unit: "items", labelKey: "itemsRecycled" },
  { icon: Droplets, iconColor: "#0891b2", iconBg: "#cffafe", value: "340", unit: "L", labelKey: "waterSaved" },
  { icon: TreePine, iconColor: "#15803d", iconBg: "#bbf7d0", value: "0.5", unit: "trees", labelKey: "equivalentTrees" },
];

function StatCard({ stat, label }: { stat: StatItem; label: string }) {
  const Icon = stat.icon;
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
        <Icon size={26} color={stat.iconColor} strokeWidth={1.5} />
      </View>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statUnit}> {stat.unit}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function EnvironmentalImpactScreen() {
  const seller = useSeller();
  const { t } = useTranslation(NAMESPACE);

  const displayName = seller?.profile
    ? seller.profile.__typename === "PersonProfile"
      ? seller.profile.firstName
      : seller.profile.businessName
    : t("account");

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header banner */}
      <View style={styles.banner}>
        <Leaf size={32} color="#fff" strokeWidth={1.5} />
        <Text style={styles.bannerTitle}>{t("yourGreenImpact")}</Text>
        <Text style={styles.bannerSubtitle}>
          {t("greenImpactSubtitle_other", { name: displayName })}
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.grid}>
        {STATS.map((stat) => (
          <StatCard key={stat.labelKey} stat={stat} label={t(stat.labelKey)} />
        ))}
      </View>

      {/* Explanation card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t("howCalculated")}</Text>
        <Text style={styles.infoBody}>{t("calculationExplanation")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    gap: 8,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
  },
  statUnit: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#6b7280",
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#1f2937",
  },
  infoBody: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    lineHeight: 20,
  },
});
