import { NAMESPACE } from "@/features/marketplace/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../components/shared/BreadCrumbs/Breadcrumb";
import CategoryProductsSection from "../ui/CategoryProductsSection";
import Header from "../ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "../ui/layout/Container";

const wallpaperImage = require("@/assets/images/wallpaper-4.jpg");

export default function ProductCategoryScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { slug, name, deptCatSlug, deptCatName, deptSlug, deptName } =
    useLocalSearchParams<{
      slug: string;
      name: string;
      deptCatSlug: string;
      deptCatName: string;
      deptSlug: string;
      deptName: string;
    }>();

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
                pathname: "/(marketplace)/department",
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
                pathname: "/(marketplace)/department-category",
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

          {/* ── Products (mocked) ──────────────────────────────────── */}
          <CategoryProductsSection categoryName={categoryName} />
        </ContentContainer>
      </ScrollContainer>
    </OuterContainer>
  );
}
