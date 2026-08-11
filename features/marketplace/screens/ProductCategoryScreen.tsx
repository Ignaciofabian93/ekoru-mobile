import { NAMESPACE } from "@/features/marketplace/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../components/Patterns/BreadCrumbs/Breadcrumb";
import useProductsByProductCategory from "../hooks/useProductsByProductCategory";
import CategoryProductsSection from "../ui/CategoryProductsSection";
import Header from "../ui/header/Header";
import { ContentContainer, OuterContainer, ScrollContainer } from "../ui/layout/Container";

const wallpaperImage = require("@/assets/images/wallpaper-4.jpg");

export default function ProductCategoryScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name, deptCatSlug, deptCatName, deptSlug, deptName } =
    useLocalSearchParams<{
      slug: string;
      name: string;
      deptCatSlug: string;
      deptCatName: string;
      deptSlug: string;
      deptName: string;
    }>();

  const {
    products,
    pageInfo,
    filters,
    hasActiveFilters,
    applyFilters,
    pageSize,
    setPage,
    setPageSize,
  } = useProductsByProductCategory({ slug: slug ?? "", language: i18n.language });

  const categoryName = name ?? t("products");

  const breadcrumbItems = [
    {
      label: t("marketplace"),
      onPress: () => router.push("/(marketplace)"),
    },
    ...(deptName
      ? [
          {
            label: deptName,
            onPress: () =>
              router.push({
                pathname: "/(marketplace)/department" as const,
                params: { slug: deptSlug, name: deptName },
              }),
          },
        ]
      : []),
    ...(deptCatName
      ? [
          {
            label: deptCatName,
            onPress: () =>
              router.push({
                pathname: "/(marketplace)/department-category" as const,
                params: {
                  slug: deptCatSlug,
                  name: deptCatName,
                  deptSlug,
                  deptName,
                },
              }),
          },
        ]
      : []),
    { label: categoryName },
  ];

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header
          wallpaperImage={wallpaperImage}
          title={categoryName}
          subtitle={t("productCategorySubtitle")}
        />
        <ContentContainer>
          {/* ── Breadcrumb ─────────────────────────────────────────── */}
          <Breadcrumb items={breadcrumbItems} />

          {/* ── Products (live) ───────────────────────────────────── */}
          <CategoryProductsSection
            categoryName={categoryName}
            products={products}
            pageInfo={pageInfo}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onApplyFilters={applyFilters}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </ContentContainer>
      </ScrollContainer>
    </OuterContainer>
  );
}
