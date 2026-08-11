import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import type { MarketplaceProduct, PageInfo, ProductFilters } from "../types";
import { NAMESPACE } from "../i18n";
import ProductFiltersSheet from "./ProductFiltersSheet";
import ProductGrid from "./ProductGrid";

interface Props {
  categoryName: string;
  products: MarketplaceProduct[];
  pageInfo?: PageInfo;
  filters: ProductFilters;
  hasActiveFilters: boolean;
  onApplyFilters: (filters: ProductFilters) => void;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Controlled products section for the department / category screens: the live
 * data + filter state are owned by the screen's `useProductsBy*` hook and
 * flow in through props. Server does the filtering and pagination.
 */
export default function CategoryProductsSection({
  categoryName,
  products,
  pageInfo,
  filters,
  hasActiveFilters,
  onApplyFilters,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const total = pageInfo?.totalCount ?? products.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Title level="h5" weight="semibold">
            {t("products")}
          </Title>
          <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
            {total} {t("results")}
          </Text>
        </View>
        <Pressable
          onPress={() => setFiltersVisible(true)}
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
        >
          <SlidersHorizontal size={16} color={hasActiveFilters ? "#fff" : colors.primary} strokeWidth={2} />
          {hasActiveFilters && <View style={styles.activeDot} />}
        </Pressable>
      </View>

      <ProductGrid
        products={products}
        page={pageInfo?.currentPage ?? 1}
        totalPages={pageInfo?.totalPages ?? 1}
        itemsPerPage={pageSize}
        filteredCount={total}
        onGoToPage={onPageChange}
        onChangeItemsPerPage={onPageSizeChange}
        emptyMessage={t("noProductsSubtitle", { categoryName })}
      />

      <ProductFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={onApplyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  filterBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  activeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
