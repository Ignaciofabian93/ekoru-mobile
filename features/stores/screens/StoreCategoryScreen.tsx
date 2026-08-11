import Breadcrumb from "@/components/Patterns/BreadCrumbs/Breadcrumb";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import useProductsByStoreCategory from "@/features/stores/hooks/useProductsByStoreCategory";
import { NAMESPACE } from "@/features/stores/i18n";
import StoreFiltersSheet from "@/features/stores/ui/StoreFiltersSheet";
import StoreProductGrid from "@/features/stores/ui/StoreProductGrid";
import { router, useLocalSearchParams } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

const wallpaperImage = require("@/assets/images/wallpaper-3.jpg");

export default function StoreCategoryScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const [filtersVisible, setFiltersVisible] = useState(false);

  const {
    storeCategory,
    loading,
    products,
    pageInfo,
    filters,
    hasActiveFilters,
    applyFilters,
    pageSize,
    setPage,
    setPageSize,
  } = useProductsByStoreCategory({ slug: slug ?? "", language: i18n.language });

  if (loading && products.length === 0 && !storeCategory) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </OuterContainer>
    );
  }

  const subcats = storeCategory?.storeSubCategory ?? [];
  const catName = name ?? storeCategory?.translation?.name ?? t("products");

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} title={catName} subtitle={t("storeCategorySubtitle")} />
        <ContentContainer>
          <Breadcrumb
            items={[
              { label: t("stores"), onPress: () => router.push("/(stores)") },
              { label: catName },
            ]}
          />

          {/* ── Subcategory chips ─────────────────────────────────── */}
          {subcats.length > 0 && (
            <View style={styles.catsSection}>
              <Text size="xs" weight="semibold" color="tertiary" style={styles.catsLabel}>
                {t("subcategories")}
              </Text>
              <View style={styles.chips}>
                {subcats.map((sc) => {
                  const tr = sc.translation;
                  if (!tr) return null;
                  return (
                    <Pressable
                      key={sc.id}
                      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                      onPress={() =>
                        router.push({
                          pathname: "/(stores)/store-subcategory",
                          params: { slug: tr.slug, name: tr.name, catSlug: slug, catName },
                        })
                      }
                    >
                      <Text size="sm" weight="medium" style={styles.chipText}>
                        {tr.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Products (live) ───────────────────────────────────── */}
          <View style={styles.productsHeader}>
            <Title level="h5" weight="semibold">
              {t("products")}
            </Title>
            <Pressable
              onPress={() => setFiltersVisible(true)}
              style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
            >
              <SlidersHorizontal size={16} color={hasActiveFilters ? "#fff" : colors.primary} strokeWidth={2} />
            </Pressable>
          </View>

          <StoreProductGrid
            products={products}
            page={pageInfo?.currentPage ?? 1}
            totalPages={pageInfo?.totalPages ?? 1}
            itemsPerPage={pageSize}
            filteredCount={pageInfo?.totalCount ?? products.length}
            onGoToPage={setPage}
            onChangeItemsPerPage={setPageSize}
            emptyMessage={t("noProductsYet")}
          />
        </ContentContainer>
      </ScrollContainer>

      <StoreFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={applyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  catsSection: {
    marginBottom: 24,
  },
  catsLabel: {
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipPressed: {
    backgroundColor: colors.background,
    borderColor: colors.borderFocus,
  },
  chipText: {
    color: colors.foreground,
  },
  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
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
});
