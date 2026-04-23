import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { router } from "expo-router";
import { Leaf } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Product } from "../types/Product";

const GAP = 10;
const H_PADDING = 32;
const COLUMN_WIDTH = (Dimensions.get("window").width - H_PADDING - GAP) / 2;

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

interface Props {
  products: Product[];
  page: number;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
  onGoToPage: (p: number) => void;
  onChangeItemsPerPage: (n: number) => void;
  emptyMessage?: string;
}
export default function ProductGrid({
  products,
  page,
  totalPages,
  itemsPerPage,
  filteredCount,
  onGoToPage,
  onChangeItemsPerPage,
  emptyMessage,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (products.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Leaf size={32} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Title level="h5" weight="semibold" align="center">
          {emptyMessage ?? t("noProductsFound")}
        </Title>
      </View>
    );
  }

  return (
    <View>
      {/* Count */}
      <Text size="sm" color="tertiary" style={styles.count}>
        {t("showingResults", { shown: products.length, total: filteredCount })}
      </Text>

      {/* 2-col grid */}
      <View style={styles.grid}>
        {products.map((product) => (
          <View key={product.id} style={styles.cell}>
            <MarketplaceCard
              product={product}
              style={{ width: COLUMN_WIDTH }}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: product.id },
                })
              }
            />
          </View>
        ))}
      </View>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onGoToPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onChangeItemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        rowsLabel={t("rows")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  cell: {
    width: COLUMN_WIDTH,
    height: 300,
  },
  empty: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  pagination: {
    marginTop: 16,
  },
});
