import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import useProductFilters from "../hooks/useProductFilters";
import { NAMESPACE } from "../i18n";
import ProductFiltersSheet from "./ProductFiltersSheet";
import ProductGrid from "./ProductGrid";

interface Props {
  categoryName: string;
}

export default function CategoryProductsSection({ categoryName }: Props) {
  const { t } = useTranslation(NAMESPACE);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Title level="h5" weight="semibold">
            {t("products")}
          </Title>
          <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
            {filteredCount} {t("results")}
          </Text>
        </View>
        <Pressable
          onPress={() => setFiltersVisible(true)}
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
        >
          <SlidersHorizontal
            size={16}
            color={hasActiveFilters ? "#fff" : colors.primary}
            strokeWidth={2}
          />
          {hasActiveFilters && <View style={styles.activeDot} />}
        </Pressable>
      </View>

      <ProductGrid
        products={paginated}
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredCount={filteredCount}
        onGoToPage={goToPage}
        onChangeItemsPerPage={changeItemsPerPage}
        emptyMessage={t("noProductsSubtitle", { categoryName })}
      />

      <ProductFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={applyFilters}
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
    backgroundColor: colors.backgroundPrimaryLight,
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
