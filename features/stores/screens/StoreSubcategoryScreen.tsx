import Breadcrumb from "@/components/shared/BreadCrumbs/Breadcrumb";
import CategoryProductsSection from "@/features/marketplace/ui/CategoryProductsSection";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import { NAMESPACE } from "@/features/stores/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

const wallpaperImage = require("@/assets/images/wallpaper-4.jpg");

export default function StoreSubcategoryScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { storeId, storeName, categoryId, categoryName } =
    useLocalSearchParams<{
      storeId: string;
      storeName: string;
      categoryId: string;
      categoryName: string;
    }>();

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header
          wallpaperImage={wallpaperImage}
          title={categoryName}
          subtitle={t("storeSubcategorySubtitle")}
        />
        <ContentContainer>
          {/* ── Breadcrumb ─────────────────────────────────────────── */}
          <Breadcrumb
            items={[
              {
                label: t("stores"),
                onPress: () => router.push("/(stores)"),
              },
              {
                label: storeName,
                onPress: () =>
                  router.push({
                    pathname: "/(stores)/store-category",
                    params: { storeId, storeName },
                  }),
              },
              { label: categoryName },
            ]}
          />

          {/* ── Products ──────────────────────────────────────────── */}
          <CategoryProductsSection categoryName={categoryName} />
        </ContentContainer>
      </ScrollContainer>
    </OuterContainer>
  );
}
