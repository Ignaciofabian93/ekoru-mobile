import Colors from "@/constants/Colors";
import Container from "@/ui/Layout/Container";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import Breadcrumb from "../ui/Breadcrumb";
import CategoryProductsSection from "../ui/CategoryProductsSection";

export default function ProductCategoryScreen() {
  const { slug, name, deptCatSlug, deptCatName, deptSlug, deptName } =
    useLocalSearchParams<{
      slug: string;
      name: string;
      deptCatSlug: string;
      deptCatName: string;
      deptSlug: string;
      deptName: string;
    }>();

  const categoryName = name ?? "Products";

  const breadcrumbItems = [
    {
      label: "Marketplace",
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
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Container>
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <Breadcrumb items={breadcrumbItems} />

        {/* ── Products (mocked) ──────────────────────────────────── */}
        <CategoryProductsSection categoryName={categoryName} />
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
