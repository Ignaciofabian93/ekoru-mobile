import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import {
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Store,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const FILTERS = ["All Stores", "Verified", "Near Me", "Top Rated", "New"];

const PLACEHOLDER_STORES = [
  {
    id: "1",
    name: "Green Earth Market",
    category: "Organic Grocery",
    rating: 4.9,
    location: "2.3 km away",
    verified: true,
  },
  {
    id: "2",
    name: "EcoCraft Studio",
    category: "Handmade & Upcycled",
    rating: 4.7,
    location: "4.1 km away",
    verified: true,
  },
  {
    id: "3",
    name: "Solar Goods Co.",
    category: "Renewable Energy",
    rating: 4.8,
    location: "6.0 km away",
    verified: false,
  },
  {
    id: "4",
    name: "The Zero Waste Shop",
    category: "Sustainable Living",
    rating: 4.6,
    location: "8.2 km away",
    verified: true,
  },
];

export default function StoresScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search + Filter row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={Colors.foregroundTertiary} strokeWidth={2} />
          <Text size="sm" color="tertiary">
            Search stores...
          </Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={Colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((filter, i) => (
          <Pressable
            key={filter}
            style={[styles.filterChip, i === 0 && styles.filterChipActive]}
          >
            <Text
              size="xs"
              weight={i === 0 ? "semibold" : "normal"}
              style={i === 0 ? styles.chipLabelActive : styles.chipLabel}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Eco-Friendly Stores
        </Text>
        <Text size="xs" color="tertiary">
          {PLACEHOLDER_STORES.length} found
        </Text>
      </View>

      {/* Store list */}
      <View style={styles.storeList}>
        {PLACEHOLDER_STORES.map((store) => (
          <Pressable key={store.id} style={styles.storeCard}>
            {/* Store avatar */}
            <View style={styles.storeAvatar}>
              <Store size={28} color={Colors.primary} strokeWidth={1.5} />
            </View>

            <View style={styles.storeInfo}>
              <View style={styles.storeNameRow}>
                <Text size="sm" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
                  {store.name}
                </Text>
                {store.verified && (
                  <ShieldCheck size={15} color={Colors.primary} strokeWidth={2} />
                )}
              </View>
              <Text size="xs" color="secondary">
                {store.category}
              </Text>
              <View style={styles.storeMeta}>
                <View style={styles.ratingRow}>
                  <Star
                    size={12}
                    color={Colors.accent}
                    fill={Colors.accent}
                    strokeWidth={0}
                  />
                  <Text size="xs" weight="medium">
                    {store.rating}
                  </Text>
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={Colors.foregroundTertiary} strokeWidth={2} />
                  <Text size="xs" color="tertiary">
                    {store.location}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.visitBtn}>
              <Text size="xs" weight="semibold" style={styles.visitBtnLabel}>
                Visit
              </Text>
            </Pressable>
          </Pressable>
        ))}
      </View>

      {/* Banner */}
      <View style={styles.bannerCard}>
        <Leaf size={20} color={Colors.primary} strokeWidth={1.5} />
        <Text size="sm" weight="medium" style={styles.bannerText}>
          Sell sustainably — open your eco store today
        </Text>
        <Pressable style={styles.bannerBtn}>
          <Text size="xs" weight="bold" style={{ color: Colors.primaryDark }}>
            Open Store
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 32,
  },
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
  filtersRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  chipLabel: { color: Colors.foregroundSecondary },
  chipLabelActive: { color: "#fff" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  storeList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  storeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  storeInfo: {
    flex: 1,
    gap: 3,
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  visitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  visitBtnLabel: {
    color: Colors.primaryDark,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 14,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  bannerText: {
    flex: 1,
    color: Colors.primaryDark,
  },
  bannerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
});
