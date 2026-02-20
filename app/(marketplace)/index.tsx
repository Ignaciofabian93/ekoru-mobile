import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import {
  Leaf,
  Package,
  Recycle,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const CATEGORIES = [
  { label: "All", icon: Package },
  { label: "Eco Goods", icon: Leaf },
  { label: "Recycled", icon: Recycle },
  { label: "Trending", icon: TrendingUp },
  { label: "Deals", icon: Tag },
  { label: "Top Rated", icon: Star },
];

const PLACEHOLDER_PRODUCTS = [
  { id: "1", name: "Bamboo Water Bottle", price: "$24.99", tag: "Eco Pick" },
  { id: "2", name: "Recycled Tote Bag", price: "$12.50", tag: "Bestseller" },
  { id: "3", name: "Solar Charger", price: "$49.00", tag: "New" },
  { id: "4", name: "Beeswax Wraps Set", price: "$18.00", tag: "Eco Pick" },
  { id: "5", name: "Cork Yoga Mat", price: "$65.00", tag: "Top Rated" },
  { id: "6", name: "Compost Bin", price: "$34.99", tag: "New" },
];

export default function MarketplaceScreen() {
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
            Search products...
          </Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={Colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const isFirst = i === 0;
          return (
            <Pressable
              key={cat.label}
              style={[styles.categoryChip, isFirst && styles.categoryChipActive]}
            >
              <Icon
                size={13}
                color={isFirst ? "#fff" : Colors.foregroundSecondary}
                strokeWidth={2}
              />
              <Text
                size="xs"
                weight={isFirst ? "semibold" : "normal"}
                style={isFirst ? styles.chipLabelActive : styles.chipLabel}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Featured Products
        </Text>
        <Pressable>
          <Text size="sm" color="primary" weight="medium">
            See all
          </Text>
        </Pressable>
      </View>

      {/* Products grid */}
      <View style={styles.grid}>
        {PLACEHOLDER_PRODUCTS.map((product) => (
          <Pressable key={product.id} style={styles.productCard}>
            {/* Image placeholder */}
            <View style={styles.productImageBox}>
              <Leaf size={32} color={Colors.primary} strokeWidth={1.5} />
            </View>
            {/* Tag */}
            <View style={styles.productTag}>
              <Text size="xs" weight="semibold" style={styles.productTagLabel}>
                {product.tag}
              </Text>
            </View>
            <View style={styles.productInfo}>
              <Text size="sm" weight="medium" numberOfLines={2}>
                {product.name}
              </Text>
              <Text size="sm" weight="bold" color="primary">
                {product.price}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Impact banner */}
      <View style={styles.impactBanner}>
        <Leaf size={20} color={Colors.primary} strokeWidth={1.5} />
        <Text size="sm" weight="medium" style={styles.impactText}>
          Every purchase supports environmental restoration
        </Text>
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
  categoriesRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  chipLabel: {
    color: Colors.foregroundSecondary,
  },
  chipLabelActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 10,
  },
  productCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginHorizontal: "1.5%",
  },
  productImageBox: {
    height: 130,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  productTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  productTagLabel: {
    color: "#fff",
    fontSize: 10,
  },
  productInfo: {
    padding: 10,
    gap: 4,
  },
  impactBanner: {
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
  impactText: {
    flex: 1,
    color: Colors.primaryDark,
  },
});
