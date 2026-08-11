import Breadcrumb from "@/components/Patterns/BreadCrumbs/Breadcrumb";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import useProductsByStoreSubCategory from "@/features/stores/hooks/useProductsByStoreSubCategory";
import { NAMESPACE } from "@/features/stores/i18n";
import StoreFiltersSheet from "@/features/stores/ui/StoreFiltersSheet";
import StoreProductGrid from "@/features/stores/ui/StoreProductGrid";
import { router, useLocalSearchParams } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

const wallpaperImage = require("@/assets/images/wallpaper-4.jpg");

export default function StoreSubcategoryScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name, catSlug, catName } = useLocalSearchParams<{
    slug: string;
    name: string;
    catSlug: string;
    catName: string;
  }>();
  const [filtersVisible, setFiltersVisible] = useState(false);

  const {
    storeSubCategory,
    loading,
    products,
    pageInfo,
    filters,
    hasActiveFilters,
    applyFilters,
    pageSize,
    setPage,
    setPageSize,
  } = useProductsByStoreSubCategory({ slug: slug ?? "", language: i18n.language });

  if (loading && products.length === 0 && !storeSubCategory) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </OuterContainer>
    );
  }

  const subName = name ?? storeSubCategory?.translation?.name ?? t("products");

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} title={subName} subtitle={t("storeSubcategorySubtitle")} />
        <ContentContainer>
          <Breadcrumb
            items={[
              { label: t("stores"), onPress: () => router.push("/(stores)") },
              ...(catName
                ? [
                    {
                      label: catName,
                      onPress: () =>
                        router.push({
                          pathname: "/(stores)/store-category" as const,
                          params: { slug: catSlug, name: catName },
                        }),
                    },
                  ]
                : []),
              { label: subName },
            ]}
          />

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
