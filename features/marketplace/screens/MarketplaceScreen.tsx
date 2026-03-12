import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { NAMESPACE } from "@/features/marketplace/i18n";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import useDepartments from "../hooks/useDepartments";
import useProductFilters from "../hooks/useProductFilters";
import DepartmentsSection from "../ui/DepartmentsSection";
import FeaturedProductsSection from "../ui/FeaturedProductsSection";
import ProductFiltersSheet from "../ui/ProductFiltersSheet";
import Header from "../ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "../ui/layout/Container";

export default function MarketplaceScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { departments, loading } = useDepartments();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    filters,
    applyFilters,
    hasActiveFilters,
    filteredCount,
    paginated,
    page,
    totalPages,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
  } = useProductFilters(DUMMY_PRODUCTS);

  const wallpaperImage = require("@/assets/images/wallpaper-1.jpg");

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} />
        <ContentContainer>
          {/* ── Search + filter ────────────────────────────────────────── */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search
                size={16}
                color={Colors.foregroundTertiary}
                strokeWidth={2}
              />
              <Text size="sm" color="tertiary">
                {t("searchPlaceholder")}
              </Text>
            </View>
            <Pressable
              style={[
                styles.filterBtn,
                hasActiveFilters && styles.filterBtnActive,
              ]}
              onPress={() => setFiltersVisible(true)}
            >
              <SlidersHorizontal
                size={18}
                color={hasActiveFilters ? "#fff" : Colors.primary}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* ── Departments from DB ────────────────────────────────────── */}
          <DepartmentsSection departments={departments} loading={loading} />

          {/* ── Featured products ──────────────────────────────────── */}
          <FeaturedProductsSection
            products={paginated}
            filteredCount={filteredCount}
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onGoToPage={goToPage}
            onChangeItemsPerPage={changeItemsPerPage}
          />
        </ContentContainer>
      </ScrollContainer>

      <ProductFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={applyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </OuterContainer>
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
    marginTop: 16,
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
  filterBtnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
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
