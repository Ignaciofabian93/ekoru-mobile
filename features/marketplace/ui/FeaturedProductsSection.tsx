import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Product } from "../types/Product";
import ProductGrid from "./ProductGrid";

interface Props {
  products: Product[];
  filteredCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onGoToPage: (p: number) => void;
  onChangeItemsPerPage: (n: number) => void;
}

export default function FeaturedProductsSection({
  products,
  filteredCount,
  page,
  totalPages,
  itemsPerPage,
  onGoToPage,
  onChangeItemsPerPage,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Title level="h5" weight="semibold">
          {t("featuredProducts")}
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          {filteredCount} {t("results")}
        </Text>
      </View>

      <ProductGrid
        products={products}
        filteredCount={filteredCount}
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onGoToPage={onGoToPage}
        onChangeItemsPerPage={onChangeItemsPerPage}
        emptyMessage={t("noProductsMatchFilters")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  sectionHeader: {
    marginBottom: 12,
  },
});
