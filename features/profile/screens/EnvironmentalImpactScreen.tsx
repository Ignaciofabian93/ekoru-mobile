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
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface StatCard {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: string;
  unit: string;
  label: string;
}

// TODO: replace with real API data
const STATS: StatCard[] = [
  {
    icon: Leaf,
    iconColor: "#16a34a",
    iconBg: "#dcfce7",
    value: "12.4",
    unit: "kg",
    label: "CO₂ Saved",
  },
  {
    icon: Recycle,
    iconColor: "#2563eb",
    iconBg: "#dbeafe",
    value: "8",
    unit: "items",
    label: "Items Recycled",
  },
  {
    icon: Droplets,
    iconColor: "#0891b2",
    iconBg: "#cffafe",
    value: "340",
    unit: "L",
    label: "Water Saved",
  },
  {
    icon: TreePine,
    iconColor: "#15803d",
    iconBg: "#bbf7d0",
    value: "0.5",
    unit: "trees",
    label: "Equivalent Trees",
  },
];

function StatCard({ stat }: { stat: StatCard }) {
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
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );
}

export default function EnvironmentalImpactScreen() {
  const seller = useSeller();

  const displayName = seller?.profile
    ? seller.profile.__typename === "PersonProfile"
      ? seller.profile.firstName
      : seller.profile.businessName
    : "You";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header banner */}
      <View style={styles.banner}>
        <Leaf size={32} color="#fff" strokeWidth={1.5} />
        <Text style={styles.bannerTitle}>Your Green Impact</Text>
        <Text style={styles.bannerSubtitle}>
          {displayName}, here's the positive change you've made by choosing
          Ekoru.
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.grid}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </View>

      {/* Explanation card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How is this calculated?</Text>
        <Text style={styles.infoBody}>
          We estimate your environmental impact based on the products you've
          exchanged, recycled, or bought second-hand through Ekoru, compared to
          buying new items.
        </Text>
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
