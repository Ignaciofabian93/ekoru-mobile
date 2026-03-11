import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import Container from "@/ui/Layout/Container";
import { Leaf, Search, SlidersHorizontal } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import useDepartments from "../hooks/useDepartments";
import DepartmentsSection from "../ui/DepartmentsSection";
import FeaturedProductsSection from "../ui/FeaturedProductsSection";

export default function MarketplaceScreen() {
  const { departments, loading } = useDepartments();

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Container>
        {/* ── Search + filter ────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search
              size={16}
              color={Colors.foregroundTertiary}
              strokeWidth={2}
            />
            <Text size="sm" color="tertiary">
              Search products...
            </Text>
          </View>
          <Pressable style={styles.filterBtn}>
            <SlidersHorizontal
              size={18}
              color={Colors.primary}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {/* ── Departments from DB ────────────────────────────────────── */}
        <DepartmentsSection departments={departments} loading={loading} />

        {/* ── Featured products (mocks) ──────────────────────────────── */}
        <FeaturedProductsSection />

        {/* ── Impact banner ─────────────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Leaf size={20} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text size="sm" weight="medium" style={styles.bannerText}>
            Every purchase supports environmental restoration
          </Text>
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  banner: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    flex: 1,
    color: Colors.primaryDark,
  },
});
