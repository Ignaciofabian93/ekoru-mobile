import { Pagination } from "@/components/shared/Pagination/Pagination";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { router } from "expo-router";
import { Leaf, MapPin, ShieldCheck, Star, Store } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Store as StoreType } from "../types/Store";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

interface Props {
  stores: StoreType[];
  page: number;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
  onGoToPage: (p: number) => void;
  onChangeItemsPerPage: (n: number) => void;
  emptyMessage?: string;
}

export default function StoreGrid({
  stores,
  page,
  totalPages,
  itemsPerPage,
  filteredCount,
  onGoToPage,
  onChangeItemsPerPage,
  emptyMessage,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (stores.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Leaf size={32} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Title level="h5" weight="semibold" align="center">
          {emptyMessage ?? t("noStoresFound")}
        </Title>
      </View>
    );
  }

  return (
    <View>
      <Text size="sm" color="tertiary" style={styles.count}>
        {t("showingResults", { shown: stores.length, total: filteredCount })}
      </Text>

      <View style={styles.list}>
        {stores.map((store) => (
          <Pressable
            key={store.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: "/(stores)/store-category",
                params: { storeId: store.id, storeName: store.storeName },
              })
            }
          >
            <View style={styles.avatar}>
              <Store size={28} color={colors.primary} strokeWidth={1.5} />
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text
                  size="sm"
                  weight="semibold"
                  numberOfLines={1}
                  style={{ flex: 1 }}
                >
                  {store.storeName}
                </Text>
                {store.verified && (
                  <ShieldCheck
                    size={15}
                    color={colors.primary}
                    strokeWidth={2}
                  />
                )}
              </View>
              <Text size="xs" color="secondary">
                {store.category}
              </Text>
              <View style={styles.meta}>
                <View style={styles.metaRow}>
                  <Star
                    size={12}
                    color={colors.accent}
                    fill={colors.accent}
                    strokeWidth={0}
                  />
                  <Text size="xs" weight="medium">
                    {store.rating}
                  </Text>
                  <Text size="xs" color="tertiary">
                    ({store.reviewCount})
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <MapPin
                    size={12}
                    color={colors.foregroundTertiary}
                    strokeWidth={2}
                  />
                  <Text size="xs" color="tertiary">
                    {store.location}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.visitBtn}
              onPress={() =>
                router.push({
                  pathname: "/(stores)/store-category",
                  params: { storeId: store.id, storeName: store.storeName },
                })
              }
            >
              <Text size="xs" weight="semibold" style={styles.visitLabel}>
                {t("visit")}
              </Text>
            </Pressable>
          </Pressable>
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
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardPressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  visitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.backgroundPrimaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  visitLabel: {
    color: colors.primaryDark,
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
    backgroundColor: colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
