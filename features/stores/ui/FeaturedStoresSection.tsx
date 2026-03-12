import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Store } from "../types/Store";
import StoreGrid from "./StoreGrid";

interface Props {
  stores: Store[];
  filteredCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onGoToPage: (p: number) => void;
  onChangeItemsPerPage: (n: number) => void;
}

export default function FeaturedStoresSection({
  stores,
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
          {t("ecoFriendlyStores")}
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          {filteredCount} {t("results")}
        </Text>
      </View>

      <StoreGrid
        stores={stores}
        filteredCount={filteredCount}
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onGoToPage={onGoToPage}
        onChangeItemsPerPage={onChangeItemsPerPage}
        emptyMessage={t("noStoresMatchFilters")}
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
    gap: 2,
  },
});
