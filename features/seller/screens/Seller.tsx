import MarketplaceCard from "@/components/Cards/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { displaySellerName } from "@/utils/displaySellerName";
import { getImageUrl } from "@/utils/getImageUrl";
import { sellerTypeTranslate } from "@/utils/sellerTypeTranslate";
import { router, useLocalSearchParams } from "expo-router";
import { MapPin, ShieldCheck, UserRound } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSellerStorefront from "../hooks/useSellerStorefront";
import { NAMESPACE } from "../i18n";

const COLUMN_WIDTH = (Dimensions.get("window").width - 32 - 10) / 2;

export default function Seller() {
  const { t } = useTranslation(NAMESPACE);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const { products, seller, loading } = useSellerStorefront(id ?? "");

  if (loading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const profile = seller?.profile as
    | { profileImage?: string | null; logo?: string | null }
    | undefined;
  const avatarUri = getImageUrl(profile?.profileImage ?? profile?.logo ?? undefined);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: top + 8, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Seller header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} resizeMode="cover" />
          ) : (
            <UserRound size={36} color={colors.primary} strokeWidth={1.5} />
          )}
        </View>

        <View style={styles.nameRow}>
          <Title level="h4" weight="bold" align="center">
            {seller ? displaySellerName(seller) : t("storefront")}
          </Title>
          {seller?.isVerified && <ShieldCheck size={18} color={colors.primary} strokeWidth={2} />}
        </View>

        {seller && (
          <View style={styles.typeBadge}>
            <Text size="xs" weight="semibold" style={{ color: colors.primaryDark }}>
              {sellerTypeTranslate(seller.sellerType)}
            </Text>
          </View>
        )}

        {seller?.county && (
          <View style={styles.metaRow}>
            <MapPin size={13} color={colors.foregroundTertiary} strokeWidth={2} />
            <Text size="sm" color="tertiary">
              {seller.county.county}
            </Text>
          </View>
        )}

        <Text size="sm" color="secondary" style={{ marginTop: 4 }}>
          {products.length} {t("itemsListed")}
        </Text>
      </View>

      {/* ── Products ───────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Title level="h5" weight="semibold">
          {t("products")}
        </Title>

        {products.length === 0 ? (
          <Text size="sm" color="tertiary" style={{ marginTop: 12 }}>
            {t("noProducts")}
          </Text>
        ) : (
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
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
    overflow: "hidden",
    marginBottom: 6,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeBadge: {
    backgroundColor: colors.navbar,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cell: {
    width: COLUMN_WIDTH,
    height: 300,
  },
});
