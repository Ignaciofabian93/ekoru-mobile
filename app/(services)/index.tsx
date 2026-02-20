import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import {
  Building2,
  Car,
  ChevronRight,
  Cpu,
  Leaf,
  Recycle,
  Search,
  SlidersHorizontal,
  Sprout,
  Sun,
  Wrench,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const SERVICE_CATEGORIES = [
  { label: "Solar", icon: Sun, color: "#f59e0b" },
  { label: "Repair", icon: Wrench, color: Colors.primary },
  { label: "Recycling", icon: Recycle, color: Colors.secondary },
  { label: "Composting", icon: Sprout, color: "#10b981" },
  { label: "Consulting", icon: Building2, color: "#6366f1" },
  { label: "EV Charging", icon: Zap, color: "#3b82f6" },
];

const FEATURED_SERVICES = [
  {
    id: "1",
    name: "Home Solar Assessment",
    provider: "SunPath Energy",
    price: "Free",
    tag: "Popular",
    icon: Sun,
  },
  {
    id: "2",
    name: "Electronics Repair",
    provider: "FixIt Green",
    price: "From $20",
    tag: "Eco Certified",
    icon: Cpu,
  },
  {
    id: "3",
    name: "Curbside Composting",
    provider: "EarthCycle Co.",
    price: "$15/mo",
    tag: "New",
    icon: Leaf,
  },
  {
    id: "4",
    name: "EV Fleet Consulting",
    provider: "GreenFleet Inc.",
    price: "Custom",
    tag: "Business",
    icon: Car,
  },
];

export default function ServicesScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={Colors.foregroundTertiary} strokeWidth={2} />
          <Text size="sm" color="tertiary">
            Search services...
          </Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={Colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Category grid */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Browse Categories
        </Text>
      </View>
      <View style={styles.categoryGrid}>
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Pressable key={cat.label} style={styles.categoryCard}>
              <View
                style={[styles.categoryIcon, { backgroundColor: `${cat.color}18` }]}
              >
                <Icon size={22} color={cat.color} strokeWidth={1.75} />
              </View>
              <Text size="xs" weight="medium" align="center">
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Featured */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Featured Services
        </Text>
        <Pressable>
          <Text size="sm" color="primary" weight="medium">
            See all
          </Text>
        </Pressable>
      </View>

      <View style={styles.serviceList}>
        {FEATURED_SERVICES.map((svc) => {
          const Icon = svc.icon;
          return (
            <Pressable key={svc.id} style={styles.serviceCard}>
              <View style={styles.serviceIconBox}>
                <Icon size={22} color={Colors.primary} strokeWidth={1.75} />
              </View>
              <View style={styles.serviceInfo}>
                <Text size="sm" weight="semibold" numberOfLines={1}>
                  {svc.name}
                </Text>
                <Text size="xs" color="secondary">
                  {svc.provider}
                </Text>
                <View style={styles.serviceMeta}>
                  <View style={styles.tag}>
                    <Text size="xs" weight="semibold" style={styles.tagLabel}>
                      {svc.tag}
                    </Text>
                  </View>
                  <Text size="xs" weight="bold" color="primary">
                    {svc.price}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.foregroundTertiary} strokeWidth={1.5} />
            </Pressable>
          );
        })}
      </View>

      {/* CTA */}
      <Pressable style={styles.ctaBanner}>
        <Wrench size={20} color={Colors.primaryDark} strokeWidth={1.75} />
        <Text size="sm" weight="semibold" style={styles.ctaText}>
          Offer your eco service
        </Text>
        <ChevronRight size={18} color={Colors.primaryDark} strokeWidth={2} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 10,
  },
  categoryCard: {
    width: "30%",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginHorizontal: "1.5%",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  serviceInfo: { flex: 1, gap: 3 },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  tag: {
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  tagLabel: { color: Colors.primaryDark, fontSize: 10 },
  ctaBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  ctaText: { flex: 1, color: Colors.primaryDark },
});
