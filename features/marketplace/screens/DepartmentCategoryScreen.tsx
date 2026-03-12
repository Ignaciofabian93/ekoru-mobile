import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { NAMESPACE } from "@/features/marketplace/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { LayoutGrid } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Breadcrumb from "../../../components/shared/BreadCrumbs/Breadcrumb";
import useDepartmentCategoryBySlug from "../hooks/useDepartmentCategoryBySlug";
import CategoryProductsSection from "../ui/CategoryProductsSection";
import Header from "../ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "../ui/layout/Container";

const wallpaperImage = require("@/assets/images/wallpaper-3.jpg");

export default function DepartmentCategoryScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { slug, name, deptSlug, deptName } = useLocalSearchParams<{
    slug: string;
    name: string;
    deptSlug: string;
    deptName: string;
  }>();

  const { departmentCategory, loading, error } = useDepartmentCategoryBySlug(
    slug ?? "",
  );

  if (loading) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </OuterContainer>
    );
  }

  if (error || !departmentCategory) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <LayoutGrid
              size={40}
              color={Colors.foregroundTertiary}
              strokeWidth={1.5}
            />
          </View>
          <Title level="h5" weight="semibold" align="center" color="tertiary">
            {t("categoryNotFound")}
          </Title>
        </View>
      </OuterContainer>
    );
  }

  const productCats = departmentCategory.productCategory ?? [];
  const catName = name ?? departmentCategory.translation.name;

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header
          wallpaperImage={wallpaperImage}
          title={catName}
          subtitle={t("departmentCategorySubtitle")}
        />
        <ContentContainer>
          {/* ── Breadcrumb ─────────────────────────────────────────── */}
          <Breadcrumb
            items={[
              {
                label: t("marketplace"),
                onPress: () => router.push("/(marketplace)"),
              },
              {
                label: deptName ?? t("department"),
                onPress: () =>
                  router.push({
                    pathname: "/(marketplace)/department",
                    params: { slug: deptSlug, name: deptName },
                  }),
              },
              { label: catName },
            ]}
          />

          {/* ── Sub-category chips ────────────────────────────────── */}
          {productCats.length > 0 && (
            <View style={styles.catsSection}>
              <Text
                size="xs"
                weight="semibold"
                color="tertiary"
                style={styles.catsLabel}
              >
                {t("subcategories")}
              </Text>
              <View style={styles.chips}>
                {productCats.map((pc) => (
                  <Pressable
                    key={pc.id}
                    style={({ pressed }) => [
                      styles.chip,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/(marketplace)/product-category",
                        params: {
                          slug: pc.translation.slug,
                          name: pc.translation.name,
                          deptCatSlug: slug,
                          deptCatName: catName,
                          deptSlug,
                          deptName,
                        },
                      })
                    }
                  >
                    <Text size="sm" weight="medium" style={styles.chipText}>
                      {pc.translation.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* ── Products (mocked) ──────────────────────────────────── */}
          <CategoryProductsSection categoryName={catName} />
        </ContentContainer>
      </ScrollContainer>
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
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  catsSection: {
    marginBottom: 28,
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipPressed: {
    backgroundColor: Colors.backgroundPrimaryLight,
    borderColor: Colors.borderFocus,
  },
  chipText: {
    color: Colors.foreground,
  },
});
